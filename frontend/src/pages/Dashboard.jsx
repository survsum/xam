import React, { useState, useEffect } from 'react';
import { Bell, User, Settings, FileText, Upload, Clock, Lock, CheckCircle, Download } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('papers');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);



  const [examName, setExamName] = useState("");
  const [examCode, setExamCode] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [unlockTime, setUnlockTime] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [paperFile, setPaperFile] = useState(null);

 const [papers, setPapers] = useState([]);

  const [templates] = useState([
    { id: 1, name: 'MCQ Template', description: 'Multiple choice questions format', questions: 50 },
    { id: 2, name: 'Essay Template', description: 'Long-form answer format', questions: 5 },
    { id: 3, name: 'Mixed Template', description: 'MCQ + Short answers', questions: 30 },
    { id: 4, name: 'Math Template', description: 'Problem-solving format', questions: 20 },
  ]);

  const stats = {
    uploaded: 24,
    locked: 8,
    unlocked: 16,
  };

  const handleLogout = () => {
    localStorage.removeItem('pxs_token');
    localStorage.removeItem('pxs_user');
    window.location.href = '/';
  };
  const handleUploadPaper = async () => {
    try {
      const token = localStorage.getItem("pxs_token");

      const formData = new FormData();

      formData.append("examName", examName);
      formData.append("examCode", examCode);
      const localDateTime = new Date(`${unlockDate}T${unlockTime}`);

formData.append(
  "unlockTime",
  localDateTime.toISOString()
);
      formData.append("assignedTo", assignedTo);
      formData.append("paper", paperFile);

      const res = await fetch(
        "http://localhost:5000/api/papers/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Paper uploaded successfully");
      fetchMyPapers();
      setShowUploadModal(false);

    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }
  };
  const fetchMyPapers = async () => {
  try {
    const token = localStorage.getItem("pxs_token");

    console.log("TOKEN:", token); // check token

    const res = await fetch(
      "http://localhost:5000/api/papers/my-papers",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setPapers(data.papers || []);
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  fetchMyPapers();
}, []);




  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb', paddingTop: '4rem' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'linear-gradient(180deg, #2a6fdb 0%, #1a5bbf 100%)',
        padding: '2rem 0',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>Perfect</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#87cefa', fontStyle: 'italic' }}>Xams</span>
          </div>
        </div>

        {/* Upload Button */}
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'white',
              color: '#2a6fdb',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Upload size={18} />
            Upload a new paper
          </button>
        </div>

        {/* Menu Items */}
        <nav>
          <SidebarItem
            icon={<FileText size={20} />}
            label="My papers"
            active={activeTab === 'papers'}
            onClick={() => { setActiveTab('papers'); setShowSettings(false); }}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            label="Template"
            active={activeTab === 'template'}
            onClick={() => { setActiveTab('template'); setShowSettings(false); }}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={showSettings}
            onClick={() => { setShowSettings(true); setActiveTab(''); }}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '2rem 3rem' }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a3a6e', margin: 0 }}>
            {showSettings ? 'Settings' : activeTab === 'template' ? 'Templates' : 'Dashboard'}
          </h1>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Notification */}
            <button style={{
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              position: 'relative',
            }}>
              <Bell size={20} color="#1a3a6e" />
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                background: '#ff4757',
                borderRadius: '50%',
              }} />
            </button>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  background: 'linear-gradient(135deg, #2a6fdb 0%, #1a5bbf 100%)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(42,111,219,0.3)',
                }}
              >
                <User size={20} color="white" />
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  padding: '0.5rem',
                  minWidth: '180px',
                  zIndex: 1000,
                }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      color: '#1a3a6e',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f4f6fb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings View */}
        {showSettings && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1a3a6e', marginBottom: '1.5rem' }}>Account Settings</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SettingItem label="Email Notifications" description="Receive email updates about your papers" />
              <SettingItem label="Auto-unlock Papers" description="Automatically unlock papers at scheduled time" />
              <SettingItem label="Two-Factor Authentication" description="Add extra security to your account" />
              <SettingItem label="Dark Mode" description="Switch to dark theme" />
            </div>

            <button style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              background: '#2a6fdb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
              Save Changes
            </button>
          </div>
        )}

        {/* Dashboard Stats */}
        {!showSettings && activeTab === 'papers' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <StatCard icon={<FileText size={24} color="#2a6fdb" />} number={stats.uploaded} label="Papers Uploaded" subtext="Total papers uploaded by you" />
              <StatCard icon={<Lock size={24} color="#ff9800" />} number={stats.locked} label="Locked Papers" subtext="Papers locked by you" />
              <StatCard icon={<CheckCircle size={24} color="#4caf50" />} number={stats.unlocked} label="Unlocked Papers" subtext="Papers unlocked by you" />
            </div>

            {/* Paper Schedule Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <InfoCard
                icon={<Clock size={40} color="#2a6fdb" />}
                title="Paper will unlock in"
                description="Your locked papers will be automatically unlocked at the scheduled date and time."
              />
              <InfoCard
                icon={<Lock size={40} color="#2a6fdb" />}
                title="When papers unlocked"
                description="Once papers are unlocked, they will be visible to the exam authorities and students."
              />
            </div>

            {/* Papers List */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1a3a6e', marginBottom: '1.5rem' }}>Upcoming Papers</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {papers.map(paper => (
                  <PaperItem key={paper._id} paper={paper} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Templates View */}
        {!showSettings && activeTab === 'template' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {templates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }} onClick={() => setShowUploadModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a3a6e', marginBottom: '1.5rem' }}>Upload New Paper</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#1a3a6e' }}>
                  Exam Credentials
                </label>
                <input
                  type="text"
                  placeholder="e.g., EXAM2024-MATH-001"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#1a3a6e' }}>
                  Name of Exam
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics Final Exam 2024"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#1a3a6e' }}>
                    Unlock Date
                  </label>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#1a3a6e' }}>
                    Unlock Time
                  </label>
                  <input
                    type="time"
                    value={unlockTime}
                    onChange={(e) => setUnlockTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1a3a6e'
                }}>
                  Assigned Organiser ID
                </label>

                <input
                  type="text"
                  placeholder="Enter organiser ID"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1a3a6e'
                }}>
                  Upload Paper File
                </label>

                <input
                  type="file"
                  onChange={(e) => setPaperFile(e.target.files[0])}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    background: 'white'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'transparent',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#666',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadPaper}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#2a6fdb',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'white',
                  }}
                >
                  Upload Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '0.75rem 1.5rem',
        background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
        border: 'none',
        borderLeft: active ? '3px solid white' : '3px solid transparent',
        cursor: 'pointer',
        color: 'white',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 400,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
      onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </button>
  );
}

