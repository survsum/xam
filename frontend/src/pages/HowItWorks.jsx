import React from 'react';

const steps = [
  {
    num: '01',
    icon: '📤',
    title: 'Upload & Encrypt',
    desc: 'The paper setter uploads the question paper. It is immediately encrypted with AES-256 before touching any server.',
  },
  {
    num: '02',
    icon: '⛓️',
    title: 'Key on Blockchain',
    desc: 'The decryption key is split, hashed, and stored on an immutable blockchain ledger. No single party holds the full key.',
  },
  {
    num: '03',
    icon: '⏱️',
    title: 'Time-Lock Set',
    desc: 'The authority sets the exact exam time. A smart contract enforces it — zero exceptions, zero overrides.',
  },
  {
    num: '04',
    icon: '🏫',
    title: 'Institution Verified',
    desc: 'At exam time, authorised institutions are cryptographically verified before decryption is triggered.',
  },
  {
    num: '05',
    icon: '🖨️',
    title: 'Secure Print & Log',
    desc: 'Paper is decrypted locally and printed. Every action — from upload to print — is logged permanently on-chain.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{
      padding: '7rem 4rem', maxWidth: 1200, margin: '0 auto',
      position: 'relative', zIndex: 1,
    }}>
      <SectionLabel>// Process</SectionLabel>
      <h2 style={titleStyle}>How PerfectXskills Works</h2>
      <p style={subStyle}>A five-step tamper-proof pipeline from paper creation to controlled printing.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 1.5,
        background: 'var(--border)',
        border: '1px solid var(--border)',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        {steps.map((step) => <Step key={step.num} {...step} />)}
      </div>
    </section>
  );
}

function Step({ num, icon, title, desc }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface2)' : 'var(--surface)',
        padding: '2.4rem 2rem',
        transition: 'background 0.3s',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
        color: 'var(--accent)', letterSpacing: '0.14em',
        marginBottom: '1.4rem',
      }}>
        {num} —
      </div>
      <div style={{ fontSize: '2rem', marginBottom: '0.9rem' }}>{icon}</div>
      <h3 style={{
        fontSize: '1.05rem', fontWeight: 700,
        marginBottom: '0.5rem', color: 'var(--text)',
      }}>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.86rem', lineHeight: 1.67 }}>{desc}</p>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
      color: 'var(--accent)', letterSpacing: '0.2em',
      textTransform: 'uppercase', marginBottom: '1rem',
    }}>
      {children}
    </div>
  );
}

export const titleStyle = {
  fontSize: 'clamp(2rem, 4vw, 2.9rem)',
  fontWeight: 800, letterSpacing: '-0.025em',
  marginBottom: '1rem', color: 'var(--text)',
};

export const subStyle = {
  color: 'var(--muted)', fontSize: '1rem',
  maxWidth: 500, lineHeight: 1.72, marginBottom: '4rem',
};
