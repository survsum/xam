import React, { useEffect, useRef } from 'react';

export default function ParticleBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Multi-scale particle counts - sparse, soft floating digital particles behind tile layer
    const count = window.innerWidth < 768 ? 25 : 55;
    const particles = [];

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    for (let i = 0; i < count; i++) {
      const depthLayer = Math.random(); // 0.0 to 1.0 depth scale
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (0.12 + depthLayer * 0.2),
        vy: (Math.random() - 0.5) * (0.12 + depthLayer * 0.2),
        radius: depthLayer > 0.85 ? 1.8 : depthLayer > 0.5 ? 1.1 : 0.65, // Soft, non-star particles
        alpha: depthLayer > 0.85 ? 0.35 : depthLayer > 0.5 ? 0.22 : 0.12,
        glow: depthLayer > 0.85,
      });
    }

    let animId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = theme === 'dark';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha.toFixed(2)})`;
          if (p.glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
          }
        } else {
          ctx.fillStyle = `rgba(124, 58, 237, ${(p.alpha * 0.6).toFixed(2)})`;
          if (p.glow) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(124, 58, 237, 0.25)';
          }
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5, // Layer 5: Particles (Behind typography Layer 6)
      }}
    />
  );
}
