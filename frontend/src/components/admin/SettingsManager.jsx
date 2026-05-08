import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function SettingsManager() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    heroTitle: 'Pioneering the Future of Global Trade',
    heroSubtitle: 'PhoenixEximm connects the finest Indian produce with the world. Uncompromising quality, seamless logistics, and trusted global partnerships.',
    heroTagline: 'GLOBAL TRADING EXCELLENCE',
    aboutText: 'Founded on the principles of integrity and excellence, PhoenixEximm has emerged as a leader in the Indian export market. We specialize in sourcing the highest grade agricultural products and delivering them across continents.',
    contactPhone: '+91 98765 43210',
    contactEmail: 'export@phoenixeximm.com',
    contactAddress: 'Mumbai, India',
    corporateEmail: 'info@phoenixeximm.com',
    corporateAddress: 'Nariman Point, Mumbai'
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setToast('Settings updated successfully!');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#001f3f]">Global Settings</h2>
          <p className="text-gray-500 text-sm">Manage website content and contact information</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-[#001f3f] mb-6 border-b pb-4">Hero & Branding</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hero Tagline</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.heroTagline} 
                onChange={e => setSettings({ ...settings, heroTagline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hero Main Title</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.heroTitle} 
                onChange={e => setSettings({ ...settings, heroTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hero Subtitle / Description</label>
              <textarea 
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.heroSubtitle} 
                onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-[#001f3f] mb-6 border-b pb-4">About Section</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Company Description</label>
            <textarea 
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
              value={settings.aboutText} 
              onChange={e => setSettings({ ...settings, aboutText: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-[#001f3f] mb-6 border-b pb-4">Contact & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Inquiry Phone</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.contactPhone} 
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Inquiry Email</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.contactEmail} 
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location City/Country</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.contactAddress} 
                onChange={e => setSettings({ ...settings, contactAddress: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Corporate Email (Footer)</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.corporateEmail} 
                onChange={e => setSettings({ ...settings, corporateEmail: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Corporate Address (Footer)</label>
              <input 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                value={settings.corporateAddress} 
                onChange={e => setSettings({ ...settings, corporateAddress: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-[#001f3f] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#003366] transition-all disabled:opacity-50"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
