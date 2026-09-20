import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import BlurredTileField from '../components/BlurredTileField';

export default function Hero({ onSignup, onHowItWorks, theme }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle Mouse Parallax (2-5px background shift, 0.2x typography shift)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" style={{
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0 5vw',
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden',
      background: 'transparent',
    }}>

      {/* Layer 3: Environmental Glass Layer */}
      <BlurredTileField theme={theme} mousePos={mousePos} />

      {/* Layer 6: Hero Typography Canvas (Left 45-50% Viewport) */}
      <div
        style={{
          width: '100%',
          maxWidth: '48vw',
          position: 'relative',
          zIndex: 10,
          background: 'transparent',
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* 1. Eyebrow */}
        <span
          className="editorial-eyebrow"
          style={{
            animation: 'heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards'
          }}
        >
          SECURE WHAT MATTERS.
        </span>

        {/* 2. Primary Headline */}
        <h1
          className="editorial-primary-heading"
          style={{
            marginBottom: '0.2rem',
            animation: 'heroRiseBlur 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards'
          }}
        >
          Examinations.
        </h1>

        {/* 3. Secondary Lighter Headline */}
        <div
          className="editorial-secondary-heading"
          style={{
            marginBottom: '1.8rem',
            animation: 'heroRiseBlur 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards'
          }}
        >
          Built for trust.
        </div>

        {/* 4. Short Description */}
        <p
          className="editorial-description"
          style={{
            marginBottom: '2.5rem',
            animation: 'heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s backwards'
          }}
        >
          Encrypted, time-locked examination papers with verifiable integrity from upload to release.
        </p>

        {/* 5. CTAs with Refined Hover Micro-Interactions */}
        <div style={{
          display: 'flex',
          gap: '1.8rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          animation: 'heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s backwards'
        }}>
          <button
            onClick={onSignup}
            className="viel-btn-primary"
          >
            GET STARTED <ArrowRight size={16} className="arrow-icon" />
          </button>

          <button
            onClick={onHowItWorks}
            className="viel-link-secondary"
          >
            EXPLORE PLATFORM <ArrowRight size={16} className="arrow-icon" />
          </button>
        </div>

      </div>

      {/* Keyframe entry animations */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heroRiseBlur {
          from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>

    </section>
  );
}
