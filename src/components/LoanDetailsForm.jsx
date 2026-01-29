import React from 'react';
import { formatCurrency, parseFormattedNumber } from '../utils/formatters';

const LoanDetailsForm = ({ loanDetails, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...loanDetails, [field]: value });
    };

    const handleNumberInput = (field, formattedValue) => {
        const numericValue = parseFormattedNumber(formattedValue);
        handleChange(field, numericValue);
    };

    const formatInputValue = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const downPaymentPercentage = loanDetails.homeValue > 0
        ? ((loanDetails.downPayment / loanDetails.homeValue) * 100).toFixed(2)
        : 0;

    const loanAmount = loanDetails.homeValue - loanDetails.downPayment;

    return (
        <div className="card fade-in">
            <h3 className="card-title">Loan Details</h3>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Home Value</label>
                    <div className="input-group">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input"
                            value={formatInputValue(loanDetails.homeValue)}
                            onChange={(e) => handleNumberInput('homeValue', e.target.value)}
                            placeholder="50,00,000"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Down Payment</label>
                    <div className="input-group has-suffix">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input"
                            value={formatInputValue(loanDetails.downPayment)}
                            onChange={(e) => handleNumberInput('downPayment', e.target.value)}
                            placeholder="10,00,000"
                        />
                        <span className="input-suffix">{downPaymentPercentage}%</span>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Loan Amount</label>
                <div className="input-group">
                    <span className="input-prefix">₹</span>
                    <input
                        type="text"
                        className="form-input"
                        value={formatInputValue(loanAmount)}
                        disabled
                        style={{ background: 'var(--bg-primary)', cursor: 'not-allowed' }}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Loan Insurance</label>
                    <div className="input-group">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input"
                            value={formatInputValue(loanDetails.loanInsurance)}
                            onChange={(e) => handleNumberInput('loanInsurance', e.target.value)}
                            placeholder="50,000"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Loan Fees & Charges</label>
                    <div className="input-group">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input"
                            value={formatInputValue(loanDetails.loanFees)}
                            onChange={(e) => handleNumberInput('loanFees', e.target.value)}
                            placeholder="25,000"
                        />
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Interest Rate</label>
                    <div className="input-group has-suffix">
                        <input
                            type="number"
                            className="form-input"
                            value={loanDetails.interestRate}
                            onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
                            placeholder="8.5"
                            step="0.01"
                            min="0"
                            max="30"
                        />
                        <span className="input-suffix">%</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Loan Tenure (Years)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={loanDetails.tenureYears}
                        onChange={(e) => handleChange('tenureYears', parseInt(e.target.value) || 0)}
                        placeholder="20"
                        min="1"
                        max="30"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Loan Start Date</label>
                <input
                    type="month"
                    className="form-input"
                    value={loanDetails.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                />
            </div>
        </div>
    );
};

export default LoanDetailsForm;
