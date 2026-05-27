import React from 'react';
import { ShieldCheck, CheckCircle, Truck, Globe } from 'lucide-react';

const ICONS = [ShieldCheck, CheckCircle, Truck, Globe];

const DEFAULTS = {
  quality1Title: 'Quality Tested',
  quality1Desc: 'Rigorous testing in ISO-certified labs for purity and grain length.',
  quality2Title: 'Pesticide Free',
  quality2Desc: 'Compliance with international safety standards and organic options.',
  quality3Title: 'Secure Logistics',
  quality3Desc: 'Moisture-controlled transport to preserve freshness and aroma.',
  quality4Title: 'Global Standards',
  quality4Desc: 'Certified by APEDA and major global food safety organizations.',
  stat1Val: '45+',  stat1Label: 'Countries Served',
  stat2Val: '12k',  stat2Label: 'Tons Shipped',
  stat3Val: '99%',  stat3Label: 'On-Time Delivery',
  stat4Val: '24/7', stat4Label: 'Global Support',
};

export default function Quality({ settings = {} }) {
  const s = { ...DEFAULTS, ...settings };

  const cards = [
    { icon: ICONS[0], title: s.quality1Title, desc: s.quality1Desc },
    { icon: ICONS[1], title: s.quality2Title, desc: s.quality2Desc },
    { icon: ICONS[2], title: s.quality3Title, desc: s.quality3Desc },
    { icon: ICONS[3], title: s.quality4Title, desc: s.quality4Desc },
  ];

  const stats = [
    { val: s.stat1Val, label: s.stat1Label },
    { val: s.stat2Val, label: s.stat2Label },
    { val: s.stat3Val, label: s.stat3Label },
    { val: s.stat4Val, label: s.stat4Label },
  ];

  return (
    <section id="quality" className="py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 fade-in-up">
          <span className="text-[#D4AF37] text-sm tracking-[0.2em] uppercase mb-4 block">Our Standards</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Uncompromising <span className="italic text-white/40">Quality</span>
          </h2>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {cards.map(({ icon: Icon, title, desc }, i) => (
            <div key={i}
              className="glass-panel p-10 rounded-sm hover:-translate-y-2 transition-transform duration-500 fade-in-up group border-t-2 border-t-transparent hover:border-t-[#D4AF37] text-center"
              style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 bg-[#0A0A0A] flex items-center justify-center rounded-full mb-8 text-[#D4AF37] mx-auto group-hover:scale-110 transition-transform duration-500 border border-[#D4AF37]/20">
                <Icon size={26} />
              </div>
              <h3 className="text-lg font-serif text-white mb-4">{title}</h3>
              <p className="text-white/40 font-light text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-12 mt-20">
          {stats.map(({ val, label }, i) => (
            <div key={i} className="text-center fade-in-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <p className="text-5xl font-serif text-[#D4AF37] mb-2">{val}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
