import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Lock, Unlock, Clock, Download, LogOut,
  RefreshCw, CheckCircle2, Search
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('viel_theme') || 'dark');

  const token = localStorage.getItem('pxs_token');
  const user = JSON.parse(localStorage.getItem('pxs_user') || 'null');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('viel_theme', next);
  };

  useEffect(() => {
    if (!token || !user) {
      navigate('/auth');
      return;
    }
    fetchAssignedPapers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAssignedPapers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/papers/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPapers(data.papers || []);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Fetch assigned error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessPaper = (paperId) => {
    window.open(`${API}/papers/access/${paperId}?token=${token}`, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('pxs_token');
    localStorage.removeItem('pxs_user');
    navigate('/');
  };

  const getRemainingTimeDetails = (unlockTimeStr) => {
    const now = currentTime;
    const unlock = new Date(unlockTimeStr);
    const diff = unlock - now;

    if (diff <= 0) {
      return { isReady: true, label: "Ready to Access" };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      isReady: false,
      label: `${hours}h ${minutes}m ${seconds}s remaining`
    };
  };

  const filteredPapers = papers.filter(p =>
    p.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.examCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssigned = papers.length;
  const lockedCount = papers.filter(p => new Date(p.unlockTime) > currentTime).length;
  const unlockedCount = totalAssigned - lockedCount;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '6.5rem 2rem 4rem' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="editorial-eyebrow">INSTITUTION ORGANISER PORTAL</span>
            <h1 className="editorial-primary-heading" style={{ fontSize: '2.2rem' }}>
              Organiser Dashboard
            </h1>
            <p className="editorial-description" style={{ fontSize: '0.92rem', marginTop: 4 }}>
              {user?.organisation || 'University'} — Authenticated Decrypted Access Stream
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleLogout}
              className="viel-btn-signin"
              style={{ color: '#ff4d5e' }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* ── Stat Metric Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="cinematic-glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <FileText size={20} color="var(--accent-violet-bright)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assigned Papers</span>
            </div>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{totalAssigned}</p>
          </div>

          <div className="cinematic-glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <Lock size={20} color="#ff9500" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Currently Locked</span>
            </div>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{lockedCount}</p>
          </div>

          <div className="cinematic-glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <Unlock size={20} color="#34c759" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Available to Download</span>
            </div>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{unlockedCount}</p>
          </div>
        </div>

        {/* ── Assigned Papers List ── */}
        <div className="cinematic-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif' }}>
              Assigned Exam Papers ({filteredPapers.length})
            </h2>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search assigned papers..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    background: 'var(--bg-dark-surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 980,
                    padding: '0.45rem 1rem 0.45rem 2.2rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>

              <button
                onClick={fetchAssignedPapers}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-violet-bright)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={14} /> Refresh List
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>Loading assigned papers...</p>
          ) : filteredPapers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={40} color="var(--accent-violet-bright)" style={{ marginBottom: '0.8rem', opacity: 0.6 }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>No exam papers assigned to your organisation yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredPapers.map(paper => {
                const timerDetails = getRemainingTimeDetails(paper.unlockTime);
                const isReady = timerDetails.isReady;

                return (
                  <div
                    key={paper._id}
                    style={{
                      padding: '1.25rem 1.5rem', borderRadius: 14,
                      border: '1px solid var(--glass-border)', background: 'var(--bg-dark-surface)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: isReady ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 149, 0, 0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isReady ? <Unlock size={22} color="#34c759" /> : <Lock size={22} color="#ff9500" />}
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          {paper.examName} ({paper.examCode})
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                          Uploaded by: <strong>{paper.uploadedBy?.firstName} {paper.uploadedBy?.lastName}</strong> ({paper.uploadedBy?.organisation})
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <Clock size={13} /> Unlock Schedule: {new Date(paper.unlockTime).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        {isReady ? (
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 980, background: 'rgba(52, 199, 89, 0.12)', color: '#34c759', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={13} /> READY TO ACCESS
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 980, background: 'rgba(255, 149, 0, 0.12)', color: '#ff9500', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Lock size={12} /> LOCKED
                            </span>
                            <span style={{ fontSize: '0.76rem', color: '#ff9500', fontWeight: 700, marginTop: 4 }}>
                              {timerDetails.label}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAccessPaper(paper._id)}
                        disabled={!isReady}
                        className={isReady ? "viel-btn-primary" : "viel-btn-signin"}
                        style={{
                          padding: '0.55rem 1.2rem', fontSize: '0.85rem',
                          opacity: isReady ? 1 : 0.4, cursor: isReady ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <Download size={15} /> Download Paper
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}