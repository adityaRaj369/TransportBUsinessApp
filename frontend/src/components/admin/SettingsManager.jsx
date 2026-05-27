import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

const DEFAULTS = {
  // Hero
  heroTagline: 'GLOBAL TRADING EXCELLENCE',
  heroTitle: 'Pioneering the Future of Global Trade',
  heroSubtitle: 'PhoenixEximm connects the finest Indian produce with the world. Uncompromising quality, seamless logistics, and trusted global partnerships.',
  // About
  aboutText: 'Founded on the principles of integrity and excellence, PhoenixEximm has emerged as a leader in the Indian export market.',
  aboutFeature1: 'Sustainable Sourcing',
  aboutFeature2: 'Direct from Farmers',
  aboutFeature3: 'Advanced Processing',
  aboutFeature4: 'Global Certifications',
  aboutFeature5: 'Custom Packaging',
  aboutFeature6: 'Timely Delivery',
  // Quality Cards
  quality1Title: 'Quality Tested',
  quality1Desc: 'Rigorous testing in ISO-certified labs for purity and grain length.',
  quality2Title: 'Pesticide Free',
  quality2Desc: 'Compliance with international safety standards and organic options.',
  quality3Title: 'Secure Logistics',
  quality3Desc: 'Moisture-controlled transport to preserve freshness and aroma.',
  quality4Title: 'Global Standards',
  quality4Desc: 'Certified by APEDA and major global food safety organizations.',
  // Stats
  stat1Val: '45+',  stat1Label: 'Countries Served',
  stat2Val: '12k',  stat2Label: 'Tons Shipped',
  stat3Val: '99%',  stat3Label: 'On-Time Delivery',
  stat4Val: '24/7', stat4Label: 'Global Support',
  // Contact & Footer
  contactPhone: '+91 98765 43210',
  contactEmail: 'export@phoenixeximm.com',
  contactAddress: 'Mumbai, India',
  corporateEmail: 'info@phoenixeximm.com',
  corporateAddress: 'Nariman Point, Mumbai',
};

const Field = ({ label, value, onChange, type = 'input', rows = 3 }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
    {type === 'textarea'
      ? <textarea rows={rows} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none resize-none" value={value} onChange={onChange} />
      : <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" value={value} onChange={onChange} />
    }
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
    <h3 className="text-base font-bold text-[#001f3f] mb-6 pb-4 border-b border-gray-100">{title}</h3>
    <div className="grid grid-cols-1 gap-5">{children}</div>
  </div>
);

export default function SettingsManager() {
  const { token } = useAuth();
  const [settings, setSettings] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(r => r.ok ? r.json() : {})
      .then(data => { if (Object.keys(data).length > 0) setSettings(prev => ({ ...prev, ...data })); })
      .catch(console.error);
  }, []);

  const set = (key) => (e) => setSettings(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) { setToast('Settings saved!'); setTimeout(() => setToast(''), 3000); }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#001f3f]">Global Settings</h2>
        <p className="text-gray-500 text-sm">All website content is controlled from here</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Hero */}
        <Section title="🏠 Hero Section">
          <Field label="Tagline (small text above title)" value={settings.heroTagline} onChange={set('heroTagline')} />
          <Field label="Main Title" value={settings.heroTitle} onChange={set('heroTitle')} />
          <Field label="Subtitle / Description" value={settings.heroSubtitle} onChange={set('heroSubtitle')} type="textarea" />
        </Section>

        {/* About */}
        <Section title="📖 About Section">
          <Field label="Company Description" value={settings.aboutText} onChange={set('aboutText')} type="textarea" rows={4} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Feature 1" value={settings.aboutFeature1} onChange={set('aboutFeature1')} />
            <Field label="Feature 2" value={settings.aboutFeature2} onChange={set('aboutFeature2')} />
            <Field label="Feature 3" value={settings.aboutFeature3} onChange={set('aboutFeature3')} />
            <Field label="Feature 4" value={settings.aboutFeature4} onChange={set('aboutFeature4')} />
            <Field label="Feature 5" value={settings.aboutFeature5} onChange={set('aboutFeature5')} />
            <Field label="Feature 6" value={settings.aboutFeature6} onChange={set('aboutFeature6')} />
          </div>
        </Section>

        {/* Quality Cards */}
        <Section title="⭐ Quality Section — Cards">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Card 1 Title" value={settings.quality1Title} onChange={set('quality1Title')} />
            <Field label="Card 1 Description" value={settings.quality1Desc} onChange={set('quality1Desc')} />
            <Field label="Card 2 Title" value={settings.quality2Title} onChange={set('quality2Title')} />
            <Field label="Card 2 Description" value={settings.quality2Desc} onChange={set('quality2Desc')} />
            <Field label="Card 3 Title" value={settings.quality3Title} onChange={set('quality3Title')} />
            <Field label="Card 3 Description" value={settings.quality3Desc} onChange={set('quality3Desc')} />
            <Field label="Card 4 Title" value={settings.quality4Title} onChange={set('quality4Title')} />
            <Field label="Card 4 Description" value={settings.quality4Desc} onChange={set('quality4Desc')} />
          </div>
        </Section>

        {/* Stats */}
        <Section title="📊 Stats Bar">
          <div className="grid grid-cols-4 gap-4">
            <Field label="Stat 1 Value" value={settings.stat1Val} onChange={set('stat1Val')} />
            <Field label="Stat 1 Label" value={settings.stat1Label} onChange={set('stat1Label')} />
            <Field label="Stat 2 Value" value={settings.stat2Val} onChange={set('stat2Val')} />
            <Field label="Stat 2 Label" value={settings.stat2Label} onChange={set('stat2Label')} />
            <Field label="Stat 3 Value" value={settings.stat3Val} onChange={set('stat3Val')} />
            <Field label="Stat 3 Label" value={settings.stat3Label} onChange={set('stat3Label')} />
            <Field label="Stat 4 Value" value={settings.stat4Val} onChange={set('stat4Val')} />
            <Field label="Stat 4 Label" value={settings.stat4Label} onChange={set('stat4Label')} />
          </div>
        </Section>

        {/* Contact */}
        <Section title="📞 Contact & Footer">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={settings.contactPhone} onChange={set('contactPhone')} />
            <Field label="Inquiry Email" value={settings.contactEmail} onChange={set('contactEmail')} />
            <Field label="Address / City" value={settings.contactAddress} onChange={set('contactAddress')} />
            <Field label="Corporate Email (Footer)" value={settings.corporateEmail} onChange={set('corporateEmail')} />
          </div>
          <Field label="Full Corporate Address (Footer)" value={settings.corporateAddress} onChange={set('corporateAddress')} />
        </Section>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#001f3f] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#003366] transition-all disabled:opacity-50">
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
