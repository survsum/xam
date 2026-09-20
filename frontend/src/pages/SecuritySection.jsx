import React from 'react';

export default function SecuritySection() {
  return (
    <section id="security" style={{
      padding: '12rem 5vw',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      
      {/* Eyebrow */}
      <span className="editorial-eyebrow">
        03 — SECURITY
      </span>

      {/* Primary Headline */}
      <h2 className="editorial-primary-heading" style={{ marginBottom: '0.4rem' }}>
        PROTECTED BY DESIGN.
      </h2>

      {/* Lighter Weight Secondary Headline */}
      <div className="editorial-secondary-heading" style={{ marginBottom: '3rem' }}>
        Zero trust architecture.
      </div>

      {/* Short Explanation */}
      <p className="editorial-description" style={{ marginBottom: '4rem', fontSize: '1.15rem' }}>
        Your examination papers remain cryptographically protected until authorized release.
      </p>

      {/* Editorial Statements Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3rem',
        marginTop: '2rem'
      }}>
        <SecurityStatement
          title="Encrypted at the source."
          desc="AES-256-CBC byte protection using 32-byte master key and random IV per document."
        />

        <SecurityStatement
          title="Time-locked until release."
          desc="Server-side temporal barriers strictly enforce scheduled unlock timestamp."
        />

        <SecurityStatement
          title="Verified by proof."
          desc="Canonical SHA-256 raw bytes notarized on Solidity smart contract."
        />
      </div>

    </section>
  );
}

function SecurityStatement({ title, desc }) {
  return (
    <div style={{
      borderLeft: '2px solid var(--accent-violet-bright)',
      paddingLeft: '1.5rem',
    }}>
      <h3 style={{
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '0.6rem',
        letterSpacing: '-0.02em',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
        {desc}
      </p>
    </div>
  );
}
