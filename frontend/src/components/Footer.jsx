import React from 'react';

export default function Footer({ settings }) {
  return (
    <footer className="bg-[#0A0A0A] py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-serif font-bold text-[#D4AF37]">PHOENIX</span>
              <span className="text-2xl font-serif font-light text-white">EXIMM</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Leading Indian export-import firm bridging the gap between Indian quality and global demand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-4 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              {['Home', 'About', 'Products', 'Quality', 'Contact'].map(l => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors duration-300">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-4 text-xs uppercase tracking-widest">Corporate</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              <li>{settings.corporateAddress || 'Nariman Point, Mumbai'}</li>
              <li>{settings.contactPhone || '+91 98765 43210'}</li>
              <li>{settings.corporateEmail || 'info@phoenixeximm.com'}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between text-white/20 text-xs tracking-widest uppercase">
          <p>&copy; 2026 PhoenixEximm. All Rights Reserved.</p>
          <a href="/admin/login" className="hover:text-white/40 transition-colors mt-2 md:mt-0">Admin</a>
        </div>
      </div>
    </footer>
  );
}
