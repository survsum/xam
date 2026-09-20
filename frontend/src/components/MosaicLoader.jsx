import React, { useEffect, useRef, useState } from 'react';

export default function MosaicLoader({ onComplete, theme }) {
  const canvasRef = useRef(null);
  const [complete, setComplete] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(1);

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

    const cols = window.innerWidth < 768 ? 16 : 28;
    const rows = window.innerWidth < 768 ? 10 : 18;
    const grid = [];

    // Directional staggered delay (Top-Left -> Bottom-Right)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const diagonalDistance = (c / cols + r / rows) * 0.5;
        grid.push({
          c,
          r,
          delay: diagonalDistance * 700 + Math.random() * 120,
          opacity: 1,
          offsetY: 0,
        });
      }
    }

    const startTime = performance.now();
    let animId;

    const render = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const cellWidth = width / cols + 1;
      const cellHeight = height / rows + 1;

      let allDone = true;
      const isDark = theme === 'dark';

      grid.forEach((cell) => {
        const cellElapsed = Math.max(0, elapsed - cell.delay);
        const cellProgress = Math.min(1, cellElapsed / 600); // 600ms per tile shutter exit

        cell.opacity = 1 - cellProgress;
        cell.offsetY = cellProgress * 20; // Subtle downward shutter motion

        if (cell.opacity > 0) {
          allDone = false;
          
          if (isDark) {
            ctx.fillStyle = `rgba(7, 7, 10, ${cell.opacity.toFixed(3)})`;
            ctx.fillRect(cell.c * (width / cols), cell.r * (height / rows) + cell.offsetY, cellWidth, cellHeight);
            
            ctx.strokeStyle = `rgba(139, 92, 246, ${(cell.opacity * 0.25).toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(cell.c * (width / cols), cell.r * (height / rows) + cell.offsetY, cellWidth, cellHeight);
          } else {
            ctx.fillStyle = `rgba(247, 245, 239, ${cell.opacity.toFixed(3)})`;
            ctx.fillRect(cell.c * (width / cols), cell.r * (height / rows) + cell.offsetY, cellWidth, cellHeight);
            
            ctx.strokeStyle = `rgba(124, 58, 237, ${(cell.opacity * 0.2).toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(cell.c * (width / cols), cell.r * (height / rows) + cell.offsetY, cellWidth, cellHeight);
          }
        }
      });

      if (elapsed > 700) {
        setLogoOpacity(Math.max(0, 1 - (elapsed - 700) / 400));
      }

      if (!allDone) {
        animId = requestAnimationFrame(render);
      } else {
        setComplete(true);
        if (onComplete) onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [onComplete, theme]);

  if (complete) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Cinematic Viel Logo in center */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: logoOpacity,
          transition: 'opacity 0.35s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontSize: '2.2rem',
            fontWeight: 900,
            letterSpacing: '0.18em',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          VIEL
        </span>
        <div
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            color: 'var(--accent-violet-bright)',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Securing Infrastructure
        </div>
      </div>
    </div>
  );
}
