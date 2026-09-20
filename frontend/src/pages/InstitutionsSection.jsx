import React from 'react';

export default function InstitutionsSection() {
  return (
    <section id="institutions" style={{
      padding: '12rem 5vw',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      
      {/* Eyebrow */}
      <span className="editorial-eyebrow">
        05 — FOR INSTITUTIONS
      </span>

      {/* Primary Headline */}
      <h2 className="editorial-primary-heading" style={{ marginBottom: '0.4rem' }}>
        BUILT FOR
      </h2>

      {/* Lighter Secondary Headline */}
      <div className="editorial-secondary-heading" style={{ marginBottom: '4rem' }}>
        THE MOMENT THAT MATTERS.
      </div>

      {/* Minimal List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: 600,
        marginBottom: '3rem'
      }}>
        <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Universities.
        </div>
        <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Examination boards.
        </div>
        <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Institutions.
        </div>
      </div>

      <p className="editorial-description" style={{ fontSize: '1.15rem' }}>
        One secure examination infrastructure ensuring paper integrity across faculties and exam halls.
      </p>

    </section>
  );
}
