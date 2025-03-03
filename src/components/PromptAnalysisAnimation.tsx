import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Cpu, BarChart, Calculator, Clock } from 'lucide-react';
import { LLMModel } from '../types';
import { useTheme } from '../context/ThemeContext';
import ModelLogo from './ModelLogo';

interface PromptAnalysisAnimationProps {
  selectedModel?: LLMModel;
}

const PromptAnalysisAnimation: React.FC<PromptAnalysisAnimationProps> = ({ selectedModel }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className="w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-full p-6 rounded-xl border border-[var(--border-color)] ${
          theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#F2F2F7]'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-[var(--primary)]">1</span>
              <Calculator className="text-[var(--primary)] ml-2" size={18} />
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Analyzing complexity</span>
                <motion.span 
                  className="text-xs text-[var(--primary)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Complete
                </motion.span>
              </div>
              <motion.div
                className={`w-full h-1 ${theme === 'dark' ? 'bg-[#48484A]' : 'bg-[#D1D1D6]'} rounded-full overflow-hidden`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="h-full bg-[var(--primary)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-[var(--primary)]">2</span>
              <BarChart className="text-[var(--primary)] ml-2" size={18} />
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Estimating tokens</span>
                <motion.span 
                  className="text-xs text-[var(--primary)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Complete
                </motion.span>
              </div>
              <motion.div 
                className={`w-full h-1 ${theme === 'dark' ? 'bg-[#48484A]' : 'bg-[#D1D1D6]'} rounded-full overflow-hidden`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="h-full bg-[var(--primary)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                />
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-[var(--primary)]">3</span>
              <Cpu className="text-[var(--primary)] ml-2" size={18} />
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Selecting optimal model</span>
                <motion.span 
                  className="text-xs text-[var(--primary)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  Complete
                </motion.span>
              </div>
              <motion.div 
                className={`w-full h-1 ${theme === 'dark' ? 'bg-[#48484A]' : 'bg-[#D1D1D6]'} rounded-full overflow-hidden`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="h-full bg-[var(--primary)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                />
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-[var(--primary)]">4</span>
              <Zap className="text-[var(--primary)] ml-2" size={18} />
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Generating response</span>
                <motion.span 
                  className="text-xs text-[var(--text-secondary)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4 }}
                >
                  In progress...
                </motion.span>
              </div>
              <motion.div 
                className={`w-full h-1 ${theme === 'dark' ? 'bg-[#48484A]' : 'bg-[#D1D1D6]'} rounded-full overflow-hidden`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="h-full bg-[var(--primary)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 0.8, delay: 2.2 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
        
        {selectedModel && (
          <motion.div 
            className={`mt-6 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-white'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.0 }}
          >
            <div className="flex items-center">
              <div className="mr-3">
                <ModelLogo modelName={selectedModel.name} size={28} />
              </div>
              <div>
                <h4 className="font-medium text-sm">Selected Model: {selectedModel.name}</h4>
                <p className="text-xs text-[var(--text-secondary)]">Provider: {selectedModel.provider}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PromptAnalysisAnimation;