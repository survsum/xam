import React, { useEffect, useState } from 'react';
import { Bell, User, Lock, Unlock, Clock, FileText, Eye, LogOut } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OrganizerDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const token = localStorage.getItem('pxs_token');
  const user = JSON.parse(localStorage.getItem('pxs_user'));

  useEffect(() => {
    fetchAssignedPapers();
  }, []);
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);


  const fetchAssignedPapers = async () => {
    try {
      const res = await fetch(`${API}/papers/assigned`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      const data = await res.json();
      if (res.ok) setPapers(data.papers || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const handleAccessPaper = (paperId) => {
  const token = localStorage.getItem("pxs_token");

  window.open(
    `http://localhost:5000/api/papers/access/${paperId}?token=${token}`,
    "_blank"
  );
};

  const handleLogout = () => {
    localStorage.removeItem('pxs_token');
    localStorage.removeItem('pxs_user');
    window.location.href = '/';
  };

  const lockedCount   = papers.filter((p) => p.status === 'locked').length;
  const unlockedCount = papers.filter((p) => p.status === 'unlocked').length;

  const getRemainingTime = (unlockTime) => {
  const now = currentTime;
  const unlock = new Date(unlockTime);

  const diff = unlock - now;

  if (diff <= 0) {
    return "Ready to Access";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor(
    (diff % (1000 * 60)) / 1000
  );

  return `${hours}h ${minutes}m ${seconds}s`;
};

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 280,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
        color: '#fff',
        padding: 24,
        position: 'fixed',
        left: 0,
        top: 0,
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32 }}>
          PerfectXams
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Welcome card */}
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '12px 16px',
          }}>
            <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>Welcome</p>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>
              {user?.firstName || 'Organiser'}
            </h2>
          </div>

          {/* Papers count card */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '12px 16px',
            color: '#1d4ed8',
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              Assigned Papers
            </p>
            <h3 style={{ fontSize: 28, fontWeight: 700 }}>{papers.length}</h3>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 280, flex: 1, padding: 32 }}>

        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
              Organizer Dashboard
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
              Access assigned encrypted papers securely
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            {/* Bell */}
            <button style={iconBtnStyle}>
              <Bell size={18} />
            </button>

            {/* Avatar */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ ...iconBtnStyle, background: '#2563eb', color: '#fff', border: 'none' }}
            >
              <User size={18} />
            </button>

            {/* Dropdown */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 52,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                padding: 8,
                width: 160,
                zIndex: 50,
              }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#334155',
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 32 }}>
          <StatCard icon={<FileText size={22} color="#2563eb" />} title="Total Papers"    value={papers.length} />
          <StatCard icon={<Lock    size={22} color="#2563eb" />} title="Locked Papers"   value={lockedCount}   />
          <StatCard icon={<Unlock  size={22} color="#2563eb" />} title="Unlocked Papers" value={unlockedCount} />
        </div>

        {/* Papers list */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: 24,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', marginBottom: 20 }}>
            Assigned Papers
          </h2>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading papers...</p>
          ) : papers.length === 0 ? (
            <p style={{ color: '#64748b' }}>No papers assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {papers.map((paper) => (
                <div
                  key={paper._id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                      {paper.examName}
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                      Code: {paper.examCode}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                      fontSize: 13,
                      color: '#64748b',
                    }}>
                      <Clock size={14} />
                      Unlock Time: {new Date(paper.unlockTime).toLocaleString()}

<br />

Time Left: {getRemainingTime(paper.unlockTime)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={
                      paper.status === 'locked'
                        ? { padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                            background: '#fff7ed', color: '#b45309' }
                        : { padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                            background: '#f0fdf4', color: '#166534' }
                    }>
                      {paper.status}
                    </span>

                    <button
                      onClick={() => handleAccessPaper(paper._id)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 10,
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Eye size={15} /> Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Shared style objects ── */

const iconBtnStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: '#fff',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

/* ── StatCard ── */

function StatCard({ icon, title, value }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{value}</h3>
      <p  style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{title}</p>
    </div>
  );
}