import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Cpu, ArrowLeft, Sun, Moon, Square } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { availableModels } from '../data/models';
import ModelLogo from './ModelLogo';

interface InteractiveChatProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  children: React.ReactNode;
  selectionMode: 'auto' | 'manual';
  setSelectionMode: (mode: 'auto' | 'manual') => void;
  onBackClick: () => void;
  onThemeToggle: () => void;
  theme: 'dark' | 'light';
  onStop?: () => void;
  onModelSelect?: (modelId: string) => void;
}

const InteractiveChat: React.FC<InteractiveChatProps> = ({
  onSendMessage,
  isProcessing,
  children,
  selectionMode,
  setSelectionMode,
  onBackClick,
  onThemeToggle,
  theme,
  onStop,
  onModelSelect
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle cursor movement for glow effect
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
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage('');
      setShowModelSelector(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Show model selector on '/' at start of line
    if (e.key === '/' && !showModelSelector) {
      e.preventDefault();
      setShowModelSelector(true);
      return;
    }
    
    // Handle arrow keys for model selection
    if (showModelSelector) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = selectedModelId 
          ? availableModels.findIndex(m => m.id === selectedModelId)
          : -1;
        
        if (e.key === 'ArrowDown') {
          const nextIndex = currentIndex < availableModels.length - 1 ? currentIndex + 1 : 0;
          setSelectedModelId(availableModels[nextIndex].id);
        } else {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableModels.length - 1;
          setSelectedModelId(availableModels[prevIndex].id);
        }
      } else if (e.key === 'Enter' && selectedModelId) {
        e.preventDefault();
        handleModelSelect(selectedModelId);
      }
    }
    
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isProcessing) {
        onSendMessage(message);
        setMessage('');
        setShowModelSelector(false);
      }
    }
    
    // Close model selector on Escape
    if (e.key === 'Escape' && showModelSelector) {
      setShowModelSelector(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Show model selector only when typing '/' at the start of input
    if (newValue === '/') {
      setShowModelSelector(true);
    }
  };

  const handleModelSelect = (modelId: string) => {
    // Remove the '/' character if it was added
    setMessage(message.replace('/', ''));
    setSelectedModelId(modelId);
    if (onModelSelect) {
      onModelSelect(modelId);
    }
    setShowModelSelector(false);
    
    // Set focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);


  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-dark)] min-h-0"
    >
      {/* Header with navigation and mode selector */}
      <motion.div 
        className={`flex items-center justify-between p-3 sm:p-4 border-b border-[var(--border-color)] ${
          theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#F2F2F7]'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <motion.button
            onClick={onBackClick}
            className="flex items-center text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors mr-2 sm:mr-4 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to home"
          >
            <ArrowLeft size={16} className="mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Back</span>
          </motion.button>
          
          <h2 className="text-lg sm:text-xl font-bold">The LLM Project</h2>
        </div>
        
        <div className="flex items-center">
          <div className={`flex rounded-lg p-1 mr-2 sm:mr-3 ${
            theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f5f5f5]'
          }`}>
            <motion.button
              className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectionMode === 'auto' 
                  ? 'border border-[var(--text-primary)] text-[var(--text-primary)]' 
                  : 'text-[var(--text-secondary)]'
              }`}
              onClick={() => setSelectionMode('auto')}
              whileHover={{ scale: selectionMode !== 'auto' ? 1.05 : 1 }}
              whileTap={{ scale: selectionMode !== 'auto' ? 0.95 : 1 }}
            >
              <Sparkles size={12} className="mr-1 sm:mr-1.5" />
              <span>Auto</span>
            </motion.button>
            <motion.button
              className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectionMode === 'manual' 
                  ? 'border border-[var(--text-primary)] text-[var(--text-primary)]' 
                  : 'text-[var(--text-secondary)]'
              }`}
              onClick={() => {
                setSelectionMode('manual');
                setShowModelSelector(true);
              }}
              whileHover={{ scale: selectionMode !== 'manual' ? 1.05 : 1 }}
              whileTap={{ scale: selectionMode !== 'manual' ? 0.95 : 1 }}
            >
              <Cpu size={12} className="mr-1 sm:mr-1.5" />
              <span>Manual</span>
            </motion.button>
          </div>
          
          <motion.button
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5f5]'
            }`}
            onClick={onThemeToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-[var(--primary)]" />
            ) : (
              <Moon size={18} className="text-[var(--primary)]" />
            )}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Chat content area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 scroll-smooth relative flex flex-col">
        {children}
      </div>
      
      <motion.div
        className="flex-shrink-0 p-3 sm:p-4 border-t border-[var(--border-color)] bg-[var(--bg-dark)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        {isFocused && (
          <div 
            className="absolute pointer-events-none hidden sm:block"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--primary-rgb), 0) 70%)`,
              transform: 'translate(-50%, -50%)',
              zIndex: 0
            }}
          />
        )}
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className={`flex items-end gap-2 sm:gap-3 p-2 rounded-xl border ${
            isFocused 
              ? 'border-[var(--primary)] shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]' 
              : 'border-[var(--border-color)]'
          } transition-all relative ${
            theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#E5E5EA]'
          }`}>
            {/* Model Selector Dropdown */}
            <AnimatePresence>
              {showModelSelector && (
                <div className="absolute inset-0 z-50">
                  <div className="fixed inset-0 z-40" onClick={() => setShowModelSelector(false)} />
                  <motion.div 
                    className={`absolute bottom-full left-0 right-0 mb-2 p-2 rounded-lg border border-[var(--border-color)] z-50 shadow-xl ${
                      theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'
                    } max-h-[300px] overflow-y-auto backdrop-blur-sm ${
                      theme === 'dark' ? 'bg-opacity-95' : 'bg-opacity-95'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-xs text-[var(--text-secondary)] mb-3 px-2">
                      <kbd className="px-2 py-1 bg-[var(--border-color)] rounded text-[var(--text-primary)]">/</kbd>
                      <span className="ml-2">Select a model or type to filter</span>
                      <div className="mt-1 text-[var(--text-secondary)]">
                        <span className="mr-2">↑↓ to navigate</span>
                        <span className="mr-2">↵ to select</span>
                        <span>esc to close</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                    {availableModels.map((model) => (
                      <motion.button
                        key={model.id}
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-3 ${
                          selectedModelId === model.id
                            ? `border border-[var(--text-primary)] text-[var(--text-primary)]`
                            : `hover:border-[var(--text-primary)]`
                        } transition-colors`}
                        onClick={() => handleModelSelect(model.id)}
                        whileHover={{ x: 4 }}
                      >
                        <ModelLogo modelName={model.name} size={24} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{model.name}</div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {model.provider} • ${(model.costPerInputToken * 1000).toFixed(5)}/1K tokens
                          </div>
                        </div>
                        <div className="flex flex-col items-end text-xs text-[var(--text-secondary)]">
                          <div className="flex items-center">
                            <span className="mr-1">Reasoning</span>
                            <span className="font-medium">{model.capabilities.reasoning}/10</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">Speed</span>
                            <span className="font-medium">{Math.round((2000 - model.latency) / 200)}/10</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            
            <textarea
              ref={textareaRef}
              className={`w-full p-2 sm:p-3 rounded-lg resize-none outline-none ${
                theme === 'dark' 
                  ? isProcessing ? 'bg-[#1C1C1E]/50' : 'bg-[#1C1C1E]'
                  : isProcessing ? 'bg-[#E5E5EA]/50' : 'bg-[#E5E5EA]'
              } text-[var(--text-primary)] placeholder-[var(--text-secondary)] font-mono text-sm max-h-[200px]`}
              placeholder="Type your message... (Shift+Enter to send) or / to select model"
              rows={1}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isProcessing}
              style={{ cursor: isProcessing ? 'not-allowed' : 'text' }}
            />
            
            <AnimatePresence mode="wait">
              <motion.button
                key={isProcessing ? 'stop' : 'send'}
                type={isProcessing ? 'button' : 'submit'}
                onClick={isProcessing ? onStop : undefined}
                disabled={!isProcessing && !message.trim()}
                className={`p-2 sm:p-3 rounded-md border ${
                  isProcessing
                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10'
                    : !message.trim()
                      ? 'border-[var(--text-secondary)] text-[var(--text-secondary)] cursor-not-allowed'
                      : 'border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:bg-opacity-10'
                } transition-colors`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={!message.trim() && !isProcessing ? {} : { scale: 1.05 }}
                whileTap={!message.trim() && !isProcessing ? {} : { scale: 0.95 }}
              >
                {isProcessing ? <Square size={18} /> : <Send size={18} />}
              </motion.button>
            </AnimatePresence>
          </div>
          
          {/* Processing indicator */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                className="mt-3 flex items-center justify-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex space-x-2">
                  <motion.div
                    className="w-2 h-2 bg-[var(--primary)] rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[var(--primary)] rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[var(--primary)] rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                  />
                </div>
                <span className="ml-3 text-xs sm:text-sm text-[var(--text-secondary)]">Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default InteractiveChat;