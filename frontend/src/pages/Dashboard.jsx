import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Upload, Clock, Lock, CheckCircle2, AlertTriangle, RefreshCw,
  Search, ShieldCheck, LogOut, Settings, X, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('papers');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('viel_theme') || 'dark');

  // User & Auth State
  const token = localStorage.getItem('pxs_token');
  const user = JSON.parse(localStorage.getItem('pxs_user') || 'null');

  // Papers & Organisers Data
  const [papers, setPapers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Upload Form State
  const [examName, setExamName] = useState('');
  const [examCode, setExamCode] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [paperFile, setPaperFile] = useState(null);

  // Upload Progress State
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [retryLoading, setRetryLoading] = useState({});

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
    fetchMyPapers();
    fetchOrganizers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pxs_token');
    localStorage.removeItem('pxs_user');
    navigate('/');
  };

  const fetchMyPapers = async () => {
    setLoadingPapers(true);
    try {
      const res = await fetch(`${API}/papers/my-papers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPapers(data.papers || []);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Fetch papers error:', err);
    } finally {
      setLoadingPapers(false);
    }
  };

  const fetchOrganizers = async () => {
    try {
      const res = await fetch(`${API}/auth/organizers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrganizers(data.organizers || []);
      }
    } catch (err) {
      console.error('Fetch organizers error:', err);
    }
  };

  const handleUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    setUploadError('');

    if (!examName || !examCode || !unlockDate || !unlockTime || !assignedTo || !paperFile) {
      setUploadError('Please fill in all required fields and select an exam paper file.');
      return;
    }

    setUploadStep(1);

    try {
      const formData = new FormData();
      formData.append('examName', examName);
      formData.append('examCode', examCode);
      formData.append('subject', subject);
      formData.append('description', description);
      
      const localDateTime = new Date(`${unlockDate}T${unlockTime}`);
      formData.append('unlockTime', localDateTime.toISOString());
      formData.append('assignedTo', assignedTo);
      formData.append('paper', paperFile);

      setTimeout(() => setUploadStep(2), 600);
      setTimeout(() => setUploadStep(3), 1200);

      const res = await fetch(`${API}/papers/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.message || 'Upload failed');
        setUploadStep(0);
        return;
      }

      setUploadStep(4);
      setTimeout(() => {
        setUploadStep(5);
        setUploadResult(data);
        fetchMyPapers();
      }, 800);

    } catch (err) {
      console.error('Upload submit error:', err);
      setUploadError('Network error during upload. Please check backend connection.');
      setUploadStep(0);
    }
  };

  const handleRetryBlockchain = async (paperId) => {
    setRetryLoading(prev => ({ ...prev, [paperId]: true }));
    try {
      const res = await fetch(`${API}/papers/${paperId}/retry-blockchain`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchMyPapers();
      } else {
        alert(data.message || 'Retry failed');
      }
    } catch (err) {
      console.error('Retry error:', err);
      alert('Could not connect to backend server');
    } finally {
      setRetryLoading(prev => ({ ...prev, [paperId]: false }));
    }
  };

  const resetModal = () => {
    setShowUploadModal(false);
    setUploadStep(0);
    setUploadError('');
    setUploadResult(null);
    setExamName('');
    setExamCode('');
    setSubject('');
    setDescription('');
    setUnlockDate('');
    setUnlockTime('');
    setAssignedTo('');
    setPaperFile(null);
  };

  const filteredPapers = papers.filter(p =>
    p.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.examCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUploaded = papers.length;
  const lockedCount = papers.filter(p => p.status === 'locked').length;
  const unlockedCount = papers.filter(p => p.status === 'unlocked').length;
  const blockchainCount = papers.filter(p => p.blockchainStatus === 'registered').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '6.5rem 2rem 4rem' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="editorial-eyebrow">VIEL INFRASTRUCTURE</span>
            <h1 className="editorial-primary-heading" style={{ fontSize: '2.2rem' }}>
              Paper Setter Portal
            </h1>
            <p className="editorial-description" style={{ fontSize: '0.92rem', marginTop: 4 }}>
              AES-256 encrypted vault & Solidity smart contract notarization
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowUploadModal(true)}
              className="viel-btn-primary"
              style={{ padding: '0.7rem 1.5rem', fontSize: '0.88rem' }}
            >
              <Upload size={16} /> Upload New Paper
            </button>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
          <StatMetricCard icon={<FileText size={20} color="var(--accent-violet-bright)" />} value={totalUploaded} label="Total Papers" sub="Uploaded by you" />
          <StatMetricCard icon={<Lock size={20} color="#ff9500" />} value={lockedCount} label="Locked Vault" sub="Awaiting unlock time" />
          <StatMetricCard icon={<CheckCircle2 size={20} color="#34c759" />} value={unlockedCount} label="Unlocked" sub="Accessible to organiser" />
          <StatMetricCard icon={<ShieldCheck size={20} color="var(--accent-violet-bright)" />} value={blockchainCount} label="Blockchain Proved" sub="Notarized on-chain" />
        </div>

        {/* ── Main Papers Section ── */}
        <div className="cinematic-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif' }}>
              Uploaded Exam Papers ({filteredPapers.length})
            </h2>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search papers..."
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
                onClick={fetchMyPapers}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-violet-bright)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {loadingPapers ? (
            <p style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>Loading encrypted paper records...</p>
          ) : filteredPapers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={38} color="var(--accent-violet-bright)" style={{ marginBottom: '0.8rem', opacity: 0.6 }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>No exam papers found</p>
              <p style={{ fontSize: '0.86rem', marginTop: 4 }}>Upload your first encrypted paper to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredPapers.map(paper => (
                <PaperRowCard
                  key={paper._id}
                  paper={paper}
                  onRetry={() => handleRetryBlockchain(paper._id)}
                  retryLoading={retryLoading[paper._id]}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Multi-Stage Upload Modal ── */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={() => resetModal()}>
          <div
            className="cinematic-glass"
            style={{ width: '100%', maxWidth: 540, padding: '2.2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Upload Exam Paper</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  AES-256 Encrypted & Smart Contract Notarized
                </p>
              </div>
              <button onClick={() => resetModal()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {uploadError && (
              <div style={{
                padding: '0.75rem 1rem', background: 'rgba(255, 77, 94, 0.1)',
                border: '1px solid rgba(255, 77, 94, 0.3)', borderRadius: 10,
                color: '#ff4d5e', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <AlertTriangle size={16} /> {uploadError}
              </div>
            )}

            {/* Form Inputs */}
            {uploadStep === 0 && (
              <form onSubmit={handleUploadSubmit}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Exam Document File * (PDF, DOCX, ZIP)
                  </label>
                  <input
                    type="file"
                    onChange={e => setPaperFile(e.target.files[0])}
                    style={{
                      width: '100%', padding: '0.6rem', background: 'var(--bg-dark-surface)',
                      border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)'
                    }}
                    accept=".pdf,.docx,.zip"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Exam Code *
                    </label>
                    <input
                      type="text"
                      placeholder="MATH2026-FINAL"
                      value={examCode}
                      onChange={e => setExamCode(e.target.value)}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', background: 'var(--bg-dark-surface)',
                        border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', outline: 'none'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Mathematics Final Exam"
                      value={examName}
                      onChange={e => setExamName(e.target.value)}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', background: 'var(--bg-dark-surface)',
                        border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Mathematics"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', background: 'var(--bg-dark-surface)',
                        border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Assign Organiser *
                    </label>
                    <select
                      value={assignedTo}
                      onChange={e => setAssignedTo(e.target.value)}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', background: 'var(--bg-dark-surface)',
                        border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer'
                      }}
                      required
                    >
                      <option value="">Select Organiser...</option>
                      {organizers.map(org => (
                        <option key={org._id} value={org._id}>
                          {org.firstName} {org.lastName} ({org.organisation})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Unlock Date *
                    </label>
                    <input
                      type="date"
                      value={unlockDate}
                      onChange={e => setUnlockDate(e.target.value)}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', background: 'var(--bg-dark-surface)',
                        border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', outline: 'none'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Unlock Time *
                    </label>
                    <input
                      type="time"
                      value={unlockTime}
                      onChange={e => setUnlockTime(e.target.value)}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', background: 'var(--bg-dark-surface)',
                        border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-primary)', outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={() => resetModal()}
                    className="viel-btn-signin"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="viel-btn-primary"
                    style={{ flex: 1 }}
                  >
                    Encrypt & Secure Upload →
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function StatMetricCard({ icon, value, label, sub }) {
  return (
    <div className="cinematic-glass" style={{ padding: '1.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
        {icon}
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>
    </div>
  );
}

function PaperRowCard({ paper, onRetry, retryLoading }) {
  const isUnlocked = paper.status === 'unlocked';
  const isBcRegistered = paper.blockchainStatus === 'registered';

  return (
    <div style={{
      padding: '1.2rem 1.5rem', borderRadius: 14,
      border: '1px solid var(--glass-border)', background: 'var(--bg-dark-surface)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: isUnlocked ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 149, 0, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isUnlocked ? <CheckCircle2 size={20} color="#34c759" /> : <Lock size={20} color="#ff9500" />}
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {paper.examName} ({paper.examCode})
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            Assigned Organiser: <strong>{paper.assignedTo?.firstName} {paper.assignedTo?.lastName}</strong> ({paper.assignedTo?.organisation})
          </p>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Canonical SHA-256: <code style={{ fontSize: '0.74rem', color: 'var(--accent-violet-bright)' }}>{paper.hash?.substring(0, 24)}...</code>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontSize: '0.8rem', fontWeight: 600 }}>
            <Clock size={13} color="var(--text-muted)" />
            {new Date(paper.unlockTime).toLocaleString()}
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4 }}>
            <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 980, background: 'rgba(52, 199, 89, 0.12)', color: '#34c759', fontWeight: 700 }}>
              ✓ Encrypted
            </span>
            {isBcRegistered ? (
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 980, background: 'var(--accent-violet-light)', color: 'var(--accent-violet-bright)', fontWeight: 700 }}>
                Registered
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 980, background: 'rgba(255, 149, 0, 0.12)', color: '#ff9500', fontWeight: 700 }}>
                Offline
              </span>
            )}
          </div>
        </div>

        {!isBcRegistered && (
          <button
            onClick={onRetry}
            disabled={retryLoading}
            className="viel-btn-signin"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
          >
            <RefreshCw size={12} className={retryLoading ? 'spin' : ''} />
            {retryLoading ? 'Retrying...' : 'Retry Notarization'}
          </button>
        )}
      </div>
    </div>
  );
}