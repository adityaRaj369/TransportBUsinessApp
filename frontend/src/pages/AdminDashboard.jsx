import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductManager from '../components/admin/ProductManager';
import InquiryManager from '../components/admin/InquiryManager';
import CategoryManager from '../components/admin/CategoryManager';
import SettingsManager from '../components/admin/SettingsManager';
import { LayoutDashboard, Package, MessageSquare, LogOut, Globe, Menu, X, Tags, Settings } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>{icon}</div>
      <p className="text-3xl font-bold text-[#001f3f]">{value}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  );
}

function Overview({ token }) {
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.ok ? r.json() : [])
      .then(data => Array.isArray(data) ? setProducts(data) : setProducts([]))
      .catch(() => setProducts([]));

    fetch(`${API}/api/inquiries`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => Array.isArray(data) ? setInquiries(data) : setInquiries([]))
      .catch(() => setInquiries([]));
  }, []);

  const unread = inquiries.filter(i => !i.read).length;
  const recent = inquiries.slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#001f3f] mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Products" value={products.length} color="bg-[#001f3f]/10" icon={<Package size={20} className="text-[#001f3f]" />} />
        <StatCard label="Total Inquiries" value={inquiries.length} color="bg-[#D4AF37]/10" icon={<MessageSquare size={20} className="text-[#D4AF37]" />} />
        <StatCard label="Unread Inquiries" value={unread} color="bg-blue-50" icon={<MessageSquare size={20} className="text-blue-500" />} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#001f3f] mb-4">Recent Inquiries</h3>
        {recent.length === 0 && <p className="text-gray-400 text-sm">No inquiries yet.</p>}
        <div className="space-y-3">
          {recent.map(inq => (
            <div key={inq.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-[#001f3f] text-sm">{inq.name}</p>
                <p className="text-gray-400 text-xs">{inq.email} · {inq.product || 'General'}</p>
              </div>
              <div className="flex items-center gap-3">
                {!inq.read && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                <span className="text-gray-300 text-xs">{new Date(inq.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Tags size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <p className="text-[#D4AF37] font-bold text-lg tracking-tight">PHOENIX<span className="text-white font-light">EXIMM</span></p>
        <p className="text-white/40 text-xs mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              tab === item.id ? 'bg-[#D4AF37] text-[#001f3f]' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
          <Globe size={18} /> View Website
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl text-sm font-medium transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-[#001f3f] flex-col shrink-0">
        <NavContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-[#001f3f] flex flex-col h-full shadow-2xl">
            <NavContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700">
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-bold text-[#001f3f]">
              {navItems.find(n => n.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">Logged in as <strong className="text-[#001f3f]">admin</strong></span>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#001f3f] font-bold text-sm">A</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {tab === 'overview' && <Overview token={token} />}
          {tab === 'categories' && <CategoryManager />}
          {tab === 'products' && <ProductManager />}
          {tab === 'inquiries' && <InquiryManager />}
          {tab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
}
