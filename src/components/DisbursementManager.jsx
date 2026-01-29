import React, { useState } from 'react';
import { formatDateDisplay } from '../utils/dateHelpers';
import { formatCurrencyShort, parseFormattedNumber } from '../utils/formatters';

const DisbursementManager = ({ disbursements, onChange, startDate, loanAmount }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newDisbursement, setNewDisbursement] = useState({
        date: '',
        amount: '',
        preEMI: '', // Optional manual pre-EMI
    });

    const handleAdd = () => {
        if (newDisbursement.date && newDisbursement.amount) {
            const disbursementDate = new Date(newDisbursement.date + '-01');
            const amount = parseFormattedNumber(newDisbursement.amount);
            const preEMI = newDisbursement.preEMI ? parseFormattedNumber(newDisbursement.preEMI) : 0;

            // Validate total disbursement doesn't exceed loan amount
            const totalDisbursed = disbursements.reduce((sum, d, idx) => {
                // Exclude the one being edited from total
                if (idx === editingIndex) return sum;
                return sum + d.amount;
            }, 0);

            if (totalDisbursed + amount > loanAmount) {
                alert(`Total disbursements cannot exceed loan amount of ₹${new Intl.NumberFormat('en-IN').format(loanAmount)}`);
                return;
            }

            if (editingIndex !== null) {
                // Update existing entry
                const updated = [...disbursements];
                updated[editingIndex] = { date: disbursementDate, amount, preEMI };
                onChange(updated);
                setEditingIndex(null);
            } else {
                // Add new entry
                onChange([...disbursements, { date: disbursementDate, amount, preEMI }]);
            }

            setNewDisbursement({ date: '', amount: '', preEMI: '' });
            setIsAdding(false);
        }
    };

    const handleEdit = (index) => {
        const disbursement = disbursements[index];
        const dateStr = `${disbursement.date.getFullYear()}-${String(disbursement.date.getMonth() + 1).padStart(2, '0')}`;
        setNewDisbursement({
            date: dateStr,
            amount: disbursement.amount.toString(),
            preEMI: disbursement.preEMI ? disbursement.preEMI.toString() : '',
        });
        setEditingIndex(index);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setNewDisbursement({ date: '', amount: '', preEMI: '' });
        setEditingIndex(null);
        setIsAdding(false);
    };

    const handleDelete = (index) => {
        onChange(disbursements.filter((_, i) => i !== index));
    };

    const sortedDisbursements = [...disbursements].sort((a, b) => a.date - b.date);
    const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
    const remainingAmount = loanAmount - totalDisbursed;

    return (
        <div className="card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>Loan Disbursements</h3>
                <button className="btn btn-small" onClick={() => editingIndex !== null ? handleCancel() : setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Disbursement'}
                </button>
            </div>

            <div style={{
                marginBottom: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-primary)'
            }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    💡 Track multiple loan disbursements. EMI starts after all disbursements are complete.
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span>Total Loan Amount:</span>
                    <strong>₹{new Intl.NumberFormat('en-IN').format(loanAmount)}</strong>
                </div>
            </div>

            {isAdding && (
                <div className="form-row" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="form-group">
                        <label className="form-label">Disbursement Date</label>
                        <input
                            type="month"
                            className="form-input"
                            value={newDisbursement.date}
                            onChange={(e) => setNewDisbursement({ ...newDisbursement, date: e.target.value })}
                            min={startDate}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Disbursement Amount</label>
                        <div className="input-group">
                            <span className="input-prefix">₹</span>
                            <input
                                type="text"
                                className="form-input"
                                value={newDisbursement.amount}
                                onChange={(e) => setNewDisbursement({ ...newDisbursement, amount: e.target.value })}
                                placeholder="10,00,000"
                            />
                        </div>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            Remaining: ₹{new Intl.NumberFormat('en-IN').format(remainingAmount)}
                        </small>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Pre-EMI Amount (Monthly)</label>
                        <div className="input-group">
                            <span className="input-prefix">₹</span>
                            <input
                                type="text"
                                className="form-input"
                                value={newDisbursement.preEMI}
                                onChange={(e) => setNewDisbursement({ ...newDisbursement, preEMI: e.target.value })}
                                placeholder="32,000"
                            />
                        </div>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            Enter the monthly pre-EMI amount from your bank
                        </small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn btn-success" onClick={handleAdd}>
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </button>
                    </div>
                </div>
            )}

            {sortedDisbursements.length === 0 ? (
                <div className="empty-state">
                    <p>No disbursements added</p>
                    <small>Add disbursement entries or leave empty to disburse full amount on start date</small>
                </div>
            ) : (
                <>
                    <div className="item-list">
                        {sortedDisbursements.map((disbursement, index) => {
                            const originalIndex = disbursements.indexOf(disbursement);
                            return (
                                <div key={index} className="item">
                                    <div className="item-content">
                                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                    DISBURSEMENT DATE
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {formatDateDisplay(disbursement.date)}
                                                </div>
                                            </div>
                                            <div style={{ width: '2px', height: '30px', background: 'var(--border-color)' }}></div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                    AMOUNT
                                                </div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                    {formatCurrencyShort(disbursement.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button className="icon-btn" onClick={() => handleEdit(originalIndex)} title="Edit">
                                            ✏️
                                        </button>
                                        <button className="icon-btn danger" onClick={() => handleDelete(originalIndex)} title="Delete">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'grid',
                        gap: '0.5rem'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Disbursed:</span>
                            <strong style={{ color: 'var(--accent-primary)' }}>
                                ₹{new Intl.NumberFormat('en-IN').format(totalDisbursed)}
                            </strong>
                        </div>
                        {remainingAmount > 0 && (
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Remaining to Disburse:</span>
                                <strong style={{ color: 'var(--accent-warning)' }}>
                                    ₹{new Intl.NumberFormat('en-IN').format(remainingAmount)}
                                </strong>
                            </div>
                        )}
                        {remainingAmount === 0 && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', textAlign: 'center', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                                ✓ Full loan amount disbursed
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DisbursementManager;
