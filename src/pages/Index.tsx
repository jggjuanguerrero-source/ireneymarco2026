import { useTranslation } from 'react-i18next';
import Navbar from '@/components/wedding/Navbar';
import Hero from '@/components/wedding/Hero';
import OurStorySection from '@/components/wedding/OurStorySection';
import WeddingSection from '@/components/wedding/WeddingSection';
import PreWeddingSection from '@/components/wedding/PreWeddingSection';
import TravelSection from '@/components/wedding/TravelSection';
import GettingThereSection from '@/components/wedding/GettingThereSection';
import RSVPSection from '@/components/wedding/RSVPSection';
import GiftSection from '@/components/wedding/GiftSection';
import MusicSection from '@/components/wedding/MusicSection';
import Footer from '@/components/wedding/Footer';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <OurStorySection />
      <WeddingSection />
      <PreWeddingSection />
      <GettingThereSection />
      <TravelSection />
      <RSVPSection />
      <GiftSection />
      <MusicSection />
      <Footer />
    </div>
  );
};

export default Index;
