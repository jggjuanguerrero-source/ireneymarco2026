import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Plane, Bus, MapPin, ExternalLink, Star, Tag, Sparkles, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  stars: number;
  category: 'luxury' | 'smart' | 'budget';
  image: string;
  description: {
    es: string;
    en: string;
    it: string;
  };
  discountCode?: string;
  bookingUrl: string;
}

// AIRPORTS DATA - Edit this array to update airport info
const airports: Airport[] = [
  {
    id: 'marco-polo',
    name: 'Aeropuerto Marco Polo',
    code: 'VCE',
    description: {
      es: 'El aeropuerto principal de Venecia. Conexiones directas con vaporetto al centro histórico.',
      en: 'The main Venice airport. Direct vaporetto connections to the historic center.',
      it: 'L\'aeroporto principale di Venezia. Connessioni dirette con vaporetto al centro storico.',
    },
    distance: '13 km',
    mapsUrl: 'https://www.google.com/maps/dir//Venice+Marco+Polo+Airport,+Viale+Galileo+Galilei,+30173+Venezia+VE,+Italy/@45.5052917,12.3519661,17z',
    busUrl: 'https://www.atvo.it/en-venice-marco-polo-airport.html',
  },
  {
    id: 'treviso',
    name: 'Aeropuerto Treviso',
    code: 'TSF',
    description: {
      es: 'Aeropuerto secundario, ideal para vuelos low-cost. Autobús directo a Venecia (40 min).',
      en: 'Secondary airport, ideal for low-cost flights. Direct bus to Venice (40 min).',
      it: 'Aeroporto secondario, ideale per voli low-cost. Autobus diretto per Venezia (40 min).',
    },
    distance: '40 km',
    mapsUrl: 'https://www.google.com/maps/dir//Treviso+Airport,+Via+Noalese,+63,+31100+Treviso+TV,+Italy/@45.6484226,12.1944831,17z',
    busUrl: 'https://www.atvo.it/en-treviso-airport.html',
  },
];

// HOTELS DATA - Edit this array to update hotel recommendations
const hotels: Hotel[] = [
  // LUXURY CATEGORY
  {
    id: 'danieli',
    name: 'Hotel Danieli',
    stars: 5,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    description: {
      es: 'Palacio gótico del siglo XIV frente a San Marcos. Lujo veneciano auténtico para una experiencia inolvidable.',
      en: '14th-century Gothic palace facing St. Mark\'s. Authentic Venetian luxury for an unforgettable experience.',
      it: 'Palazzo gotico del XIV secolo di fronte a San Marco. Lusso veneziano autentico per un\'esperienza indimenticabile.',
    },
    discountCode: 'IRENEMARCO2026',
    bookingUrl: 'https://www.marriott.com/hotels/travel/vcedk-hotel-danieli-a-luxury-collection-hotel-venice/',
  },
  {
    id: 'gritti',
    name: 'The Gritti Palace',
    stars: 5,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    description: {
      es: 'Elegancia atemporal en el Gran Canal. Terraza con vistas espectaculares y servicio impecable.',
      en: 'Timeless elegance on the Grand Canal. Terrace with spectacular views and impeccable service.',
      it: 'Eleganza senza tempo sul Canal Grande. Terrazza con viste spettacolari e servizio impeccabile.',
    },
    bookingUrl: 'https://www.marriott.com/hotels/travel/vcegr-the-gritti-palace-a-luxury-collection-hotel/',
  },
  // SMART CHOICE CATEGORY
  {
    id: 'saturnia',
    name: 'Hotel Saturnia & International',
    stars: 4,
    category: 'smart',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    description: {
      es: 'A 2 minutos de San Marcos. Relación calidad-precio excepcional con encanto veneciano.',
      en: '2 minutes from St. Mark\'s. Exceptional value for money with Venetian charm.',
      it: 'A 2 minuti da San Marco. Rapporto qualità-prezzo eccezionale con fascino veneziano.',
    },
    discountCode: 'WEDDING10',
    bookingUrl: 'https://www.hotelsaturnia.it/',
  },
  {
    id: 'bonvecchiati',
    name: 'Hotel Bonvecchiati',
    stars: 4,
    category: 'smart',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    description: {
      es: 'Ubicación central perfecta. Habitaciones elegantes con todas las comodidades modernas.',
      en: 'Perfect central location. Elegant rooms with all modern amenities.',
      it: 'Posizione centrale perfetta. Camere eleganti con tutti i comfort moderni.',
    },
    bookingUrl: 'https://www.hotelbonvecchiati.it/',
  },
  // BUDGET / SQUAD CATEGORY
  {
    id: 'generator',
    name: 'Generator Venice',
    stars: 3,
    category: 'budget',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    description: {
      es: 'En la isla de Giudecca con vistas al skyline. Ambiente joven, bar en la azotea y buen rollo.',
      en: 'On Giudecca island with skyline views. Young vibe, rooftop bar and good vibes.',
      it: 'Sull\'isola della Giudecca con vista sullo skyline. Atmosfera giovane, bar sul tetto e buone vibes.',
    },
    discountCode: 'SQUAD15',
    bookingUrl: 'https://staygenerator.com/hostels/venice',
  },
  {
    id: 'we-crociferi',
    name: 'We Crociferi',
    stars: 3,
    category: 'budget',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    description: {
      es: 'Antiguo monasterio convertido en hostel de diseño. Arquitectura única y ambiente social.',
      en: 'Former monastery turned design hostel. Unique architecture and social atmosphere.',
      it: 'Ex monastero trasformato in ostello di design. Architettura unica e atmosfera sociale.',
    },
    bookingUrl: 'https://wecrociferi.com/',
  },
];

