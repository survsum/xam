import React from 'react';

const workflowWords = [
  { word: 'Upload.', sub: 'Paper setter uploads encrypted payload to authenticated vault.' },
  { word: 'Encrypt.', sub: 'AES-256-CBC byte lock with unique IV generation.' },
  { word: 'Lock.', sub: 'Server-side temporal barrier blocks pre-unlock access.' },
  { word: 'Verify.', sub: 'Canonical SHA-256 digest notarized on Solidity ledger.' },
  { word: 'Release.', sub: 'Authenticated decryption stream opened at exact unlock time.' },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{
      padding: '12rem 5vw',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      
      {/* Eyebrow */}
      <span className="editorial-eyebrow">
        02 — HOW IT WORKS
      </span>

      {/* Primary Statement */}
      <h2 className="editorial-primary-heading" style={{ marginBottom: '0.4rem' }}>
        FROM UPLOAD
      </h2>

      {/* Lighter Secondary Statement */}
      <div className="editorial-secondary-heading" style={{ marginBottom: '5rem' }}>
        TO RELEASE.
      </div>

      {/* Cinematic Timeline Words Layout (No 5 generic cards) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        maxWidth: 800,
      }}>
        {workflowWords.map((item, index) => (
          <div
            key={item.word}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              alignItems: 'baseline',
              paddingBottom: '2.5rem',
              borderBottom: index < workflowWords.length - 1 ? '1px solid var(--glass-border)' : 'none',
            }}
          >
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--accent-violet-bright)',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              0{index + 1}
            </span>

            <div>
              <h3 style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                marginBottom: '0.4rem',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                {item.word}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 460 }}>
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
