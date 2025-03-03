import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
  words: string[];
  delay?: number;
  className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  words, 
  delay = 2000,
  className = ''
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const period = 2000;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const tick = () => {
      const fullText = words[currentWordIndex];
      
      if (isDeleting) {
        // When deleting, remove one character
        setText(prev => prev.substring(0, prev.length - 1));
        // Speed up deletion slightly
        setDelta(150);
      } else {
        // When typing, add one character
        setText(prev => fullText.substring(0, prev.length + 1));
        // Slow down typing slightly for more natural effect
        setDelta(200 - Math.random() * 100);
      }

      // Logic for transitioning between typing and deleting
      if (!isDeleting && text === fullText) {
        // Word is complete, wait before deleting
        setDelta(period);
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        // Word is deleted, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
        // Small pause before typing next word
        setDelta(500);
      }
    };

    timeoutRef.current = setTimeout(tick, delta);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delta, isDeleting, currentWordIndex, words]);

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        className="text-[var(--primary)]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {text}
      </motion.span>
      <motion.span 
        className="inline-block w-[3px] h-[1em] bg-[var(--primary)] ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          repeatType: "loop",
          ease: "linear"
        }}
      />
    </span>
  );
};

export default TypewriterEffect;