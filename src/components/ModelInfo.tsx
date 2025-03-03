import React from 'react';
import { ModelSelection } from '../types';
import { MessageSquare, ArrowRight, DollarSign, Cpu, Shield, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ModelLogo from './ModelLogo';
import { useTheme } from '../context/ThemeContext';

interface ModelInfoProps {
  modelSelection: ModelSelection | null;
}

const ModelInfo: React.FC<ModelInfoProps> = ({ modelSelection }) => {
  const { theme } = useTheme();
  
  if (!modelSelection) return null;

  const { selectedModel, estimatedCost, confidenceScore, reasoning, tokenEstimates } = modelSelection;

  const getTierIcon = (tier: 'low' | 'medium' | 'flagship') => {
    switch (tier) {
      case 'low':
        return <Zap size={14} className="text-green-500" />;
      case 'medium':
        return <Star size={14} className="text-blue-500" />;
      case 'flagship':
        return <Shield size={14} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier: 'low' | 'medium' | 'flagship') => {
    switch (tier) {
      case 'low':
        return 'text-green-500 border-green-500';
      case 'medium':
        return 'text-blue-500 border-blue-500';
      case 'flagship':
        return 'text-purple-500 border-purple-500';
      default:
        return 'text-[var(--text-primary)] border-[var(--border-color)]';
    }
  };

  const getTierName = (tier: 'low' | 'medium' | 'flagship') => {
    switch (tier) {
      case 'low':
        return 'Basic';
      case 'medium':
        return 'Standard';
      case 'flagship':
        return 'Premium';
      default:
        return '';
    }
  };

  return (
    <motion.div 
      className={`backdrop-blur-2xl rounded-2xl p-6 border border-[var(--border-color)] ${
        theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ModelLogo modelName={selectedModel.name} size={36} />
            <div 
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border ${getTierColor(selectedModel.tier)} ${
                theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'
              }`}
            >
              {getTierIcon(selectedModel.tier)}
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-base tracking-tight">{selectedModel.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--text-secondary)] tracking-widest uppercase">{selectedModel.provider}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getTierColor(selectedModel.tier)} border bg-opacity-10`}>
                {getTierName(selectedModel.tier)}
              </span>
            </div>
          </div>
        </div>
        <div className={`text-xs font-semibold tracking-wider px-3 py-1 rounded-full border ${
          confidenceScore === 1.0
            ? 'border-[var(--primary)] text-[var(--primary)]'
            : 'border-[var(--text-primary)] text-[var(--text-primary)]'
        }`}>
          {Math.min(100, Math.round(confidenceScore * 100))}% Match
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className={`p-3 rounded-xl backdrop-blur-md ${theme === 'dark' ? 'bg-black/10' : 'bg-black/5'} border border-[var(--text-primary)] border-opacity-20`}>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-[var(--text-primary)]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Input Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-mono font-medium tracking-tight">{tokenEstimates?.input}</span>
            <span className="text-xs text-[var(--text-secondary)]">tokens</span>
          </div>
          <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
            ${(selectedModel.costPerInputToken * 1000).toFixed(5)}/1K tokens
          </div>
        </div>
        
        <div className={`p-3 rounded-xl backdrop-blur-md ${theme === 'dark' ? 'bg-black/10' : 'bg-black/5'} border border-[var(--text-primary)] border-opacity-20`}>
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={16} className="text-[var(--text-primary)]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Output Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-mono font-medium tracking-tight">~{tokenEstimates?.estimatedOutput}</span>
            <span className="text-xs text-[var(--text-secondary)]">tokens</span>
          </div>
          <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
            ${(selectedModel.costPerOutputToken * 1000).toFixed(5)}/1K tokens
          </div>
        </div>
      </div>
      
      <div className={`p-3 rounded-xl backdrop-blur-md ${theme === 'dark' ? 'bg-black/10' : 'bg-black/5'} border border-[var(--text-primary)] border-opacity-20 mb-5`}>
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} className="text-[var(--text-primary)]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Total Estimated Cost</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-mono font-medium tracking-tight">${estimatedCost.toFixed(6)}</span>
        </div>
      </div>
      
      <div className={`p-3 rounded-xl backdrop-blur-md ${theme === 'dark' ? 'bg-black/10' : 'bg-black/5'} border border-[var(--text-primary)] border-opacity-20 hover:border-opacity-100 transition-all`}>
        <h4 className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-[var(--text-secondary)]">Selection Reasoning</h4>
        <p className="text-xs leading-relaxed tracking-tight">{reasoning.split('\n\n')[0]}</p>
      </div>
    </motion.div>
  );
};

export default ModelInfo;