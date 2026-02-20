import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';

import Countdown from './Countdown';
import veniceWatercolor from '@/assets/venice-horizontal.jpg';

const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax effect: image moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#FAFAF9]">
      {/* ═══════════════════════════════════════════════════════════════
          ZONA SUPERIOR (65%) — Texto exclusivo, padding agresivo arriba
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 pt-24 md:pt-36 lg:pt-40 pb-4 min-h-[65vh]">
        {/* Save the date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body italic text-base md:text-lg text-muted-foreground tracking-widest mb-4 md:mb-6"
        >
          save the date
        </motion.p>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground mb-4 md:mb-6 leading-tight"
        >
          <span className="font-script">Irene</span>
          <span className="not-italic text-primary mx-2 md:mx-4 font-sans font-normal">&amp;</span>
          <span className="font-script">Marco</span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-3 md:mb-4"
        >
          <div className="w-16 md:w-24 h-px bg-primary/60" />
          <span className="text-primary/80 text-xs">✦</span>
          <div className="w-16 md:w-24 h-px bg-primary/60" />
        </motion.div>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-serif text-lg md:text-xl lg:text-2xl tracking-[0.1em] text-foreground mb-1 md:mb-2"
        >
          {t('hero.date')}
        </motion.p>

        {/* Small decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center mb-1 md:mb-2"
        >
          <div className="w-10 md:w-14 h-px bg-primary/50" />
        </motion.div>

        {/* Location */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="font-script text-2xl md:text-3xl text-primary mb-6 md:mb-8"
        >
          {t('hero.location')}
        </motion.p>

        {/* Countdown */}
        <div className="bg-background/60 backdrop-blur-sm rounded-2xl px-6 py-4">
          <Countdown />
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-4"
        >
          <a
            href="#rsvp"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block font-serif text-xs md:text-sm tracking-widest 
                       border border-primary/60 text-primary px-6 py-2 md:px-8 md:py-3 rounded-full
                       transition-all duration-500 
                       hover:bg-primary hover:text-white hover:border-primary"
          >
            {t('hero.cta')}
          </a>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONA INFERIOR (35%) — Contenedor rígido para imagen
          Altura máxima estricta, imagen contenida sin desbordamiento
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 1.1 }}
        className="absolute bottom-0 left-0 w-full h-[50vh] md:h-[35vh] z-10 pointer-events-none"
      >
        {/* Gradient fade at top edge for smooth blend */}
        <div 
          className="absolute top-0 left-0 w-full h-16 z-10"
          style={{
            background: 'linear-gradient(to bottom, #FAFAF9 0%, transparent 100%)',
          }}
        />
        
        {/* Image with parallax effect */}
        <motion.img
          style={{ y: imageY }}
          src={veniceWatercolor}
          alt="Venice watercolor illustration - Rialto bridge and gondola"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain object-bottom"
        />
      </motion.div>
    </section>
  );
};

export default Hero;