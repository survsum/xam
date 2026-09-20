import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import CustomCursor from '../components/CustomCursor';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ROLES = ['Exam Authority / Paper Setter', 'Institution Organiser'];

export default function Auth({ defaultTab = 'login', onSuccess }) {
  const [tab, setTab] = useState(defaultTab);
  const [theme, setTheme] = useState(() => localStorage.getItem('viel_theme') || 'dark');

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 1.5rem',
      overflowX: 'hidden',
    }}>
      {/* Subtly Dimmed Particles background */}
      <ParticleBackground theme={theme} opacity={0.3} />
      <CustomCursor />

      {/* Main Centered Auth Container */}
      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 10 }}>
        
        {/* Header Branding - Clean Typographic Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            letterSpacing: '0.1em',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, system-ui, sans-serif',
            marginBottom: '0.6rem'
          }}>
            VIEL
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.3rem',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            {tab === 'login' ? 'Sign In to Viel' : 'Create a Secure Account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Authenticated access for Paper Setters & Organisers
          </p>
        </div>

        {/* Refined Segmented Control Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          padding: 4,
          borderRadius: 980,
          marginBottom: '2rem',
        }}>
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '0.6rem',
                background: tab === t ? 'var(--accent-violet)' : 'transparent',
                border: 'none',
                borderRadius: 980,
                color: tab === t ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: tab === t ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form Container Card */}
        <div
          className="cinematic-glass"
          style={{
            padding: '2.5rem 2rem',
            border: '1px solid var(--glass-border-violet)',
            boxShadow: 'var(--shadow-cinematic)'
          }}
        >
          {tab === 'login'
            ? <LoginForm onSuccess={onSuccess} onSwitch={() => setTab('signup')} />
            : <SignupForm onSuccess={onSuccess} onSwitch={() => setTab('login')} />
          }
        </div>

      </div>
    </div>
  );
}

/* ─── Shared Helpers ─── */

function FormGroup({ label, children, error }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '0.4rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>{label}</label>
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#ff4d5e', fontSize: '0.78rem' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}

/* ─── Refined Viel Input Style ─── */
const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'var(--bg-dark-surface)',
  border: '1px solid var(--glass-border)',
  borderRadius: 12,
  color: 'var(--text-primary)',
  fontSize: '0.92rem',
  fontFamily: 'Inter, system-ui, sans-serif',
  outline: 'none',
  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
};

/* ─── Login Form ─── */

function LoginForm({ onSuccess, onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handle = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email || !pass || !role) {
      setErrorMsg('Please select your role and enter email & password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Invalid email, password or role.');
        setLoading(false);
        return;
      }

      localStorage.setItem('pxs_token', data.token);
      localStorage.setItem('pxs_user', JSON.stringify(data.user));

      if (onSuccess) onSuccess('🔐', 'Login Successful', `Redirecting to ${data.user.role} Dashboard...`);

      setTimeout(() => {
        if (data.user.role === "Institution Organiser") {
          navigate("/organizer-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 500);

    } catch {
      setErrorMsg('Could not connect to server. Please check backend.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle}>
      {errorMsg && (
        <div style={{
          padding: '0.75rem 1rem', background: 'rgba(255, 77, 94, 0.1)',
          border: '1px solid rgba(255, 77, 94, 0.25)', borderRadius: 10,
          color: '#ff4d5e', fontSize: '0.85rem', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <FormGroup label="Role">
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">Select your role...</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </FormGroup>

      <FormGroup label="Email Address">
        <input
          type="email"
          placeholder="setter@university.edu"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
      </FormGroup>

      <FormGroup label="Password">
        <div style={{ position: 'relative' }}>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={pass}
            onChange={e => setPass(e.target.value)}
            style={{ ...inputStyle, paddingRight: '2.5rem' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormGroup>

      <button
        type="submit"
        className="viel-btn-primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '0.8rem', padding: '0.9rem' }}
      >
        {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
        Don't have an account?{' '}
        <span onClick={onSwitch} style={{ color: 'var(--accent-violet-bright)', fontWeight: 600, cursor: 'pointer' }}>
          Register here
        </span>
      </p>
    </form>
  );
}

/* ─── Signup Form ─── */

function SignupForm({ onSuccess, onSwitch }) {
  const [f, setF] = useState({ fname: '', lname: '', org: '', email: '', role: '', pass: '', pass2: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const upd = k => e => setF(prev => ({ ...prev, [k]: e.target.value }));

  const handle = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!f.fname || !f.lname || !f.org || !f.email || !f.role || !f.pass || !f.pass2) {
      setErrorMsg('Please fill in all fields to register.');
      return;
    }
    if (f.pass !== f.pass2) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (f.pass.length < 12) {
      setErrorMsg('Password must be at least 12 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: f.fname,
          lastName: f.lname,
          organisation: f.org,
          email: f.email,
          role: f.role,
          password: f.pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Signup failed.');
        setLoading(false);
        return;
      }

      localStorage.setItem('pxs_token', data.token);
      localStorage.setItem('pxs_user', JSON.stringify(data.user));

      if (onSuccess) onSuccess('✅', 'Account Created', `Welcome, ${data.user.firstName}!`);
      
      onSwitch();
    } catch {
      setErrorMsg('Could not connect to backend server.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle}>
      {errorMsg && (
        <div style={{
          padding: '0.75rem 1rem', background: 'rgba(255, 77, 94, 0.1)',
          border: '1px solid rgba(255, 77, 94, 0.25)', borderRadius: 10,
          color: '#ff4d5e', fontSize: '0.85rem', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        <FormGroup label="First Name">
          <input placeholder="Alex" value={f.fname} onChange={upd('fname')} style={inputStyle} required />
        </FormGroup>
        <FormGroup label="Last Name">
          <input placeholder="Morgan" value={f.lname} onChange={upd('lname')} style={inputStyle} required />
        </FormGroup>
      </div>

      <FormGroup label="Institution / Organisation">
        <input placeholder="Oxford University" value={f.org} onChange={upd('org')} style={inputStyle} required />
      </FormGroup>

      <FormGroup label="Email Address">
        <input type="email" placeholder="alex@university.edu" value={f.email} onChange={upd('email')} style={inputStyle} required />
      </FormGroup>

      <FormGroup label="Role">
        <select value={f.role} onChange={upd('role')} style={{ ...inputStyle, cursor: 'pointer' }} required>
          <option value="">Select your role...</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </FormGroup>

      <FormGroup label="Create Password (Min 12 chars)">
        <div style={{ position: 'relative' }}>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={f.pass}
            onChange={upd('pass')}
            style={{ ...inputStyle, paddingRight: '2.5rem' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormGroup>

      <FormGroup label="Confirm Password">
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={f.pass2}
          onChange={upd('pass2')}
          style={inputStyle}
          required
        />
      </FormGroup>

      <button
        type="submit"
        className="viel-btn-primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '0.8rem', padding: '0.9rem' }}
      >
        {loading ? 'CREATING ACCOUNT...' : 'CREATE SECURE ACCOUNT →'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
        Already registered?{' '}
        <span onClick={onSwitch} style={{ color: 'var(--accent-violet-bright)', fontWeight: 600, cursor: 'pointer' }}>
          Sign In
        </span>
      </p>
    </form>
  );
}
