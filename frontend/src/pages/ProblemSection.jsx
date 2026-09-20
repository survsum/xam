import React from 'react';

export default function ProblemSection() {
  return (
    <section id="problem" style={{
      padding: '12rem 5vw',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      
      {/* Small Eyebrow Label */}
      <span className="editorial-eyebrow">
        01 — THE PROBLEM
      </span>

      {/* Primary Statement */}
      <h2 className="editorial-primary-heading" style={{ maxWidth: 1000, marginBottom: '0.4rem' }}>
        The exam begins
      </h2>

      {/* Lighter Weight Secondary Statement */}
      <div className="editorial-secondary-heading" style={{ maxWidth: 1000, marginBottom: '3rem' }}>
        before the exam begins.
      </div>

      {/* Short Editorial Lines */}
      <div style={{ maxWidth: 540 }}>
        <p className="editorial-description" style={{ marginBottom: '0.8rem', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 500 }}>
          Leaks don't happen at the examination hall.
        </p>
        <p className="editorial-description" style={{ fontSize: '1.15rem' }}>
          They happen before it. Unprotected transmission channels and unverified custody chains compromise student effort long before paper distribution.
        </p>
      </div>

    </section>
  );
}
