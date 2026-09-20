import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, XCircle, Search, Upload, RefreshCw, AlertTriangle, Hash } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AuditView() {
  const [file, setFile] = useState(null);
  const [examCodeInput, setExamCodeInput] = useState('');
  const [computedHash, setComputedHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('viel_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('viel_theme', next);
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError('');
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setComputedHash(hashHex);
    } catch (err) {
      console.error("Hash computation error:", err);
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!file && !examCodeInput) {
      setError("Please select an original document file or enter an Exam Code.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      if (file) formData.append('paper', file);
      if (examCodeInput) formData.append('examCode', examCodeInput);
      if (computedHash) formData.append('hash', computedHash);

      const res = await fetch(`${API}/papers/verify-document`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Verification failed');
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend server for verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '6.5rem 1.5rem 4rem' }} className="animate-fade-in">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="editorial-eyebrow">TRANSPARENT AUDIT TRAIL</span>
          <h1 className="editorial-primary-heading" style={{ fontSize: '2.5rem' }}>
            Authenticity Verification
          </h1>
          <p className="editorial-description" style={{ maxWidth: 640, margin: '0.8rem auto 0' }}>
            Verify canonical SHA-256 digests against registered database metadata and Solidity smart contract proofs.
          </p>
        </div>

        {/* Audit Search & File Upload Box */}
        <div className="cinematic-glass" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <FileCheck size={20} color="var(--accent-violet-bright)" /> Upload Document or Search Exam Code
          </h2>

          <form onSubmit={handleVerify}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* File Dropzone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Select Original Document (PDF/DOCX)
                </label>
                <div style={{
                  border: '2px dashed var(--glass-border-violet)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-dark-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onClick={() => document.getElementById('audit-file-input').click()}
                >
                  <Upload size={28} color="var(--accent-violet-bright)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {file ? file.name : 'Click to select document'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Calculates local SHA-256 before submission'}
                  </p>
                  <input
                    id="audit-file-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Exam Code Search Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Or Search by Exam Code
                </label>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="MATH2026-FINAL"
                    value={examCodeInput}
                    onChange={e => setExamCodeInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      background: 'var(--bg-dark-surface)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 12,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>

                {computedHash && (
                  <div style={{
                    padding: '0.8rem', background: 'var(--bg-dark-surface)',
                    borderRadius: 10, fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Calculated SHA-256:</span>
                    <span style={{ color: 'var(--accent-violet-bright)', wordBreak: 'break-all', fontWeight: 600 }}>{computedHash}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', background: 'rgba(255, 77, 94, 0.1)',
                border: '1px solid rgba(255, 77, 94, 0.3)', borderRadius: 10,
                color: '#ff4d5e', fontSize: '0.86rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="viel-btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Verifying Authenticity...
                </>
              ) : (
                'Run Authenticity Audit Verification →'
              )}
            </button>
          </form>
        </div>

        {/* Verification Results Panel */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Card 1: Cryptographic Document Hash Check */}
            <div className="cinematic-glass" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Hash size={20} color="var(--accent-violet-bright)" /> Cryptographic Hash Check
                </h3>
                {result.documentHashMatch ? (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 980, background: 'rgba(52, 199, 89, 0.12)', color: '#34c759', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} /> MATCHED
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 980, background: 'rgba(255, 77, 94, 0.12)', color: '#ff4d5e', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <XCircle size={13} /> NO MATCH
                  </span>
                )}
              </div>

              {result.paper ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.86rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Exam Name:</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{result.paper.examName} ({result.paper.examCode})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Original File:</span>
                    <span>{result.paper.originalFileName || 'exam_paper.pdf'} ({result.paper.fileSize ? `${(result.paper.fileSize / 1024).toFixed(1)} KB` : 'N/A'})</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Recorded Canonical SHA-256:</span>
                    <code style={{ fontSize: '0.76rem', color: 'var(--accent-violet-bright)', wordBreak: 'break-all', background: 'var(--bg-dark-surface)', padding: '6px 10px', borderRadius: 8, display: 'block', border: '1px solid var(--glass-border)' }}>
                      {result.paper.hash}
                    </code>
                  </div>
                  {result.inputHash && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Uploaded Document SHA-256:</span>
                      <code style={{ fontSize: '0.76rem', color: result.documentHashMatch ? '#34c759' : '#ff4d5e', wordBreak: 'break-all', background: 'var(--bg-dark-surface)', padding: '6px 10px', borderRadius: 8, display: 'block', border: '1px solid var(--glass-border)' }}>
                        {result.inputHash}
                      </code>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Uploaded by <strong>{result.paper.uploadedBy?.firstName} {result.paper.uploadedBy?.lastName}</strong> ({result.paper.uploadedBy?.organisation})
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No registered document matches the provided hash or code in the system database.
                </p>
              )}
            </div>

            {/* Card 2: Smart Contract & Blockchain Proof */}
            <div className="cinematic-glass" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--accent-violet-bright)" /> Blockchain Proof
                </h3>
                {result.paper?.blockchainStatus === 'registered' || result.blockchainHashMatch ? (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 980, background: 'rgba(52, 199, 89, 0.12)', color: '#34c759', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} /> ON-CHAIN VERIFIED
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 980, background: 'rgba(255, 149, 0, 0.12)', color: '#ff9500', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={13} /> {result.paper?.blockchainStatus?.toUpperCase() || 'LOCAL ONLY'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Smart Contract Address:</span>
                  <code style={{ fontSize: '0.76rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                    0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (Hardhat Localnet)
                  </code>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Transaction Hash:</span>
                  {result.paper?.blockchainTxHash ? (
                    <code style={{ fontSize: '0.76rem', color: 'var(--accent-violet-bright)', wordBreak: 'break-all', background: 'var(--bg-dark-surface)', padding: '6px 10px', borderRadius: 8, display: 'block', border: '1px solid var(--glass-border)' }}>
                      {result.paper.blockchainTxHash}
                    </code>
                  ) : (
                    <span style={{ color: '#ff9500', fontSize: '0.82rem' }}>
                      No transaction hash recorded (RPC connection was offline during upload)
                    </span>
                  )}
                </div>

                {result.blockchainRecord && (
                  <div style={{ background: 'var(--bg-dark-surface)', padding: '0.8rem', borderRadius: 10, fontSize: '0.8rem', border: '1px solid var(--glass-border)' }}>
                    <p style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>Contract Query Result:</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>On-Chain Hash: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-violet-bright)' }}>{result.blockchainRecord.hash}</span></p>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>Unlock Timestamp: {new Date(result.blockchainRecord.unlockTime * 1000).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
