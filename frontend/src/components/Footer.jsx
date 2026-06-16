import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        fontSize: '1.25rem', fontWeight: 800,
        color: 'var(--accent)', fontFamily: 'var(--font-body)',
        marginBottom: '0.7rem',
        letterSpacing: '-0.01em',
      }}>
        🔐 PerfectXskills
      </div>
      <p style={{
        color: 'var(--muted)', fontFamily: 'var(--font-mono)',
        fontSize: '0.77rem', lineHeight: 1.8,
      }}>
        © 2025 PerfectXskills. Blockchain-powered exam security.<br />
        Built with integrity — for institutions that demand it.
      </p>
    </footer>
  );
}
