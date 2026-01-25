import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const WEDDING_DATE = new Date('2026-10-10T12:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: t('countdown.days') },
    { value: timeLeft.hours, label: t('countdown.hours') },
    { value: timeLeft.minutes, label: t('countdown.minutes') },
    { value: timeLeft.seconds, label: t('countdown.seconds') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8"
    >
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center">
          <div className="text-center">
            <motion.div
              key={unit.value}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-strong leading-none font-light"
            >
              {unit.value.toString().padStart(2, '0')}
            </motion.div>
            <p className="font-body italic text-xs md:text-sm tracking-widest text-foreground/70 mt-2 lowercase">
              {unit.label}
            </p>
          </div>

          {/* Separator colon (not after last item) */}
          {index < timeUnits.length - 1 && (
            <span className="ml-4 md:ml-6 lg:ml-8 font-serif text-2xl md:text-3xl lg:text-4xl text-primary/60 font-light">
              :
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default Countdown;
