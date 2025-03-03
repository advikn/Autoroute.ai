import React from 'react';
import { Router, Brain, Cpu, Sparkles, Zap, ArrowRight, Network, Workflow, GitBranch, GitMerge, Lightbulb, Gauge, Code, Database, Layers, BarChart2, Compass, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { useTheme } from '../../context/ThemeContext';
import ModelLogo from '../ModelLogo';

interface IntelligentRoutingModalProps {
  onClose: () => void;
}

const IntelligentRoutingModal: React.FC<IntelligentRoutingModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  
  // Dynamic classes based on theme
  const cardClass = theme === 'dark' 
    ? 'bg-[#121212] border border-[#333]' 
    : 'bg-white border border-[#eaeaea] shadow-sm';
  
  const codeClass = theme === 'dark'
    ? 'bg-[#1a1a1a] border border-[#333]'
    : 'bg-[#f5f5f5] border border-[#eaeaea]';

  return (
    <Modal 
      title="Intelligent Routing Logic" 
      onClose={onClose}
      icon={<Router size={28} />}
    >
      <div className="space-y-6 sm:space-y-8">
        <motion.div 
          className={`${cardClass} p-6 rounded-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold mb-6 text-center">
            Intelligent Model Selection Process
          </h3>
          <p className="text-center text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto text-sm">
            Our intelligent routing system analyzes your prompt and selects the optimal model based on task requirements and cost efficiency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${cardClass} p-4 rounded-lg relative`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--border-color)] flex items-center justify-center mb-3">
                <span className="text-lg font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-3 mt-2">Prompt Analysis</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Analyzes complexity, task type, and domain expertise requirements
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Complexity scoring (1-10)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Task classification</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Domain identification</span>
                </li>
              </ul>
            </div>

            <div className={`${cardClass} p-4 rounded-lg relative`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--border-color)] flex items-center justify-center mb-3">
                <span className="text-lg font-bold">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-3 mt-2">Model Scoring</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Evaluates each model based on capabilities and cost-efficiency
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Capability matching</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Cost calculation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Performance metrics</span>
                </li>
              </ul>
            </div>

            <div className={`${cardClass} p-4 rounded-lg relative`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--border-color)] flex items-center justify-center mb-3">
                <span className="text-lg font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-3 mt-2">Model Selection</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Selects the optimal model based on analysis and scoring
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Quality prioritization</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Cost optimization</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span>Final selection</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`${cardClass} p-4 rounded-lg`}>
            <h4 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Workflow className="mr-2 text-[var(--text-primary)]" size={16} />
              Task Type Matching
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Factual Queries</span>
                  <span className="text-sm text-[var(--text-secondary)]">Prioritizes factual capability</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-full ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#eee]'} rounded-full h-2`}>
                    <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Reasoning Tasks</span>
                  <span className="text-sm text-[var(--text-secondary)]">Prioritizes reasoning capability</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-full ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#eee]'} rounded-full h-2`}>
                    <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Creative Tasks</span>
                  <span className="text-sm text-[var(--text-secondary)]">Prioritizes creative capability</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-full ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#eee]'} rounded-full h-2`}>
                    <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Coding Tasks</span>
                  <span className="text-sm text-[var(--text-secondary)]">Prioritizes coding capability</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-full ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#eee]'} rounded-full h-2`}>
                    <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${cardClass} p-4 rounded-lg`}>
            <h4 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Gauge className="mr-2 text-[var(--text-primary)]" size={16} />
              Complexity Handling
            </h4>
            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center">
                <div className="w-8 text-center">1-3</div>
                <ArrowRight size={16} className="mx-2 text-[var(--primary)]" />
                <div className={`flex-1 ${cardClass} p-2 rounded text-xs sm:text-sm`}>
                  Simple models (Llama 3 8B, Claude 3 Haiku)
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center">4-6</div>
                <ArrowRight size={16} className="mx-2 text-[var(--primary)]" />
                <div className={`flex-1 ${cardClass} p-2 rounded text-xs sm:text-sm`}>
                  Mid-tier models (Mistral Small)
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center">7-8</div>
                <ArrowRight size={16} className="mx-2 text-[var(--primary)]" />
                <div className={`flex-1 ${cardClass} p-2 rounded text-xs sm:text-sm`}>
                  Advanced models (Mistral Medium, Claude 3 Sonnet)
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center">9-10</div>
                <ArrowRight size={16} className="mx-2 text-[var(--primary)]" />
                <div className={`flex-1 ${cardClass} p-2 rounded text-xs sm:text-sm`}>
                  Premium models (GPT-4o, Llama 3 70B)
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={`${cardClass} p-4 rounded-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4">Example Routing Scenarios</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className={`${cardClass} p-3 rounded-lg`}>
              <h4 className="font-medium mb-2 text-sm">Simple Factual Query</h4>
              <div className={`mb-3 p-3 ${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f5]'} rounded-lg text-[var(--text-primary)] text-xs sm:text-sm`}>
                "What is the capital of France?"
              </div>
              <div className="flex items-start sm:items-center flex-col sm:flex-row">
                <ArrowRight className="text-[var(--primary)] mr-3 mb-2 sm:mb-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Routes to: Llama 3 8B or Claude 3 Haiku</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Reasoning: Low complexity (2/10), factual task, short response, no specialized knowledge needed
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${cardClass} p-3 rounded-lg`}>
              <h4 className="font-medium mb-2 text-sm">Complex Coding Task</h4>
              <div className={`mb-3 p-3 ${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f5]'} rounded-lg text-[var(--text-primary)] text-xs sm:text-sm`}>
                "Write a React component that implements a drag-and-drop file uploader with progress bar"
              </div>
              <div className="flex items-start sm:items-center flex-col sm:flex-row">
                <ArrowRight className="text-[var(--primary)] mr-3 mb-2 sm:mb-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Routes to: GPT-4o or Llama 3 70B</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Reasoning: High complexity (8/10), coding task, long response, specialized knowledge required
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${cardClass} p-3 rounded-lg`}>
              <h4 className="font-medium mb-2 text-sm">Reasoning Problem</h4>
              <div className={`mb-3 p-3 ${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f5]'} rounded-lg text-[var(--text-primary)] text-xs sm:text-sm`}>
                "Analyze the potential economic impacts of implementing a four-day work week"
              </div>
              <div className="flex items-start sm:items-center flex-col sm:flex-row">
                <ArrowRight className="text-[var(--primary)] mr-3 mb-2 sm:mb-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Routes to: Mistral Medium or Claude 3 Sonnet</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Reasoning: Medium-high complexity (7/10), reasoning task, medium-length response, some expertise required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default IntelligentRoutingModal;