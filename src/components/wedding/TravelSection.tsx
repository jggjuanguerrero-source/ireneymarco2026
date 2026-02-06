import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Plane, Bus, MapPin, ExternalLink, Tag, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hotelEuropaImg from '@/assets/hotel-europa.jpg';
import hotelAtlanticoImg from '@/assets/hotel-atlantico.jpg';
import hotelCasablancaImg from '@/assets/hotel-casablanca.jpg';

// ============================================
// EDITABLE DATA - Hotels & Airports
// ============================================

interface Airport {
  id: string;
  name: string;
  code: string;
  description: {
    es: string;
    en: string;
    it: string;
  };
  distance: string;
  mapsUrl: string;
  busUrl: string;
}
interface Hotel {
  id: string;
  name: string;
  image: string;
  description: {
    es: string;
    en: string;
    it: string;
  };
  prices: {
    double: number;
    triple?: number;
  };
  discountCode: string;
  bookingUrl: string;
}

// AIRPORTS DATA - Edit this array to update airport info
const airports: Airport[] = [{
  id: 'marco-polo',
  name: 'Aeropuerto Marco Polo',
  code: 'VCE',
  description: {
    es: 'El aeropuerto principal de Venecia. Conexiones directas con vaporetto al centro histórico.',
    en: 'The main Venice airport. Direct vaporetto connections to the historic center.',
    it: 'L\'aeroporto principale di Venezia. Connessioni dirette con vaporetto al centro storico.'
  },
  distance: '13 km',
  mapsUrl: 'https://www.google.com/maps/dir//Venice+Marco+Polo+Airport,+Viale+Galileo+Galilei,+30173+Venezia+VE,+Italy/@45.5052917,12.3519661,17z',
  busUrl: 'https://www.atvo.it/en-venice-marco-polo-airport.html'
}, {
  id: 'treviso',
  name: 'Aeropuerto Treviso',
  code: 'TSF',
  description: {
    es: 'Aeropuerto secundario, ideal para vuelos low-cost. Autobús directo a Venecia (40 min).',
    en: 'Secondary airport, ideal for low-cost flights. Direct bus to Venice (40 min).',
    it: 'Aeroporto secondario, ideale per voli low-cost. Autobus diretto per Venezia (40 min).'
  },
  distance: '40 km',
  mapsUrl: 'https://www.google.com/maps/dir//Treviso+Airport,+Via+Noalese,+63,+31100+Treviso+TV,+Italy/@45.6484226,12.1944831,17z',
  busUrl: 'https://www.atvo.it/en-treviso-airport.html'
}];

// HOTELS DATA - Edit this array to update hotel recommendations
const hotels: Hotel[] = [{
  id: 'europa',
  name: 'Hotel Europa',
  image: hotelEuropaImg,
  description: {
    es: 'Hotel acogedor en el corazón de Jesolo, ideal para disfrutar de la playa y la cercanía a Venecia.',
    en: 'Cozy hotel in the heart of Jesolo, ideal for enjoying the beach and proximity to Venice.',
    it: 'Hotel accogliente nel cuore di Jesolo, ideale per godersi la spiaggia e la vicinanza a Venezia.'
  },
  prices: {
    double: 90
  },
  discountCode: 'BODA-IRENE-MARCO',
  bookingUrl: 'https://www.hoteleuropajesolo.it/'
}, {
  id: 'atlantico',
  name: 'Hotel Atlántico',
  image: hotelAtlanticoImg,
  description: {
    es: 'Ubicación privilegiada con todas las comodidades para una estancia perfecta en Jesolo.',
    en: 'Privileged location with all amenities for a perfect stay in Jesolo.',
    it: 'Posizione privilegiata con tutti i comfort per un soggiorno perfetto a Jesolo.'
  },
  prices: {
    double: 80
  },
  discountCode: 'BODA-IRENE-MARCO',
  bookingUrl: 'https://www.hotel-atlantico.it/'
}, {
  id: 'casablanca',
  name: 'Hotel Casablanca',
  image: hotelCasablancaImg,
  description: {
    es: 'Excelente relación calidad-precio con opción de habitaciones triples, perfecto para grupos.',
    en: 'Excellent value for money with triple room option, perfect for groups.',
    it: 'Ottimo rapporto qualità-prezzo con opzione camere triple, perfetto per gruppi.'
  },
  prices: {
    double: 70,
    triple: 105
  },
  discountCode: 'BODA-IRENE-MARCO',
  bookingUrl: 'https://casablancajesolo.it/'
}];

