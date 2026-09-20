import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Lock, Unlock, Clock, Eye, Download, ShieldCheck, LogOut,
  RefreshCw, CheckCircle2, AlertTriangle, Building, Search
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('pxs_token');
  const user = JSON.parse(localStorage.getItem('pxs_user') || 'null');

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
    // Authenticated download endpoint
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* ── Apple Sidebar ── */}
      <aside style={{
        width: 260,
        background: 'var(--surface-card)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '2rem 1.2rem',
        position: 'fixed',
        height: '100vh',
        top: 0, left: 0,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #0071e3 0%, #5856d6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '1rem'
            }}>
              P
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Perfect<span style={{ color: 'var(--accent-apple)' }}>Xams</span>
            </span>
          </div>

          <div style={{
            padding: '1rem', background: 'var(--accent-apple-light)',
            borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(0,113,227,0.15)'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-apple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Institution Portal
            </p>
            <p style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
              {user?.organisation || 'University'}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Organiser: {user?.firstName} {user?.lastName}
            </p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.65rem 0.8rem', width: '100%',
              borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--accent-apple-light)', color: 'var(--accent-apple)',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
            }}>
              <FileText size={18} /> Assigned Exam Papers
            </button>

            <button
              onClick={() => navigate('/audit')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.65rem 0.8rem', width: '100%',
                borderRadius: 'var(--radius-sm)', border: 'none',
                background: 'transparent', color: 'var(--text-secondary)',
                fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
              <ShieldCheck size={18} /> Audit & Verification
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center',
            padding: '0.75rem', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)',
            color: 'var(--status-danger)', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer'
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* ── Main Content Area ── */}
      <main style={{ marginLeft: 260, flex: 1, padding: '2.5rem 3rem' }} className="animate-fade-in">
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Organiser Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 2 }}>
              Access & download assigned encrypted exam papers upon scheduled unlock time
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search assigned papers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="apple-input"
                style={{ paddingLeft: '2.2rem', width: 240, padding: '0.55rem 0.8rem 0.55rem 2.2rem', fontSize: '0.84rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            </div>
          </div>
        </div>

        {/* ── Stat Metric Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="apple-card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <FileText size={20} color="var(--accent-apple)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assigned Papers</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{totalAssigned}</p>
          </div>

          <div className="apple-card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <Lock size={20} color="var(--status-warning)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Currently Locked</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{lockedCount}</p>
          </div>

          <div className="apple-card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <Unlock size={20} color="var(--status-success)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Available to Download</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{unlockedCount}</p>
          </div>
        </div>

        {/* ── Assigned Papers List ── */}
        <div className="apple-card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Assigned Papers ({filteredPapers.length})
            </h2>
            <button
              onClick={fetchAssignedPapers}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-apple)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RefreshCw size={14} /> Refresh List
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-tertiary)', padding: '2rem 0', textAlign: 'center' }}>Loading assigned papers...</p>
          ) : filteredPapers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <FileText size={40} color="var(--text-tertiary)" style={{ marginBottom: '0.8rem' }} />
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>No exam papers assigned to your organisation yet</p>
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
                      padding: '1.25rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: isReady ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isReady ? <Unlock size={22} color="var(--status-success)" /> : <Lock size={22} color="var(--status-warning)" />}
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {paper.examName} ({paper.examCode})
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                          Uploaded by: <strong>{paper.uploadedBy?.firstName} {paper.uploadedBy?.lastName}</strong> ({paper.uploadedBy?.organisation})
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                          <Clock size={13} /> Unlock Schedule: {new Date(paper.unlockTime).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      {/* Timer & Status Badge */}
                      <div style={{ textAlign: 'right' }}>
                        {isReady ? (
                          <span className="apple-badge badge-success">
                            <CheckCircle2 size={13} /> READY TO ACCESS
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span className="apple-badge badge-warning">
                              <Lock size={12} /> LOCKED
                            </span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--status-warning)', fontWeight: 700, marginTop: 4 }}>
                              {timerDetails.label}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Download / Access Button */}
                      <button
                        onClick={() => handleAccessPaper(paper._id)}
                        disabled={!isReady}
                        className="apple-button-primary"
                        style={{
                          padding: '0.55rem 1.1rem', fontSize: '0.85rem',
                          background: isReady ? 'var(--accent-apple)' : 'var(--bg-tertiary)',
                          color: isReady ? '#fff' : 'var(--text-tertiary)',
                          boxShadow: 'none', cursor: isReady ? 'pointer' : 'not-allowed'
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

      </main>
    </div>
  );
}