import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("pxs_token");
  const user = JSON.parse(localStorage.getItem("pxs_user") || "null");

  const dashboardPath =
    user?.role === "Institution Organiser"
      ? "/organizer-dashboard"
      : "/dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (target) => {
    if (target.startsWith('/')) {
      navigate(target);
    } else if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2.5rem',
      background: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(251, 251, 253, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.3s ease',
    }}>

      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => handleNavClick('/')}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #0071e3 0%, #5856d6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '0.9rem'
        }}>
          P
        </div>
        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Perfect<span style={{ color: 'var(--accent-apple)', fontWeight: 800 }}>Xams</span>
        </span>
      </div>

      {/* Navigation links */}
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '0.4rem',
        margin: 0,
        padding: 0,
      }}>
        {[
          { label: 'Home', target: 'home' },
          { label: 'How It Works', target: 'how' },
          { label: 'Features', target: 'features' },
          { label: 'Audit & Verify', target: '/audit' },
          { label: 'Team', target: 'team' },
        ].map(({ label, target }) => (
          <li key={target}>
            <button
              onClick={() => handleNavClick(target)}
              style={{
                background: location.pathname === target ? 'rgba(0, 113, 227, 0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
                color: location.pathname === target ? 'var(--accent-apple)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.86rem',
                fontWeight: location.pathname === target ? 600 : 500,
                padding: '0.45rem 0.9rem',
                borderRadius: '980px',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                if (location.pathname !== target) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== target) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        {!token ? (
          <>
            <button
              onClick={onLogin}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '980px',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="apple-button-primary"
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.86rem' }}
            >
              Get Started
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate(dashboardPath)}
            className="apple-button-primary"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.86rem' }}
          >
            Go to Dashboard →
          </button>
        )}
      </div>

    </nav>
  );
}