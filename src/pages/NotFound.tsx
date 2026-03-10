import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const gondolaMessages = [
  "Esta góndola se ha perdido por los canales... 🛶",
  "Ni el gondolero más experto encontraría esta página... 🇮🇹",
  "¿Seguro que no te has caído al canal? 💦",
  "Houston... digo, Venezia, tenemos un problema 🍝",
  "Marco Polo exploró medio mundo, pero esta URL no existe 🗺️",
];

const NotFound = () => {
  const location = useLocation();
  const [message] = useState(
    () => gondolaMessages[Math.floor(Math.random() * gondolaMessages.length)]
  );

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Animated water waves */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
          style={{
            background: "linear-gradient(to top, hsl(var(--primary) / 0.3), transparent)",
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 opacity-15"
          style={{
            background: "linear-gradient(to top, hsl(var(--primary) / 0.4), transparent)",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Gondola emoji floating */}
      <motion.div
        className="text-7xl mb-2"
        animate={{
          y: [0, -12, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🛶
      </motion.div>

      {/* 404 number */}
      <motion.h1
        className="text-[8rem] sm:text-[10rem] font-bold leading-none text-primary/20 select-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
      >
        404
      </motion.h1>

      {/* Fun message */}
      <motion.p
        className="text-xl sm:text-2xl text-foreground/80 text-center max-w-md mb-2 -mt-4"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>

      {/* Attempted path */}
      <motion.code
        className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {location.pathname}
      </motion.code>

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
        >
          🏠 Volver a la invitación
        </Link>
      </motion.div>

      {/* Cheeky footer */}
      <motion.p
        className="absolute bottom-6 text-xs text-muted-foreground/60 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        (La boda sigue en pie, tranquilo/a 😅)
      </motion.p>
    </div>
  );
};

export default NotFound;
