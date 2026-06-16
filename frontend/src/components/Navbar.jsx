import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
 
const navStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.8rem 4rem',
  background: 'rgba(244,246,251,0.92)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderBottom: '0.5px solid rgba(100,140,210,0.18)',
  transition: 'box-shadow 0.3s',
};
 
const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  textDecoration: 'none',
  cursor: 'pointer',
  lineHeight: 1,
};
 
// "PerfectX" — bold serif, dark navy
const logoWordOneStyle = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: '1.25rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: '#1a3a6e',
  fontStyle: 'normal',
};
 
// "skills" — italic serif, accent blue
const logoWordTwoStyle = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: '1.25rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: '#2a6fdb',
  fontStyle: 'italic',
};
 
const navLinks = [
  { label: 'Home', href: 'home' },
  { label: 'How It Works', href: 'how' },
  { label: 'Features', href: 'features' },
  { label: 'Our Team', href: 'team' },
];
 
export default function Navbar({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  const token = localStorage.getItem("pxs_token");
  const user = JSON.parse(localStorage.getItem("pxs_user"));
 
  const dashboardPath =
    user?.role === "Institution Organiser"
      ? "/organizer-dashboard"
      : "/dashboard";
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
 
  const handleNavClick = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };
 
  return (
    <nav style={{
      ...navStyle,
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none'
    }}>
 
      {/* Logo */}
      <div style={logoStyle} onClick={() => handleNavClick('home')}>
        <span style={logoWordOneStyle}>Perfect</span>
        <span style={logoWordTwoStyle}>Xams</span>
      </div>
 
      {/* Nav links */}
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '0.2rem',
        margin: 0,
        padding: 0,
      }}>
        {navLinks.map(({ label, href }) => (
          <li key={href}>
            <button
              onClick={() => handleNavClick(href)}
              style={{
                background: 'none',
                border: '0.5px solid transparent',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 400,
                letterSpacing: '0.005em',
                padding: '0.38rem 0.95rem',
                borderRadius: '50px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#1a3a6e';
                e.currentTarget.style.borderColor = 'rgba(42,111,219,0.18)';
                e.currentTarget.style.background = 'rgba(42,111,219,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--muted)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.background = 'none';
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
 
      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        {!token ? (
          <>
            <NavBtn variant="outline" onClick={onLogin}>Log In</NavBtn>
            <NavBtn variant="primary" onClick={onSignup}>Sign Up</NavBtn>
          </>
        ) : (
          <NavBtn variant="primary" onClick={() => navigate(dashboardPath)}>
            Dashboard
          </NavBtn>
        )}
      </div>
 
    </nav>
  );
}
 
function NavBtn({ children, variant, onClick }) {
  const base = {
    padding: '0.48rem 1.25rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
    transition: 'all 0.2s',
    border: 'none',
  };
 
  const styles = variant === 'primary'
    ? {
        ...base,
        background: '#2a6fdb',
        color: '#fff',
      }
    : {
        ...base,
        background: 'transparent',
        border: '0.5px solid rgba(100,140,210,0.35)',
        color: 'var(--text)',
      };
 
  return (
    <button style={styles} onClick={onClick}>
      {children}
    </button>
  );
}