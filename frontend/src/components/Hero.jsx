import React, { useRef } from 'react';
import { useParticleBackground } from './ThreeHooks';

export default function Hero({ settings }) {
  const canvasRef = useRef(null);
  useParticleBackground(canvasRef);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Three.js particle canvas */}
      <div ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Radial depth gradient */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.75) 60%, #0A0A0A 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="uppercase tracking-[0.3em] text-sm text-[#D4AF37] mb-6 fade-in-up">
          {settings.heroTagline || 'Excellence in Global Trade'}
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight mb-8 text-white fade-in-up" style={{ transitionDelay: '0.2s' }}>
          {settings.heroTitle
            ? settings.heroTitle.split('<br />').map((t, i) => <React.Fragment key={i}>{t}<br /></React.Fragment>)
            : <>Pioneering the Future of<br /><span className="gold-text-gradient italic">Global Trade.</span></>
          }
        </h1>

        <p className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl font-light mb-12 fade-in-up" style={{ transitionDelay: '0.4s' }}>
          {settings.heroSubtitle || 'PhoenixEximm connects the finest Indian produce with the world. Uncompromising quality, seamless logistics, and trusted global partnerships.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ transitionDelay: '0.6s' }}>
          <a href="#products" className="inline-block border border-[#D4AF37] px-10 py-4 text-sm uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all duration-300">
            View Our Products
          </a>
          <a href="#contact" className="inline-block border border-white/20 px-10 py-4 text-sm uppercase tracking-widest text-white/60 hover:border-white hover:text-white transition-all duration-300">
            Get a Quote
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
        <span className="text-xs uppercase tracking-widest text-white/30">Discover</span>
        <div className="w-px h-10 bg-[#D4AF37]/40" />
      </div>
    </section>
  );
}
