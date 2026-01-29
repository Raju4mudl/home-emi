import { addMonthsToDate, getMonthsDifference } from './dateHelpers';

/**
 * Calculate EMI using the formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} Monthly EMI amount
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
    if (principal <= 0 || tenureMonths <= 0) return 0;
    if (annualRate === 0) return principal / tenureMonths;

    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return emi;
};

/**
 * Generate complete amortization schedule with rate changes and part payments
 * @param {number} principal - Initial loan amount
 * @param {number} annualRate - Initial annual interest rate (%)
 * @param {number} tenureMonths - Initial loan tenure in months
 * @param {Date} startDate - Loan start date
 * @param {Array} rateChanges - Array of {date, newRate} objects
 * @param {Array} partPayments - Array of {date, amount} objects
 * @returns {Array} Amortization schedule
 */
export const generateAmortizationSchedule = (
    principal,
    annualRate,
    tenureMonths,
    startDate,
    rateChanges = [],
    partPayments = []
) => {
    const schedule = [];
    let balance = principal;
    let currentRate = annualRate;
    let currentEMI = calculateEMI(principal, annualRate, tenureMonths);
    let monthIndex = 0;

    // Create maps for quick lookup
    const rateChangeMap = new Map();
    rateChanges.forEach(rc => {
        const key = getMonthsDifference(startDate, rc.date);
        rateChangeMap.set(key, rc);
    });

    const partPaymentMap = new Map();
    partPayments.forEach(pp => {
        const key = getMonthsDifference(startDate, pp.date);
        partPaymentMap.set(key, pp.amount);
    });

    while (balance > 1 && monthIndex < tenureMonths * 2) { // Safety limit
        const currentDate = addMonthsToDate(startDate, monthIndex);

        // Check for rate change
        if (rateChangeMap.has(monthIndex)) {
            const rateChange = rateChangeMap.get(monthIndex);
            currentRate = rateChange.newRate;

            // Handle adjustment type
            if (rateChange.adjustmentType === 'emi') {
                // Keep tenure same, adjust EMI
                const remainingMonths = tenureMonths - monthIndex;
                currentEMI = calculateEMI(balance, currentRate, remainingMonths);
            }
            // If 'tenure', keep EMI same and tenure will adjust naturally
        }

        // Calculate interest and principal for this month
        const monthlyRate = currentRate / 12 / 100;
        const interestAmount = balance * monthlyRate;
        let principalAmount = Math.min(currentEMI - interestAmount, balance);

        // Ensure we don't go negative
        if (principalAmount < 0) principalAmount = 0;

        let partPayment = 0;
        // Check for part payment
        if (partPaymentMap.has(monthIndex)) {
            partPayment = partPaymentMap.get(monthIndex);
            principalAmount += partPayment;
        }

        balance -= principalAmount;
        if (balance < 1) balance = 0;

        schedule.push({
            month: monthIndex + 1,
            date: currentDate,
            emi: currentEMI,
            principal: principalAmount - partPayment,
            interest: interestAmount,
            partPayment: partPayment,
            balance: balance,
            rate: currentRate,
            isRateChange: rateChangeMap.has(monthIndex),
            hasPartPayment: partPaymentMap.has(monthIndex),
        });

        monthIndex++;

        if (balance === 0) break;
    }

    return schedule;
};

/**
 * Generate amortization schedule with disbursement support
 * @param {number} totalLoanAmount - Total loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} tenureMonths - Loan tenure in months
 * @param {Date} startDate - Loan start date
 * @param {Array} disbursements - Array of {date, amount} objects
 * @param {Array} rateChanges - Array of {date, newRate} objects
 * @param {Array} partPayments - Array of {date, amount} objects
 * @returns {Array} Amortization schedule with disbursements
 */
