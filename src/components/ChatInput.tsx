import React, { useState, KeyboardEvent } from 'react';
import { Send, AlertCircle, Square, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { availableModels } from '../data/models';
import ModelLogo from './ModelLogo';
import TieredModelSelector from './TieredModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  error: string | null;
  onModelSelect?: (modelId: string) => void;
  onStop?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing, error, onModelSelect, onStop }) => {
  const [message, setMessage] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing && !error) {
      // Pass selected model if in manual mode
      if (selectedModelId && onModelSelect) {
        onModelSelect(selectedModelId);
      }
      onSendMessage(message);
      setMessage('');
      setShowModelSelector(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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

    // Send message on Shift+Enter
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isProcessing && !error) {
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

  const handleModelSelect = (modelId: string) => {
    // Remove the '/' character if it was added
    setMessage(message.replace('/', ''));
    setSelectedModelId(modelId);
    if (onModelSelect) {
      onModelSelect(modelId);
    }
    setShowModelSelector(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Show model selector when typing '/' at the start of a line
    if (newValue.endsWith('/')) {
      const lines = newValue.split('\n');
      const currentLine = lines[lines.length - 1];
      if (currentLine === '/') {
        setShowModelSelector(true);
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={`backdrop-blur-2xl rounded-xl p-3 border border-[var(--border-color)] relative ${
        theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {error && (
        <div className="mb-2 text-red-500 text-xs flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}
      
      {/* Model Selector Dropdown */}
      <AnimatePresence>
        {showModelSelector && (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2">
            <div className="fixed inset-0 z-40" onClick={() => setShowModelSelector(false)} />
            <motion.div 
              className="relative z-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <TieredModelSelector 
                selectedModelId={selectedModelId}
                setSelectedModelId={handleModelSelect}
                onClose={() => setShowModelSelector(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="flex items-end gap-3">
        <div className="flex-grow">
          <textarea
            className={`w-full p-3 rounded-lg text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none font-mono text-sm tracking-tight relative z-10 backdrop-blur-md ${
              theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#E5E5EA]'
            }`}
            placeholder="Type your message... (Shift+Enter to send) or / to select model"
            rows={3}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.button
            key={isProcessing ? 'stop' : 'send'}
            type={isProcessing ? 'button' : 'submit'}
            onClick={isProcessing ? onStop : undefined}
            disabled={!isProcessing && (!message.trim() || !!error)}
            className={`p-3 rounded-lg border transition-colors ${
              isProcessing 
                ? 'border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10'
                : !message.trim() || !!error
                  ? 'border-[var(--text-secondary)] text-[var(--text-secondary)] cursor-not-allowed'
                  : 'border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:bg-opacity-10'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={!message.trim() && !isProcessing ? {} : { scale: 1.1 }}
            whileTap={!message.trim() && !isProcessing ? {} : { scale: 0.95 }}
          >
            {isProcessing ? <Square size={20} /> : <Send size={20} />}
          </motion.button>
        </AnimatePresence>
      </div>
      {isProcessing && (
        <div className="mt-3 flex items-center justify-center">
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
          <span className="ml-3 text-xs tracking-wide text-[var(--text-secondary)]">Processing your message...</span>
        </div>
      )}
    </motion.form>
  );
};

export default ChatInput;