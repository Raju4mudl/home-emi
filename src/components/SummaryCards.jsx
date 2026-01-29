import React from 'react';
import { formatCurrency, formatCurrencyShort } from '../utils/formatters';
import { formatDateDisplay } from '../utils/dateHelpers';

const SummaryCards = ({ loanSummary, loanDetails, schedule, expenses }) => {
    if (!schedule || schedule.length === 0) {
        return null;
    }

    const currentMonthData = schedule[0] || {};
    const lastMonthData = schedule[schedule.length - 1] || {};
    const completionDate = lastMonthData.date;

    const totalMonthlyPayment = currentMonthData.emi +
        (expenses.maintenanceMonthly || 0) +
        ((expenses.propertyTaxAnnual || 0) / 12) +
        ((expenses.homeInsuranceAnnual || 0) / 12);

    const totalInitialCosts = (loanDetails.downPayment || 0) +
        (loanDetails.loanInsurance || 0) +
        (loanDetails.loanFees || 0) +
        (expenses.oneTimeExpenses || 0);

    return (
        <div className="grid grid-4 fade-in" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="summary-card">
                <div className="summary-label">Monthly EMI</div>
                <div className="summary-value">{formatCurrencyShort(currentMonthData.emi)}</div>
                <div className="summary-subtitle">
                    {formatCurrency(currentMonthData.emi)}
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-label">Total Interest</div>
                <div className="summary-value">{formatCurrencyShort(loanSummary.totalInterest)}</div>
                <div className="summary-subtitle">
                    Over {loanSummary.actualTenureMonths} months
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-label">Total Payment</div>
                <div className="summary-value">{formatCurrencyShort(loanSummary.totalPayable)}</div>
                <div className="summary-subtitle">
                    Principal + Interest
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-label">Loan Completion</div>
                <div className="summary-value" style={{ fontSize: '1.5rem' }}>
                    {completionDate ? formatDateDisplay(completionDate) : 'N/A'}
                </div>
                <div className="summary-subtitle">
                    {loanSummary.actualTenureMonths} months tenure
                </div>
            </div>

            {totalMonthlyPayment > currentMonthData.emi && (
                <div className="summary-card">
                    <div className="summary-label">Total Monthly Cost</div>
                    <div className="summary-value">{formatCurrencyShort(totalMonthlyPayment)}</div>
                    <div className="summary-subtitle">
                        EMI + Expenses
                    </div>
                </div>
            )}

            {totalInitialCosts > 0 && (
                <div className="summary-card">
                    <div className="summary-label">Initial Costs</div>
                    <div className="summary-value">{formatCurrencyShort(totalInitialCosts)}</div>
                    <div className="summary-subtitle">
                        Down + Fees + Expenses
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryCards;
