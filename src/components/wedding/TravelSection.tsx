import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, ExternalLink, Copy, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hotelImg from '@/assets/hotel-orizzonte.jpg';

const HOTEL_EMAIL = 'booking@horizzonte.com';
const HOTEL_PHONE = '0421 380 004';
const HOTEL_WEB = 'https://www.hotelorizzonte.it/';

const MAILTO_SUBJECT = 'Conferma prenotazione [Nome e Cognome] per matrimonio Marco & Irene';
const MAILTO_BODY = `Buongiorno,
Vorrei confermare una prenotazione per il matrimonio di Marco & Irene.
- Nome e Cognome: [Tu Nombre y Apellidos]
- Data di arrivo (Check-in): [Giorno] Ottobre 2026
- Data di partenza (Check-out): [Giorno] Ottobre 2026
- Numero di persone: [Numero di adulti/bambini]
Grazie.`;

const TravelSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const mailtoLink = `mailto:${HOTEL_EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}&body=${encodeURIComponent(MAILTO_BODY)}`;

  const fullTemplate = `${t('sections.travel.emailSubjectLabel')}: ${MAILTO_SUBJECT}\n\n${MAILTO_BODY}`;

  return (
    <section id="travel" ref={ref} className="section-padding bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
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
            {t('sections.travel.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.travel.subtitle')}
          </p>
        </motion.div>

        {/* Hotel Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-background rounded-xl overflow-hidden border border-border shadow-sm"
        >
          {/* Hotel Image */}
          <div className="relative h-56 md:h-72 overflow-hidden">
            <img
              src={hotelImg}
              alt="Hotel Orizzonte"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <h3 className="font-serif text-2xl md:text-3xl text-background drop-shadow-lg">
                Hotel Orizzonte
              </h3>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Description */}
            <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed">
              {t('sections.travel.hotelDescription')}
            </p>

            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex-1">
                <p className="font-serif text-lg text-foreground">75€ <span className="font-body text-sm text-muted-foreground">{t('sections.travel.perNight')}</span></p>
                <p className="font-body text-sm text-muted-foreground">{t('sections.travel.priceNote')}</p>
              </div>
              <a
                href={HOTEL_WEB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline"
              >
                <Globe className="w-4 h-4" />
                {t('sections.travel.visitWeb')}
              </a>
            </div>

            {/* Booking instructions */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg text-foreground">{t('sections.travel.howToBook')}</h4>
              <p className="font-body text-sm text-foreground/70">{t('sections.travel.bookingInstructions')}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => window.open(mailtoLink, '_blank')}
                >
                  <Mail className="w-4 h-4" />
                  {t('sections.travel.bookByEmail')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => window.open(`tel:+39${HOTEL_PHONE.replace(/\s/g, '')}`, '_self')}
                >
                  <Phone className="w-4 h-4" />
                  {HOTEL_PHONE}
                </Button>
              </div>
            </div>

            {/* Fallback template */}
            <div className="mt-6 p-5 bg-card rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <p className="font-body text-sm italic text-muted-foreground">
                  {t('sections.travel.fallbackNote')}
                </p>
                <button
                  onClick={() => handleCopy(fullTemplate, 'template')}
                  className="ml-3 flex-shrink-0 p-2 rounded-md hover:bg-primary/10 transition-colors"
                  title={t('sections.travel.copyTemplate')}
                >
                  {copiedField === 'template' ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-primary" />
                  )}
                </button>
              </div>
              <div className="font-body text-sm text-foreground/80 whitespace-pre-line leading-relaxed bg-background/50 p-4 rounded border border-border/50">
                <p className="font-semibold mb-1">{t('sections.travel.emailSubjectLabel')}:</p>
                <p className="mb-3">{MAILTO_SUBJECT}</p>
                <p className="font-semibold mb-1">{t('sections.travel.emailBodyLabel')}:</p>
                <p>{MAILTO_BODY}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelSection;
