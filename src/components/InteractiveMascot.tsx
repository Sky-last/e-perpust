import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveMascotProps {
  isFocusEmail?: boolean;
  isFocusPassword?: boolean;
  showPassword?: boolean;
  emailLength?: number;
  isSuccess?: boolean;
}

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({
  isFocusEmail = false,
  isFocusPassword = false,
  showPassword = false,
  emailLength = 0,
  isSuccess = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Calculate eye movement offset based on typing length
  const eyeMoveX = isFocusEmail ? Math.min(10, Math.max(-10, (emailLength - 10) * 0.7)) : 0;
  const eyeMoveY = isFocusEmail ? 5 : 0;

  // Hand position state
  const getLeftHandProps = () => {
    if (isFocusPassword && !showPassword) {
      // Cover eyes completely
      return { x: 26, y: -48, rotate: 18, scale: 1.05 };
    }
    if (isFocusPassword && showPassword) {
      // Peek through fingers
      return { x: 12, y: -28, rotate: 8, scale: 1.02 };
    }
    if (isSuccess) {
      // Wave happily
      return { x: -10, y: -35, rotate: -25, scale: 1.1 };
    }
    return { x: 0, y: 0, rotate: 0, scale: 1 };
  };

  const getRightHandProps = () => {
    if (isFocusPassword && !showPassword) {
      // Cover eyes completely
      return { x: -26, y: -48, rotate: -18, scale: 1.05 };
    }
    if (isFocusPassword && showPassword) {
      // Peek through fingers
      return { x: -12, y: -28, rotate: -8, scale: 1.02 };
    }
    if (isSuccess) {
      // Wave happily
      return { x: 10, y: -35, rotate: 25, scale: 1.1 };
    }
    return { x: 0, y: 0, rotate: 0, scale: 1 };
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center -mb-6 z-20 pointer-events-none select-none">
      {/* Background Soft Glow */}
      <div className="absolute w-36 h-36 rounded-full bg-blue-500/20 blur-2xl animate-pulse -z-10" />

      {/* Interactive Mascot Canvas / SVG */}
      <div className="relative w-44 h-40 flex items-center justify-center">
        <svg
          viewBox="0 0 200 180"
          className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] overflow-visible"
        >
          <defs>
            {/* Bear Fur Gradient */}
            <linearGradient id="bearFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Inner Ear Gradient */}
            <linearGradient id="innerEar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            {/* Snout Gradient */}
            <linearGradient id="snoutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* EARS */}
          <motion.g
            animate={{
              rotate: isFocusEmail ? [0, -3, 0] : 0,
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {/* Left Ear */}
            <circle cx="50" cy="45" r="22" fill="url(#bearFur)" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="50" cy="45" r="13" fill="url(#innerEar)" opacity="0.85" />

            {/* Right Ear */}
            <circle cx="150" cy="45" r="22" fill="url(#bearFur)" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="150" cy="45" r="13" fill="url(#innerEar)" opacity="0.85" />
          </motion.g>

          {/* HEAD BASE */}
          <motion.ellipse
            cx="100"
            cy="90"
            rx="68"
            ry="60"
            fill="url(#bearFur)"
            stroke="#38bdf8"
            strokeWidth="2"
            animate={{
              scale: isSuccess ? [1, 1.05, 1] : 1,
              rotate: isSuccess ? [0, 3, -3, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* CHEEK BLUSH */}
          <circle cx="52" cy="102" r="10" fill="#f472b6" opacity="0.4" className="blur-[1px]" />
          <circle cx="148" cy="102" r="10" fill="#f472b6" opacity="0.4" className="blur-[1px]" />

          {/* EYES CONTAINER */}
          <g>
            {/* Left Eye White */}
            <ellipse cx="72" cy="80" rx="14" ry="16" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            {/* Right Eye White */}
            <ellipse cx="128" cy="80" rx="14" ry="16" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

            {/* PUPILS (Densitized & Moveable) */}
            {!isBlinking && (!isFocusPassword || showPassword) ? (
              <>
                {/* Left Pupil */}
                <motion.g
                  animate={{ x: eyeMoveX, y: eyeMoveY }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <circle cx="72" cy="81" r="7.5" fill="#0f172a" />
                  <circle cx="74.5" cy="78.5" r="2.5" fill="#ffffff" />
                  <circle cx="70" cy="83" r="1" fill="#ffffff" />
                </motion.g>

                {/* Right Pupil */}
                <motion.g
                  animate={{ x: eyeMoveX, y: eyeMoveY }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <circle cx="128" cy="81" r="7.5" fill="#0f172a" />
                  <circle cx="130.5" cy="78.5" r="2.5" fill="#ffffff" />
                  <circle cx="126" cy="83" r="1" fill="#ffffff" />
                </motion.g>
              </>
            ) : (
              // BLINKING / CLOSED EYES STATE
              <>
                <path d="M 60 82 Q 72 90 84 82" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <path d="M 116 82 Q 128 90 140 82" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* SNOUT & NOSE */}
          <ellipse cx="100" cy="105" rx="22" ry="16" fill="url(#snoutGrad)" />
          <path
            d="M 92 98 Q 100 93 108 98 Q 100 108 92 98 Z"
            fill="#0f172a"
          />

          {/* MOUTH */}
          {isSuccess ? (
            // Happy Smile
            <path d="M 90 110 Q 100 122 110 110" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            // Cute neutral mouth
            <path d="M 93 110 Q 100 114 107 110" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* SMART GLASSES */}
          <g opacity="0.9">
            <rect x="54" y="66" width="36" height="28" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <rect x="110" y="66" width="36" height="28" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="90" y1="78" x2="110" y2="78" stroke="#38bdf8" strokeWidth="2.5" />
          </g>

          {/* PAWS / HANDS (Interactive overlay that covers eyes when password is focused) */}
          {/* Left Paw */}
          <motion.g
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={getLeftHandProps()}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <ellipse cx="44" cy="142" rx="18" ry="16" fill="url(#bearFur)" stroke="#1e293b" strokeWidth="2" />
            <ellipse cx="44" cy="142" rx="10" ry="8" fill="url(#innerEar)" opacity="0.6" />
          </motion.g>

          {/* Right Paw */}
          <motion.g
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={getRightHandProps()}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <ellipse cx="156" cy="142" rx="18" ry="16" fill="url(#bearFur)" stroke="#1e293b" strokeWidth="2" />
            <ellipse cx="156" cy="142" rx="10" ry="8" fill="url(#innerEar)" opacity="0.6" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
};
