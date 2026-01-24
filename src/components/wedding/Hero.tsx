import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Countdown from './Countdown';
import veniceWatercolor from '@/assets/venice-watercolor-clean.png';

const Hero = () => {
  const { t } = useTranslation();

  const scrollToContent = () => {
    const element = document.querySelector('#wedding');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* UPPER SECTION - Clean solid background with all text content */}
      <div className="relative z-10 flex-1 flex flex-col items-center text-center px-6 pt-24 md:pt-28 pb-8">
        {/* Save the date - italic serif */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body italic text-base md:text-lg text-muted-foreground tracking-widest mb-6"
        >
          save the date
        </motion.p>

        {/* Names - elegant script with light classic serif ampersand */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight"
        >
          Irene
          <span 
            className="text-primary mx-2 md:mx-4 inline-block"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
              fontStyle: 'italic'
            }}
          >
            &
          </span>
          Marco
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

        {/* Location - connected to i18n */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="font-script text-2xl md:text-3xl text-primary mb-8"
        >
          {t('hero.location')}
        </motion.p>

        {/* Countdown */}
        <Countdown />
      </div>

      {/* LOWER SECTION - Watercolor illustration as decorative footer */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="relative w-full h-[35vh] md:h-[38vh] flex-shrink-0"
      >
        {/* Soft gradient blend at top of image */}
        <div 
          className="absolute top-0 left-0 right-0 h-16 md:h-24 z-10"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)'
          }}
        />
        
        {/* Watercolor image */}
        <img 
          src={veniceWatercolor} 
          alt="Venice watercolor illustration - Rialto bridge and gondola" 
          className="w-full h-full object-contain object-bottom"
        />
      </motion.div>

      {/* Scroll indicator - positioned above the image */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-[36vh] md:bottom-[40vh] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors cursor-pointer"
      >
        <span className="font-body italic text-xs tracking-widest">
          {t('hero.scrollDown')}
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;
