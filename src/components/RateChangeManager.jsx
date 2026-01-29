import React, { useState } from 'react';
import { formatDateDisplay } from '../utils/dateHelpers';
import { parseFormattedNumber } from '../utils/formatters';

const RateChangeManager = ({ rateChanges, onChange, startDate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newRateChange, setNewRateChange] = useState({
        date: '',
        newRate: '',
        adjustmentType: 'tenure', // 'emi' or 'tenure'
    });

    const handleAdd = () => {
        if (newRateChange.date && newRateChange.newRate) {
            const changeDate = new Date(newRateChange.date + '-01');

            if (editingIndex !== null) {
                // Update existing entry
                const updated = [...rateChanges];
                updated[editingIndex] = {
                    date: changeDate,
                    newRate: parseFloat(newRateChange.newRate),
                    adjustmentType: newRateChange.adjustmentType
                };
                onChange(updated);
                setEditingIndex(null);
            } else {
                // Add new entry
                onChange([...rateChanges, {
                    date: changeDate,
                    newRate: parseFloat(newRateChange.newRate),
                    adjustmentType: newRateChange.adjustmentType
                }]);
            }

            setNewRateChange({ date: '', newRate: '', adjustmentType: 'tenure' });
            setIsAdding(false);
        }
    };

    const handleEdit = (index) => {
        const change = rateChanges[index];
        const dateStr = `${change.date.getFullYear()}-${String(change.date.getMonth() + 1).padStart(2, '0')}`;
        setNewRateChange({
            date: dateStr,
            newRate: change.newRate.toString(),
            adjustmentType: change.adjustmentType || 'tenure',
        });
        setEditingIndex(index);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setNewRateChange({ date: '', newRate: '', adjustmentType: 'tenure' });
        setEditingIndex(null);
        setIsAdding(false);
    };

    const handleDelete = (index) => {
        onChange(rateChanges.filter((_, i) => i !== index));
    };

    const sortedRateChanges = [...rateChanges].sort((a, b) => a.date - b.date);

    return (
        <div className="card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>Interest Rate Changes</h3>
                <button className="btn btn-small" onClick={() => editingIndex !== null ? handleCancel() : setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Rate Change'}
                </button>
            </div>

            {isAdding && (
                <div className="form-row" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="form-group">
                        <label className="form-label">Change Date</label>
                        <input
                            type="month"
                            className="form-input"
                            value={newRateChange.date}
                            onChange={(e) => setNewRateChange({ ...newRateChange, date: e.target.value })}
                            min={startDate}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">New Interest Rate</label>
                        <div className="input-group has-suffix">
                            <input
                                type="number"
                                className="form-input"
                                value={newRateChange.newRate}
                                onChange={(e) => setNewRateChange({ ...newRateChange, newRate: e.target.value })}
                                placeholder="9.5"
                                step="0.01"
                                min="0"
                                max="30"
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Adjustment Type</label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xs)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <input
                                    type="radio"
                                    name="adjustmentType"
                                    value="tenure"
                                    checked={newRateChange.adjustmentType === 'tenure'}
                                    onChange={(e) => setNewRateChange({ ...newRateChange, adjustmentType: e.target.value })}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span>Keep EMI, Adjust Tenure</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <input
                                    type="radio"
                                    name="adjustmentType"
                                    value="emi"
                                    checked={newRateChange.adjustmentType === 'emi'}
                                    onChange={(e) => setNewRateChange({ ...newRateChange, adjustmentType: e.target.value })}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span>Keep Tenure, Adjust EMI</span>
                            </label>
                        </div>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            {newRateChange.adjustmentType === 'tenure'
                                ? '💡 Most banks keep EMI same and adjust tenure'
                                : '💡 EMI will change to maintain original tenure'}
                        </small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn btn-success" onClick={handleAdd}>
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </button>
                    </div>
                </div>
            )}

            {sortedRateChanges.length === 0 ? (
                <div className="empty-state">
                    <p>No rate changes added yet</p>
                    <small>Click "Add Rate Change" to add interest rate changes during the loan tenure</small>
                </div>
            ) : (
                <div className="item-list">
                    {sortedRateChanges.map((change, index) => {
                        const originalIndex = rateChanges.indexOf(change);
                        return (
                            <div key={index} className="item">
                                <div className="item-content">
                                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                EFFECTIVE FROM
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {formatDateDisplay(change.date)}
                                            </div>
                                        </div>
                                        <div style={{ width: '2px', height: '30px', background: 'var(--border-color)' }}></div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                NEW RATE
                                            </div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                {change.newRate}%
                                            </div>
                                        </div>
                                        {change.adjustmentType && (
                                            <>
                                                <div style={{ width: '2px', height: '30px', background: 'var(--border-color)' }}></div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                        ADJUSTMENT
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                        {change.adjustmentType === 'tenure' ? '📅 Keep EMI' : '💰 Keep Tenure'}
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
            )}
        </div>
    );
};

export default RateChangeManager;
