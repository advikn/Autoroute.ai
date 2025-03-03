import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, AlertCircle, Unlock, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InteractiveBackground from '../components/InteractiveBackground';
import SnakeGame from '../components/SnakeGame';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Start with unlocked state, then animate to locked
    setTimeout(() => setIsLocked(true), 500);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setIsUnlocking(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      {/* Theme Toggle */}
      <motion.button
        className={`fixed top-4 right-4 p-2 rounded-full z-20 ${
          theme === 'dark' 
            ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' 
            : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
        } border border-[var(--border-color)]`}
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Sun size={20} className="text-[var(--primary)]" />
        ) : (
          <Moon size={20} className="text-[var(--primary)]" />
        )}
      </motion.button>

      <InteractiveBackground sensitivity={0.08} />
      
      <div 
        ref={containerRef}
        className="w-full max-w-md mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-2xl border border-[var(--border-color)] relative overflow-hidden ${
            theme === 'dark' ? 'bg-black/50' : 'bg-white/50'
          } backdrop-blur-xl`}
        >
          {/* Glow effect */}
          <div 
            className="absolute pointer-events-none"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              width: '500px',
              height: '500px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--primary-rgb), 0) 70%)`,
              zIndex: 0
            }}
          />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <motion.div 
                className={`w-20 h-20 rounded-2xl flex items-center justify-center relative ${
                  theme === 'dark' 
                    ? 'bg-[#1a1a1a] border-2 border-[var(--primary)]' 
                    : 'bg-[#f5f5f5] border-2 border-[var(--primary)]'
                }`}
                initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
                animate={isUnlocking ? {
                  rotateY: [0, 180],
                  scale: [1, 1.2, 1.2, 0],
                  opacity: [1, 1, 1, 0],
                  y: [0, -20, -40, -60]
                } : isLocked ? {
                  rotateY: 0,
                  scale: 1,
                  opacity: 1
                } : {
                  rotateY: 180,
                  scale: 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.1,
                  times: isUnlocking ? [0, 0.3, 0.7, 1] : undefined,
                  ease: "easeInOut"
                }}
              >
                <AnimatePresence mode="wait">
                  {isUnlocking ? (
                    <motion.div
                      key="unlock"
                      initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1,
                        scale: 1,
                        rotate: [0, 360]
                      }}
                      exit={{ 
                        opacity: 0,
                        scale: 0.8,
                        y: -20
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Unlock size={40} className="text-[var(--primary)] relative z-10" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lock"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ 
                        opacity: 1,
                        rotateY: isLocked ? [180, 0] : 180,
                        scale: isLocked ? [0.8, 1.2, 1] : 1
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.8,
                        times: isLocked ? [0, 0.6, 1] : undefined,
                        ease: "easeInOut"
                      }}
                    >
                      <Lock size={40} className="text-[var(--primary)] relative z-10" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
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
            </div>

            <motion.h1 
              className="text-2xl font-bold text-center mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Private Beta Access
            </motion.h1>
            
            <motion.p 
              className="text-[var(--text-secondary)] text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Enter the password to continue
            </motion.p>

            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="relative"
              >
                <div className={`flex items-center border border-[var(--border-color)] rounded-lg p-2 mb-4 ${
                  error ? 'border-red-500' : ''
                } transition-colors relative group`}>
                  <Key size={20} className="text-[var(--text-secondary)] mr-2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className={`flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]`}
                    placeholder="Enter password"
                    autoFocus
                  />
                  
                  {/* Input glow effect */}
                  <div 
                    className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg ${
                      error 
                        ? 'bg-red-500/5' 
                        : 'bg-[var(--primary)]/5'
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-red-500 text-sm mb-4"
                    >
                      <AlertCircle size={16} className="mr-1" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="w-full bg-[var(--primary)] text-[var(--bg-dark)] rounded-lg p-3 font-medium hover:bg-[var(--primary-light)] transition-colors relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Continue</span>
                  
                  {/* Button hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'center' }}
                  />
                </motion.button>
              </motion.div>
            </form>
            
            <div className="mt-8">
              <SnakeGame />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;