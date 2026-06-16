import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/globals.css';

import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Modal from './components/Modal';
import Stats from './components/Stats';
import Footer from './components/Footer';

import Hero from './pages/Hero';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import Auth from './pages/Auth';
import Team from './pages/Team';
import Dashboard from './pages/Dashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';

function HomePage() {
  const [modal, setModal] = useState({ icon: '', title: '', message: '' });
  const [authTab, setAuthTab] = useState('login');

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
    <>
      <Navbar
        onLogin={() => scrollToAuth('login')}
        onSignup={() => scrollToAuth('signup')}
      />

      <div style={{ marginTop: 68 }}>
        <Ticker />
      </div>

      <Hero
        onSignup={() => scrollToAuth('signup')}
        onHowItWorks={() =>
          document.getElementById('how')?.scrollIntoView({
            behavior: 'smooth',
          })
        }
      />
     

      <Stats />
      <HowItWorks />
      <Features />
       <Auth defaultTab={authTab} onSuccess={showModal} />

      

      <Team />
      <Footer />

      <Modal
        icon={modal.icon}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}