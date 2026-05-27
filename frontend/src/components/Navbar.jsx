import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Products', href: '#products' },
  { name: 'Quality', href: '#quality' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-full" />
            <img src="/1000090467.jpg" alt="Phoenix Eximm Logo" className="h-14 w-auto object-contain drop-shadow-md relative z-10 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="tracking-[0.2em] uppercase text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-500">PhoenixEximm</span>
            <span className="text-[0.6rem] text-[#D4AF37] tracking-[0.35em] uppercase opacity-80">Global Exports</span>
          </div>
        </a>

        <div className="hidden md:flex space-x-10 text-xs tracking-widest uppercase font-medium items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href}
              className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300">
              {link.name}
            </a>
          ))}
          <a href="/admin/login" className="text-white/25 hover:text-white/50 text-xs transition-colors">Admin</a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-[#D4AF37] transition-colors">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/5">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-4 text-white/70 hover:text-[#D4AF37] tracking-widest uppercase text-sm transition-colors border-b border-white/5">
                  {link.name}
                </a>
              ))}
              <a href="/admin/login" className="block px-3 py-3 text-white/25 text-xs tracking-widest uppercase">Admin Login</a>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
