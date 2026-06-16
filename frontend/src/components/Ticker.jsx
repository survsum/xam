import React from 'react';

const items = [
  { label: 'Block', hash: '#0x4F2A', event: 'Paper Upload Verified ✓' },
  { label: 'Block', hash: '#0x4F2B', event: 'Encryption Key Stored ✓' },
  { label: 'Block', hash: '#0x4F2C', event: 'Institution Auth Confirmed ✓' },
  { label: 'Block', hash: '#0x4F2D', event: 'Decryption Released 09:00 ✓' },
  { label: 'Block', hash: '#0x4F2E', event: 'Print Audit Logged ✓' },
  { label: 'Block', hash: '#0x4F2F', event: 'Immutable Record Created ✓' },
];

// Duplicate for seamless loop
const allItems = [...items, ...items];

export default function Ticker() {
  return (
    <div style={{
      background: 'var(--accentlight)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '0.6rem 0',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        display: 'flex',
        gap: '3rem',
        animation: 'ticker 22s linear infinite',
        whiteSpace: 'nowrap',
        width: 'max-content',
      }}>
        {allItems.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.71rem',
            color: 'var(--muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            {item.label}{' '}
            <span style={{ color: 'var(--accent)' }}>{item.hash}</span>
            {' — '}{item.event}
          </span>
        ))}
      </div>
    </div>
  );
}
