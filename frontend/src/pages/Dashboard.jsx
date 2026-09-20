import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Upload, Clock, Lock, CheckCircle2, AlertTriangle, RefreshCw,
  Search, ShieldCheck, User, LogOut, Settings, Eye, Check, X, ArrowRight, Database
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('papers');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
  const [uploadStep, setUploadStep] = useState(0); // 0: Idle, 1: Uploading & Encrypting, 2: SHA-256 Hashing, 3: Saving DB, 4: Blockchain Notarization, 5: Complete
  const [uploadError, setUploadError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [retryLoading, setRetryLoading] = useState({});

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

    setUploadStep(1); // Stage 1: Uploading & Encrypting

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

      // Simulate real stage step transitions
      setTimeout(() => setUploadStep(2), 600); // Stage 2: SHA-256 Hashing
      setTimeout(() => setUploadStep(3), 1200); // Stage 3: Database Storage & Encryption

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

      setUploadStep(4); // Stage 4: Blockchain Notarization
      setTimeout(() => {
        setUploadStep(5); // Complete
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

  // Filtered papers
  const filteredPapers = papers.filter(p =>
    p.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.examCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalUploaded = papers.length;
  const lockedCount = papers.filter(p => p.status === 'locked').length;
  const unlockedCount = papers.filter(p => p.status === 'unlocked').length;
  const blockchainCount = papers.filter(p => p.blockchainStatus === 'registered').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* ── Apple Style Sidebar ── */}
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

          {/* Primary Action Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="apple-button-primary"
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', padding: '0.7rem 1rem', marginBottom: '2rem', justifyContent: 'center' }}
          >
            <Upload size={18} /> Upload New Paper
          </button>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <SidebarNavItem
              icon={<FileText size={18} />}
              label="My Exam Papers"
              active={activeTab === 'papers'}
              onClick={() => setActiveTab('papers')}
            />
            <SidebarNavItem
              icon={<ShieldCheck size={18} />}
              label="Audit & Verify"
              onClick={() => navigate('/audit')}
            />
            <SidebarNavItem
              icon={<Settings size={18} />}
              label="Account Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>
        </div>

        {/* User Card */}
        <div style={{
          padding: '0.8rem', background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-danger)', padding: 4 }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main Work Area ── */}
      <main style={{ marginLeft: 260, flex: 1, padding: '2.5rem 3rem' }} className="animate-fade-in">
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Paper Setter Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 2 }}>
              Secure AES-256 encrypted exam paper vault & blockchain registry
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search exam papers..."
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
          <StatMetricCard icon={<FileText size={20} color="var(--accent-apple)" />} value={totalUploaded} label="Total Papers" sub="Uploaded by you" />
          <StatMetricCard icon={<Lock size={20} color="var(--status-warning)" />} value={lockedCount} label="Locked Vault" sub="Awaiting unlock time" />
          <StatMetricCard icon={<CheckCircle2 size={20} color="var(--status-success)" />} value={unlockedCount} label="Unlocked" sub="Accessible to organiser" />
          <StatMetricCard icon={<ShieldCheck size={20} color="var(--status-info)" />} value={blockchainCount} label="Blockchain Proved" sub="Notarized on-chain" />
        </div>

        {/* ── Main Papers Section ── */}
        {activeTab === 'papers' && (
          <div className="apple-card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Uploaded Exam Papers ({filteredPapers.length})
              </h2>
              <button
                onClick={fetchMyPapers}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-apple)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={14} /> Refresh List
              </button>
            </div>

            {loadingPapers ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '2rem 0', textAlign: 'center' }}>Loading encrypted paper records...</p>
            ) : filteredPapers.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <FileText size={40} color="var(--text-tertiary)" style={{ marginBottom: '0.8rem' }} />
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>No exam papers found</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 4 }}>Upload your first encrypted paper to get started.</p>
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
        )}

        {/* ── Settings View ── */}
        {activeTab === 'settings' && (
          <div className="apple-card" style={{ padding: '2rem', maxWidth: 600 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Account & Security Preferences</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <SettingRow label="Institution Name" value={user?.organisation || 'University'} />
              <SettingRow label="Account Role" value={user?.role} />
              <SettingRow label="Email Address" value={user?.email} />
              <SettingRow label="Encryption Standard" value="AES-256-CBC (Server Derived)" />
              <SettingRow label="Ethereum Smart Contract" value="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" />
            </div>
          </div>
        )}

      </main>

      {/* ── Multi-Stage Upload Modal ── */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={() => resetModal()}>
          <div
            className="apple-card animate-pop-in"
            style={{ width: '100%', maxWidth: 540, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Upload Exam Paper</h2>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  AES-256 Encrypted & Smart Contract Notarized
                </p>
              </div>
              <button onClick={() => resetModal()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            {uploadError && (
              <div style={{
                padding: '0.75rem 1rem', background: 'var(--status-danger-bg)',
                borderRadius: 'var(--radius-sm)', color: 'var(--status-danger)',
                fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <AlertTriangle size={16} /> {uploadError}
              </div>
            )}

            {/* Stage Progress Indicator */}
            {uploadStep > 0 && uploadStep < 5 && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-apple)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing Security Pipeline...
                </p>
                <StageItem active={uploadStep >= 1} text="1. Encrypting File with AES-256-CBC" />
                <StageItem active={uploadStep >= 2} text="2. Computing Canonical SHA-256 Checksum" />
                <StageItem active={uploadStep >= 3} text="3. Storing Metadata in Database" />
                <StageItem active={uploadStep >= 4} text="4. Attempting Blockchain Notarization" />
              </div>
            )}

            {/* Success Confirmation View */}
            {uploadStep === 5 && uploadResult && (
              <div style={{ background: 'var(--status-success-bg)', border: '1px solid rgba(52,199,89,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-success)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.8rem' }}>
                  <CheckCircle2 size={24} /> Paper Secured & Saved!
                </div>
                
                <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-primary)' }}>
                  <p><strong>Exam Name:</strong> {uploadResult.paper?.examName}</p>
                  <p><strong>Document Status:</strong> <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>✓ Encrypted & Saved</span></p>
                  <p><strong>Canonical SHA-256:</strong> <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{uploadResult.paper?.hash}</code></p>
                  <p><strong>Blockchain Notarization:</strong>{' '}
                    {uploadResult.paper?.blockchainStatus === 'registered' ? (
                      <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>✓ Registered ({uploadResult.paper?.blockchainTxHash?.substring(0, 16)}...)</span>
                    ) : (
                      <span style={{ color: 'var(--status-warning)', fontWeight: 700 }}>⚠ Local Blockchain Offline (Paper is safe, retry available)</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => resetModal()}
                  className="apple-button-primary"
                  style={{ width: '100%', marginTop: '1.2rem' }}
                >
                  Done
                </button>
              </div>
            )}

            {/* Form Inputs (Shown when idle or error) */}
            {uploadStep === 0 && (
              <form onSubmit={handleUploadSubmit}>
                {/* File Dropzone */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Exam Document File * (PDF, DOCX, ZIP max 25MB)
                  </label>
                  <input
                    type="file"
                    onChange={e => setPaperFile(e.target.files[0])}
                    className="apple-input"
                    style={{ padding: '0.6rem' }}
                    accept=".pdf,.docx,.zip"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Exam Credentials / Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MATH2026-FINAL"
                      value={examCode}
                      onChange={e => setExamCode(e.target.value)}
                      className="apple-input"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mathematics Final Exam"
                      value={examName}
                      onChange={e => setExamName(e.target.value)}
                      className="apple-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="apple-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Assign Institution Organiser *
                    </label>
                    <select
                      value={assignedTo}
                      onChange={e => setAssignedTo(e.target.value)}
                      className="apple-input"
                      style={{ cursor: 'pointer' }}
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
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Unlock Date *
                    </label>
                    <input
                      type="date"
                      value={unlockDate}
                      onChange={e => setUnlockDate(e.target.value)}
                      className="apple-input"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Unlock Time *
                    </label>
                    <input
                      type="time"
                      value={unlockTime}
                      onChange={e => setUnlockTime(e.target.value)}
                      className="apple-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={() => resetModal()}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 980, border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="apple-button-primary"
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

    </div>
  );
}

/* ── Shared Subcomponents ── */

function SidebarNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.65rem 0.8rem', width: '100%',
        borderRadius: 'var(--radius-sm)', border: 'none',
        background: active ? 'var(--accent-apple-light)' : 'transparent',
        color: active ? 'var(--accent-apple)' : 'var(--text-secondary)',
        fontWeight: active ? 700 : 500, fontSize: '0.88rem',
        cursor: 'pointer', transition: 'all var(--transition-fast)'
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function StatMetricCard({ icon, value, label, sub }) {
  return (
    <div className="apple-card" style={{ padding: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
        <div style={{ padding: 6, borderRadius: 8, background: 'var(--bg-secondary)' }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{sub}</p>
    </div>
  );
}

function StageItem({ active, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: active ? 'var(--text-primary)' : 'var(--text-tertiary)', margin: '4px 0' }}>
      {active ? <Check size={14} color="var(--status-success)" /> : <div style={{ width: 14 }} />}
      <span style={{ fontWeight: active ? 600 : 400 }}>{text}</span>
    </div>
  );
}

function PaperRowCard({ paper, onRetry, retryLoading }) {
  const isUnlocked = paper.status === 'unlocked';
  const isBcRegistered = paper.blockchainStatus === 'registered';

  return (
    <div style={{
      padding: '1.2rem', borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: isUnlocked ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isUnlocked ? <CheckCircle2 size={20} color="var(--status-success)" /> : <Lock size={20} color="var(--status-warning)" />}
        </div>

        <div>
          {/* Fix: Use paper.examName */}
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {paper.examName} ({paper.examCode})
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Assigned Organiser: <strong>{paper.assignedTo?.firstName} {paper.assignedTo?.lastName}</strong> ({paper.assignedTo?.organisation})
          </p>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
            Canonical SHA-256: <code style={{ fontSize: '0.73rem' }}>{paper.hash?.substring(0, 24)}...</code>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontSize: '0.8rem', fontWeight: 600 }}>
            <Clock size={13} color="var(--text-tertiary)" />
            {new Date(paper.unlockTime).toLocaleString()}
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4 }}>
            {/* Document Storage Status */}
            <span className="apple-badge badge-success">✓ Encrypted</span>

            {/* Blockchain Notarization Status */}
            {isBcRegistered ? (
              <span className="apple-badge badge-info" title={paper.blockchainTxHash}>
                <ShieldCheck size={12} /> Registered
              </span>
            ) : (
              <span className="apple-badge badge-warning">
                <AlertTriangle size={12} /> {paper.blockchainStatus?.toUpperCase() || 'OFFLINE'}
              </span>
            )}
          </div>
        </div>

        {/* Retry Blockchain Button if offline */}
        {!isBcRegistered && (
          <button
            onClick={onRetry}
            disabled={retryLoading}
            style={{
              padding: '0.4rem 0.8rem', borderRadius: 980, border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)', fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
            }}
            title="Retry notarizing document hash on Ethereum smart contract"
          >
            <RefreshCw size={12} className={retryLoading ? 'spin' : ''} />
            {retryLoading ? 'Retrying...' : 'Retry Blockchain'}
          </button>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}