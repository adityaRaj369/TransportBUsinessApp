import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function Contact({ categories, settings }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', product: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', phone: '', product: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const inputClass = "w-full bg-transparent border-b border-white/20 pb-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-white/25";

  return (
    <section id="contact" className="py-32 bg-[#1C1C1C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 fade-in-up">
          <span className="text-[#D4AF37] text-sm tracking-[0.2em] uppercase mb-4 block">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">Request a <span className="italic text-white/40">Consultation</span></h2>
        </div>

        <div className="bg-[#0A0A0A] p-10 md:p-16 border border-white/5 rounded-sm relative overflow-hidden fade-in-up">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37]" />

          {/* Contact info strip */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 pb-12 border-b border-white/10">
            {[
              { Icon: Phone, label: 'Call Us', val: settings.contactPhone || '+91 98765 43210' },
              { Icon: Mail, label: 'Email Us', val: settings.contactEmail || 'export@phoenixeximm.com' },
              { Icon: MapPin, label: 'Location', val: settings.contactAddress || 'Mumbai, India' },
            ].map(({ Icon, label, val }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-1">{label}</p>
                  <p className="text-sm text-white/80">{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <input type="text" placeholder="Full Name" className={inputClass} value={formData.name} onChange={set('name')} />
              <input type="email" placeholder="Email Address" className={inputClass} value={formData.email} onChange={set('email')} />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <input type="tel" placeholder="Phone Number" className={inputClass} value={formData.phone} onChange={set('phone')} />
              <select className={`${inputClass} appearance-none`} value={formData.product} onChange={set('product')}>
                <option value="" className="bg-[#0A0A0A]">Interested Product</option>
                {categories.map(c => <option key={c.id} value={c.name} className="bg-[#0A0A0A]">{c.name}</option>)}
                <option value="Other" className="bg-[#0A0A0A]">Other</option>
              </select>
            </div>
            <textarea placeholder="Your Message" rows="4" className={`${inputClass} resize-none`} value={formData.message} onChange={set('message')} />
            <div className="text-center pt-4">
              <button type="submit" disabled={status === 'sending'}
                className="bg-[#D4AF37] text-[#0A0A0A] px-12 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-300 flex items-center gap-3 mx-auto">
                {status === 'sending' ? 'Sending...' : 'Send Inquiry'} <ArrowRight size={16} />
              </button>
              {status === 'success' && <p className="mt-4 text-[#D4AF37] text-sm tracking-widest">Inquiry sent successfully!</p>}
              {status === 'error' && <p className="mt-4 text-red-400 text-sm tracking-widest">Error. Please try again.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
