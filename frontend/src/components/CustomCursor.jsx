import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.cursorHover !== undefined
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      {/* Central Violet Dot */}
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--accent-violet)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px var(--accent-violet-glow)',
          transition: 'transform 0.05s ease-out',
        }}
      />

      {/* Expanding Ring */}
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: hovered ? 44 : 26,
          height: hovered ? 44 : 26,
          borderRadius: '50%',
          border: '1px solid var(--accent-violet-bright)',
          background: hovered ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, border-color 0.2s ease',
          boxShadow: hovered ? '0 0 20px var(--accent-violet-glow)' : 'none',
        }}
      />
    </div>
  );
}
