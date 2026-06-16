import React, { useState } from 'react';
import { SectionLabel, titleStyle, subStyle } from './HowItWorks';

const features = [
  {
    icon: '🔐',
    title: 'End-to-End Encryption',
    desc: 'Papers are encrypted before upload and decrypted only at the authorised institution\'s terminal. Plaintext never travels the network.',
  },
  {
    icon: '⛓️',
    title: 'Immutable Blockchain Ledger',
    desc: 'Every event is recorded on a distributed ledger. Retroactive modification is mathematically impossible without detection.',
  },
  {
    icon: '🕐',
    title: 'Smart-Contract Time Lock',
    desc: 'Decryption keys are released by a smart contract — only at the scheduled exam time. No human can override it.',
  },
  {
    icon: '🏛️',
    title: 'Multi-Institution Support',
    desc: 'Supports universities, schools, government boards, and competitive exam bodies with role-based access control.',
  },
  {
    icon: '📋',
    title: 'Full Audit Trail',
    desc: 'Upload, approval, key access, and printing are all permanently traceable. Accountability at every step.',
  },
  {
    icon: '✅',
    title: 'Identity Verification',
    desc: 'Institutions are cryptographically authenticated before any paper access is granted — no password guessing.',
  },
];

export default function Features() {
  return (
    <section id="features" style={{
      padding: '7rem 4rem', maxWidth: 1200, margin: '0 auto',
      position: 'relative', zIndex: 1,
    }}>
      <SectionLabel>// Why PerfectXskills</SectionLabel>
      <h2 style={titleStyle}>Built for Trust</h2>
      <p style={subStyle}>Every feature is designed to make question paper leaks structurally impossible.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {features.map(f => <FeatureCard key={f.title} {...f} />)}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(26,86,219,0.3)' : 'var(--border)'}`,
        borderRadius: 14, padding: '2rem',
        position: 'relative', overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'all 0.28s ease',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s ease',
      }} />

      <div style={{
        width: 48, height: 48,
        background: 'var(--accentlight)',
        border: '1px solid rgba(26,86,219,0.15)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', marginBottom: '1.2rem',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.02rem', fontWeight: 700,
        marginBottom: '0.5rem', color: 'var(--text)',
      }}>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.86rem', lineHeight: 1.67 }}>{desc}</p>
    </div>
  );
}
