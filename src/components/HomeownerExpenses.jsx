import React from 'react';
import { parseFormattedNumber } from '../utils/formatters';

const HomeownerExpenses = ({ expenses, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...expenses, [field]: value });
    };

    const handleNumberInput = (field, formattedValue) => {
        const numericValue = parseFormattedNumber(formattedValue);
        handleChange(field, numericValue);
    };

    const formatInputValue = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-IN').format(value);
    };

    return (
        <div className="card fade-in">
            <h3 className="card-title">Homeowner Expenses</h3>

            <div className="form-group">
                <label className="form-label">One-time Expenses</label>
                <div className="input-group">
                    <span className="input-prefix">₹</span>
                    <input
                        type="text"
                        className="form-input"
                        value={formatInputValue(expenses.oneTimeExpenses)}
                        onChange={(e) => handleNumberInput('oneTimeExpenses', e.target.value)}
                        placeholder="2,00,000"
                    />
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    Includes registration, stamp duty, legal fees, etc.
                </small>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Property Taxes (Annual)</label>
                    <div className="input-group">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input"
                            value={formatInputValue(expenses.propertyTaxAnnual)}
                            onChange={(e) => handleNumberInput('propertyTaxAnnual', e.target.value)}
                            placeholder="25,000"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Home Insurance (Annual)</label>
                    <div className="input-group">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input"
                            value={formatInputValue(expenses.homeInsuranceAnnual)}
                            onChange={(e) => handleNumberInput('homeInsuranceAnnual', e.target.value)}
                            placeholder="15,000"
                        />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Maintenance Expenses (Monthly)</label>
                <div className="input-group">
                    <span className="input-prefix">₹</span>
                    <input
                        type="text"
                        className="form-input"
                        value={formatInputValue(expenses.maintenanceMonthly)}
                        onChange={(e) => handleNumberInput('maintenanceMonthly', e.target.value)}
                        placeholder="5,000"
                    />
                </div>
            </div>

            <div style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-primary)'
            }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Total Monthly Expenses:</span>
                        <strong>₹{new Intl.NumberFormat('en-IN').format(
                            expenses.maintenanceMonthly +
                            (expenses.propertyTaxAnnual / 12) +
                            (expenses.homeInsuranceAnnual / 12)
                        )}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeownerExpenses;
