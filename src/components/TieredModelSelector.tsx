import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Zap, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { availableModels } from '../data/models';
import ModelLogo from './ModelLogo';

interface TieredModelSelectorProps {
  selectedModelId: string | null;
  setSelectedModelId: (modelId: string) => void;
  onClose: () => void;
}

const TieredModelSelector: React.FC<TieredModelSelectorProps> = ({
  selectedModelId,
  setSelectedModelId,
  onClose
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`p-4 rounded-xl border border-[var(--border-color)] shadow-lg ${
        theme === 'dark' ? 'bg-[#1C1C1E]/95' : 'bg-white/95'
      } backdrop-blur-lg`}
    >
      <div className="text-sm font-medium mb-4">Select a Model</div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {/* Premium/Flagship Tier */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center gap-1 text-xs">
              <Shield size={12} className="text-[var(--primary)]" />
              <span className="font-medium">Premium Models</span>
            </div>
          </div>
          <div className="space-y-1">
            {availableModels
              .filter(model => model.tier === 'flagship')
              .map(model => (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-3 ${
                    selectedModelId === model.id
                      ? 'bg-[var(--primary)] bg-opacity-10 border border-[var(--primary)]'
                      : 'hover:bg-[var(--border-color)] hover:bg-opacity-20 border border-transparent'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ModelLogo modelName={model.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {model.provider} • ${(model.costPerInputToken * 1000).toFixed(5)}/1K tokens
                    </div>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>

        {/* Standard/Medium Tier */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center gap-1 text-xs">
              <Star size={12} className="text-[var(--primary)]" />
              <span className="font-medium">Standard Models</span>
            </div>
          </div>
          <div className="space-y-1">
            {availableModels
              .filter(model => model.tier === 'medium')
              .map(model => (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-3 ${
                    selectedModelId === model.id
                      ? 'bg-[var(--primary)] bg-opacity-10 border border-[var(--primary)]'
                      : 'hover:bg-[var(--border-color)] hover:bg-opacity-20 border border-transparent'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ModelLogo modelName={model.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {model.provider} • ${(model.costPerInputToken * 1000).toFixed(5)}/1K tokens
                    </div>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>

        {/* Basic/Low Tier */}
        <div>
          <div className="flex items-center mb-2">
            <div className="flex items-center gap-1 text-xs">
              <Zap size={12} className="text-[var(--primary)]" />
              <span className="font-medium">Basic Models</span>
            </div>
          </div>
          <div className="space-y-1">
            {availableModels
              .filter(model => model.tier === 'low')
              .map(model => (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-3 ${
                    selectedModelId === model.id
                      ? 'bg-[var(--primary)] bg-opacity-10 border border-[var(--primary)]'
                      : 'hover:bg-[var(--border-color)] hover:bg-opacity-20 border border-transparent'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ModelLogo modelName={model.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {model.provider} • ${(model.costPerInputToken * 1000).toFixed(5)}/1K tokens
                    </div>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TieredModelSelector;