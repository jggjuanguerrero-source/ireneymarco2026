import { useTranslation } from 'react-i18next';
import Navbar from '@/components/wedding/Navbar';
import Hero from '@/components/wedding/Hero';
import Section from '@/components/wedding/Section';
import TravelSection from '@/components/wedding/TravelSection';
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

      {/* Viaje & Hoteles Section - Custom Component */}
      <TravelSection />

      {/* RSVP Section */}
      <Section
        id="rsvp"
        title={t('sections.rsvp.title')}
        subtitle={t('sections.rsvp.subtitle')}
        description={t('sections.rsvp.description')}
      />

      {/* Música Section */}
      <Section
        id="music"
        title={t('sections.music.title')}
        subtitle={t('sections.music.subtitle')}
        description={t('sections.music.description')}
        variant="alternate"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
