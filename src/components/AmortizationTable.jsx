import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { formatDateDisplay } from '../utils/dateHelpers';

const AmortizationTable = ({ schedule }) => {
    const [showAll, setShowAll] = useState(false);

    if (!schedule || schedule.length === 0) {
        return null;
    }

    const displayedSchedule = showAll ? schedule : schedule.slice(0, 12);

    return (
        <div className="card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>Amortization Schedule</h3>
                {schedule.length > 12 && (
                    <button className="btn btn-small btn-secondary" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : `Show All (${schedule.length} months)`}
                    </button>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Date</th>
                            <th>Payment</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Disbursement</th>
                            <th>Balance</th>
                            <th>Events</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedSchedule.map((entry, index) => (
                            <tr
                                key={index}
                                className={entry.isRateChange || entry.hasPartPayment || entry.hasDisbursement ? 'highlight' : ''}
                            >
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {entry.month}
                                </td>
                                <td>{formatDateDisplay(entry.date)}</td>
                                <td>
                                    {entry.isPreEMI ? (
                                        <span style={{ color: 'var(--accent-warning)' }}>
                                            {formatCurrency(entry.emi)} <small>(Pre-EMI)</small>
                                        </span>
                                    ) : (
                                        formatCurrency(entry.emi)
                                    )}
                                </td>
                                <td style={{ color: 'var(--accent-success)' }}>
                                    {formatCurrency(entry.principal)}
                                </td>
                                <td style={{ color: 'var(--accent-primary)' }}>
                                    {formatCurrency(entry.interest)}
                                </td>
                                <td>
                                    {entry.disbursement && entry.disbursement > 0 ? (
                                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                                            {formatCurrency(entry.disbursement)}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                                    )}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {formatCurrency(entry.balance)}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                        {entry.isPreEMI && (
                                            <span className="badge badge-warning">
                                                ⏳ Pre-EMI
                                            </span>
                                        )}
                                        {entry.hasDisbursement && (
                                            <span className="badge badge-primary">
                                                💳 Disbursed
                                            </span>
                                        )}
                                        {entry.isRateChange && (
                                            <span className="badge badge-warning">
                                                ⚡ {entry.rate}%
                                            </span>
                                        )}
                                        {entry.hasPartPayment && entry.partPayment > 0 && (
                                            <span className="badge badge-success">
                                                💰 Payment
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!showAll && schedule.length > 12 && (
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                }}>
                    Showing first 12 months of {schedule.length} total months
                </div>
            )}
        </div>
    );
};

export default AmortizationTable;
