import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Zap, Check, ChevronDown, ChevronUp, CircleDollarSign, Shield, Star } from 'lucide-react';
import { LLMModel } from '../types';
import { availableModels } from '../data/models';
import ModelLogo from './ModelLogo';
import { useTheme } from '../context/ThemeContext';

interface ModelSelectorProps {
  selectionMode: 'auto' | 'manual';
  setSelectionMode: (mode: 'auto' | 'manual') => void;
  selectedModelId: string | null;
  setSelectedModelId: (modelId: string | null) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectionMode,
  setSelectionMode,
  selectedModelId,
  setSelectedModelId,
}) => {
  const { theme } = useTheme();
  const [activeTier, setActiveTier] = useState<'all' | 'low' | 'medium' | 'flagship'>('all');
  const [showTierDropdown, setShowTierDropdown] = useState(false);
  const [showProviderFilter, setShowProviderFilter] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Function to get models by tier
  const getModelsByTier = (tier: 'low' | 'medium' | 'flagship') => {
    return availableModels.filter(model => model.tier === tier);
  };

  // Filter models based on active tier and selected providers
  const filteredModels = availableModels.filter(model => {
    // Filter by tier
    if (activeTier !== 'all' && model.tier !== activeTier) {
      return false;
    }
    
    // Filter by provider
    if (selectedProviders.length > 0 && !selectedProviders.includes(model.provider)) {
      return false;
    }
    
    return true;
  });

  // Get all unique providers
  const providers = [...new Set(availableModels.map(model => model.provider))];

  const handleProviderToggle = (provider: string) => {
    if (selectedProviders.includes(provider)) {
      setSelectedProviders(selectedProviders.filter(p => p !== provider));
    } else {
      setSelectedProviders([...selectedProviders, provider]);
    }
  };

  const getTierIcon = (tier: 'low' | 'medium' | 'flagship') => {
    switch (tier) {
      case 'low':
        return <Zap size={14} className="text-[var(--text-secondary)]" />;
      case 'medium':
        return <Star size={14} className="text-[var(--text-secondary)]" />;
      case 'flagship':
        return <Shield size={14} className="text-[var(--text-secondary)]" />;
      default:
        return null;
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
    <div className={`rounded-xl p-4 border border-[var(--border-color)] ${
      theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Select Model</h3>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowProviderFilter(!showProviderFilter)}
            className={`p-1.5 rounded-md text-[var(--text-secondary)] ${
              selectedProviders.length > 0 
                ? 'bg-[var(--border-color)] bg-opacity-30' 
                : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
          </motion.button>
          
          <div className="relative">
            <motion.button
              onClick={() => setShowTierDropdown(!showTierDropdown)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs ${
                activeTier !== 'all'
                  ? 'bg-[var(--border-color)] bg-opacity-30 text-[var(--text-primary)]'
                  : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{activeTier === 'all' ? 'All Tiers' : getTierName(activeTier)}</span>
              {showTierDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </motion.button>
            
            <AnimatePresence>
              {showTierDropdown && (
                <motion.div
                  className={`absolute right-0 mt-1 z-10 min-w-[120px] border border-[var(--border-color)] rounded-md shadow-lg ${
                    theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-white'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setActiveTier('all');
                        setShowTierDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-md ${
                        activeTier === 'all'
                          ? 'bg-[var(--border-color)] bg-opacity-30 text-[var(--text-primary)]'
                          : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
                      }`}
                    >
                      All Tiers
                    </button>
                    <button
                      onClick={() => {
                        setActiveTier('low');
                        setShowTierDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-md flex items-center gap-2 ${
                        activeTier === 'low'
                          ? 'bg-[var(--border-color)] bg-opacity-30 text-[var(--text-primary)]'
                          : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
                      }`}
                    >
                      {getTierIcon('low')}
                      <span>Basic</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTier('medium');
                        setShowTierDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-md flex items-center gap-2 ${
                        activeTier === 'medium'
                          ? 'bg-[var(--border-color)] bg-opacity-30 text-[var(--text-primary)]'
                          : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
                      }`}
                    >
                      {getTierIcon('medium')}
                      <span>Standard</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTier('flagship');
                        setShowTierDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-md flex items-center gap-2 ${
                        activeTier === 'flagship'
                          ? 'bg-[var(--border-color)] bg-opacity-30 text-[var(--text-primary)]'
                          : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
                      }`}
                    >
                      {getTierIcon('flagship')}
                      <span>Premium</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Provider Filter */}
      <AnimatePresence>
        {showProviderFilter && (
          <motion.div
            className="mb-4 bg-[var(--border-color)] bg-opacity-20 p-3 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs mb-2 text-[var(--text-secondary)]">Provider Filter</p>
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <button
                  key={provider}
                  onClick={() => handleProviderToggle(provider)}
                  className={`px-2 py-1 rounded-md text-xs ${
                    selectedProviders.includes(provider)
                      ? 'bg-[var(--border-color)] bg-opacity-40 text-[var(--text-primary)]'
                      : 'hover:bg-[var(--border-color)] hover:bg-opacity-30'
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-h-[300px] overflow-y-auto pr-1">
        <div className="space-y-2">
          {filteredModels.map(model => (
            <motion.button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-3 border ${
                selectedModelId === model.id
                  ? 'border-[var(--text-primary)] bg-[var(--border-color)] bg-opacity-20'
                  : 'border-[var(--border-color)] hover:border-[var(--text-primary)] hover:border-opacity-50'
              } relative transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <ModelLogo modelName={model.name} size={28} />
                <div 
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border border-[var(--border-color)] ${
                    theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'
                  }`}
                >
                  {getTierIcon(model.tier)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="font-medium text-sm truncate">{model.name}</p>
                  {selectedModelId === model.id && (
                    <Check size={14} className="text-[var(--text-primary)] ml-1 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {model.provider}
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                  <CircleDollarSign size={10} />
                  <span>${(model.costPerInputToken * 1000).toFixed(5)}/1K</span>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] border border-[var(--border-color)] text-[var(--text-secondary)]">
                    {getTierName(model.tier)}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;