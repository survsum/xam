import React, { useState } from 'react';
import { SectionLabel, titleStyle } from './HowItWorks';

const team = [
  { initials: 'NK', name: 'Nitish Kumar',  role: 'Lead Developer' },
  { initials: 'LW', name: 'Lucky Walia',   role: 'Blockchain Engineer' },
  { initials: 'KT', name: 'Kapil Thakur',  role: 'Security Architect' },
  { initials: 'NG', name: 'Nanish Garg',   role: 'UI / UX Designer' },
];

const avatarColors = [
  ['#1a56db', '#0ea5e9'],
  ['#7c3aed', '#06b6d4'],
  ['#0d9488', '#1a56db'],
  ['#ea580c', '#f59e0b'],
];

export default function Team() {
  return (
    <section id="team" style={{
      padding: '7rem 4rem', maxWidth: 1200, margin: '0 auto',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ textAlign: 'center' }}>
        <SectionLabel>// The Builders</SectionLabel>
        <h2 style={titleStyle}>Our Team</h2>
        <p style={{
          color: 'var(--muted)', fontSize: '1rem',
          maxWidth: 480, margin: '0.8rem auto 0', lineHeight: 1.7,
        }}>
          The minds behind PerfectXskills — building the future of tamper-proof examinations.
        </p>
      </div>

      <div style={{
        display: 'flex', gap: '1.5rem',
        flexWrap: 'wrap', justifyContent: 'center',
        marginTop: '3.5rem',
      }}>
        {team.map((member, i) => (
          <TeamCard key={member.name} {...member} colors={avatarColors[i]} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ initials, name, role, colors }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(26,86,219,0.28)' : 'var(--border)'}`,
        borderRadius: 18, padding: '2.6rem 2rem',
        textAlign: 'center', width: 200,
        position: 'relative', overflow: 'hidden',
        transform: hovered ? 'translateY(-7px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Bottom accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.38s ease',
      }} />

      {/* Avatar */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        margin: '0 auto 1.2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem', fontWeight: 700,
        color: '#fff', fontFamily: 'var(--font-mono)',
        boxShadow: hovered ? `0 8px 22px ${colors[0]}44` : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        {initials}
      </div>

      <div style={{
        fontSize: '1rem', fontWeight: 700,
        marginBottom: '0.3rem', color: 'var(--text)',
      }}>{name}</div>
      <div style={{
        fontSize: '0.72rem', color: 'var(--accent)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
      }}>{role}</div>
    </div>
  );
}
