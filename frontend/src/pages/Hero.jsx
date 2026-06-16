import React from 'react';
import Button from '../components/Button';

const chainNodes = [
  { label: 'Upload',   hash: '#0x4F2A' },
  { label: 'Encrypt',  hash: '#0x4F2B' },
  { label: 'Lock Key', hash: '#0x4F2C' },
  { label: 'Release',  hash: '#0x4F2D' },
  { label: 'Audit Log',hash: '#0x4F2E' },
];

export default function Hero({ onSignup, onHowItWorks }) {
  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
      padding: '8rem 2rem 5rem',
      position: 'relative', zIndex: 1, overflow: 'hidden',
    }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '22%', left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 380,
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.13) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        background: 'var(--accentlight)',
        border: '1px solid rgba(26,86,219,0.18)',
        color: 'var(--accent)',
        padding: '0.4rem 1.2rem',
        borderRadius: 100,
        fontSize: '0.76rem',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        marginBottom: '2.4rem',
        animation: 'fadeDown 0.8s ease both',
      }}>
        <span style={{
          width: 7, height: 7, background: 'var(--accent)',
          borderRadius: '50%', animation: 'pulse 2s infinite',
          display: 'inline-block',
        }} />
        Blockchain-Powered Security
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(2.8rem, 7vw, 5.4rem)',
        fontWeight: 800, lineHeight: 1.05,
        letterSpacing: '-0.03em', maxWidth: 880,
        color: 'var(--text)',
        animation: 'fadeDown 0.8s 0.1s ease both',
      }}>
        Exam Paper Leaks<br />
        Stop{' '}
        <span style={{
          background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Here.
        </span>
      </h1>

      {/* Subtext */}
      <p style={{
        color: 'var(--muted)', fontSize: '1.08rem',
        maxWidth: 570, margin: '1.8rem auto 3rem',
        lineHeight: 1.72,
        animation: 'fadeDown 0.8s 0.2s ease both',
      }}>
        PerfectXskills encrypts question papers on-chain. Keys release only at exam time.
        Every action is permanently recorded — tamper-proof, transparent, traceable.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex', gap: '1rem', justifyContent: 'center',
        flexWrap: 'wrap',
        animation: 'fadeDown 0.8s 0.3s ease both',
      }}>
        <Button size="lg" onClick={onSignup}>Get Started Free</Button>
        <Button size="lg" variant="outline" onClick={onHowItWorks}>See How It Works</Button>
      </div>

      {/* Blockchain Chain Nodes */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: '5rem', gap: 0,
        animation: 'fadeUp 1s 0.5s ease both',
        flexWrap: 'wrap',
      }}>
        {chainNodes.map((node, i) => (
          <React.Fragment key={node.label}>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10, padding: '0.8rem 1.2rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'var(--muted)', textAlign: 'center',
              minWidth: 112,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.74rem', marginBottom: '0.2rem' }}>
                {node.label}
              </div>
              <div style={{ color: 'var(--accent)', fontSize: '0.63rem' }}>{node.hash}</div>
            </div>
            {i < chainNodes.length - 1 && (
              <div style={{
                width: 28, height: 2,
                background: 'linear-gradient(90deg, var(--border), var(--accent), var(--border))',
                position: 'relative', flexShrink: 0,
              }}>
                <span style={{
                  position: 'absolute', right: -5, top: -8,
                  fontSize: '0.55rem', color: 'var(--accent)',
                }}>▶</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
