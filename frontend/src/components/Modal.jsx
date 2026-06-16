import React from 'react';
import Button from './Button';

export default function Modal({ icon, title, message, onClose }) {
  if (!title) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,28,53,0.38)',
        backdropFilter: 'blur(7px)',
        zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--accent)',
          borderRadius: 18,
          padding: '3rem 2.6rem',
          textAlign: 'center',
          maxWidth: 380, width: '90%',
          boxShadow: '0 24px 70px rgba(26,86,219,0.18)',
          animation: 'popIn 0.38s ease',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{
          fontSize: '1.4rem', fontWeight: 800,
          marginBottom: '0.6rem', color: 'var(--text)',
        }}>{title}</h3>
        <p style={{
          color: 'var(--muted)', fontSize: '0.9rem',
          lineHeight: 1.65, marginBottom: '2rem',
        }}>{message}</p>
        <Button onClick={onClose} size="md">Close</Button>
      </div>
    </div>
  );
}
