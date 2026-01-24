import { motion } from 'framer-motion';

interface VenetianOrnamentProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const VenetianOrnament = ({ className = '', size = 'md' }: VenetianOrnamentProps) => {
  const sizeClasses = {
    sm: 'w-32 md:w-48',
    md: 'w-48 md:w-64 lg:w-80',
    lg: 'w-64 md:w-80 lg:w-96',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 400 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Central ornament with venetian filigree */}
        <g className="text-primary" fill="currentColor" opacity="0.7">
          {/* Left wing */}
          <path d="M0 40 Q50 40 80 35 Q100 32 120 35 Q140 40 160 38 Q180 35 200 40" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" />
          
          {/* Right wing (mirrored) */}
          <path d="M400 40 Q350 40 320 35 Q300 32 280 35 Q260 40 240 38 Q220 35 200 40" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" />
          
          {/* Left curls */}
          <circle cx="60" cy="38" r="4" opacity="0.5" />
          <circle cx="100" cy="34" r="3" opacity="0.4" />
          <circle cx="140" cy="36" r="3" opacity="0.4" />
          
          {/* Right curls (mirrored) */}
          <circle cx="340" cy="38" r="4" opacity="0.5" />
          <circle cx="300" cy="34" r="3" opacity="0.4" />
          <circle cx="260" cy="36" r="3" opacity="0.4" />
          
          {/* Central diamond */}
          <path d="M200 30 L210 40 L200 50 L190 40 Z" opacity="0.6" />
          
          {/* Inner diamond */}
          <path d="M200 34 L206 40 L200 46 L194 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
          
          {/* Decorative dots */}
          <circle cx="175" cy="40" r="2" opacity="0.5" />
          <circle cx="225" cy="40" r="2" opacity="0.5" />
          
          {/* Lower curves */}
          <path d="M50 42 Q100 50 150 45 Q175 43 200 45" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                fill="none" 
                opacity="0.4" />
          <path d="M350 42 Q300 50 250 45 Q225 43 200 45" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                fill="none" 
                opacity="0.4" />
        </g>
      </svg>
    </motion.div>
  );
};

export default VenetianOrnament;
