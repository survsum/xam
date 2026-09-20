import React, { useState } from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, XCircle, Search, Upload, RefreshCw, AlertTriangle, ExternalLink, Hash, Clock, User } from 'lucide-react';
import Navbar from '../components/Navbar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AuditView() {
  const [file, setFile] = useState(null);
  const [examCodeInput, setExamCodeInput] = useState('');
  const [computedHash, setComputedHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Calculate client-side SHA-256 digest of selected file
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '6.5rem 1.5rem 4rem' }} className="animate-fade-in">
        
        {/* Header Section */}
        <div style={{ textTransform: 'center', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.9rem', borderRadius: '980px',
            background: 'var(--status-info-bg)', color: 'var(--status-info)',
            fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem'
          }}>
            <ShieldCheck size={16} /> Blockchain & Cryptographic Audit
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.035em' }}>
            Document Authenticity Verification
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 640, margin: '0.5rem auto 0', lineHeight: 1.6 }}>
            Verify your exam paper's canonical SHA-256 checksum against recorded database metadata and local Ethereum smart contract proofs.
          </p>
        </div>

        {/* Audit Search & File Upload Box */}
        <div className="apple-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={20} color="var(--accent-apple)" /> Upload Document or Search Exam Code
          </h2>

          <form onSubmit={handleVerify}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* File Dropzone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Select Original Document (PDF/DOCX)
                </label>
                <div style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onClick={() => document.getElementById('audit-file-input').click()}
                >
                  <Upload size={28} color="var(--accent-apple)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {file ? file.name : 'Click to select document'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
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
                    placeholder="e.g. MATH2026-FINAL"
                    value={examCodeInput}
                    onChange={e => setExamCodeInput(e.target.value)}
                    className="apple-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                </div>

                {computedHash && (
                  <div style={{
                    padding: '0.75rem', background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)'
                  }}>
                    <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: 2 }}>Client-Side Calculated SHA-256:</span>
                    <span style={{ color: 'var(--accent-apple)', wordBreak: 'break-all', fontWeight: 600 }}>{computedHash}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', background: 'var(--status-danger-bg)',
                borderRadius: 'var(--radius-sm)', color: 'var(--status-danger)',
                fontSize: '0.86rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="apple-button-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Verifying Document Authenticity...
                </>
              ) : (
                'Run Authenticity Audit Verification →'
              )}
            </button>
          </form>
        </div>

        {/* Verification Results Panel */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Card 1: Cryptographic Document Hash Check */}
            <div className="apple-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Hash size={20} color="var(--accent-apple)" /> Cryptographic Hash Check
                </h3>
                {result.documentHashMatch ? (
                  <span className="apple-badge badge-success">
                    <CheckCircle2 size={14} /> MATCHED
                  </span>
                ) : (
                  <span className="apple-badge badge-danger">
                    <XCircle size={14} /> NO MATCH
                  </span>
                )}
              </div>

              {result.paper ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.86rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Exam Name:</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{result.paper.examName} ({result.paper.examCode})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Original File:</span>
                    <span>{result.paper.originalFileName || 'exam_paper.pdf'} ({result.paper.fileSize ? `${(result.paper.fileSize / 1024).toFixed(1)} KB` : 'N/A'})</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Recorded Canonical SHA-256:</span>
                    <code style={{ fontSize: '0.76rem', color: 'var(--accent-apple)', wordBreak: 'break-all', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 6, display: 'block' }}>
                      {result.paper.hash}
                    </code>
                  </div>
                  {result.inputHash && (
                    <div>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Uploaded Document SHA-256:</span>
                      <code style={{ fontSize: '0.76rem', color: result.documentHashMatch ? 'var(--status-success)' : 'var(--status-danger)', wordBreak: 'break-all', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 6, display: 'block' }}>
                        {result.inputHash}
                      </code>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Uploaded by <strong>{result.paper.uploadedBy?.firstName} {result.paper.uploadedBy?.lastName}</strong> ({result.paper.uploadedBy?.organisation})
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No registered document matches the provided hash or code in the system database.
                </p>
              )}
            </div>

            {/* Card 2: Smart Contract & Blockchain Proof */}
            <div className="apple-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--accent-apple)" /> Blockchain Notarization Proof
                </h3>
                {result.paper?.blockchainStatus === 'registered' || result.blockchainHashMatch ? (
                  <span className="apple-badge badge-success">
                    <CheckCircle2 size={14} /> ON-CHAIN VERIFIED
                  </span>
                ) : (
                  <span className="apple-badge badge-warning">
                    <AlertTriangle size={14} /> {result.paper?.blockchainStatus?.toUpperCase() || 'LOCAL ONLY'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Smart Contract Address:</span>
                  <code style={{ fontSize: '0.76rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                    0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (Hardhat Localnet)
                  </code>
                </div>

                <div>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Transaction Hash:</span>
                  {result.paper?.blockchainTxHash ? (
                    <code style={{ fontSize: '0.76rem', color: 'var(--accent-apple)', wordBreak: 'break-all', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 6, display: 'block' }}>
                      {result.paper.blockchainTxHash}
                    </code>
                  ) : (
                    <span style={{ color: 'var(--status-warning)', fontSize: '0.82rem' }}>
                      No transaction hash recorded (RPC connection was offline during upload)
                    </span>
                  )}
                </div>

                {result.blockchainRecord && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <p style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>Contract Query Result:</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>On-Chain Hash: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-apple)' }}>{result.blockchainRecord.hash}</span></p>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>Unlock Timestamp: {new Date(result.blockchainRecord.unlockTime * 1000).toLocaleString()}</p>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  <strong>Security Note:</strong> Canonical SHA-256 hashes are immutable proof of paper integrity. Document hash verification and blockchain notarization are separate audit layers.
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
