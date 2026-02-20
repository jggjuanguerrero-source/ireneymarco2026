import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ExternalLink, Copy, Check, Globe, Paperclip, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hotelImg from '@/assets/hotel-orizzonte.jpg';

const HOTEL_EMAIL = 'booking@horizzonte.com';
const HOTEL_PHONE = '+39 0421 380 004';
const HOTEL_WEB = 'https://www.horizzonte.com/';

const placeholders: Record<string, { name: string; day: string; people: string }> = {
  es: { name: 'Nombre y Apellidos', day: 'Día', people: 'Número de adultos/niños' },
  en: { name: 'Name and Surname', day: 'Day', people: 'Number of adults/children' },
  it: { name: 'Nome e Cognome', day: 'Giorno', people: 'Numero di persone' },
};

const getEmailContent = (lang: string) => {
  const p = placeholders[lang] || placeholders.es;
  const subject = `Conferma prenotazione [${p.name}] per matrimonio Marco & Irene`;
  const body = `Buongiorno,\nVorrei confermare una prenotazione per il matrimonio di Marco & Irene.\n- Nome e Cognome: [${p.name}]\n- Data di arrivo (Check-in): [${p.day}] Ottobre 2026\n- Data di partenza (Check-out): [${p.day}] Ottobre 2026\n- Numero di persone: [${p.people}]\nGrazie.`;
  return { subject, body };
};

const TravelSection = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);

  const lang = i18n.language?.substring(0, 2) || 'es';
  const { subject, body } = getEmailContent(lang);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const mailtoLink = `mailto:${HOTEL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const fullTemplate = `${t('sections.travel.emailSubjectLabel')}: ${subject}\n\n${body}`;

  return (
    <section id="travel" ref={ref} className="section-padding bg-secondary/80">
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

            {/* Booking steps */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg text-foreground">{t('sections.travel.howToBook')}</h4>
              <div className="space-y-2 text-left">
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">1</span>
                  <p className="font-body text-sm text-foreground/70">{t('sections.travel.bookingStep1')}</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">2</span>
                  <p className="font-body text-sm text-foreground/70">{t('sections.travel.bookingStep2')}</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">3</span>
                  <p className="font-body text-sm text-foreground/70">{t('sections.travel.bookingStep3')}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
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
                  asChild
                >
                  <a href={`tel:${HOTEL_PHONE.replace(/\s/g, '')}`}>
                    <Phone className="w-4 h-4" />
                    {HOTEL_PHONE}
                  </a>
                </Button>
              </div>
            </div>

            {/* Collapsible email template */}
            <div className="mt-6">
              <button
                onClick={() => setShowEmailTemplate(!showEmailTemplate)}
                className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
              >
                <Mail className="w-3.5 h-3.5" />
                {t('sections.travel.fallbackNote')}
                <motion.span
                  animate={{ rotate: showEmailTemplate ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {showEmailTemplate && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-lg border border-border overflow-hidden shadow-sm">
                      {/* Window title bar */}
                      <div className="flex items-center justify-between bg-muted px-4 py-2.5 border-b border-border">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="font-body text-xs font-medium tracking-wide uppercase">
                            {t('sections.travel.bookByEmail')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-muted-foreground/50" />
                          <button
                            onClick={() => handleCopy(fullTemplate, 'template')}
                            className="p-1 rounded hover:bg-primary/10 transition-colors"
                            title={t('sections.travel.copyTemplate')}
                          >
                            {copiedField === 'template' ? (
                              <Check className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Header fields */}
                      <div className="bg-background px-4 py-2.5 space-y-1.5 border-b border-border/50">
                        <div className="flex items-center gap-2 font-body text-sm">
                          <span className="text-muted-foreground font-medium w-12 shrink-0">{t('sections.travel.emailToLabel')}:</span>
                          <span className="text-foreground">{HOTEL_EMAIL}</span>
                        </div>
                        <div className="flex items-start gap-2 font-body text-sm">
                          <span className="text-muted-foreground font-medium w-12 shrink-0">{t('sections.travel.emailSubjectLabel')}:</span>
                          <span className="text-foreground">{subject}</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="bg-card/60 px-4 py-4">
                        <p className="font-body text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                          {body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelSection;
