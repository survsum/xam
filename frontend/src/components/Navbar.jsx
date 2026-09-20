import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon } from 'lucide-react';

export default function Navbar({ onLogin, onSignup, theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("pxs_token");
  const user = JSON.parse(localStorage.getItem("pxs_user") || "null");

  const dashboardPath =
    user?.role === "Institution Organiser"
      ? "/organizer-dashboard"
      : "/dashboard";

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
      padding: '1rem 3rem',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>

      {/* Brand Logo - Viel (Pure Minimal Typographic Logo - No icon box) */}
      <div
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => handleNavClick('home')}
      >
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '0.08em',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          VIEL
        </span>
      </div>

      {/* Navigation Links with scaleX underline hover animation */}
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '0.4rem',
        margin: 0,
        padding: 0,
      }}>
        {[
          { label: 'Platform', target: 'home' },
          { label: 'How It Works', target: 'how' },
          { label: 'Security', target: 'security' },
          { label: 'Verification', target: '/audit' },
          { label: 'Institutions', target: 'institutions' },
          { label: 'Team', target: 'team' },
        ].map(({ label, target }) => {
          const isActive = location.pathname === target;

          return (
            <li key={target}>
              <button
                onClick={() => handleNavClick(target)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Action CTA Buttons + Theme Toggle */}
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        {/* Theme Toggle Button with Rotation Hover */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {!token ? (
          <>
            {/* Polished Sign In Button */}
            <button
              onClick={onLogin}
              className="viel-btn-signin"
            >
              Sign In
            </button>

            {/* Primary Get Started Button */}
            <button
              onClick={onSignup}
              className="viel-btn-primary"
              style={{ padding: '0.48rem 1.35rem', fontSize: '0.86rem' }}
            >
              Get Started →
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate(dashboardPath)}
            className="viel-btn-primary"
            style={{ padding: '0.48rem 1.35rem', fontSize: '0.86rem' }}
          >
            Go to Dashboard →
          </button>
        )}
      </div>

    </nav>
  );
}