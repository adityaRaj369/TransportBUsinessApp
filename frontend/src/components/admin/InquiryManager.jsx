import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Eye, Mail, Phone, Package, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || '';

export default function InquiryManager() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchInquiries = async () => {
    const res = await fetch(`${API}/api/inquiries`, { headers: authHeaders });
    const data = await res.json();
    setInquiries(data.reverse()); // newest first
  };

  useEffect(() => { fetchInquiries(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const markRead = async (id) => {
    await fetch(`${API}/api/inquiries/${id}/read`, { method: 'PUT', headers: authHeaders });
    fetchInquiries();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    await fetch(`${API}/api/inquiries/${id}`, { method: 'DELETE', headers: authHeaders });
    if (selected?.id === id) setSelected(null);
    fetchInquiries();
    showToast('Inquiry deleted.');
  };

  const unreadCount = inquiries.filter(i => !i.read).length;

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#001f3f]">Inquiries</h2>
        <p className="text-gray-500 text-sm">{inquiries.length} total · <span className="text-[#D4AF37] font-semibold">{unreadCount} unread</span></p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-260px)]">
        {/* List */}
        <div className="w-full md:w-2/5 overflow-y-auto space-y-3 pr-2">
          {inquiries.length === 0 && (
            <div className="text-center text-gray-400 py-16">
              <Mail size={48} className="mx-auto mb-4 opacity-30" />
              <p>No inquiries yet.</p>
            </div>
          )}
          {inquiries.map(inq => (
            <div
              key={inq.id}
              onClick={() => { setSelected(inq); if (!inq.read) markRead(inq.id); }}
              className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                selected?.id === inq.id
                  ? 'bg-[#001f3f] border-[#001f3f] text-white'
                  : 'bg-white border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold text-sm ${selected?.id === inq.id ? 'text-white' : 'text-[#001f3f]'}`}>{inq.name}</span>
                {!inq.read && <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />}
              </div>
              <p className={`text-xs mb-2 ${selected?.id === inq.id ? 'text-white/70' : 'text-gray-400'}`}>{inq.email}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected?.id === inq.id ? 'bg-white/20 text-white' : 'bg-[#D4AF37]/10 text-[#001f3f]'}`}>
                  {inq.product || 'General'}
                </span>
                <span className={`text-xs ${selected?.id === inq.id ? 'text-white/50' : 'text-gray-300'}`}>
                  {new Date(inq.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 bg-white rounded-3xl shadow-md border border-gray-100 p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#001f3f]">{selected.name}</h3>
                  <p className="text-gray-400 text-sm">{new Date(selected.date).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm font-medium border border-red-100 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Mail size={12} /> EMAIL</div>
                  <p className="text-[#001f3f] font-medium text-sm">{selected.email}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Phone size={12} /> PHONE</div>
                  <p className="text-[#001f3f] font-medium text-sm">{selected.phone || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Package size={12} /> PRODUCT INTEREST</div>
                  <p className="text-[#001f3f] font-medium text-sm">{selected.product || 'General'}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Calendar size={12} /> DATE</div>
                  <p className="text-[#001f3f] font-medium text-sm">{new Date(selected.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-[#001f3f]/5 rounded-2xl p-6">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Message</p>
                <p className="text-[#001f3f] leading-relaxed text-sm">{selected.message || '(No message provided)'}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
              <div className="text-center">
                <Eye size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Select an inquiry to view details</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
