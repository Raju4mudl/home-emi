import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import LoanDetailsForm from './components/LoanDetailsForm';
import HomeownerExpenses from './components/HomeownerExpenses';
import RateChangeManager from './components/RateChangeManager';
import PartPaymentManager from './components/PartPaymentManager';
import DisbursementManager from './components/DisbursementManager';
import SummaryCards from './components/SummaryCards';
import PaymentChart from './components/PaymentChart';
import AmortizationTable from './components/AmortizationTable';
import ContactForm from './components/ContactForm';
import { generateAmortizationScheduleWithDisbursements, calculateLoanSummary } from './utils/emiCalculator';
import { parseMonthYear } from './utils/dateHelpers';
import html2pdf from 'html2pdf.js';

function App() {
  const currentDate = new Date();
  const currentMonthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  // Helper to load from localStorage with fallback to default
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects for arrays
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            date: item.date ? new Date(item.date) : item.date
          }));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    return defaultValue;
  };

  const [loanDetails, setLoanDetails] = useState(() =>
    loadFromStorage('loanDetails', {
      homeValue: 5000000,
      downPayment: 1000000,
      loanInsurance: 50000,
      interestRate: 8.5,
      tenureYears: 20,
      loanFees: 25000,
      startDate: currentMonthYear,
    })
  );

  const [expenses, setExpenses] = useState(() =>
    loadFromStorage('expenses', {
      oneTimeExpenses: 200000,
      propertyTaxAnnual: 25000,
      homeInsuranceAnnual: 15000,
      maintenanceMonthly: 5000,
    })
  );

  const [rateChanges, setRateChanges] = useState(() => loadFromStorage('rateChanges', []));
  const [partPayments, setPartPayments] = useState(() => loadFromStorage('partPayments', []));
  const [disbursements, setDisbursements] = useState(() => loadFromStorage('disbursements', []));
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('loanDetails', JSON.stringify(loanDetails));
  }, [loanDetails]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('rateChanges', JSON.stringify(rateChanges));
  }, [rateChanges]);

  useEffect(() => {
    localStorage.setItem('partPayments', JSON.stringify(partPayments));
  }, [partPayments]);

  useEffect(() => {
    localStorage.setItem('disbursements', JSON.stringify(disbursements));
  }, [disbursements]);

  // Clear all data
  const handleClearAll = () => {
    if (window.confirm('⚠️ This will erase all your data. Are you sure?')) {
      // Clear localStorage
      localStorage.removeItem('loanDetails');
      localStorage.removeItem('expenses');
      localStorage.removeItem('rateChanges');
      localStorage.removeItem('partPayments');
      localStorage.removeItem('disbursements');

      // Reset state to defaults
      setLoanDetails({
        homeValue: 5000000,
        downPayment: 1000000,
        loanInsurance: 50000,
        interestRate: 8.5,
        tenureYears: 20,
        loanFees: 25000,
        startDate: currentMonthYear,
      });
      setExpenses({
        oneTimeExpenses: 200000,
        propertyTaxAnnual: 25000,
        homeInsuranceAnnual: 15000,
        maintenanceMonthly: 5000,
      });
      setRateChanges([]);
      setPartPayments([]);
      setDisbursements([]);
    }
  };

  // Calculate loan details
  const principal = loanDetails.homeValue - loanDetails.downPayment;
  const tenureMonths = loanDetails.tenureYears * 12;
  const startDate = parseMonthYear(loanDetails.startDate);

  // Generate amortization schedule
  const schedule = useMemo(() => {
    if (principal <= 0 || tenureMonths <= 0) {
      return [];
    }

    // Expand recurring part payments into individual entries
    const expandedPartPayments = [];
    partPayments.forEach(payment => {
      if (payment.isRecurring) {
        // Generate payments for every year within the loan tenure
        const paymentMonth = payment.date.getMonth();
        const paymentYear = payment.date.getFullYear();
        const startYear = startDate.getFullYear();
        const endYear = startYear + Math.ceil(tenureMonths / 12);

        for (let year = paymentYear; year <= endYear; year++) {
          const recurringDate = new Date(year, paymentMonth, 1);
          // Only add if it's within loan period
          if (recurringDate >= startDate) {
            expandedPartPayments.push({
              date: recurringDate,
              amount: payment.amount
            });
          }
        }
      } else {
        // One-time payment
        expandedPartPayments.push({
          date: payment.date,
          amount: payment.amount
        });
      }
    });

    return generateAmortizationScheduleWithDisbursements(
      principal,
      loanDetails.interestRate,
      tenureMonths,
      startDate,
      disbursements,
      rateChanges,
      expandedPartPayments
    );
  }, [principal, loanDetails.interestRate, tenureMonths, startDate, disbursements, rateChanges, partPayments]);

  const loanSummary = useMemo(() => {
    if (schedule.length === 0) {
      return {
        totalInterest: 0,
        totalPrincipal: 0,
        totalPartPayments: 0,
        totalPayable: 0,
        actualTenureMonths: 0,
      };
    }
    return calculateLoanSummary(schedule);
  }, [schedule]);

  // Export PDF function
  const handleExportPDF = () => {
    const element = document.getElementById('pdf-export-content');
    const opt = {
      margin: [10, 10],
      filename: `Home-Loan-EMI-Report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="App">
      <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)', position: 'relative' }}>
        <button
          className="header-btn header-btn-clear"
          onClick={handleClearAll}
          style={{
            background: 'var(--bg-danger)',
            color: 'white',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🗑️ Clear All Data
        </button>
        <button
          className="header-btn header-btn-export"
          onClick={handleExportPDF}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-info))',
            color: 'white',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          📄 Export PDF
        </button>
        <h1>🏠 Home Loan EMI Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          Calculate your monthly EMI, track rate changes, and plan part payments
        </p>
      </header>

      <div id="pdf-export-content">
        {/* Input Section */}
        <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <LoanDetailsForm loanDetails={loanDetails} onChange={setLoanDetails} />
          <HomeownerExpenses expenses={expenses} onChange={setExpenses} />
        </div>

        {/* Disbursement Section */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <DisbursementManager
            disbursements={disbursements}
            onChange={setDisbursements}
            startDate={loanDetails.startDate}
            loanAmount={principal}
          />
        </div>

        {/* Advanced Features */}
        <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <RateChangeManager
            rateChanges={rateChanges}
            onChange={setRateChanges}
            startDate={loanDetails.startDate}
          />
          <PartPaymentManager
            partPayments={partPayments}
            onChange={setPartPayments}
            startDate={loanDetails.startDate}
          />
        </div>

        {/* Results Section */}
        {schedule.length > 0 && (
          <>
            <SummaryCards
              loanSummary={loanSummary}
              loanDetails={loanDetails}
              schedule={schedule}
              expenses={expenses}
            />

            <PaymentChart schedule={schedule} />

            <AmortizationTable schedule={schedule} />
          </>
        )}

        {schedule.length === 0 && principal > 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Enter loan details to see your EMI calculation</h3>
          </div>
        )}


        <footer style={{
          textAlign: 'center',
          marginTop: 'var(--spacing-2xl)',
          padding: 'var(--spacing-xl)',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>💡 Tip: Add rate changes and part payments to see how they affect your loan tenure and total interest</p>
          </div>
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: 'var(--spacing-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
              © {new Date().getFullYear()} <strong>Home Loan EMI Calculator</strong>. All rights reserved.
            </p>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Developed with ❤️ by <a
                href="https://www.linkedin.com/in/raju-gorai/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1px dotted var(--accent-primary)'
                }}
                onMouseEnter={(e) => e.target.style.borderBottom = '1px solid var(--accent-primary)'}
                onMouseLeave={(e) => e.target.style.borderBottom = '1px dotted var(--accent-primary)'}
              >
                Raju Gorai
              </a>
            </p>
            <button
              onClick={() => setIsContactFormOpen(true)}
              style={{
                marginTop: 'var(--spacing-md)',
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-info))',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              📧 Contact Me
            </button>
          </div>
        </footer>
      </div>

      {/* Contact Form Modal */}
      <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
    </div>
  );
}

export default App;
