import React, { useState } from 'react';

export default function Button({ children, variant = 'primary', size = 'md', onClick, fullWidth }) {
  const [hovered, setHovered] = useState(false);

  const sizes = {
    sm: { padding: '0.5rem 1.2rem', fontSize: '0.82rem' },
    md: { padding: '0.72rem 1.8rem', fontSize: '0.88rem' },
    lg: { padding: '0.9rem 2.4rem', fontSize: '0.97rem' },
  };

  const base = {
    ...sizes[size],
    borderRadius: 9,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    letterSpacing: '0.03em',
    transition: 'all 0.22s',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    width: fullWidth ? '100%' : 'auto',
    justifyContent: fullWidth ? 'center' : undefined,
  };

  const variants = {
    primary: {
      background: hovered
        ? 'linear-gradient(135deg,#0d47c7,#0891b2)'
        : 'linear-gradient(135deg, var(--accent), var(--accent2))',
      color: '#fff',
      transform: hovered ? 'translateY(-2px)' : 'none',
      boxShadow: hovered ? '0 10px 26px rgba(26,86,219,0.28)' : 'none',
    },
    outline: {
      background: hovered ? 'var(--accentlight)' : 'transparent',
      border: `1.5px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
      color: hovered ? 'var(--accent)' : 'var(--text)',
    },
    ghost: {
      background: hovered ? 'var(--surface2)' : 'transparent',
      color: hovered ? 'var(--accent)' : 'var(--muted)',
      border: 'none',
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}
