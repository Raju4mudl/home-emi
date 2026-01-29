import React, { useState } from 'react';
import { formatDateDisplay } from '../utils/dateHelpers';
import { formatCurrencyShort, parseFormattedNumber } from '../utils/formatters';

const PartPaymentManager = ({ partPayments, onChange, startDate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newPartPayment, setNewPartPayment] = useState({
        date: '',
        amount: '',
        isRecurring: false, // Annual recurring payment
    });

    const handleAdd = () => {
        if (newPartPayment.date && newPartPayment.amount) {
            const paymentDate = new Date(newPartPayment.date + '-01');
            const amount = parseFormattedNumber(newPartPayment.amount);

            if (editingIndex !== null) {
                // Update existing entry
                const updated = [...partPayments];
                updated[editingIndex] = { date: paymentDate, amount, isRecurring: newPartPayment.isRecurring };
                onChange(updated);
                setEditingIndex(null);
            } else {
                // Add new entry
                onChange([...partPayments, { date: paymentDate, amount, isRecurring: newPartPayment.isRecurring }]);
            }

            setNewPartPayment({ date: '', amount: '', isRecurring: false });
            setIsAdding(false);
        }
    };

    const handleEdit = (index) => {
        const payment = partPayments[index];
        const dateStr = `${payment.date.getFullYear()}-${String(payment.date.getMonth() + 1).padStart(2, '0')}`;
        setNewPartPayment({
            date: dateStr,
            amount: payment.amount.toString(),
            isRecurring: payment.isRecurring || false,
        });
        setEditingIndex(index);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setNewPartPayment({ date: '', amount: '', isRecurring: false });
        setEditingIndex(null);
        setIsAdding(false);
    };

    const handleDelete = (index) => {
        onChange(partPayments.filter((_, i) => i !== index));
    };

    const formatInputValue = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-IN').format(parseFormattedNumber(value));
    };

    const sortedPartPayments = [...partPayments].sort((a, b) => a.date - b.date);
    const totalPartPayments = partPayments.reduce((sum, pp) => sum + pp.amount, 0);

    return (
        <div className="card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>Part Payments</h3>
                <button className="btn btn-small" onClick={() => editingIndex !== null ? handleCancel() : setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Part Payment'}
                </button>
            </div>

            {isAdding && (
                <div className="form-row" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="form-group">
                        <label className="form-label">Payment Date</label>
                        <input
                            type="month"
                            className="form-input"
                            value={newPartPayment.date}
                            onChange={(e) => setNewPartPayment({ ...newPartPayment, date: e.target.value })}
                            min={startDate}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Payment Amount</label>
                        <div className="input-group">
                            <span className="input-prefix">₹</span>
                            <input
                                type="text"
                                className="form-input"
                                value={newPartPayment.amount}
                                onChange={(e) => setNewPartPayment({ ...newPartPayment, amount: e.target.value })}
                                placeholder="5,00,000"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <input
                                type="checkbox"
                                checked={newPartPayment.isRecurring}
                                onChange={(e) => setNewPartPayment({ ...newPartPayment, isRecurring: e.target.checked })}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>🔄 Repeat every year</span>
                        </label>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', marginLeft: '1.5rem' }}>
                            Auto-apply this payment annually in the same month
                        </small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn btn-success" onClick={handleAdd}>
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </button>
                    </div>
                </div>
            )}

            {sortedPartPayments.length === 0 ? (
                <div className="empty-state">
                    <p>No part payments added yet</p>
                    <small>Click "Add Part Payment" to add lump sum payments that reduce your principal</small>
                </div>
            ) : (
                <>
                    <div className="item-list">
                        {sortedPartPayments.map((payment, index) => {
                            const originalIndex = partPayments.indexOf(payment);
                            return (
                                <div key={index} className="item">
                                    <div className="item-content">
                                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                    PAYMENT DATE
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {formatDateDisplay(payment.date)}
                                                </div>
                                            </div>
                                            <div style={{ width: '2px', height: '30px', background: 'var(--border-color)' }}></div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                    AMOUNT
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                                                        {formatCurrencyShort(payment.amount)}
                                                    </div>
                                                    {payment.isRecurring && (
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem',
                                                            background: 'var(--accent-info-bg)',
                                                            color: 'var(--accent-info)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            fontWeight: 600
                                                        }}>
                                                            🔄 Annual
                                                        </span>
                                                    )}
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

                    {totalPartPayments > 0 && (
                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--accent-success)'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total Part Payments:</span>
                                <strong style={{ color: 'var(--accent-success)' }}>
                                    ₹{new Intl.NumberFormat('en-IN').format(totalPartPayments)}
                                </strong>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PartPaymentManager;
