import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Clock, Church, Bus, PartyPopper, Shirt } from 'lucide-react';

const WeddingSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const timeline = [
    { icon: Bus, label: t('sections.wedding.hotelDeparture'), time: t('sections.wedding.hotelDepartureTime') },
    { icon: Church, label: t('sections.wedding.churchCeremony'), time: t('sections.wedding.churchTime') },
    { icon: Clock, label: t('sections.wedding.transportToVenue'), time: t('sections.wedding.transportTime') },
    { icon: PartyPopper, label: t('sections.wedding.celebrationStart'), time: t('sections.wedding.celebrationTime') },
  ];

  return (
    <section id="wedding" ref={ref} className="section-padding bg-background">
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
          {t('sections.wedding.title')}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-body italic text-lg md:text-xl text-muted-foreground mb-8"
        >
          {t('sections.wedding.subtitle')}
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
          className="font-body text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed mb-16"
        >
          {t('sections.wedding.description')}
        </motion.p>

        {/* Schedule Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="font-serif text-xl md:text-2xl text-foreground mb-10">
            {t('sections.wedding.scheduleTitle')}
          </h3>

          <div className="relative max-w-md mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-primary/20" />

            <div className="space-y-8">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 + index * 0.15, duration: 0.5 }}
                    className="flex items-center gap-5"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-body text-foreground/70 text-sm">{item.label}</p>
                      <p className="font-serif text-lg text-foreground font-medium">{item.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Dresscode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="inline-flex flex-col items-center gap-3 p-8 rounded-xl bg-secondary/50 border border-border"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shirt className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-xl text-foreground">
            {t('sections.wedding.dresscodeTitle')}
          </h3>
          <p className="font-body text-lg font-medium text-foreground">
            {t('sections.wedding.dresscode')}
          </p>
          <p className="font-body text-sm text-muted-foreground">
            {t('sections.wedding.dresscodeDescription')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WeddingSection;
