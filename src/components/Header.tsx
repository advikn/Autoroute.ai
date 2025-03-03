import React, { useState } from 'react';
import { BarChart3, Zap, Router, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CostOptimizationModal from './modals/CostOptimizationModal';
import IntelligentRoutingModal from './modals/IntelligentRoutingModal';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const [showCostModal, setShowCostModal] = useState(false);
  const [showRoutingModal, setShowRoutingModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="glassmorphism-dark py-4 px-4 md:px-6 sticky top-0 z-10">
        <div className="container mx-auto">
          <motion.div 
            className="flex items-center justify-between px-2 sm:px-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <Router className="mr-2 text-[#1DB954]" size={24} />
              <h1 className="text-lg sm:text-xl font-bold">The LLM Project</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.button 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoutingModal(true)}
              >
                <BarChart3 className="mr-2 text-[#1DB954]" size={16} />
                <span className="text-sm">Intelligent Routing</span>
              </motion.button>
              <motion.button 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCostModal(true)}
              >
                <Zap className="mr-2 text-[#1DB954]" size={16} />
                <span className="text-sm">Cost Optimization</span>
              </motion.button>
              <motion.button
                className="flex items-center cursor-pointer p-2 rounded-full hover:bg-opacity-70"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? ( 
                  <Sun size={20} className="text-[#1DB954]" />
                ) : (
                  <Moon size={20} className="text-[#1DB954]" />
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <motion.button
                className="p-2 rounded-full hover:bg-opacity-70"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-[#1DB954]" />
                ) : (
                  <Moon size={20} className="text-[#1DB954]" />
                )}
              </motion.button>
              <motion.button
                className="p-2 ml-2 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-[#1DB954]" />
                ) : (
                  <Menu size={24} className="text-[#1DB954]" />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-[72px] left-0 right-0 z-20 glassmorphism-dark py-4 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              <motion.button 
                className="flex items-center cursor-pointer py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowRoutingModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                <BarChart3 className="mr-3 text-[#1DB954]" size={20} />
                <span>Intelligent Routing</span>
              </motion.button>
              <motion.button 
                className="flex items-center cursor-pointer py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowCostModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Zap className="mr-3 text-[#1DB954]" size={20} />
                <span>Cost Optimization</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals rendered at the root level to avoid z-index issues */}
      {showCostModal && (
        <CostOptimizationModal onClose={() => setShowCostModal(false)} />
      )}

      {showRoutingModal && (
        <IntelligentRoutingModal onClose={() => setShowRoutingModal(false)} />
      )}
    </>
  );
};

export default Header;