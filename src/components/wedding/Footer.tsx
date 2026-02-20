import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 md:py-16 bg-secondary/80">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="w-12 h-px bg-primary/40" />
          <span className="text-primary/50 text-xs">✦</span>
          <div className="w-12 h-px bg-primary/40" />
        </motion.div>

        {/* Monogram */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-script text-5xl md:text-6xl text-foreground mb-6"
        >
          I & M
        </motion.p>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body italic text-base tracking-widest text-muted-foreground"
        >
          {t('footer.madeWith')}
        </motion.p>

        {/* Year */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-body text-xs tracking-[0.3em] text-muted-foreground/60 mt-4"
        >
          2026
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
