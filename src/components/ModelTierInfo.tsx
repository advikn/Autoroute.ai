import React from 'react';
import { Shield, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ModelTierInfoProps {
  tier: 'low' | 'medium' | 'flagship';
}

const ModelTierInfo: React.FC<ModelTierInfoProps> = ({ tier }) => {
  const { theme } = useTheme();
  
  const getTierDetails = () => {
    switch (tier) {
      case 'low':
        return {
          name: 'Basic',
          icon: <Zap size={20} className="text-green-500" />,
          color: 'text-green-500 border-green-500',
          bg: 'bg-green-500',
          description: 'Cost-effective models with good performance for basic tasks. Ideal for simple queries, information retrieval, and straightforward conversations.',
          models: ['GPT-3.5 Turbo', 'Claude 3 Haiku', 'Llama 3 8B', 'Mistral Small'],
          useCases: ['Simple questions', 'Basic summarization', 'Short form content', 'Day-to-day assistance']
        };
      case 'medium':
        return {
          name: 'Standard',
          icon: <Star size={20} className="text-blue-500" />,
          color: 'text-blue-500 border-blue-500',
          bg: 'bg-blue-500',
          description: 'Well-rounded models with strong performance across multiple domains. Great balance between quality, speed, and cost-efficiency.',
          models: ['Claude 3 Sonnet', 'Gemini Pro', 'Gemini Flash', 'Llama 3 70B', 'Mistral Medium'],
          useCases: ['Content creation', 'Detailed explanations', 'Code generation', 'Complex reasoning']
        };
      case 'flagship':
        return {
          name: 'Premium',
          icon: <Shield size={20} className="text-purple-500" />,
          color: 'text-purple-500 border-purple-500',
          bg: 'bg-purple-500',
          description: 'Top-tier models with exceptional capabilities for demanding tasks. Unmatched reasoning, accuracy, and specialized domain expertise.',
          models: ['GPT-4 Turbo', 'GPT-4 32K', 'Claude 3 Opus', 'Gemini Ultra', 'Mistral Large'],
          useCases: ['Advanced reasoning', 'Professional content', 'Complex coding', 'Research assistance']
        };
    }
  };
  
  const details = getTierDetails();
  
  return (
    <motion.div 
      className={`p-4 rounded-xl border ${details.color} ${
        theme === 'dark' ? 'bg-[#121212]' : 'bg-white'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        {details.icon}
        <h3 className={`font-bold text-lg ${details.color}`}>{details.name} Tier</h3>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] mb-4">{details.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Featured Models:</h4>
        <div className="flex flex-wrap gap-2">
          {details.models.map((model, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${details.bg} bg-opacity-10 ${details.color}`}
            >
              {model}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Ideal Use Cases:</h4>
        <ul className="text-xs text-[var(--text-secondary)] space-y-1">
          {details.useCases.map((useCase, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${details.bg}`}></div>
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ModelTierInfo;