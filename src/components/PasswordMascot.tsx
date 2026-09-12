import { motion, AnimatePresence } from 'framer-motion';

interface PasswordMascotProps {
  isPasswordVisible: boolean;
  size?: number;
}

export default function PasswordMascot({ isPasswordVisible, size = 80 }: PasswordMascotProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        y: isPasswordVisible ? 0 : [-2, 2, -2]
      }}
      transition={{
        scale: { duration: 0.6, ease: "backOut" },
        rotate: { duration: 0.6, ease: "backOut" },
        y: {
          duration: 2,
          repeat: isPasswordVisible ? 0 : Infinity,
          ease: "easeInOut"
        }
      }}
      className="inline-block"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Bear Face */}
        <circle cx="50" cy="50" r="35" fill="#4A90E2" />
        <circle cx="50" cy="50" r="33" fill="#5BA3FF" />
        
        {/* Left Ear */}
        <circle cx="25" cy="25" r="15" fill="#4A90E2" />
        <circle cx="25" cy="25" r="12" fill="#FF7BA9" />
        
        {/* Right Ear */}
        <circle cx="75" cy="25" r="15" fill="#4A90E2" />
        <circle cx="75" cy="25" r="12" fill="#FF7BA9" />
        
        {/* Eyes - Animated based on password visibility */}
        <AnimatePresence mode="wait">
          {isPasswordVisible ? (
            // Eyes closed (covering eyes with paws)
            <motion.g
              key="closed"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {/* Left paw covering eye */}
              <motion.ellipse 
                cx="38" 
                cy="45" 
                rx="10" 
                ry="12" 
                fill="#4A90E2"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <ellipse cx="38" cy="45" rx="7" ry="9" fill="#5BA3FF" />
              
              {/* Right paw covering eye */}
              <motion.ellipse 
                cx="62" 
                cy="45" 
                rx="10" 
                ry="12" 
                fill="#4A90E2"
                animate={{ rotate: [5, -5, 5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <ellipse cx="62" cy="45" rx="7" ry="9" fill="#5BA3FF" />
              
              {/* Closed eye lines (peek) */}
              <path d="M 33 45 Q 38 47 43 45" stroke="#2C3E50" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 57 45 Q 62 47 67 45" stroke="#2C3E50" strokeWidth="2" fill="none" strokeLinecap="round" />
            </motion.g>
          ) : (
            // Eyes open
            <motion.g
              key="open"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {/* Left Eye */}
              <circle cx="38" cy="45" r="8" fill="white" />
              <motion.circle 
                cx="40" 
                cy="45" 
                r="5" 
                fill="#2C3E50"
                animate={{ 
                  cx: [40, 42, 40],
                  cy: [45, 46, 45]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <circle cx="42" cy="43" r="2" fill="white" />
              
              {/* Right Eye */}
              <circle cx="62" cy="45" r="8" fill="white" />
              <motion.circle 
                cx="64" 
                cy="45" 
                r="5" 
                fill="#2C3E50"
                animate={{ 
                  cx: [64, 62, 64],
                  cy: [45, 46, 45]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <circle cx="66" cy="43" r="2" fill="white" />
            </motion.g>
          )}
        </AnimatePresence>
        
        {/* Snout */}
        <ellipse cx="50" cy="60" rx="12" ry="10" fill="white" />
        
        {/* Nose */}
        <motion.ellipse 
          cx="50" 
          cy="58" 
          rx="5" 
          ry="4" 
          fill="#2C3E50"
          animate={isPasswordVisible ? {} : { scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Mouth - Changes expression */}
        <AnimatePresence mode="wait">
          {isPasswordVisible ? (
            // Worried/shy expression
            <motion.g
              key="worried"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <path 
                d="M 50 62 Q 45 64 42 63" 
                stroke="#2C3E50" 
                strokeWidth="1.5" 
                fill="none" 
                strokeLinecap="round"
              />
              <path 
                d="M 50 62 Q 55 64 58 63" 
                stroke="#2C3E50" 
                strokeWidth="1.5" 
                fill="none" 
                strokeLinecap="round"
              />
            </motion.g>
          ) : (
            // Happy smile
            <motion.g
              key="happy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <path 
                d="M 50 62 Q 45 65 42 63" 
                stroke="#2C3E50" 
                strokeWidth="1.5" 
                fill="none" 
                strokeLinecap="round"
              />
              <path 
                d="M 50 62 Q 55 65 58 63" 
                stroke="#2C3E50" 
                strokeWidth="1.5" 
                fill="none" 
                strokeLinecap="round"
              />
            </motion.g>
          )}
        </AnimatePresence>
        
        {/* Cheek blush - More intense when eyes closed (embarrassed) */}
        <motion.circle 
          cx="30" 
          cy="55" 
          r="5" 
          fill="#FF7BA9" 
          animate={{ opacity: isPasswordVisible ? [0.6, 0.8, 0.6] : [0.3, 0.4, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="70" 
          cy="55" 
          r="5" 
          fill="#FF7BA9" 
          animate={{ opacity: isPasswordVisible ? [0.6, 0.8, 0.6] : [0.3, 0.4, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Arms/Paws on sides */}
        <circle cx="15" cy="50" r="10" fill="#4A90E2" />
        <circle cx="85" cy="50" r="10" fill="#4A90E2" />
        
        {/* Bottom paws */}
        <circle cx="38" cy="80" r="8" fill="#4A90E2" />
        <circle cx="62" cy="80" r="8" fill="#4A90E2" />
      </svg>
    </motion.div>
  );
}
