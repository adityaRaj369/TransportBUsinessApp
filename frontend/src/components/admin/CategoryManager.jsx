import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function CategoryManager() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editing ? `${API}/api/categories/${editing.id}` : `${API}/api/categories`;
    const method = editing ? 'PUT' : 'POST';
    
    try {
      await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(form)
      });
      await fetchCategories();
      showToast(editing ? 'Category updated!' : 'Category added!');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving category');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await fetch(`${API}/api/categories/${id}`, { method: 'DELETE', headers: authHeaders });
      await fetchCategories();
      showToast('Category deleted.');
    } catch (err) {
      console.error(err);
      showToast('Error deleting category');
    }
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#001f3f]">Categories</h2>
          <p className="text-gray-500 text-sm">{categories.length} categories available</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#001f3f] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#003366] transition-all">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <h3 className="font-bold text-[#001f3f] text-lg mb-2">{c.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{c.description || 'No description provided.'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1 border border-[#001f3f] text-[#001f3f] py-2 rounded-lg text-sm font-medium hover:bg-[#001f3f] hover:text-white transition-all">
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="flex-1 flex items-center justify-center gap-1 border border-red-200 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#001f3f]">{editing ? 'Edit Category' : 'Add Category'}</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
                    <input 
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      placeholder="e.g. Basmati Rice" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                    <textarea 
                      rows={3} 
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" 
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})} 
                      placeholder="A short description of this category..." 
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
                  <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex-1 bg-[#001f3f] text-white py-3 rounded-xl font-bold hover:bg-[#003366] transition-all disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
