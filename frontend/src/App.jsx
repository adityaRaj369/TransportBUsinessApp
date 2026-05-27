import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Quality from './components/Quality';
import Contact from './components/Contact';
import Footer from './components/Footer';

const API = import.meta.env.VITE_API_URL || '';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function PublicSite() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(r => r.ok ? r.json() : [])
      .then(data => Array.isArray(data) ? setCategories(data) : setCategories([]))
      .catch(() => setCategories([]));

    fetch(`${API}/api/settings`)
      .then(r => r.ok ? r.json() : {})
      .then(data => (data && typeof data === 'object') ? setSettings(data) : setSettings({}))
      .catch(() => setSettings({}));
  }, []);

  // Scroll-triggered fade-in-up observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [categories, settings]);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <Hero settings={settings} />
      <About settings={settings} />
      <Products categories={categories} />
      <Quality settings={settings} />
      <Contact categories={categories} settings={settings} />
      <Footer settings={settings} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
