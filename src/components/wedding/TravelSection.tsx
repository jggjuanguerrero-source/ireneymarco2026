import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { MapPin, ExternalLink, Tag, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hotelEuropaImg from '@/assets/hotel-europa.jpg';
import hotelAtlanticoImg from '@/assets/hotel-atlantico.jpg';
import hotelCasablancaImg from '@/assets/hotel-casablanca.jpg';

// ============================================
// EDITABLE DATA - Hotels
// ============================================

interface Hotel {
  id: string;
  name: string;
  image: string;
  description: { es: string; en: string; it: string };
  prices: { double: number; triple?: number };
  discountCode: string;
  bookingUrl: string;
}

const hotels: Hotel[] = [
  {
    id: 'europa',
    name: 'Hotel Europa',
    image: hotelEuropaImg,
    description: {
      es: 'Hotel acogedor en el corazón de Jesolo, ideal para disfrutar de la playa y la cercanía a Venecia.',
      en: 'Cozy hotel in the heart of Jesolo, ideal for enjoying the beach and proximity to Venice.',
      it: 'Hotel accogliente nel cuore di Jesolo, ideale per godersi la spiaggia e la vicinanza a Venezia.',
    },
    prices: { double: 90 },
    discountCode: 'BODA-IRENE-MARCO',
    bookingUrl: 'https://www.hoteleuropajesolo.it/',
  },
  {
    id: 'atlantico',
    name: 'Hotel Atlántico',
    image: hotelAtlanticoImg,
    description: {
      es: 'Ubicación privilegiada con todas las comodidades para una estancia perfecta en Jesolo.',
      en: 'Privileged location with all amenities for a perfect stay in Jesolo.',
      it: 'Posizione privilegiata con tutti i comfort per un soggiorno perfetto a Jesolo.',
    },
    prices: { double: 80 },
    discountCode: 'BODA-IRENE-MARCO',
    bookingUrl: 'https://www.hotel-atlantico.it/',
  },
  {
    id: 'casablanca',
    name: 'Hotel Casablanca',
    image: hotelCasablancaImg,
    description: {
      es: 'Excelente relación calidad-precio con opción de habitaciones triples, perfecto para grupos.',
      en: 'Excellent value for money with triple room option, perfect for groups.',
      it: 'Ottimo rapporto qualità-prezzo con opzione camere triple, perfetto per gruppi.',
    },
    prices: { double: 70, triple: 105 },
    discountCode: 'BODA-IRENE-MARCO',
    bookingUrl: 'https://casablancajesolo.it/',
  },
];

// ============================================
// COMPONENT
// ============================================

const TravelSection = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const lang = i18n.language as 'es' | 'en' | 'it';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, hotelId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(hotelId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="travel" ref={ref} className="section-padding bg-secondary/50">
      <div className="max-w-6xl mx-auto">
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

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <h4 className="font-serif text-lg text-foreground mb-3">{hotel.name}</h4>
                <p className="font-body text-sm text-foreground/70 mb-4 leading-relaxed">
                  {hotel.description[lang]}
                </p>

                <div className="mb-4 space-y-1">
                  <div className="flex items-center justify-between font-body text-sm">
                    <span className="text-foreground/80">{t('sections.travel.priceDouble')}</span>
                    <span className="font-semibold text-foreground">{hotel.prices.double}€{t('sections.travel.perNight')}</span>
                  </div>
                  {hotel.prices.triple && (
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-foreground/80">{t('sections.travel.priceTriple')}</span>
                      <span className="font-semibold text-foreground">{hotel.prices.triple}€{t('sections.travel.perNight')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                  <code className="font-mono text-sm font-semibold text-primary truncate">
                    {hotel.discountCode}
                  </code>
                  <button
                    onClick={() => handleCopy(hotel.discountCode, hotel.id)}
                    className="ml-auto flex-shrink-0 p-1.5 rounded-md hover:bg-primary/10 transition-colors"
                    title={t('sections.travel.copyCode')}
                  >
                    {copiedId === hotel.id ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => window.open(hotel.bookingUrl, '_blank')}
                >
                  {t('sections.travel.bookNow')}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelSection;
