import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import VenetianOrnament from './VenetianOrnament';

interface SectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  children?: React.ReactNode;
  variant?: 'default' | 'alternate';
}

const Section = ({ id, title, subtitle, description, children, variant = 'default' }: SectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id={id}
      ref={ref}
      className={`section-padding ${variant === 'alternate' ? 'bg-secondary/30' : 'bg-background'}`}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <VenetianOrnament size="sm" className="mx-auto mb-12" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4"
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-body text-lg md:text-xl text-muted-foreground mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-24 h-px bg-primary/40 mx-auto mb-8"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-body text-base md:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Custom content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Section;
