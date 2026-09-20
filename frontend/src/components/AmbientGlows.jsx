import React, { useEffect, useRef } from 'react';

export default function AmbientGlows({ theme }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let animId;
    let startTime = performance.now();

    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      if (containerRef.current) {
        const glow1 = containerRef.current.querySelector('.glow-blob-1');
        const glow2 = containerRef.current.querySelector('.glow-blob-2');
        const glow3 = containerRef.current.querySelector('.glow-blob-3');

        if (glow1) {
          const x1 = Math.sin(elapsed * 0.08) * 35;
          const y1 = Math.cos(elapsed * 0.06) * 25;
          glow1.style.transform = `translate3d(${x1}px, ${y1}px, 0)`;
        }
        if (glow2) {
          const x2 = Math.cos(elapsed * 0.07) * 40;
          const y2 = Math.sin(elapsed * 0.09) * 30;
          glow2.style.transform = `translate3d(${x2}px, ${y2}px, 0)`;
        }
        if (glow3) {
          const x3 = Math.sin(elapsed * 0.05) * 25;
          const y3 = Math.cos(elapsed * 0.08) * 35;
          glow3.style.transform = `translate3d(${x3}px, ${y3}px, 0)`;
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1, // Layer 2: Ambient Radial Glow Blobs
        overflow: 'hidden',
      }}
    >
      {/* Glow Blob 1: Behind Headline / Typography */}
      <div
        className="glow-blob-1"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '55vw',
          height: '55vh',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.09) 0%, rgba(120, 80, 240, 0.04) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(196, 181, 253, 0.25) 0%, rgba(221, 214, 254, 0.1) 45%, transparent 70%)',
          filter: 'blur(70px)',
          willChange: 'transform',
        }}
      />

      {/* Glow Blob 2: Behind Paper Plane */}
      <div
        className="glow-blob-2"
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '60vw',
          height: '60vh',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.035) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(254, 240, 138, 0.2) 0%, rgba(221, 214, 254, 0.12) 50%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Glow Blob 3: Faint Gray/Violet Atmosphere Bottom */}
      <div
        className="glow-blob-3"
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '30%',
          width: '50vw',
          height: '50vh',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(167, 139, 250, 0.04) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(243, 232, 255, 0.22) 0%, transparent 70%)',
          filter: 'blur(90px)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
