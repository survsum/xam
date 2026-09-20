import React from 'react';

const team = [
  { initials: 'LW', name: 'Lucky Walia', role: 'Lead Developer', colors: ['#8b5cf6', '#5b21b6'] },
  { initials: 'SS', name: 'Saurav Suman', role: 'Co-Lead Developer', colors: ['#8b5cf6', '#4c1d95'] },
];

export default function Team() {
  return (
    <section id="team" style={{
      padding: '8rem 2rem',
      maxWidth: 1100,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{
          fontSize: '0.88rem',
          fontWeight: 800,
          color: 'var(--accent-violet-bright)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          06 — ENGINEERING LEADERSHIP
        </span>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: 'var(--text-white)',
          marginTop: '0.8rem',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          THE VIEL TEAM.
        </h2>
        <p style={{
          color: 'var(--text-muted)', fontSize: '1rem',
          maxWidth: 480, margin: '0.8rem auto 0', lineHeight: 1.7,
        }}>
          The engineers behind Viel — building the future of tamper-proof examination infrastructure.
        </p>
      </div>

      <div style={{
        display: 'flex', gap: '2.5rem',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {team.map((member) => (
          <TeamCard key={member.name} {...member} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ initials, name, role, colors }) {
  return (
    <div
      className="cinematic-glass"
      style={{
        padding: '3rem 2.5rem',
        textAlign: 'center', width: 280,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top Violet Accent Line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
      }} />

      {/* Avatar Circle */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        margin: '0 auto 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', fontWeight: 900,
        color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: `0 10px 30px rgba(139, 92, 246, 0.4)`,
      }}>
        {initials}
      </div>

      <div style={{
        fontSize: '1.25rem', fontWeight: 900,
        marginBottom: '0.4rem', color: 'var(--text-white)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>{name}</div>
      
      <div style={{
        fontSize: '0.84rem', color: 'var(--accent-violet-bright)',
        fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em',
        fontWeight: 700,
      }}>{role}</div>
    </div>
  );
}
