import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/globals.css';

import MosaicLoader from './components/MosaicLoader';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import PlaneCanvas from './components/PlaneCanvas';
import Modal from './components/Modal';
import Footer from './components/Footer';

import Hero from './pages/Hero';
import ProblemSection from './pages/ProblemSection';
import HowItWorks from './pages/HowItWorks';
import SecuritySection from './pages/SecuritySection';
import VerificationSection from './pages/VerificationSection';
import InstitutionsSection from './pages/InstitutionsSection';
import Team from './pages/Team';
import CtaSection from './pages/CtaSection';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AuditView from './pages/AuditView';

import AmbientGlows from './components/AmbientGlows';

function HomePage() {
  const [modal, setModal] = useState({ icon: '', title: '', message: '' });
  const [authTab, setAuthTab] = useState('login');
  
  // 1. Light/Dark Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('viel_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('viel_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showModal = (icon, title, message) =>
    setModal({ icon, title, message });

  const closeModal = () =>
    setModal({ icon: '', title: '', message: '' });

  const scrollToAuth = (tab) => {
    setAuthTab(tab);
    setTimeout(() => {
      document.getElementById('auth')?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 50);
  };

  return (
    <div style={{ position: 'relative', background: 'var(--bg-dark)', minHeight: '100vh', overflowX: 'hidden', transition: 'background-color 0.4s ease' }}>
      
      {/* Initial Load Mosaic Reveal Overlay */}
      <MosaicLoader theme={theme} />

      {/* Layer 2: Slow-Drifting Ambient Radial Glow Blobs */}
      <AmbientGlows theme={theme} />

      {/* Custom Minimal Cursor */}
      <CustomCursor />

      {/* Interactive Floating Particle Atmosphere */}
      <ParticleBackground theme={theme} />

      {/* 3D Paper Plane Canvas Overlay */}
      <PlaneCanvas theme={theme} />

      {/* Glass Navbar */}
      <Navbar
        onLogin={() => scrollToAuth('login')}
        onSignup={() => scrollToAuth('signup')}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Hero Section */}
      <Hero
        theme={theme}
        onSignup={() => scrollToAuth('signup')}
        onHowItWorks={() =>
          document.getElementById('how')?.scrollIntoView({
            behavior: 'smooth',
          })
        }
      />

      {/* 01 — The Problem */}
      <ProblemSection />

      {/* 02 — How It Works */}
      <HowItWorks />

      {/* 03 — Security */}
      <SecuritySection />

      {/* 04 — Verification */}
      <VerificationSection />

      {/* 05 — For Institutions */}
      <InstitutionsSection />

      {/* 06 — Engineering Leadership (Team) */}
      <Team />

      {/* Auth Portal Section */}
      <Auth defaultTab={authTab} onSuccess={showModal} />

      {/* 07 — Final CTA */}
      <CtaSection onSignup={() => scrollToAuth('signup')} />

      {/* Footer */}
      <Footer />

      <Modal
        icon={modal.icon}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth defaultTab="login" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/audit" element={<AuditView />} />
      </Routes>
    </BrowserRouter>
  );
}