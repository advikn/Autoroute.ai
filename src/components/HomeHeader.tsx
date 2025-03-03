import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Router, Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const HomeHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? `py-2 sm:py-3 backdrop-blur-sm border-b border-[var(--border-color)] ${
            theme === 'dark' ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-80'
          }` 
        : 'py-3 sm:py-5 bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-lg sm:text-xl">The LLM Project</span>
          </Link>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <motion.button
              className={`p-2 rounded-md ${
                theme === 'dark' ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5f5]'
              }`}
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-[var(--primary)]" />
              ) : (
                <Moon size={20} className="text-[var(--primary)]" />
              )}
            </motion.button>
            
            <motion.button
              className="p-2 ml-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-[var(--primary)]" />
              ) : (
                <Menu size={20} className="text-[var(--primary)]" />
              )}
            </motion.button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <motion.button
              className={`p-2 rounded-md ${
                theme === 'dark' ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5f5]'
              }`}
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-[var(--primary)]" />
              ) : (
                <Moon size={20} className="text-[var(--primary)]" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-[60px] left-0 right-0 z-20 border-b border-[var(--border-color)]"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)'
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-4">
              <Link 
                to="/chat" 
                className="btn btn-primary rounded-md flex items-center justify-center mb-4 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Try it now
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HomeHeader;