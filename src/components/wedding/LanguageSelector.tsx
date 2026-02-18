import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// SVG flags inline — no external assets needed, work perfectly on GitHub Pages
const FlagES = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 15" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="20" height="15" fill="#c60b1e"/>
    <rect y="3.75" width="20" height="7.5" fill="#ffc400"/>
  </svg>
);

const FlagEN = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const FlagIT = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="10" height="20" fill="#009246"/>
    <rect x="10" width="10" height="20" fill="#fff"/>
    <rect x="20" width="10" height="20" fill="#CE2B37"/>
  </svg>
);

const languages = [
  { code: 'es', label: 'ES', Flag: FlagES },
  { code: 'en', label: 'EN', Flag: FlagEN },
  { code: 'it', label: 'IT', Flag: FlagIT },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('wedding-language', code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <currentLang.Flag />
        <span className="font-body text-xs tracking-widest uppercase">{currentLang.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 py-1.5 bg-background rounded-lg shadow-lg border border-border z-20 min-w-[110px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-muted/50 transition-colors ${
                    lang.code === i18n.language ? 'text-primary' : 'text-foreground/70'
                  }`}
                >
                  <lang.Flag />
                  <span className="font-body text-xs tracking-widest uppercase">{lang.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
