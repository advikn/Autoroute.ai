import React from 'react';
import { DollarSign, TrendingDown, BarChart, LineChart, PieChart, Zap, Calculator, Coins, BarChart as ChartBar, Clock, Target, Gauge, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { availableModels } from '../../data/models';
import Modal from './Modal';
import { useTheme } from '../../context/ThemeContext';
import ModelLogo from '../ModelLogo';

interface CostOptimizationModalProps {
  onClose: () => void;
}

const CostOptimizationModal: React.FC<CostOptimizationModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  
  // Sort models by input cost
  const sortedByInputCost = [...availableModels].sort((a, b) => 
    a.costPerInputToken - b.costPerInputToken
  );

  // Sort models by output cost
  const sortedByOutputCost = [...availableModels].sort((a, b) => 
    a.costPerOutputToken - b.costPerOutputToken
  );

  // Sort by overall cost efficiency (using a simple metric)
  const sortedByEfficiency = [...availableModels].sort((a, b) => {
    const aEfficiency = (a.capabilities.reasoning + a.capabilities.factual) / 
                        ((a.costPerInputToken + a.costPerOutputToken) * 1000);
    const bEfficiency = (b.capabilities.reasoning + b.capabilities.factual) / 
                        ((b.costPerInputToken + b.costPerOutputToken) * 1000);
    return bEfficiency - aEfficiency;
  });

  // Dynamic classes based on theme
  const cardClass = theme === 'dark' 
    ? 'bg-[#121212] border border-[#333]' 
    : 'bg-white border border-[#eaeaea] shadow-sm';
  
  const stepBgClass = theme === 'dark'
    ? 'bg-[#1a1a1a] border border-[#333]'
    : 'bg-white border border-[#eaeaea] shadow-sm';

  const tableRowHoverClass = theme === 'dark'
    ? 'hover:bg-[#1a1a1a]'
    : 'hover:bg-[#f5f5f5]';

  return (
    <Modal 
      title="Cost Optimization" 
      onClose={onClose}
      icon={<DollarSign size={28} />}
    >
      <div className="space-y-6 sm:space-y-8">
        <motion.div 
          className={`${cardClass} p-6 rounded-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold mb-6 text-center">
            Cost-Efficient Model Selection
          </h3>
          <p className="text-center text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto text-sm">
            Our system automatically selects the most cost-effective model while maintaining high-quality responses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${cardClass} p-4 rounded-lg relative`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--border-color)] flex items-center justify-center mb-3">
                <span className="text-lg font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-3 mt-2">Token Estimation</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Calculates expected input and output tokens
              </p>
              <div className={`${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f5]'} p-3 rounded-lg`}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Input Cost</span>
                  <span className="text-[var(--primary)]">$0.0001/1K tokens</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Output Cost</span>
                  <span className="text-[var(--primary)]">$0.0003/1K tokens</span>
                </div>
              </div>
            </div>

            <div className={`${cardClass} p-4 rounded-lg relative`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--border-color)] flex items-center justify-center mb-3">
                <span className="text-lg font-bold">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-3 mt-2">Cost Analysis</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Evaluates cost-efficiency ratio for each model
              </p>
              <div className={`${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f5]'} p-3 rounded-lg`}>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                    <span className="text-sm">Performance metrics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                    <span className="text-sm">Cost per capability</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardClass} p-4 rounded-lg relative`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--border-color)] flex items-center justify-center mb-3">
                <span className="text-lg font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-3 mt-2">Model Selection</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Selects optimal model based on cost-efficiency
              </p>
              <div className={`${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f5]'} p-3 rounded-lg`}>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                    <span className="text-sm">Quality threshold</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                    <span className="text-sm">Cost optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={`${cardClass} p-4 rounded-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 border-b border-[var(--border-color)]">Model</th>
                <th className="text-left py-3 px-4 border-b border-[var(--border-color)]">Provider</th>
                <th className="text-right py-3 px-4 border-b border-[var(--border-color)]">
                  <div>Input Cost</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">per 1K tokens</div>
                </th>
                <th className="text-right py-3 px-4 border-b border-[var(--border-color)]">
                  <div>Output Cost</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">per 1K tokens</div>
                </th>
                <th className="text-left py-3 px-4 border-b border-[var(--border-color)]">Capabilities</th>
              </tr>
            </thead>
            <tbody>
              {availableModels.map((model) => (
                <tr key={model.id} className={`${tableRowHoverClass} transition-colors`}>
                  <td className="py-3 px-4 border-b border-[var(--border-color)] font-medium">
                    <span className="truncate max-w-[80px] sm:max-w-none">{model.name}</span>
                  </td>
                  <td className="py-3 px-4 border-b border-[var(--border-color)]">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
                    }`}>
                      {model.provider}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-[var(--border-color)] text-right">
                    <div className="font-mono text-[var(--text-primary)]">${(model.costPerInputToken * 1000).toFixed(5)}</div>
                  </td>
                  <td className="py-3 px-4 border-b border-[var(--border-color)] text-right">
                    <div className="font-mono text-[var(--text-primary)]">${(model.costPerOutputToken * 1000).toFixed(5)}</div>
                  </td>
                  <td className="py-3 px-4 border-b border-[var(--border-color)]">
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.reasoning >= 8 && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          theme === 'dark' 
                            ? 'bg-[#1a1a1a] text-[var(--text-primary)]' 
                            : 'bg-[#f5f5f5] text-[var(--text-primary)]'
                        }`}>
                          Reasoning
                        </span>
                      )}
                      {model.capabilities.factual >= 8 && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-[#1a1a1a] text-[var(--text-primary)]'
                            : 'bg-[#f5f5f5] text-[var(--text-primary)]'
                        }`}>
                          Factual
                        </span>
                      )}
                      {model.capabilities.coding >= 8 && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-[#1a1a1a] text-[var(--text-primary)]'
                            : 'bg-[#f5f5f5] text-[var(--text-primary)]'
                        }`}>
                          Coding
                        </span>
                      )}
                      {model.capabilities.creative >= 8 && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-[#1a1a1a] text-[var(--text-primary)]'
                            : 'bg-[#f5f5f5] text-[var(--text-primary)]'
                        }`}>
                          Creative
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`${cardClass} p-4 rounded-xl`}>
            <h4 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Cost Comparison</h4>
            <div className="space-y-1.5">
              {sortedByInputCost.slice(0, 5).map((model, index) => (
                <div key={model.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center">
                    <span className="truncate max-w-[80px] sm:max-w-none">{model.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-[var(--text-secondary)]">Input</div>
                      <div className="font-mono text-xs">${(model.costPerInputToken * 1000).toFixed(5)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[var(--text-secondary)]">Output</div>
                      <div className="font-mono text-xs">${(model.costPerOutputToken * 1000).toFixed(5)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`${cardClass} p-4 rounded-xl`}>
            <h4 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Value Ranking</h4>
            <div className="space-y-3">
              {sortedByEfficiency.slice(0, 5).map((model, index) => (
                <div key={model.id} className="flex items-center gap-3">
                  <div className="flex items-center min-w-[120px]">
                    <span className="truncate max-w-[80px] sm:max-w-none">{model.name}</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-[var(--border-color)]">
                    <div 
                      className="h-2 rounded-full bg-[var(--primary)]"
                      style={{ width: `${100 - index * 20}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[40px] text-right">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {index === 0 ? "Best" : `${100 - index * 20}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-4 text-center">Based on capability per token cost</div>
          </div>
        </motion.div>

        <motion.div 
          className={`${cardClass} p-4 rounded-lg mt-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold mb-4">Cost Optimization Tips</h3>
          <ul className="space-y-3 text-[var(--text-secondary)] text-sm">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-lg bg-[var(--border-color)] font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span>For simple factual queries, the router will select cost-effective models like Llama 3 8B or Claude 3 Haiku</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-lg bg-[var(--border-color)] font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span>Be specific in your prompts to reduce back-and-forth exchanges, saving on token costs</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-lg bg-[var(--border-color)] font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span>For complex tasks requiring expertise, the system will balance capability with cost</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-lg bg-[var(--border-color)] font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span>Use manual mode when you know exactly which model capabilities you need</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </Modal>
  );
};

export default CostOptimizationModal;