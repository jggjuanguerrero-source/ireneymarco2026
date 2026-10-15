import { useTranslation } from 'react-i18next';
import Navbar from '@/components/wedding/Navbar';
import Hero from '@/components/wedding/Hero';
import PhotosSection from '@/components/wedding/PhotosSection';
import OurStorySection from '@/components/wedding/OurStorySection';
// Ocultas tras la boda: WeddingSection, PreWeddingSection, MusicSection
// Ocultas a 1 día de la boda: GettingThereSection, TravelSection, RSVPSection

import GiftSection from '@/components/wedding/GiftSection';
import Footer from '@/components/wedding/Footer';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div className="hidden md:block md:h-16 lg:h-24 bg-background" />
      <PhotosSection />
      <OurStorySection />
      {/* Ocultas tras la boda: WeddingSection, PreWeddingSection, MusicSection */}
      {/* Ocultas a 1 día de la boda: GettingThereSection, TravelSection, RSVPSection */}
      <GiftSection />
      <Footer />
    </div>
  );
};

export default Index;
