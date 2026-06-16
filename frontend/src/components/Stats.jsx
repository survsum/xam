import React from 'react';

const stats = [
  { val: '100%',   label: 'Tamper-Proof' },
  { val: '0ms',    label: 'Early Access' },
  { val: '256-bit',label: 'AES Encryption' },
  { val: '∞',      label: 'Audit Trail' },
];

export default function Stats() {
  return (
    <div style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '3rem 4rem',
      display: 'flex', justifyContent: 'center',
      gap: '5rem', flexWrap: 'wrap',
      position: 'relative', zIndex: 1,
      boxShadow: 'var(--shadow-sm)',
    }}>
      {stats.map(({ val, label }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.4rem', fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{val}</div>
          <div style={{
            color: 'var(--muted)', fontSize: '0.78rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            marginTop: '0.25rem', fontFamily: 'var(--font-mono)',
          }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
