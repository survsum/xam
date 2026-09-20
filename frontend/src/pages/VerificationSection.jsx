import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

export default function VerificationSection() {
  const navigate = useNavigate();

  return (
    <section id="verification" style={{
      padding: '12rem 5vw',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      
      {/* Eyebrow */}
      <span className="editorial-eyebrow">
        04 — VERIFICATION
      </span>

      {/* Primary Headline */}
      <h2 className="editorial-primary-heading" style={{ marginBottom: '0.4rem' }}>
        EVERY PAPER
      </h2>

      {/* Lighter Secondary Headline */}
      <div className="editorial-secondary-heading" style={{ marginBottom: '3.5rem' }}>
        LEAVES A TRACE.
      </div>

      {/* Editorial Statements */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2.5rem',
        marginBottom: '5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            SHA-256 integrity.
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Calculated directly from unencrypted raw file bytes.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Blockchain notarization.
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Immutably recorded on Ethereum Solidity smart contract.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Verifiable proof.
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Deterministic verification for paper setters & institutions.
          </p>
        </div>
      </div>

      {/* Minimal Visual Animation Sequence: DOCUMENT -> HASH -> PROOF -> VERIFIED */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '2.5rem 3rem',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 20,
        maxWidth: 900,
        flexWrap: 'wrap',
      }}>
        <PipelineWord label="DOCUMENT" sub="Original PDF" />
        <PipelineArrow />
        <PipelineWord label="HASH" sub="SHA-256 Digest" />
        <PipelineArrow />
        <PipelineWord label="PROOF" sub="Blockchain Receipt" />
        <PipelineArrow />
        <PipelineWord label="VERIFIED" sub="Authentic Integrity" highlight />
      </div>

      <div style={{ marginTop: '3.5rem' }}>
        <button
          onClick={() => navigate('/audit')}
          className="viel-link-secondary"
          style={{ fontSize: '0.95rem' }}
        >
          LAUNCH INTERACTIVE AUDIT TOOL →
        </button>
      </div>

    </section>
  );
}

function PipelineWord({ label, sub, highlight }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '1.2rem',
        fontWeight: 800,
        letterSpacing: '0.08em',
        color: highlight ? 'var(--accent-violet-bright)' : 'var(--text-primary)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {label}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
        {sub}
      </div>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div style={{ color: 'var(--accent-violet-bright)', opacity: 0.6, fontSize: '1rem' }}>
      →
    </div>
  );
}
