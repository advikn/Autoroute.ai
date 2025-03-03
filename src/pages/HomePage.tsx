import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileWarning from '../components/MobileWarning';
import { 
  ArrowRight, 
  Router, 
  X,
  BarChart,
  Zap,
  Shield,
  Star,
} from 'lucide-react';
import HomeHeader from '../components/HomeHeader';
import InteractiveBackground from '../components/InteractiveBackground';
import TypewriterEffect from '../components/TypewriterEffect';
import CostOptimizationModal from '../components/modals/CostOptimizationModal';
import IntelligentRoutingModal from '../components/modals/IntelligentRoutingModal';
import LLMOrchestrationAnimation from '../components/LLMOrchestrationAnimation';
import TieredModelSelector from '../components/TieredModelSelector';
import { availableModels } from '../data/models';
import ModelLogo from '../components/ModelLogo';
import { useTheme } from '../context/ThemeContext';

const HomePage: React.FC = () => {
  const [showCostModal, setShowCostModal] = useState(false);
  const [showRoutingModal, setShowRoutingModal] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedModel = selectedModelId ? availableModels.find(m => m.id === selectedModelId) : null;

  // Check if device is mobile on mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setShowMobileWarning(true);
      document.body.style.overflow = 'hidden';
    }
    
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;
      setShowMobileWarning(isMobileNow);
      document.body.style.overflow = isMobileNow ? 'hidden' : '';
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, []);

  // Load saved model preference from localStorage
  useEffect(() => {
    const savedModelId = localStorage.getItem('selectedModelId');
    if (savedModelId && availableModels.some(m => m.id === savedModelId)) {
      setSelectedModelId(savedModelId);
    }
  }, []);

  // Save model preference to localStorage when it changes
  useEffect(() => {
    if (selectedModelId) {
      localStorage.setItem('selectedModelId', selectedModelId);
    }
  }, [selectedModelId]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      setIsSubmitting(true);
      
      // Navigate to chat page with model selection and prompt
      navigate('/chat', { 
        state: { 
          initialPrompt: promptInput,
          selectedModelId: selectedModelId
        } 
      });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Show model selector on '/' at start of line
    if (e.key === '/' && !showModelSelector && promptInput === '') {
      e.preventDefault();
      setShowModelSelector(true);
      return;
    }
    
    // Handle escape to close model selector
    if (e.key === 'Escape' && showModelSelector) {
      setShowModelSelector(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPromptInput(newValue);
    
    // Show model selector when typing '/' at the start of input
    if (newValue === '/') {
      setShowModelSelector(true);
    }
  };

  const handleModelSelect = (modelId: string) => {
    // Remove the '/' character if it was added
    setPromptInput(promptInput.replace('/', ''));
    setSelectedModelId(modelId);
    setShowModelSelector(false);
    
    // Set focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Words to cycle through in the typewriter effect
  const typewriterWords = [
    "Enterprises",
    "Small Businesses",
    "Startups",
    "Individuals",
    "Creatives",
    "Change Makers"
  ];

  // Helper function for tier badges
  const getTierBadge = (tier: 'low' | 'medium' | 'flagship') => {
    switch (tier) {
      case 'low':
        return (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30">
            <Zap size={12} className="text-green-500" />
            <span className="text-green-500 font-medium">Basic</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30">
            <Star size={12} className="text-blue-500" />
            <span className="text-blue-500 font-medium">Standard</span>
          </div>
        );
      case 'flagship':
        return (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-30">
            <Shield size={12} className="text-purple-500" />
            <span className="text-purple-500 font-medium">Premium</span>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-app relative ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Mobile Warning */}
      <AnimatePresence>
        {showMobileWarning && (
          <MobileWarning showCloseButton={false} />
        )}
      </AnimatePresence>
      
      {/* Interactive Background */}
      <InteractiveBackground sensitivity={0.08} />
      
      <HomeHeader />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 relative overflow-hidden min-h-screen flex items-center justify-center">
          <div className="container relative z-10 px-4 flex items-center justify-center">
            <div className="max-w-4xl w-full text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4"
              >
                We're building the next-gen LLM Orchestration for{' '}
                <TypewriterEffect words={typewriterWords} delay={3000} />
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[var(--text-secondary)] text-lg sm:text-xl max-w-3xl mx-auto"
              >
                The LLM Project is revolutionizing LLM routing
              </motion.p>
              
              <motion.div 
                className="max-w-2xl mt-8 sm:mt-16 relative mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handlePromptSubmit} className="relative">
                  <div className={`flex items-center border border-[var(--border-color)] rounded-md p-2 input-container input-glow ${
                    theme === 'dark' ? 'bg-[#121212]' : 'bg-white shadow-sm'
                  } ${isSubmitting ? 'opacity-50' : ''}`}>
                    <input 
                      ref={inputRef}
                      type="text" 
                      className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm sm:text-base transition-colors"
                      placeholder="Ask anything... (or type / to select a model)"
                      value={promptInput}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      disabled={isSubmitting}
                    />
                    {selectedModel && (
                      <motion.div 
                        className="flex items-center gap-2 px-2 py-1 mr-2 rounded-md border border-[var(--border-color)] hover:border-[var(--primary)] transition-all"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          <ModelLogo 
                            modelName={selectedModel.name} 
                            size={18} 
                          />
                        </div>
                        <span className="text-xs text-[var(--text-primary)]">
                          {selectedModel.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedModelId(null);
                          }}
                          className="ml-1 p-0.5 rounded-full hover:bg-[var(--border-color)] hover:bg-opacity-20 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    )}
                    <button 
                      type="submit"
                      className="bg-[var(--primary)] text-[var(--bg-dark)] rounded-md p-2 hover:bg-[var(--primary-light)] transition-all hover:shadow-md"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="w-[18px] h-[18px] border-2 border-[var(--bg-dark)] border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </button>
                  </div>
                  
                  {/* Model Selector Dropdown */}
                  <AnimatePresence>
                    {showModelSelector && (
                      <motion.div 
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TieredModelSelector
                          selectedModelId={selectedModelId}
                          setSelectedModelId={handleModelSelect}
                          onClose={() => setShowModelSelector(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.button 
                  className="group px-5 sm:px-6 py-2.5 sm:py-3 text-sm rounded-lg border border-[var(--border-color)] hover:border-[var(--primary)] bg-transparent transition-all flex items-center justify-center font-medium"
                  onClick={() => setShowRoutingModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BarChart size={18} className="mr-2 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">Learn about Routing</span>
                </motion.button>
                
                <motion.button 
                  className="group px-5 sm:px-6 py-2.5 sm:py-3 text-sm rounded-lg border border-[var(--border-color)] hover:border-[var(--primary)] bg-transparent transition-all flex items-center justify-center font-medium"
                  onClick={() => setShowCostModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap size={18} className="mr-2 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">Cost Optimization</span>
                </motion.button>
              </motion.div>
              
              {/* Tier-based model display */}
              <motion.div 
                className="mt-16 max-w-7xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">Available Models by Tier</h2>
                
                {/* Premium/Flagship Tier */}
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center gap-2">
                      {getTierBadge('flagship')}
                      <span className="text-sm text-[var(--text-secondary)]">Premium Models</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {availableModels
                      .filter(model => model.tier === 'flagship')
                      .map((model) => (
                        <motion.div
                          key={model.id}
                          className={`flex flex-col items-center p-4 rounded-xl ${
                            selectedModelId === model.id 
                              ? `${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} border border-[var(--primary)]` 
                              : `border border-transparent hover:${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`
                          } backdrop-blur-sm ${
                            theme === 'dark' ? 'bg-[#111]/50' : 'bg-white/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedModelId(model.id);
                            if (inputRef.current) inputRef.current.focus();
                          }}
                        >
                          <div className="relative">
                            <ModelLogo modelName={model.name} size={40} />
                          </div>
                          <h3 className="mt-3 text-sm font-medium tracking-tight text-center w-full truncate px-2">{model.name}</h3>
                          <p className="mt-1 text-xs text-[var(--text-secondary)] opacity-80 text-center w-full truncate px-2">{model.provider}</p>
                          <div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-[var(--border-color)] bg-opacity-10 text-[var(--text-secondary)]">
                            ${(model.costPerInputToken * 1000).toFixed(5)}/1K
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
                
                {/* Standard/Medium Tier */}
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-4">
                    {getTierBadge('medium')}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {availableModels
                      .filter(model => model.tier === 'medium')
                      .map((model) => (
                        <motion.div
                          key={model.id}
                          className={`flex flex-col items-center p-4 rounded-xl ${
                            selectedModelId === model.id 
                              ? 'ring-1 ring-[var(--primary)]' 
                              : 'border border-[var(--border-color)] hover:border-[var(--primary)] hover:border-opacity-50'
                          } backdrop-blur-sm ${
                            theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedModelId(model.id);
                            if (inputRef.current) inputRef.current.focus();
                          }}
                        >
                          <div className="relative">
                            <ModelLogo modelName={model.name} size={40} />
                            <div 
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-blue-500 bg-blue-500 bg-opacity-10"
                            >
                              <Star size={12} className="text-blue-500" />
                            </div>
                          </div>
                          <h3 className="mt-3 text-sm font-medium text-center">{model.name}</h3>
                          <p className="mt-1 text-xs text-[var(--text-secondary)] text-center">{model.provider}</p>
                          <div className="mt-2 text-[10px] px-2 py-1 rounded-full border border-[var(--border-color)] text-[var(--text-primary)]">
                            ${(model.costPerInputToken * 1000).toFixed(5)}/1K
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
                
                {/* Basic/Low Tier */}
                <div>
                  <div className="flex items-center justify-center mb-4">
                    {getTierBadge('low')}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {availableModels
                      .filter(model => model.tier === 'low')
                      .map((model) => (
                        <motion.div
                          key={model.id}
                          className={`flex flex-col items-center p-4 rounded-xl ${
                            selectedModelId === model.id 
                              ? 'ring-1 ring-[var(--primary)]' 
                              : 'border border-[var(--border-color)] hover:border-[var(--primary)] hover:border-opacity-50'
                          } backdrop-blur-sm ${
                            theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedModelId(model.id);
                            if (inputRef.current) inputRef.current.focus();
                          }}
                        >
                          <div className="relative">
                            <ModelLogo modelName={model.name} size={40} />
                            <div 
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-green-500 bg-green-500 bg-opacity-10"
                            >
                              <Zap size={12} className="text-green-500" />
                            </div>
                          </div>
                          <h3 className="mt-3 text-sm font-medium text-center">{model.name}</h3>
                          <p className="mt-1 text-xs text-[var(--text-secondary)] text-center">{model.provider}</p>
                          <div className="mt-2 text-[10px] px-2 py-1 rounded-full border border-[var(--border-color)] text-[var(--text-primary)]">
                            ${(model.costPerInputToken * 1000).toFixed(5)}/1K
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Modals */}
        {showCostModal && (
          <CostOptimizationModal onClose={() => setShowCostModal(false)} />
        )}

        {showRoutingModal && (
          <IntelligentRoutingModal onClose={() => setShowRoutingModal(false)} />
        )}
      </main>
    </div>
  );
};

export default HomePage;