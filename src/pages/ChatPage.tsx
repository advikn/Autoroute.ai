import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileWarning from '../components/MobileWarning';
import ChatMessage from '../components/ChatMessage';
import ModelInfo from '../components/ModelInfo';
import ModelSelector from '../components/ModelSelector';
import InteractiveBackground from '../components/InteractiveBackground';
import InteractiveChat from '../components/InteractiveChat';
import PromptAnalysisAnimation from '../components/PromptAnalysisAnimation';
import { ChatMessage as ChatMessageType, ModelSelection, SelectionMode } from '../types';
import { analyzePrompt } from '../services/promptAnalyzer';
import { selectModel, estimateTokenCount } from '../services/modelSelector';
import { generateResponse } from '../services/llmService';
import { availableModels } from '../data/models';
import { useTheme } from '../context/ThemeContext';

const ChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('auto');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [modelSelection, setModelSelection] = useState<ModelSelection | null>(null);
  const [showAnalysisAnimation, setShowAnalysisAnimation] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptProcessed = useRef(false);
  const { theme, toggleTheme } = useTheme();

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
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for initial prompt from homepage
  useEffect(() => {
    const state = location.state as { 
      initialPrompt?: string;
      selectedModelId?: string | null;
    } | null;
    
    if (state?.initialPrompt && !initialPromptProcessed.current) {
      initialPromptProcessed.current = true;
      
      // First set the model and mode
      if (state.selectedModelId) {
        setSelectedModelId(state.selectedModelId);
        setSelectionMode('manual');
      }

      // Then wait for state to update before sending message
      setTimeout(() => {
        handleSendMessage(state.initialPrompt!);
      }, 100);
      
      // Clear the state to prevent resubmission on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSendMessage = async (message: string) => {
    if (isProcessing) return;
    
    abortControllerRef.current = new AbortController();
    
    setIsProcessing(true);
    setError(null);
    
    // Add user message
    const userMessage: ChatMessageType = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      let selectedModel;
      let modelSelectionResult;
      
      // Manual mode: Use selected model or default to first model
      if (selectionMode === 'manual') {
        selectedModel = selectedModelId ? 
          availableModels.find(m => m.id === selectedModelId) : 
          availableModels[0];
      
        const inputTokens = estimateTokenCount(message);
        const outputMultiplier = 5; // Use default medium length for manual selection
        const estimatedOutputTokens = inputTokens * outputMultiplier;
      
        modelSelectionResult = {
          selectedModel,
          estimatedCost: (inputTokens * selectedModel.costPerInputToken) + 
                        (estimatedOutputTokens * selectedModel.costPerOutputToken),
          confidenceScore: 1.0,
          alternatives: [],
          reasoning: `Using manually selected model: ${selectedModel.name} (${selectedModel.provider})`,
          tokenEstimates: {
            input: inputTokens,
            estimatedOutput: estimatedOutputTokens
          }
        };
        
        // Don't show analysis animation for manual selection
        setShowAnalysisAnimation(false);
      } else {
        // Auto mode - use intelligent routing
        setShowAnalysisAnimation(true);
        const analysis = analyzePrompt(message);
        modelSelectionResult = selectModel(message, analysis);
        selectedModel = modelSelectionResult.selectedModel;
      
        // Simulate analysis time for auto mode
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
      
      setModelSelection(modelSelectionResult);
      
      // Generate response
      const responseContent = await generateResponse(selectedModel, message, abortControllerRef.current.signal);
      
      // Hide analysis animation after response is generated
      setShowAnalysisAnimation(false);
      
      // Clear abort controller after successful completion
      abortControllerRef.current = null;
      
      // Add assistant message
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: responseContent,
        model: selectedModel.name,
        timestamp: new Date(),
        estimatedCost: modelSelectionResult.estimatedCost
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      // Check if the error was from aborting
      if (err.name === 'AbortError') {
        setError('Request cancelled');
        return;
      }
      
      console.error('Error processing message:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setShowAnalysisAnimation(false);
    } finally {
      setIsProcessing(false);
      if (abortControllerRef.current?.signal.aborted) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
      setShowAnalysisAnimation(false);
    }
  };

  return (
    <div className={`flex flex-col h-[100dvh] fixed inset-0 overflow-hidden ${theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#F5F5F7]'}`}>
      {/* Mobile Warning */}
      <AnimatePresence>
        {showMobileWarning && (
          <MobileWarning showCloseButton={false} />
        )}
      </AnimatePresence>
      
      {/* Interactive Background */}
      <div className="hidden sm:block">
        <InteractiveBackground sensitivity={0.03} />
      </div>
      
      <main className="flex-1 w-full flex flex-col z-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full relative overflow-hidden">
          {/* Left sidebar with model info */}
          <AnimatePresence mode="wait">
            {modelSelection && (
              <motion.div 
                className={`${
                  selectionMode === 'manual' 
                    ? 'lg:w-96 h-auto lg:h-full lg:min-h-screen'
                    : 'lg:w-80 h-auto'
                } ${
                  window.matchMedia('(max-width: 1024px)').matches
                    ? 'fixed bottom-0 left-0 right-0 z-30 max-h-[60vh] overflow-y-auto rounded-t-xl border-t border-[var(--border-color)] backdrop-blur-md'
                    : 'hidden lg:block overflow-y-auto border-r border-[var(--border-color)]'
                } ${
                  theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#F5F5F7]'
                } backdrop-blur-md`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-3 p-4">
                  <ModelInfo modelSelection={modelSelection} />
                
                  {selectionMode === 'manual' && (
                    <ModelSelector 
                      selectionMode={selectionMode}
                      setSelectionMode={setSelectionMode}
                      selectedModelId={selectedModelId}
                      setSelectedModelId={setSelectedModelId}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main chat area */}
          <motion.div
            className={`w-full lg:flex-1 h-full flex flex-col overflow-hidden relative min-h-0 ${
              modelSelection && window.matchMedia('(max-width: 1024px)').matches
                ? 'pb-[60vh]'
                : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InteractiveChat 
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
              onBackClick={() => navigate('/')}
              onThemeToggle={toggleTheme}
              theme={theme}
              onStop={handleStop}
              onModelSelect={(modelId) => {
                setSelectedModelId(modelId);
                setSelectionMode('manual');
              }}
            >
              {messages.length === 0 ? (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center text-center p-4 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold mb-2">Welcome to LLM Router</h2>
                  <p className="text-[var(--text-secondary)] max-w-md mb-6 text-sm sm:text-base">
                    Ask anything and our intelligent router will select the most appropriate AI model for your query.
                  </p>
                  <div className={`backdrop-blur-sm p-4 rounded-lg shadow-sm max-w-lg w-full border border-[var(--border-color)] ${
                    theme === 'dark' ? 'bg-[#1a1a1a] bg-opacity-70' : 'bg-[#f5f5f5] bg-opacity-70'
                  }`}>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Try asking:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <motion.button 
                        className={`text-left p-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          theme === 'dark' ? 'hover:bg-[#222]' : 'hover:bg-[#e5e5e5]'
                        }`}
                        onClick={() => handleSendMessage("What is the capital of France?")}
                        whileHover={{ scale: 1.02, backgroundColor: theme === 'dark' ? '#222' : '#e5e5e5' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        What is the capital of France?
                      </motion.button>
                      <motion.button 
                        className={`text-left p-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          theme === 'dark' ? 'hover:bg-[#222]' : 'hover:bg-[#e5e5e5]'
                        }`}
                        onClick={() => handleSendMessage("Write a short poem about technology")}
                        whileHover={{ scale: 1.02, backgroundColor: theme === 'dark' ? '#222' : '#e5e5e5' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Write a short poem about technology
                      </motion.button>
                      <motion.button 
                        className={`text-left p-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          theme === 'dark' ? 'hover:bg-[#222]' : 'hover:bg-[#e5e5e5]'
                        }`}
                        onClick={() => handleSendMessage("Explain quantum computing in simple terms")}
                        whileHover={{ scale: 1.02, backgroundColor: theme === 'dark' ? '#222' : '#e5e5e5' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Explain quantum computing
                      </motion.button>
                      <motion.button 
                        className={`text-left p-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          theme === 'dark' ? 'hover:bg-[#222]' : 'hover:bg-[#e5e5e5]'
                        }`}
                        onClick={() => handleSendMessage("Write a JavaScript function to reverse a string")}
                        whileHover={{ scale: 1.02, backgroundColor: theme === 'dark' ? '#222' : '#e5e5e5' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Write a function to reverse a string
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 min-h-0 relative flex flex-col">
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ChatMessage message={message} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} className="h-4 flex-shrink-0" />
                </div>
              )}
              
              {/* Prompt Analysis Animation - Only shown in auto mode */}
              {selectionMode === 'auto' && (
                <AnimatePresence>
                  {showAnalysisAnimation && (
                    <PromptAnalysisAnimation selectedModel={modelSelection?.selectedModel} />
                  )}
                </AnimatePresence>
              )}
              
              {error && (
                <motion.div 
                  className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </InteractiveChat>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;