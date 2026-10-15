import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Camera, UploadCloud, ShieldCheck, Sparkles } from 'lucide-react';
import Section from './Section';

const UPLOAD_URL = 'https://weduploader.com/upload/Fc8HB8Hjb5O0qu14';

const PhotosSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    { icon: UploadCloud, text: t('sections.photos.feature1') },
    { icon: ShieldCheck, text: t('sections.photos.feature2') },
    { icon: Sparkles, text: t('sections.photos.feature3') },
  ];

  return (
    <div ref={ref}>
      <Section
        id="photos"
        title={t('sections.photos.title')}
        subtitle={t('sections.photos.subtitle')}
        description={t('sections.photos.description')}
        variant="alternate"
      >
        <div className="max-w-xl mx-auto bg-background border border-border rounded-xl p-8 md:p-10 shadow-sm space-y-6">
          <ul className="space-y-4 text-left">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-start gap-3 font-body text-sm md:text-base text-foreground/80"
              >
                <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-3 pt-2">
            <motion.a
              href={UPLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.umami?.track('photos_upload_click')}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
            >
              <Camera className="w-4 h-4" />
              {t('sections.photos.cta')}
            </motion.a>
            <p className="font-body italic text-sm text-muted-foreground">
              {t('sections.photos.ctaNote')}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PhotosSection;
