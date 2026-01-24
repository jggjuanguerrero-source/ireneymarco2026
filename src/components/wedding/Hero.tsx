import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Countdown from './Countdown';

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
      {/* Subtle warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/40" />
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Save the date - italic serif */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body italic text-lg md:text-xl text-muted-foreground tracking-widest mb-8"
        >
          save the date
        </motion.p>

        {/* Names - elegant script */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground mb-10 leading-tight"
        >
          Irene
          <span className="text-primary mx-3 md:mx-5">&</span>
          Marco
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="w-16 md:w-24 h-px bg-primary/50" />
          <span className="text-primary text-xs">✦</span>
          <div className="w-16 md:w-24 h-px bg-primary/50" />
        </motion.div>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-serif text-xl md:text-2xl lg:text-3xl tracking-[0.1em] text-foreground mb-4"
        >
          {t('hero.date')}
        </motion.p>

        {/* Another decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="w-12 md:w-16 h-px bg-primary/40" />
        </motion.div>

        {/* Location - italicized script style */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="font-script text-3xl md:text-4xl text-primary mb-16"
        >
          Venecia
        </motion.p>

        {/* Countdown */}
        <Countdown />
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <span className="font-body italic text-sm tracking-widest">
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
