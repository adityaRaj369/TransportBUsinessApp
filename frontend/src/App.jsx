import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronRight, Phone, Mail, MapPin,
  CheckCircle, Globe, ShieldCheck, Truck, ArrowRight
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const API = import.meta.env.VITE_API_URL || '';

// ── Protected Route ───────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

// ══════════════════════════════════════════════════════════════════
//  PUBLIC SITE COMPONENTS
// ══════════════════════════════════════════════════════════════════

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Quality', href: '#quality' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#001f3f]/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Phoenix Eximm Logo" className="h-16 w-auto object-contain drop-shadow-md" />
        </div>
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-white/90 hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide">
              {link.name.toUpperCase()}
            </a>
          ))}
          <a href="/admin/login" className="text-white/40 hover:text-white/60 text-xs font-medium transition-colors self-center ml-2">Admin</a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#001f3f] border-t border-white/10 overflow-hidden">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 text-white hover:bg-[#D4AF37]/20 rounded-lg text-lg font-medium">{link.name}</a>
              ))}
              <a href="/admin/login" className="block px-3 py-3 text-white/40 text-sm">Admin Login</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ settings }) => (
  <section id="home" className="relative h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src="/hero_bg.png" alt="Warehouse" className="w-full h-full object-cover scale-105" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] via-[#001f3f]/60 to-transparent opacity-80"></div>
    </div>
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="max-w-2xl">
        <span className="text-[#D4AF37] font-bold tracking-widest text-sm mb-4 block">{settings.heroTagline || 'GLOBAL TRADING EXCELLENCE'}</span>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {settings.heroTitle ? (
            settings.heroTitle.split('<br />').map((t, i) => <React.Fragment key={i}>{t}<br /></React.Fragment>)
          ) : (
            <>Pioneering the Future of <span className="text-[#D4AF37]">Global Trade</span></>
          )}
        </h1>
        <p className="text-xl text-white/80 mb-10 leading-relaxed">
          {settings.heroSubtitle || 'PhoenixEximm connects the finest Indian produce with the world. Uncompromising quality, seamless logistics, and trusted global partnerships.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#products" className="bg-[#D4AF37] hover:bg-[#c9a830] text-[#001f3f] px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center">
            VIEW OUR PRODUCTS <ChevronRight className="ml-2" size={20} />
          </a>
          <a href="#contact" className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm flex items-center justify-center">
            GET A QUOTE
          </a>
        </div>
      </motion.div>
    </div>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
      <div className="w-1 h-12 bg-white rounded-full"></div>
    </div>
  </section>
);

const About = ({ settings }) => (
  <section id="about" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
          <img src="/global_trade.png" alt="Global Trade" className="rounded-2xl shadow-2xl" />
          <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] p-8 rounded-2xl shadow-xl hidden lg:block">
            <span className="text-4xl font-bold text-[#001f3f] block">15+</span>
            <span className="text-sm font-semibold text-[#001f3f]/80 uppercase">Countries Served</span>
          </div>
        </motion.div>
        <div>
          <h2 className="text-4xl font-bold text-[#001f3f] mb-6">About PhoenixEximm</h2>
          <div className="w-20 h-1.5 bg-[#D4AF37] mb-8"></div>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {settings.aboutText || 'Founded on the principles of integrity and excellence, PhoenixEximm has emerged as a leader in the Indian export market. We specialize in sourcing the highest grade agricultural products and delivering them across continents.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {["Sustainable Sourcing", "Direct from Farmers", "Advanced Processing", "Global Certifications", "Custom Packaging", "Timely Delivery"].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <CheckCircle className="text-[#D4AF37]" size={20} />
                <span className="text-gray-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Products = ({ categories }) => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const catNames = ['All', ...categories.map(c => c.name)];

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.ok ? r.json() : [])
      .then(data => Array.isArray(data) ? setProducts(data) : setProducts([]))
      .catch(() => setProducts([]));
  }, []);

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#001f3f] mb-4">Our Premium Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover the finest selection of Indian rice, processed with care and precision.</p>
        </div>
        <div className="flex justify-center space-x-4 mb-12">
          {catNames.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat ? 'bg-[#001f3f] text-white shadow-lg' : 'bg-white text-[#001f3f] hover:bg-[#D4AF37]/20'}`}>{cat}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={product.image?.startsWith('/uploads') ? `${API}${product.image}` : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#001f3f] text-xs font-bold px-3 py-1 rounded-full">{product.category}</div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#001f3f] mb-3">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">{product.description}</p>
                  <div className="space-y-2 mb-8">
                    {(product.features || []).map((feat, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-500">
                        <CheckCircle size={14} className="text-[#D4AF37] mr-2" /> {feat}
                      </div>
                    ))}
                  </div>
                  <a href="#contact" className="block w-full py-3 rounded-lg border-2 border-[#001f3f] text-[#001f3f] font-bold hover:bg-[#001f3f] hover:text-white transition-all text-center">
                    REQUEST SPECIFICATIONS
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Quality = () => (
  <section id="quality" className="py-24 bg-[#001f3f] text-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-4">Uncompromising Quality</h2>
        <div className="w-24 h-1.5 bg-[#D4AF37] mx-auto mb-6"></div>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">Our multi-stage quality control process ensures only the most perfect grains make it to your table.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-12">
        {[
          { icon: <ShieldCheck size={40} />, title: "Quality Tested", desc: "Rigorous testing in ISO-certified labs for purity and grain length." },
          { icon: <CheckCircle size={40} />, title: "Pesticide Free", desc: "Compliance with international safety standards and organic options." },
          { icon: <Truck size={40} />, title: "Secure Logistics", desc: "Moisture-controlled transport to preserve freshness and aroma." },
          { icon: <Globe size={40} />, title: "Global Standards", desc: "Certified by APEDA and major global food safety organizations." }
        ].map((item, idx) => (
          <motion.div key={idx} whileHover={{ y: -10 }} className="text-center group">
            <div className="mb-6 inline-block p-4 bg-white/10 rounded-2xl group-hover:bg-[#D4AF37] group-hover:text-[#001f3f] transition-all duration-300">{item.icon}</div>
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
  </section>
);

const Contact = ({ categories, settings }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', product: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', product: '', message: '' });
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#001f3f] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-12 bg-[#D4AF37] text-[#001f3f]">
            <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
            <p className="mb-12 font-medium">Ready to take your business global? Reach out to our expert trade consultants today.</p>
            <div className="space-y-6">
              {[
                { Icon: Phone, label: 'Call Us', val: settings.contactPhone || '+91 98765 43210' },
                { Icon: Mail, label: 'Email Us', val: settings.contactEmail || 'export@phoenixeximm.com' },
                { Icon: MapPin, label: 'Location', val: settings.contactAddress || 'Mumbai, India' },
              ].map(({ Icon, label, val }) => (
                <div key={label} className="flex items-center space-x-4">
                  <div className="p-3 bg-[#001f3f]/10 rounded-lg"><Icon size={24} /></div>
                  <div>
                    <p className="text-xs uppercase font-bold opacity-60">{label}</p>
                    <p className="font-bold">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-2/3 p-12 bg-white">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'FULL NAME', field: 'name', type: 'text', placeholder: 'John Doe' },
                { label: 'EMAIL ADDRESS', field: 'email', type: 'email', placeholder: 'john@example.com' },
                { label: 'PHONE NUMBER', field: 'phone', type: 'tel', placeholder: '+91 ...' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-[#001f3f] mb-2">{label}</label>
                  <input type={type} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" placeholder={placeholder} value={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-[#001f3f] mb-2">INTERESTED PRODUCT</label>
                <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#D4AF37] outline-none transition-all" value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })}>
                  <option value="">Select a Product Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#001f3f] mb-2">YOUR MESSAGE</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={status === 'sending'} className="w-full bg-[#001f3f] text-white py-4 rounded-lg font-bold hover:bg-[#003366] transition-all flex items-center justify-center gap-2">
                  {status === 'sending' ? 'SENDING...' : 'SEND INQUIRY'} <ArrowRight size={20} />
                </button>
                {status === 'success' && <p className="mt-4 text-green-600 font-bold text-center">Inquiry sent successfully!</p>}
                {status === 'error' && <p className="mt-4 text-red-600 font-bold text-center">Error. Please try again.</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ settings }) => (
  <footer className="bg-[#001f3f] text-white pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-[#D4AF37]">PHOENIX</span>
            <span className="text-2xl font-light text-white ml-1">EXIMM</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">Leading Indian export-import firm bridging the gap between Indian quality and global demand.</p>
        </div>
        <div>
          <h4 className="font-bold text-[#D4AF37] mb-4">Quick Links</h4>
          <ul className="space-y-3 text-white/50 text-sm">
            {['Home', 'About', 'Products', 'Quality', 'Contact'].map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#D4AF37] mb-4">Corporate</h4>
          <ul className="space-y-3 text-white/50 text-sm">
            <li>{settings.corporateAddress || 'Nariman Point, Mumbai'}</li>
            <li>{settings.contactPhone || '+91 98765 43210'}</li>
            <li>{settings.corporateEmail || 'info@phoenixeximm.com'}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between text-white/25 text-sm">
        <p>&copy; 2026 PhoenixEximm. All Rights Reserved.</p>
        <a href="/admin/login" className="hover:text-white/50 transition-colors mt-2 md:mt-0">Admin</a>
      </div>
    </div>
  </footer>
);

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

  return (
    <div className="font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <Hero settings={settings} />
      <About settings={settings} />
      <Products categories={categories} />
      <Quality />
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
