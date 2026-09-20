import React from 'react';

export default function CtaSection({ onSignup }) {
  return (
    <section id="cta" style={{
      padding: '14rem 5vw 10rem',
      maxWidth: 1200,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      
      {/* Small Eyebrow */}
      <span className="editorial-eyebrow">
        SECURE WHAT MATTERS.
      </span>

      {/* Very Large Primary Headline */}
      <h2 className="editorial-primary-heading" style={{ marginBottom: '0.4rem' }}>
        Protect the paper.
      </h2>

      {/* Lighter Weight Secondary Headline */}
      <div className="editorial-secondary-heading" style={{ marginBottom: '3.5rem' }}>
        Protect the moment.
      </div>

      {/* Minimal CTA Button */}
      <div>
        <button
          onClick={onSignup}
          className="viel-btn-primary"
          style={{ padding: '0.95rem 2.4rem', fontSize: '0.98rem' }}
        >
          GET STARTED →
        </button>
      </div>

    </section>
  );
}