export const generateAmortizationScheduleWithDisbursements = (
    totalLoanAmount,
    annualRate,
    tenureMonths,
    startDate,
    disbursements = [],
    rateChanges = [],
    partPayments = []
) => {
    // If no disbursements, use regular schedule
    if (disbursements.length === 0) {
        return generateAmortizationSchedule(
            totalLoanAmount,
            annualRate,
            tenureMonths,
            startDate,
            rateChanges,
            partPayments
        );
    }

    const schedule = [];
    let disbursedPrincipal = 0;
    let balance = 0;
    let currentRate = annualRate;
    let monthIndex = 0;
    let emiStarted = false;
    let currentEMI = 0;

    // Create maps for quick lookup
    const disbursementMap = new Map();
    disbursements.forEach(d => {
        const key = getMonthsDifference(startDate, d.date);
        disbursementMap.set(key, (disbursementMap.get(key) || 0) + d.amount);
    });

    const rateChangeMap = new Map();
    rateChanges.forEach(rc => {
        const key = getMonthsDifference(startDate, rc.date);
        rateChangeMap.set(key, rc);
    });

    const partPaymentMap = new Map();
    partPayments.forEach(pp => {
        const key = getMonthsDifference(startDate, pp.date);
        partPaymentMap.set(key, pp.amount);
    });

    // Find the last disbursement month
    const lastDisbursementMonth = Math.max(...Array.from(disbursementMap.keys()));

    // Calculate total months including pre-EMI period
    const totalMonths = lastDisbursementMonth + tenureMonths + 1;

    while (monthIndex < totalMonths && monthIndex < tenureMonths * 3) { // Safety limit
        const currentDate = addMonthsToDate(startDate, monthIndex);

        // Check for rate change FIRST (before disbursement)
        // This ensures disbursement EMI calculation uses the new rate
        if (rateChangeMap.has(monthIndex)) {
            const rateChange = rateChangeMap.get(monthIndex);
            currentRate = rateChange.newRate;

            if (emiStarted) {
                // Handle adjustment type
                if (rateChange.adjustmentType === 'emi') {
                    // Keep tenure same, adjust EMI
                    const remainingMonths = tenureMonths - monthIndex;
                    currentEMI = calculateEMI(balance, currentRate, remainingMonths);
                }
                // If 'tenure', keep EMI same and tenure will adjust naturally
            }
        }

        // Check for disbursement AFTER rate change
        let newDisbursement = 0;
        if (disbursementMap.has(monthIndex)) {
            newDisbursement = disbursementMap.get(monthIndex);
            disbursedPrincipal += newDisbursement;
            balance += newDisbursement;

            // Recalculate EMI immediately when disbursement happens
            // Use original loan tenure, not remaining months
            // This is how most banks work - they use the original tenure from loan start
            if (disbursedPrincipal > 0) {
                currentEMI = calculateEMI(disbursedPrincipal, currentRate, tenureMonths);
                emiStarted = true; // EMI starts immediately after first disbursement
            }
        }

        // Calculate payment for this month
        const monthlyRate = currentRate / 12 / 100;
        let interestAmount = balance * monthlyRate;
        let principalAmount = 0;
        let payment = 0;

        if (emiStarted && balance > 0) {
            // Regular EMI - starts immediately after first disbursement
            payment = currentEMI;
            principalAmount = Math.min(currentEMI - interestAmount, balance);
            if (principalAmount < 0) principalAmount = 0;
        } else if (balance > 0) {
            // Before first disbursement - no payment
            payment = 0;
            interestAmount = 0;
            principalAmount = 0;
        }

        // Check for part payment
        let partPayment = 0;
        if (partPaymentMap.has(monthIndex)) {
            partPayment = partPaymentMap.get(monthIndex);
            principalAmount += partPayment;
            payment += partPayment;
        }

        balance -= principalAmount;
        if (balance < 1) balance = 0;

        schedule.push({
            month: monthIndex + 1,
            date: currentDate,
            emi: payment,
            principal: principalAmount - partPayment,
            interest: interestAmount,
            partPayment: partPayment,
            disbursement: newDisbursement,
            balance: balance,
            rate: currentRate,
            isPreEMI: !emiStarted,
            isRateChange: rateChangeMap.has(monthIndex),
            hasPartPayment: partPaymentMap.has(monthIndex),
            hasDisbursement: disbursementMap.has(monthIndex),
        });

        monthIndex++;

        if (balance === 0 && emiStarted) break;
    }

    return schedule;
};

/**
 * Calculate total interest and payment summary
 */
export const calculateLoanSummary = (schedule) => {
    let totalInterest = 0;
    let totalPrincipal = 0;
    let totalPartPayments = 0;

    schedule.forEach(entry => {
        totalInterest += entry.interest;
        totalPrincipal += entry.principal;
        totalPartPayments += entry.partPayment;
    });

    return {
        totalInterest,
        totalPrincipal,
        totalPartPayments,
        totalPayable: totalPrincipal + totalInterest + totalPartPayments,
        actualTenureMonths: schedule.length,
    };
};

/**
 * Calculate EMI increase needed to maintain original tenure when rate increases
 */
export const calculateEMIIncreaseForTenure = (
    currentBalance,
    oldRate,
    newRate,
    remainingMonths
) => {
    const oldEMI = calculateEMI(currentBalance, oldRate, remainingMonths);
    const newEMI = calculateEMI(currentBalance, newRate, remainingMonths);
    return newEMI - oldEMI;
};

/**
 * Calculate part payment needed to maintain original EMI when rate increases
 */
export const calculatePartPaymentForEMI = (
    currentBalance,
    targetEMI,
    newRate,
    remainingMonths
) => {
    // Binary search to find the required principal reduction
    let low = 0;
    let high = currentBalance;
    let result = 0;

    while (high - low > 1) {
        const mid = (low + high) / 2;
        const newPrincipal = currentBalance - mid;
        const newEMI = calculateEMI(newPrincipal, newRate, remainingMonths);

        if (newEMI > targetEMI) {
            low = mid;
        } else {
            high = mid;
            result = mid;
        }
    }

    return result;
};
