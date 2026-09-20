import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '4rem 2rem 3rem',
      borderTop: '1px solid var(--glass-border)',
      background: 'var(--bg-dark-surface)',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '1.4rem',
        fontWeight: 900,
        color: 'var(--text-primary)',
        marginBottom: '0.8rem',
        letterSpacing: '0.08em',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        VIEL
      </div>
      <p style={{
        color: 'var(--text-dark-muted)',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.82rem',
        lineHeight: 1.8,
      }}>
        © {new Date().getFullYear()} Viel. Cryptographic Examination Infrastructure.<br />
        Built with integrity for paper setters and academic institutions worldwide.
      </p>
    </footer>
  );
}
