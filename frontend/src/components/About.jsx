import React, { useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { useInteractiveGlobe } from './ThreeHooks';

const DEFAULT_FEATURES = [
  'Sustainable Sourcing', 'Direct from Farmers',
  'Advanced Processing', 'Global Certifications',
  'Custom Packaging', 'Timely Delivery',
];

export default function About({ settings = {} }) {
  const globeRef = useRef(null);
  useInteractiveGlobe(globeRef);

  const features = [
    settings.aboutFeature1 || DEFAULT_FEATURES[0],
    settings.aboutFeature2 || DEFAULT_FEATURES[1],
    settings.aboutFeature3 || DEFAULT_FEATURES[2],
    settings.aboutFeature4 || DEFAULT_FEATURES[3],
    settings.aboutFeature5 || DEFAULT_FEATURES[4],
    settings.aboutFeature6 || DEFAULT_FEATURES[5],
  ];

  return (
    <section id="about" className="py-32 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="fade-in-up">
            <span className="text-[#D4AF37] text-sm tracking-[0.2em] uppercase mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white">
              About <span className="text-[#D4AF37]">PhoenixEximm</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8 font-light">
              {settings.aboutText || 'Founded on the principles of integrity and excellence, PhoenixEximm has emerged as a leader in the Indian export market. We specialize in sourcing the highest grade agricultural products and delivering them across continents.'}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-10">
            {features.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/55 text-sm">
                  <CheckCircle className="text-[#D4AF37] flex-shrink-0" size={15} />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-bold">PE</div>
              <div>
                <p className="font-serif italic text-white text-lg">{settings.directorName || 'Phoenix Eximm'}</p>
                <p className="text-xs text-[#D4AF37] uppercase tracking-widest">{settings.directorTitle || 'Global Exports Division'}</p>
              </div>
            </div>
          </div>

          {/* Globe */}
          <div className="fade-in-up" style={{ transitionDelay: '0.2s' }}>
            <div ref={globeRef} className="glass-panel rounded-2xl relative overflow-hidden cursor-grab active:cursor-grabbing" style={{ height: '450px' }}>
              <div className="absolute top-4 left-4 z-10 text-xs text-white/40 tracking-widest uppercase flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                Live Network
              </div>
              <div className="absolute bottom-4 right-4 z-10 text-xs text-white/25 tracking-widest pointer-events-none">Drag to rotate</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