// ============================================
// COMPONENT
// ============================================

const categoryConfig = {
  luxury: {
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  smart: {
    icon: Heart,
    color: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  budget: {
    icon: Users,
    color: 'bg-sky-100 text-sky-700 border-sky-200',
  },
};

const TravelSection = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const lang = i18n.language as 'es' | 'en' | 'it';

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

        {/* HOW TO ARRIVE - Transport Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <Plane className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-2xl md:text-3xl text-foreground">
              {t('sections.travel.howToArrive')}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {airports.map((airport, index) => (
              <motion.div
                key={airport.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
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
                  <Button
                    variant="default"
                    className="flex-1 gap-2"
                    onClick={() => window.open(airport.mapsUrl, '_blank')}
                  >
                    <MapPin className="w-4 h-4" />
                    {t('sections.travel.viewRoute')}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => window.open(airport.busUrl, '_blank')}
                  >
                    <Bus className="w-4 h-4" />
                    {t('sections.travel.busSchedules')}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* WHERE TO STAY - Hotels Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-2xl md:text-3xl text-foreground">
              {t('sections.travel.whereToStay')}
            </h3>
          </div>

          {/* Category Groups */}
          {(['luxury', 'smart', 'budget'] as const).map((category, catIndex) => {
            const categoryHotels = hotels.filter(h => h.category === category);
            const config = categoryConfig[category];
            const Icon = config.icon;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + catIndex * 0.15, duration: 0.6 }}
                className="mb-10 last:mb-0"
              >
                {/* Category Label */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-body border ${config.color}`}>
                    <Icon className="w-4 h-4" />
                    {t(`sections.travel.categories.${category}`)}
                  </span>
                </div>

                {/* Hotel Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {categoryHotels.map((hotel, index) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6 + catIndex * 0.1 + index * 0.05, duration: 0.5 }}
                      className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all group"
                    >
                      {/* Hotel Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Stars overlay */}
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Hotel Info */}
                      <div className="p-5">
                        <h4 className="font-serif text-lg text-foreground mb-2">
                          {hotel.name}
                        </h4>

                        <p className="font-body text-sm text-foreground/70 mb-4 leading-relaxed">
                          {hotel.description[lang]}
                        </p>

                        {/* Discount Code */}
                        {hotel.discountCode && (
                          <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <Tag className="w-4 h-4 text-primary" />
                            <span className="font-body text-sm text-foreground/80">
                              {t('sections.travel.discountCode')}:
                            </span>
                            <code className="font-mono text-sm font-semibold text-primary">
                              {hotel.discountCode}
                            </code>
                          </div>
                        )}

                        {/* Book Button */}
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TravelSection;
