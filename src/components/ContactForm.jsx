import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);

        // EmailJS credentials
        const serviceId = 'service_lbbif9w';
        const templateId = 'template_mxzfe5p';
        const publicKey = '3bQioFSCutpWw7W50';

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'mythoughtraju@gmail.com'
        };

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setSubmitted(true);
                setSending(false);
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                    onClose();
                }, 3000);
            })
            .catch((error) => {
                console.error('FAILED...', error);
                setSending(false);
                alert('Failed to send message. Please try again or email directly at mythoughtraju@gmail.com');
            });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-2xl)',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-color)'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>📧 Contact Me</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            padding: '0.25rem'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {submitted ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--accent-success)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Message Sent!</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. I'll get back to you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label className="form-label">Your Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label className="form-label">Your Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-input"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={5}
                                placeholder="Your message here..."
                                style={{ resize: 'vertical', minHeight: '100px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={sending}
                                style={{ flex: 1 }}
                            >
                                {sending ? '📤 Sending...' : '📧 Send Message'}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={onClose}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactForm;
