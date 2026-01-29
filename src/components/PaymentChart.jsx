import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PaymentChart = ({ schedule }) => {
    if (!schedule || schedule.length === 0) {
        return null;
    }

    const currentMonth = schedule[0];

    // Pie chart data for current month's EMI breakdown
    const pieData = {
        labels: ['Principal', 'Interest'],
        datasets: [
            {
                data: [currentMonth.principal, currentMonth.interest],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(99, 102, 241, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1',
                    font: {
                        size: 12,
                        family: 'Inter',
                    },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(10, 14, 39, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = ((value / currentMonth.emi) * 100).toFixed(1);
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                    },
                },
            },
        },
    };

    // Line chart data for principal vs interest over time
    // Sample every 12 months for better performance
    const sampledSchedule = schedule.filter((_, index) => index % 12 === 0 || index === schedule.length - 1);

    const lineData = {
        labels: sampledSchedule.map(entry => entry.month),
        datasets: [
            {
                label: 'Principal',
                data: sampledSchedule.map(entry => entry.principal),
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Interest',
                data: sampledSchedule.map(entry => entry.interest),
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1',
                    font: {
                        size: 12,
                        family: 'Inter',
                    },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(10, 14, 39, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 11,
                    },
                },
                title: {
                    display: true,
                    text: 'Month',
                    color: '#cbd5e1',
                },
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 11,
                    },
                    callback: function (value) {
                        return '₹' + (value / 1000).toFixed(0) + 'K';
                    },
                },
                title: {
                    display: true,
                    text: 'Amount',
                    color: '#cbd5e1',
                },
            },
        },
    };

    return (
        <div className="grid grid-2 fade-in" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="card">
                <h3 className="card-title">Current Month EMI Breakdown</h3>
                <div style={{ height: '300px' }}>
                    <Pie data={pieData} options={pieOptions} />
                </div>
                <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Monthly EMI: {formatCurrency(currentMonth.emi)}
                </div>
            </div>

            <div className="card">
                <h3 className="card-title">Principal vs Interest Over Time</h3>
                <div style={{ height: '300px' }}>
                    <Line data={lineData} options={lineOptions} />
                </div>
                <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Sampled data for visualization
                </div>
            </div>
        </div>
    );
};

export default PaymentChart;
