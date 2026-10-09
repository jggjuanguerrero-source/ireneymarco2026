import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PreWeddingSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="prewedding"
      ref={ref}
      className="section-padding bg-background"
    >
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
          {t('sections.prewedding.title')}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-body italic text-lg md:text-xl text-muted-foreground mb-8"
        >
          {t('sections.prewedding.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-16 h-px bg-primary/30 mx-auto mb-8"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-body text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          {t('sections.prewedding.description')}
        </motion.p>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-secondary/30 border border-primary/10 rounded-2xl p-8 md:p-10 space-y-6">
            {/* Date */}
            <div className="flex items-center justify-center gap-3">
              <Calendar className="w-5 h-5 text-primary/60" />
              <span className="font-serif text-xl text-foreground">
                {t('sections.prewedding.date')}
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-primary/20 mx-auto" />

            {/* Time */}
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-primary/60" />
              <span className="font-body text-sm tracking-[0.1em] uppercase text-muted-foreground">
                {t('sections.prewedding.timeLabel')}
              </span>
              <span className="font-serif text-xl text-foreground">
                {t('sections.prewedding.time')}
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-primary/20 mx-auto" />

            {/* Location */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5 text-primary/60" />
                <span className="font-serif text-xl text-foreground">
                  {t('sections.prewedding.location')}
                </span>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                {t('sections.prewedding.address')}
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ristorante+Amante+Via+Goffredo+Mameli+22+Lido+di+Jesolo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-1 font-body text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                {t('sections.prewedding.mapsButton')}
              </a>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-primary/20 mx-auto" />

            {/* Menu */}
            <p className="font-body italic text-base text-foreground/80">
              {t('sections.prewedding.menu')}
            </p>
          </div>

          {/* End note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-body text-sm text-muted-foreground/70 italic mt-6 max-w-md mx-auto"
          >
            {t('sections.prewedding.endNote')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default PreWeddingSection;