// ============================================
// COMPONENT
// ============================================

const TravelSection = () => {
  const {
    t,
    i18n
  } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  });
  const lang = i18n.language as 'es' | 'en' | 'it';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (code: string, hotelId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(hotelId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  return <section id="travel" ref={ref} className="section-padding bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8
      }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-primary/50 text-xs">✦</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4 font-sans">
            {t('sections.travel.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.travel.subtitle')}
          </p>
        </motion.div>

        {/* HOW TO ARRIVE - Transport Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        delay: 0.2,
        duration: 0.8
      }} className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Plane className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-2xl md:text-3xl text-foreground">
              {t('sections.travel.howToArrive')}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {airports.map((airport, index) => <motion.div key={airport.id} initial={{
            opacity: 0,
            y: 20
          }} animate={isInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            delay: 0.3 + index * 0.1,
            duration: 0.6
          }} className="bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-serif text-xl text-foreground mb-1">
                      {airport.name}
                    </h4>
                    <span className="font-body text-sm text-muted-foreground">
                      {airport.code} · {airport.distance} {t('sections.travel.fromAirport')}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <p className="font-body text-foreground/80 mb-6 leading-relaxed">
                  {airport.description[lang]}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="default" className="flex-1 gap-2" onClick={() => window.open(airport.mapsUrl, '_blank')}>
                    <MapPin className="w-4 h-4" />
                    {t('sections.travel.viewRoute')}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => window.open(airport.busUrl, '_blank')}>
                    <Bus className="w-4 h-4" />
                    {t('sections.travel.busSchedules')}
                  </Button>
                </div>
              </motion.div>)}
          </div>
        </motion.div>

        {/* WHERE TO STAY - Hotels Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        delay: 0.4,
        duration: 0.8
      }}>
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-2xl md:text-3xl text-foreground">
              {t('sections.travel.whereToStay')}
            </h3>
          </div>

          {/* Hotel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => <motion.div key={hotel.id} initial={{
            opacity: 0,
            scale: 0.95
          }} animate={isInView ? {
            opacity: 1,
            scale: 1
          } : {}} transition={{
            delay: 0.5 + index * 0.1,
            duration: 0.5
          }} className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all group">
                {/* Hotel Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Hotel Info */}
                <div className="p-5">
                  <h4 className="font-serif text-lg text-foreground mb-3">
                    {hotel.name}
                  </h4>

                  <p className="font-body text-sm text-foreground/70 mb-4 leading-relaxed">
                    {hotel.description[lang]}
                  </p>

                  {/* Prices */}
                  <div className="mb-4 space-y-1">
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-foreground/80">{t('sections.travel.priceDouble')}</span>
                      <span className="font-semibold text-foreground">{hotel.prices.double}€{t('sections.travel.perNight')}</span>
                    </div>
                    {hotel.prices.triple && <div className="flex items-center justify-between font-body text-sm">
                        <span className="text-foreground/80">{t('sections.travel.priceTriple')}</span>
                        <span className="font-semibold text-foreground">{hotel.prices.triple}€{t('sections.travel.perNight')}</span>
                      </div>}
                  </div>

                  {/* Discount Code */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                    <code className="font-mono text-sm font-semibold text-primary truncate">
                      {hotel.discountCode}
                    </code>
                    <button onClick={() => handleCopy(hotel.discountCode, hotel.id)} className="ml-auto flex-shrink-0 p-1.5 rounded-md hover:bg-primary/10 transition-colors" title={t('sections.travel.copyCode')}>
                      {copiedId === hotel.id ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-primary" />}
                    </button>
                  </div>

                  {/* Book Button */}
                  <Button variant="outline" className="w-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => window.open(hotel.bookingUrl, '_blank')}>
                    {t('sections.travel.bookNow')}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </section>;
};
export default TravelSection;