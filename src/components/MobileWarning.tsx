import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MobileWarningProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ onClose, showCloseButton = false }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`fixed inset-0 z-[9999] backdrop-blur-xl ${
        theme === 'dark' ? 'bg-black/90' : 'bg-white/90'
      } flex items-center justify-center p-6`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="max-w-md w-full text-center">
        <motion.div 
          className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 relative ${
            theme === 'dark'
              ? 'bg-[#1a1a1a] border-2 border-[var(--primary)]'
              : 'bg-[#f5f5f5] border-2 border-[var(--primary)]'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Monitor size={48} className="text-[var(--primary)] relative z-10" />
          
          {/* Animated glow effect */}
          <motion.div 
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.2), transparent 70%)`
            }}
          />
          
          {/* Animated particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[var(--primary)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-20, 20],
                x: [-20 + i * 20, 20 + i * 20]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Desktop Experience Only
        </motion.h2>
        
        <motion.p 
          className="text-[var(--text-secondary)] text-base leading-relaxed mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          This application is designed exclusively for desktop use. Please access it from a laptop or desktop computer for the full experience.
        </motion.p>
        
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >          
          {showCloseButton && (
            <motion.button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MobileWarning;