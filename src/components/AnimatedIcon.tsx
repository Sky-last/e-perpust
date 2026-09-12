import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedIconProps {
  src: string;
  alt: string;
  className?: string;
  size?: number;
  animation?: 'bounce' | 'wave' | 'pulse' | 'rotate' | 'float' | 'wiggle';
}

export default function AnimatedIcon({ 
  src, 
  alt, 
  className = '', 
  size = 48,
  animation = 'float' 
}: AnimatedIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const animations = {
    bounce: {
      initial: { y: 0 },
      animate: {
        y: [0, -15, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      hover: {
        scale: 1.2,
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.5 }
      }
    },
    wave: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 10, -10, 10, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      hover: {
        scale: 1.15,
        rotate: 360,
        transition: { duration: 0.6 }
      }
    },
    pulse: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      hover: {
        scale: 1.3,
        filter: "brightness(1.2)",
        transition: { duration: 0.3 }
      }
    },
    rotate: {
      initial: { rotate: 0 },
      animate: {
        rotate: 360,
        transition: {
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }
      },
      hover: {
        scale: 1.2,
        rotate: 720,
        transition: { duration: 0.8 }
      }
    },
    float: {
      initial: { y: 0 },
      animate: {
        y: [-5, 5, -5],
        rotate: [0, 2, 0, -2, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      hover: {
        scale: 1.15,
        y: -10,
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.4 }
      }
    },
    wiggle: {
      initial: { rotate: 0, x: 0 },
      animate: {
        rotate: [0, -5, 5, -5, 5, 0],
        x: [0, -2, 2, -2, 2, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 3
        }
      },
      hover: {
        scale: 1.2,
        rotate: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      }
    }
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={isHovered ? selectedAnimation.hover : selectedAnimation.animate}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`inline-block cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
}

// Komponen khusus untuk logo ikon buku perpustakaan (menggantikan bear mascot lama dengan icon_book.png)
export function BearMascotIcon({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [-2, 2, -2]
      }}
      transition={{
        scale: { duration: 0.5, ease: "backOut" },
        opacity: { duration: 0.4 },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{
        scale: 1.12,
        rotate: [0, -3, 3, -2, 0],
        transition: { duration: 0.4 }
      }}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/assets/icon/icon_book.png"
        alt="Logo Perpustakaan"
        className="w-full h-full object-contain rounded-full drop-shadow-md select-none pointer-events-none"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = './assets/icon/icon_book.png';
        }}
      />
    </motion.div>
  );
}

// Alias agar dapat diimport sebagai BookMascotIcon
export const BookMascotIcon = BearMascotIcon;

