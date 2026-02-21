import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Plane, Bus, Car, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GettingThereSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cards = [
    {
      icon: Plane,
      titleKey: 'sections.gettingThere.airport1Title',
      codeKey: 'sections.gettingThere.airport1Code',
      descKey: 'sections.gettingThere.airport1Desc',
      routeKey: 'sections.gettingThere.airport1Route',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Venice+Marco+Polo+Airport&destination=Jesolo+Autostazione',
    },
    {
      icon: Plane,
      titleKey: 'sections.gettingThere.airport2Title',
      codeKey: 'sections.gettingThere.airport2Code',
      descKey: 'sections.gettingThere.airport2Desc',
      routeKey: 'sections.gettingThere.airport2Route',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Treviso+Airport&destination=Jesolo+Autostazione',
    },
    {
      icon: Car,
      titleKey: 'sections.gettingThere.carTitle',
      codeKey: null,
      descKey: 'sections.gettingThere.carDesc',
      routeKey: null,
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Jesolo+Autostazione',
    },
  ];

  return (
    <section id="getting-there" ref={ref} className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-primary/50 text-xs">✦</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4">
            {t('sections.gettingThere.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.gettingThere.subtitle')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                className="bg-secondary/80 rounded-xl border border-border p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <h3 className="font-serif text-lg text-foreground mb-1">
                  {t(card.titleKey)}
                </h3>
                {card.codeKey && (
                  <span className="font-body text-sm text-muted-foreground mb-3">
                    ({t(card.codeKey)})
                  </span>
                )}

                <p className="font-body text-sm text-foreground/80 leading-relaxed mb-2">
                  {t(card.descKey)}
                </p>

                {card.routeKey && (
                  <div className="flex items-center gap-1.5 text-primary/80 mb-4">
                    <Bus className="w-3.5 h-3.5" />
                    <span className="font-body text-xs leading-snug">
                      {t(card.routeKey)}
                    </span>
                  </div>
                )}

                <div className="mt-auto pt-4 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => window.open(card.mapsUrl, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t('sections.gettingThere.mapsButton')}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GettingThereSection;
