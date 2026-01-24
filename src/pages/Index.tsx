import { useTranslation } from 'react-i18next';
import Navbar from '@/components/wedding/Navbar';
import Hero from '@/components/wedding/Hero';
import Section from '@/components/wedding/Section';
import TravelSection from '@/components/wedding/TravelSection';
import RSVPSection from '@/components/wedding/RSVPSection';
import MusicSection from '@/components/wedding/MusicSection';
import Footer from '@/components/wedding/Footer';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* La Boda Section */}
      <Section
        id="wedding"
        title={t('sections.wedding.title')}
        subtitle={t('sections.wedding.subtitle')}
        description={t('sections.wedding.description')}
      />

      {/* Viaje & Hoteles Section */}
      <TravelSection />

      {/* RSVP Section */}
      <RSVPSection />

      {/* Música Section */}
      <MusicSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
