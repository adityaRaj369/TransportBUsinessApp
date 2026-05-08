import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function ProductManager() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Basmati Rice', description: '', features: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API}/api/categories`);
    if(res.ok) setCategories(await res.json());
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: categories[0]?.name || '', description: '', features: '' });
    setImageFile(null); setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, description: p.description, features: p.features.join(', ') });
    setImagePreview(`${API}${p.image.startsWith('/uploads') ? p.image : ''}`);
    setImageFile(null);
    setShowForm(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('category', form.category);
    fd.append('description', form.description);
    fd.append('features', JSON.stringify(form.features.split(',').map(f => f.trim()).filter(Boolean)));
    if (imageFile) fd.append('image', imageFile);

    const url = editing ? `${API}/api/products/${editing.id}` : `${API}/api/products`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: authHeaders, body: fd });
    await fetchProducts();
    setSaving(false);
    setShowForm(false);
    showToast(editing ? 'Product updated!' : 'Product added!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`${API}/api/products/${id}`, { method: 'DELETE', headers: authHeaders });
    await fetchProducts();
    showToast('Product deleted.');
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
          <h2 className="text-2xl font-bold text-[#001f3f]">Products</h2>
          <p className="text-gray-500 text-sm">{products.length} products in catalog</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#001f3f] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#003366] transition-all">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
            <div className="h-48 overflow-hidden relative">
              <img
                src={p.image.startsWith('/uploads') ? `${API}${p.image}` : p.image}
                alt={p.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-[#D4AF37] text-[#001f3f] text-xs font-bold px-3 py-1 rounded-full">{p.category}</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#001f3f] mb-2 text-sm">{p.name}</h3>
              <p className="text-gray-500 text-xs mb-4 line-clamp-2">{p.description}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {p.features.slice(0,3).map((f,i) => (
                  <span key={i} className="text-xs bg-[#001f3f]/5 text-[#001f3f] px-2 py-1 rounded-lg">{f}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 border border-[#001f3f] text-[#001f3f] py-2 rounded-lg text-sm font-medium hover:bg-[#001f3f] hover:text-white transition-all">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1 border border-red-200 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#001f3f]">{editing ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                {/* Image upload */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-[#D4AF37] transition-colors cursor-pointer relative" onClick={() => document.getElementById('product-image-input').click()}>
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="h-40 object-cover rounded-xl mx-auto" />
                      : <div className="py-8 text-gray-400"><Upload size={32} className="mx-auto mb-2" /><p className="text-sm">Click to upload image</p></div>
                    }
                    <input id="product-image-input" type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. 1121 RAW BASMATI RICE" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Features (comma-separated)</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Aromatic, Long Grain, Aged" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the product..." />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
                  <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 bg-[#001f3f] text-white py-3 rounded-xl font-bold hover:bg-[#003366] transition-all disabled:opacity-50">
                    {saving ? 'Saving...' : (editing ? 'Update Product' : 'Add Product')}
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
