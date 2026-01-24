import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Countdown from './Countdown';
import VenetianOrnament from './VenetianOrnament';

const Hero = () => {
  const { t } = useTranslation();

  const scrollToContent = () => {
    const element = document.querySelector('#wedding');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Decorative corner ornaments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-20 left-8 text-primary text-6xl font-serif hidden lg:block"
      >
        ❧
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-20 right-8 text-primary text-6xl font-serif hidden lg:block transform scale-x-[-1]"
      >
        ❧
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Top ornament */}
        <VenetianOrnament size="md" className="mx-auto mb-8" />

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground mb-4"
        >
          <span className="gold-shimmer">Irene</span>
          <span className="text-primary mx-4 md:mx-6">&</span>
          <span className="gold-shimmer">Marco</span>
        </motion.h1>

        {/* Date with ornaments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-3"
        >
          <span className="text-primary/50">✦</span>
          <p className="font-serif text-lg md:text-xl lg:text-2xl tracking-[0.15em] uppercase text-foreground/80">
            {t('hero.date')}
          </p>
          <span className="text-primary/50">✦</span>
        </motion.div>

        {/* Location */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-body text-base md:text-lg tracking-widest text-muted-foreground mb-16"
        >
          {t('hero.location')}
        </motion.p>

        {/* Countdown */}
        <Countdown />

        {/* Bottom ornament */}
        <VenetianOrnament size="sm" className="mx-auto mt-16 rotate-180" />
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <span className="font-body text-sm tracking-widest uppercase">
          {t('hero.scrollDown')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;
