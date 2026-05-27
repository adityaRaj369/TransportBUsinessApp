import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function Products({ categories }) {
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
    <section id="products" className="py-32 bg-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-20 fade-in-up">
          <span className="text-[#D4AF37] text-sm tracking-[0.2em] uppercase mb-4 block">Our Collection</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Premium <span className="italic text-white/40">Products</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 fade-in-up">
          {catNames.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-xs uppercase tracking-widest transition-all duration-300 border ${
                filter === cat
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0A] font-semibold'
                  : 'border-white/20 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <div key={product.id}
                className="glass-panel rounded-sm overflow-hidden hover:-translate-y-2 transition-transform duration-500 group border-t-2 border-t-transparent hover:border-t-[#D4AF37]">
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={product.image?.startsWith('/uploads') ? `${API}${product.image}` : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#0A0A0A] text-xs font-bold px-3 py-1 tracking-widest uppercase">
                    {product.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-serif text-white mb-3">{product.name}</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed line-clamp-3">{product.description}</p>
                  <div className="space-y-2 mb-8">
                    {(product.features || []).map((feat, i) => (
                      <div key={i} className="flex items-center text-xs text-white/40">
                        <CheckCircle size={12} className="text-[#D4AF37] mr-2 flex-shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                  <a href="#contact"
                    className="block w-full py-3 border border-white/20 text-white/50 text-xs uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 text-center">
                    Request Specifications
                  </a>
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
