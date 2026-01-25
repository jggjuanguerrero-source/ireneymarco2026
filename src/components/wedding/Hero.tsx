import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import Countdown from './Countdown';
import veniceWatercolor from '@/assets/venice-watercolor.png';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen overflow-hidden bg-[#FAFAF9]">
      {/* ═══════════════════════════════════════════════════════════════
          ZONA SUPERIOR (65%) — Texto exclusivo, fondo sólido
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 h-[65vh]">
        {/* Save the date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body italic text-base md:text-lg text-muted-foreground tracking-widest mb-6"
        >
          save the date
        </motion.p>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight"
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
          className="flex items-center justify-center gap-4 mb-4"
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
          className="font-serif text-lg md:text-xl lg:text-2xl tracking-[0.1em] text-foreground mb-2"
        >
          {t('hero.date')}
        </motion.p>

        {/* Small decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center mb-2"
        >
          <div className="w-10 md:w-14 h-px bg-primary/50" />
        </motion.div>

        {/* Location */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="font-script text-2xl md:text-3xl text-primary mb-8"
        >
          {t('hero.location')}
        </motion.p>

        {/* Countdown — stays in the text zone for full legibility */}
        <Countdown />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONA INFERIOR (35%) — Imagen con máscara de fundido
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 1.1 }}
        className="absolute bottom-0 left-0 w-full h-[35vh] z-10 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
        }}
      >
        <img
          src={veniceWatercolor}
          alt="Venice watercolor illustration - Rialto bridge and gondola"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-bottom md:object-cover"
        />
      </motion.div>
    </section>
  );
};

export default Hero;