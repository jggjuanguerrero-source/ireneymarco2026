import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import ourStoryImage from '@/assets/our-story.jpg';

const OurStorySection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="ourstory" ref={ref} className="section-padding bg-background">
      <div className="max-w-3xl mx-auto text-center">
        {/* Decorative line top */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="w-12 h-px bg-primary/40" />
          <span className="text-primary/50 text-xs">✦</span>
          <div className="w-12 h-px bg-primary/40" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4"
        >
          {t('sections.ourstory.title')}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-body italic text-lg md:text-xl text-muted-foreground mb-8"
        >
          {t('sections.ourstory.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-16 h-px bg-primary/30 mx-auto mb-8"
        />

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-10 overflow-hidden rounded-lg shadow-lg"
        >
          <img
            src={ourStoryImage}
            alt={t('sections.ourstory.imageAlt')}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-body text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed"
        >
          {t('sections.ourstory.description')}
        </motion.p>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="font-body text-base text-muted-foreground mt-6 italic"
        >
          {t('sections.ourstory.infoNote')}
        </motion.p>
      </div>
    </section>
  );
};

export default OurStorySection;
