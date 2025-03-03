import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Zap, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LLMModel } from '../types';
import ModelLogo from './ModelLogo';

interface ModelTierDisplayProps {
  currentModel: LLMModel;
}

const ModelTierDisplay: React.FC<ModelTierDisplayProps> = ({ currentModel }) => {
  const { theme } = useTheme();

  const getTierBadge = () => {
    switch (currentModel.tier) {
      case 'low':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30">
            <Zap size={12} className="text-green-500" />
            <span className="text-[10px] font-medium text-green-500">Basic</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30">
            <Star size={12} className="text-blue-500" />
            <span className="text-[10px] font-medium text-blue-500">Standard</span>
          </div>
        );
      case 'flagship':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30">
            <Shield size={12} className="text-purple-500" />
            <span className="text-[10px] font-medium text-purple-500">Premium</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`p-3 rounded-xl backdrop-blur-md border border-[var(--border-color)] ${
        theme === 'dark' ? 'bg-[#1C1C1E]/80' : 'bg-white/80'
      } shadow-sm`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ModelLogo modelName={currentModel.name} size={32} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{currentModel.name}</h3>
            {getTierBadge()}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--text-secondary)]">{currentModel.provider}</span>
            <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--border-color)] bg-opacity-30">
              <Info size={10} className="text-[var(--text-secondary)]" />
              <span className="text-[var(--text-secondary)]">${(currentModel.costPerInputToken * 1000).toFixed(5)}/1K tokens</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-3">
        <div className={`text-center p-1 rounded ${theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#F2F2F7]'}`}>
          <p className="text-[9px] text-[var(--text-secondary)]">Reasoning</p>
          <p className="text-xs font-medium">{currentModel.capabilities.reasoning}/10</p>
        </div>
        <div className={`text-center p-1 rounded ${theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#F2F2F7]'}`}>
          <p className="text-[9px] text-[var(--text-secondary)]">Factual</p>
          <p className="text-xs font-medium">{currentModel.capabilities.factual}/10</p>
        </div>
        <div className={`text-center p-1 rounded ${theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#F2F2F7]'}`}>
          <p className="text-[9px] text-[var(--text-secondary)]">Creative</p>
          <p className="text-xs font-medium">{currentModel.capabilities.creative}/10</p>
        </div>
        <div className={`text-center p-1 rounded ${theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#F2F2F7]'}`}>
          <p className="text-[9px] text-[var(--text-secondary)]">Coding</p>
          <p className="text-xs font-medium">{currentModel.capabilities.coding}/10</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelTierDisplay;