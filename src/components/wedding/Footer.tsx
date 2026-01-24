import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import VenetianOrnament from './VenetianOrnament';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Ornament */}
        <VenetianOrnament size="sm" className="mx-auto mb-8" />

        {/* Monogram */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-script text-5xl md:text-6xl text-primary mb-6"
        >
          I & M
        </motion.p>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body text-sm tracking-widest text-muted-foreground"
        >
          {t('footer.madeWith')}
        </motion.p>

        {/* Year */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-xs tracking-[0.3em] text-muted-foreground/60 mt-4"
        >
          2026
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