// Stat Card Component
function StatCard({ icon, number, label, subtext }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(42,111,219,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a3a6e', margin: 0 }}>{number}</h3>
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a3a6e', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{subtext}</p>
    </div>
  );
}

// Info Card Component
function InfoCard({ icon, title, description }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(42,111,219,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a3a6e', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

// Paper Item Component
function PaperItem({ paper }) {
  const isUnlocked = paper.status === 'unlocked';

  return (
    <div style={{
      padding: '1.25rem',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isUnlocked ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isUnlocked ? <CheckCircle size={20} color="#4caf50" /> : <Lock size={20} color="#ff9800" />}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a3a6e', margin: '0 0 0.3rem 0' }}>
            {paper.examname}
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
           {
  isUnlocked
    ? "Unlocked"
    : `Unlocks at ${new Date(paper.unlockTime).toLocaleString()}`
}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={16} color="#666" />
        <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>  {new Date(paper.unlockTime).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

// Template Card Component
function TemplateCard({ template }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(42,111,219,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <FileText size={24} color="#2a6fdb" />
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a3a6e', marginBottom: '0.5rem' }}>
        {template.name}
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', lineHeight: 1.5 }}>
        {template.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>{template.questions} Questions</span>
        <button style={{
          padding: '0.5rem 1rem',
          background: '#2a6fdb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          <Download size={14} />
          Use
        </button>
      </div>
    </div>
  );
}

// Setting Item Component
function SettingItem({ label, description }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid #e0e0e0',
    }}>
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a3a6e', margin: '0 0 0.3rem 0' }}>
          {label}
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
          {description}
        </p>
      </div>

      <div
        onClick={() => setEnabled(!enabled)}
        style={{
          width: '48px',
          height: '24px',
          borderRadius: '12px',
          background: enabled ? '#2a6fdb' : '#e0e0e0',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.3s',
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: enabled ? '26px' : '2px',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );
}