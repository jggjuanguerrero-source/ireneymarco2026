import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const IBAN = 'DE74 7004 0048 0550 1671 00';

const GiftSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = IBAN.replace(/\s/g, '');
    let success = false;

    // Primary: modern Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        // fall through to legacy method
      }
    }

    // Fallback: execCommand (works everywhere including GitHub Pages)
    if (!success) {
      try {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        success = document.execCommand('copy');
        document.body.removeChild(el);
      } catch {
        // nothing more we can do
      }
    }

    if (success) {
      window.umami?.track('gift_iban_copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section id="gift" ref={ref} className="section-padding bg-secondary/80">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-primary/50 text-xs">✦</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4">
            {t('sections.gift.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.gift.subtitle')}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-background border border-border rounded-xl p-8 md:p-10 text-center space-y-8 shadow-sm"
        >
          {/* Message */}
          <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl mx-auto">
            {t('sections.gift.message')}
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto" />

          {/* IBAN */}
          <div className="space-y-3">
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
              {t('sections.gift.ibanLabel')}
            </p>

            <div className="flex flex-col items-center gap-3">
              <span className="font-serif text-[clamp(0.9rem,4vw,1.5rem)] tracking-wider md:tracking-widest text-foreground select-all whitespace-nowrap">
                {IBAN}
              </span>

              <button
                onClick={handleCopy}
                className="relative flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 rounded-full text-xs font-body text-primary/70 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                aria-label={t('sections.gift.copyLabel')}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="flex items-center gap-1.5 text-primary"
                    >
                      <Check className="w-3 h-3" />
                      {t('sections.gift.copiedLabel')}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      {t('sections.gift.copyLabel')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftSection;
