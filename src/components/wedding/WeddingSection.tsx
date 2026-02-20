import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Bus, Ship, Church, AlertTriangle, UtensilsCrossed, PartyPopper, MapPin, Shirt, Camera } from 'lucide-react';
import iglesiaImg from '@/assets/iglesia.jpg';
import restauranteImg from '@/assets/restaurante.jpg';

const MAPS = {
  hotel: 'https://maps.google.com/?q=Hotel+Orizzonte+Viale+Venezia+5+Jesolo',
  punta: 'https://maps.google.com/?q=Punta+Sabbioni+30013+VE',
  church: 'https://maps.google.com/?q=Chiesa+dei+Gesuiti+Venezia+Salizada+dei+Spechieri+4877',
  restaurant: 'https://maps.google.com/?q=Ristorante+Da+Guido+Via+Roma+Sinistra+25+Jesolo',
};

const MichelinBadge = () => (
  <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.2)] text-[10px] font-semibold tracking-wider text-primary uppercase align-middle">
    Michelin Guide
  </span>
);

const MapsButton = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/50 rounded-full px-3 py-1 transition-colors mt-2"
  >
    <MapPin className="w-3 h-3" />
    {label}
  </a>
);

const WeddingSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const timeline = [
    {
      icon: Bus,
      time: t('sections.wedding.step1Time'),
      label: t('sections.wedding.step1Label'),
      location: t('sections.wedding.step1Location'),
      note: t('sections.wedding.step1Note'),
      mapsHref: MAPS.hotel,
      warning: false,
    },
    {
      icon: Ship,
      time: t('sections.wedding.step2Time'),
      label: t('sections.wedding.step2Label'),
      location: t('sections.wedding.step2Location'),
      warning: t('sections.wedding.step2Warning'),
      mapsHref: MAPS.punta,
      note: null,
    },
    {
      icon: Church,
      time: t('sections.wedding.step3Time'),
      label: t('sections.wedding.step3Label'),
      location: t('sections.wedding.step3Location'),
      mapsHref: MAPS.church,
      image: iglesiaImg,
      note: null,
      warning: false,
    },
    {
      icon: Camera,
      time: t('sections.wedding.step3bTime'),
      label: t('sections.wedding.step3bLabel'),
      location: null,
      mapsHref: null,
      note: t('sections.wedding.step3bNote'),
      warning: false,
    },
    {
      icon: Ship,
      time: t('sections.wedding.step4Time'),
      label: t('sections.wedding.step4Label'),
      location: null,
      warning: t('sections.wedding.step4Warning'),
      mapsHref: null,
      note: null,
    },
    {
      icon: UtensilsCrossed,
      time: t('sections.wedding.step5Time'),
      label: t('sections.wedding.step5Label'),
      location: t('sections.wedding.step5Location'),
      mapsHref: MAPS.restaurant,
      image: restauranteImg,
      michelin: true,
      note: null,
      warning: false,
    },
    {
      icon: PartyPopper,
      time: t('sections.wedding.step6Time'),
      label: t('sections.wedding.step6Label'),
      location: null,
      mapsHref: null,
      note: null,
      warning: false,
    },
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

          <div className="relative max-w-xl mx-auto text-left">
            {/* Vertical line */}
            <div className="absolute left-[2.35rem] top-4 bottom-4 w-px bg-primary/20" />

            <div className="space-y-6">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 + index * 0.12, duration: 0.5 }}
                    className="flex gap-5"
                  >
                    {/* Icon bubble */}
                    <div className="w-[4.7rem] flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pb-2 flex-1 min-w-0">
                      <p className="font-serif text-lg text-foreground font-medium leading-tight">
                        <span className="text-primary mr-2">{item.time}</span>
                        {item.label}
                        {'michelin' in item && item.michelin && <MichelinBadge />}
                      </p>

                      {item.location && (
                        <p className="font-body text-sm text-muted-foreground mt-0.5">{item.location}</p>
                      )}

                      {item.note && (
                        <p className="font-body text-sm text-foreground/60 italic mt-1">{item.note}</p>
                      )}

                      {item.warning && (
                        <div className="mt-2 flex items-start gap-2 bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">
                          <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <p className="font-body text-xs text-foreground/80 leading-snug">{item.warning}</p>
                        </div>
                      )}

                      {item.mapsHref && (
                        <MapsButton href={item.mapsHref} label={t('sections.wedding.mapsButton')} />
                      )}

                      {'image' in item && item.image && (
                        <img
                          src={item.image}
                          alt={item.label}
                          className="mt-3 rounded-lg shadow-md w-full max-w-sm object-cover aspect-[16/10] max-h-48 md:max-h-none"
                          loading="lazy"
                        />
                      )}
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
          transition={{ delay: 1.6, duration: 0.8 }}
          className="inline-flex flex-col items-center gap-3 p-8 rounded-xl bg-secondary/50 border border-border max-w-lg mx-auto"
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
          <p className="font-body text-sm text-muted-foreground text-center leading-relaxed">
            {t('sections.wedding.dresscodeDescription')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WeddingSection;
