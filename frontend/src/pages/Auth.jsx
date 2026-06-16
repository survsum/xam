import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionLabel, titleStyle } from './HowItWorks';
import Button from '../components/Button';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const roles = ['Exam Authority / Paper Setter', 'Institution Organiser'];

export default function Auth({ defaultTab = 'login', onSuccess }) {
  const [tab, setTab] = useState(defaultTab);

  React.useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  return (
    <section id="auth" style={{
      padding: '7rem 2rem',
      display: 'flex', justifyContent: 'center',
      background: 'linear-gradient(180deg, var(--bg) 0%, #e2ebfa 100%)',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <SectionLabel>// Access Portal</SectionLabel>
          <h2 style={{ ...titleStyle, fontSize: '2rem' }}>Secure Sign In</h2>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px 10px 0 0', overflow: 'hidden',
        }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '1rem',
              background: tab === t ? 'var(--accentlight)' : 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2.5px solid var(--accent)' : '2.5px solid transparent',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'var(--font-body)', fontWeight: 700,
              fontSize: '0.88rem', letterSpacing: '0.04em',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form Box */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)', borderTop: 'none',
          borderRadius: '0 0 16px 16px', padding: '2.5rem',
          boxShadow: '0 10px 40px rgba(26,86,219,0.09)',
        }}>
          {tab === 'login'
            ? <LoginForm onSuccess={onSuccess} onSwitch={() => setTab('signup')} />
            : <SignupForm onSuccess={onSuccess} onSwitch={() => setTab('login')} />
          }
        </div>
      </div>
    </section>
  );
}

/* ─── Shared sub-components ─── */

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem', fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '0.5rem',
      }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg)',
  border: '1.5px solid var(--border)',
  borderRadius: 8, padding: '0.74rem 1rem',
  color: 'var(--text)', fontFamily: 'var(--font-body)',
  fontSize: '0.91rem', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

function Input({ type = 'text', placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{
        ...inputStyle,
        borderColor: focused ? 'var(--accent)' : 'var(--border)',
        boxShadow: focused ? '0 0 0 3px rgba(26,86,219,0.1)' : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Select({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange}
      style={{
        ...inputStyle,
        cursor: 'pointer', WebkitAppearance: 'none',
        borderColor: focused ? 'var(--accent)' : 'var(--border)',
        boxShadow: focused ? '0 0 0 3px rgba(26,86,219,0.1)' : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <option value="">— Select Role —</option>
      {roles.map(r => <option key={r}>{r}</option>)}
    </select>
  );
}

function AuthNote({ text, link, onLink }) {
  return (
    <p style={{
      textAlign: 'center', color: 'var(--muted)',
      fontSize: '0.8rem', marginTop: '1.3rem',
      fontFamily: 'var(--font-mono)',
    }}>
      {text}{' '}
      <span onClick={onLink} style={{ color: 'var(--accent)', cursor: 'pointer' }}>{link}</span>
    </p>
  );
}

/* ─── Login Form ─── */

function LoginForm({ onSuccess, onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [role, setRole]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !pass || !role) {
      onSuccess('⚠️', 'Missing Fields', 'Please fill in your email, password, and role before continuing.');
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
        onSuccess('❌', 'Login Failed', data.message || 'Invalid credentials.');
        return;
      }

      // Store token for future authenticated requests
      localStorage.setItem('pxs_token', data.token);
      localStorage.setItem('pxs_user', JSON.stringify(data.user));

      onSuccess('🔐',`Redirecting to ${data.user.role} DashBoard ........`);
      setTimeout(() => {
  if (data.user.role === "Institution Organiser") {
  navigate("/organizer-dashboard");
} else {
  navigate("/dashboard");
}
}, 1000);

    } catch {
      onSuccess('❌', 'Network Error', 'Could not reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormGroup label="Email Address">
        <Input type="email" placeholder="authority@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
      </FormGroup>
      <FormGroup label="Password">
        <Input type="password" placeholder="••••••••••••" value={pass} onChange={e => setPass(e.target.value)} />
      </FormGroup>
      <FormGroup label="Role">
        <Select value={role} onChange={e => setRole(e.target.value)} />
      </FormGroup>
      <Button fullWidth size="lg" onClick={handle} disabled={loading}>
        {loading ? 'Authenticating…' : 'Access PerfectXskills →'}
      </Button>
      <AuthNote text="Don't have an account?" link="Sign up" onLink={onSwitch} />
    </>
  );
}

/* ─── Signup Form ─── */

function SignupForm({ onSuccess, onSwitch }) {
  const [f, setF] = useState({ fname:'', lname:'', org:'', email:'', role:'', pass:'', pass2:'' });
  const [loading, setLoading] = useState(false);
  const upd = k => e => setF(prev => ({ ...prev, [k]: e.target.value }));

  const handle = async () => {
    if (!f.fname || !f.lname || !f.org || !f.email || !f.role || !f.pass || !f.pass2) {
      onSuccess('⚠️', 'Incomplete Form', 'Please fill in all fields to create your secure account.'); return;
    }
    if (f.pass !== f.pass2) {
      onSuccess('❌', 'Password Mismatch', 'Your passwords do not match. Please try again.'); return;
    }
    if (f.pass.length < 12) {
      onSuccess('❌', 'Weak Password', 'Password must be at least 12 characters for security compliance.'); return;
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
        onSuccess('❌', 'Signup Failed', data.message || 'Something went wrong.');
        return;
      }

      // Store token
      localStorage.setItem('pxs_token', data.token);
      localStorage.setItem('pxs_user', JSON.stringify(data.user));

      onSuccess('✅', 'Account Created!', `Welcome, ${data.user.firstName}! Your identity as ${data.user.role} at ${data.user.organisation} has been registered and anchored on the blockchain.`);
    } catch {
      onSuccess('❌', 'Network Error', 'Could not reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormGroup label="First Name">
          <Input placeholder="Nitish" value={f.fname} onChange={upd('fname')} />
        </FormGroup>
        <FormGroup label="Last Name">
          <Input placeholder="Kumar" value={f.lname} onChange={upd('lname')} />
        </FormGroup>
      </div>
      <FormGroup label="Institution / Organisation">
        <Input placeholder="Delhi University" value={f.org} onChange={upd('org')} />
      </FormGroup>
      <FormGroup label="Email Address">
        <Input type="email" placeholder="you@institution.ac.in" value={f.email} onChange={upd('email')} />
      </FormGroup>
      <FormGroup label="Role">
        <Select value={f.role} onChange={upd('role')} />
      </FormGroup>
      <FormGroup label="Create Password">
        <Input type="password" placeholder="Min. 8 characters" value={f.pass} onChange={upd('pass')} />
      </FormGroup>
      <FormGroup label="Confirm Password">
        <Input type="password" placeholder="Repeat password" value={f.pass2} onChange={upd('pass2')} />
      </FormGroup>
      <Button fullWidth size="lg" onClick={handle} disabled={loading}>
        {loading ? 'Creating Account…' : 'Create Secure Account →'}
      </Button>
      <AuthNote text="Already registered?" link="Log in" onLink={onSwitch} />
    </>
  );
}
