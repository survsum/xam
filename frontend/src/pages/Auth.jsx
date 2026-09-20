import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, UserCheck, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ROLES = ['Exam Authority / Paper Setter', 'Institution Organiser'];

export default function Auth({ defaultTab = 'login', onSuccess }) {
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  return (
    <section id="auth" style={{
      padding: '6rem 1.5rem',
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '85vh',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="animate-pop-in">
        
        {/* Header Badge */}
        <div style={{ textTransform: 'center', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.9rem', borderRadius: '980px',
            background: 'var(--accent-apple-light)', color: 'var(--accent-apple)',
            fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem'
          }}>
            <ShieldCheck size={16} /> Security Portal
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {tab === 'login' ? 'Sign In to PerfectXams' : 'Create Secure Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Authenticated access for Paper Setters & Organisers
          </p>
        </div>

        {/* Apple Segmented Control Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          padding: 4,
          borderRadius: 980,
          marginBottom: '1.5rem',
        }}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '0.6rem',
                background: tab === t ? 'var(--surface-card)' : 'transparent',
                border: 'none',
                borderRadius: 980,
                color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: tab === t ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form Container Card */}
        <div className="apple-card" style={{ padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {tab === 'login'
            ? <LoginForm onSuccess={onSuccess} onSwitch={() => setTab('signup')} />
            : <SignupForm onSuccess={onSuccess} onSwitch={() => setTab('login')} />
          }
        </div>
      </div>
    </section>
  );
}

/* ─── Shared Helpers ─── */

function FormGroup({ label, children, error }) {
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.8rem', fontWeight: 600,
        color: 'var(--text-secondary)', marginBottom: '0.4rem',
      }}>{label}</label>
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--status-danger)', fontSize: '0.78rem' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}

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
          padding: '0.75rem 1rem', background: 'var(--status-danger-bg)',
          border: '1px solid rgba(255,59,48,0.2)', borderRadius: 'var(--radius-sm)',
          color: 'var(--status-danger)', fontSize: '0.85rem', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <FormGroup label="Role">
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="apple-input"
          style={{ cursor: 'pointer' }}
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
          className="apple-input"
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
            className="apple-input"
            style={{ paddingRight: '2.5rem' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)'
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormGroup>

      <button
        type="submit"
        className="apple-button-primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {loading ? 'Authenticating...' : 'Sign In →'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '1.2rem' }}>
        Don't have an account?{' '}
        <span onClick={onSwitch} style={{ color: 'var(--accent-apple)', fontWeight: 600, cursor: 'pointer' }}>
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
          padding: '0.75rem 1rem', background: 'var(--status-danger-bg)',
          border: '1px solid rgba(255,59,48,0.2)', borderRadius: 'var(--radius-sm)',
          color: 'var(--status-danger)', fontSize: '0.85rem', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        <FormGroup label="First Name">
          <input placeholder="Alex" value={f.fname} onChange={upd('fname')} className="apple-input" required />
        </FormGroup>
        <FormGroup label="Last Name">
          <input placeholder="Morgan" value={f.lname} onChange={upd('lname')} className="apple-input" required />
        </FormGroup>
      </div>

      <FormGroup label="Institution / Organisation">
        <input placeholder="Oxford University" value={f.org} onChange={upd('org')} className="apple-input" required />
      </FormGroup>

      <FormGroup label="Email Address">
        <input type="email" placeholder="alex@university.edu" value={f.email} onChange={upd('email')} className="apple-input" required />
      </FormGroup>

      <FormGroup label="Role">
        <select value={f.role} onChange={upd('role')} className="apple-input" style={{ cursor: 'pointer' }} required>
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
            className="apple-input"
            style={{ paddingRight: '2.5rem' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)'
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
          className="apple-input"
          required
        />
      </FormGroup>

      <button
        type="submit"
        className="apple-button-primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {loading ? 'Creating Account...' : 'Register Secure Account →'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '1.2rem' }}>
        Already registered?{' '}
        <span onClick={onSwitch} style={{ color: 'var(--accent-apple)', fontWeight: 600, cursor: 'pointer' }}>
          Sign In
        </span>
      </p>
    </form>
  );
}

