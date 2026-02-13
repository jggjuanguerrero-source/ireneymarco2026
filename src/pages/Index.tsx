import { useTranslation } from 'react-i18next';
import Navbar from '@/components/wedding/Navbar';
import Hero from '@/components/wedding/Hero';
import WeddingSection from '@/components/wedding/WeddingSection';
import PreWeddingSection from '@/components/wedding/PreWeddingSection';
import TravelSection from '@/components/wedding/TravelSection';
import RSVPSection from '@/components/wedding/RSVPSection';
import MusicSection from '@/components/wedding/MusicSection';
import SeatFinderSection from '@/components/wedding/SeatFinderSection';
import Footer from '@/components/wedding/Footer';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <WeddingSection />
      <PreWeddingSection />
      <TravelSection />
      <RSVPSection />
      <SeatFinderSection />
      <MusicSection />
      <Footer />
    </div>
  );
};

export default Index;
