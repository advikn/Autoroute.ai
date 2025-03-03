import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Cpu, BarChart, Sparkles, Router, MessageSquare, ArrowRight, Database, Code, Lightbulb, Gauge } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LLMOrchestrationAnimation: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { theme } = useTheme();
  
  const nodes = [
    { id: 'prompt', label: 'Prompt Analysis', icon: <MessageSquare size={24} className="text-[var(--primary)]" />, x: 100, y: 150 },
    { id: 'router', label: 'LLM Router', icon: <Router size={24} className="text-[var(--primary)]" />, x: 300, y: 150 },
    { id: 'model1', label: 'GPT-4o', icon: <Brain size={24} className="text-[var(--primary)]" />, x: 500, y: 50 },
    { id: 'model2', label: 'Claude 3 Sonnet', icon: <Sparkles size={24} className="text-[var(--primary)]" />, x: 500, y: 150 },
    { id: 'model3', label: 'Llama 3 70B', icon: <Cpu size={24} className="text-[var(--primary)]" />, x: 500, y: 250 },
    { id: 'model4', label: 'Mistral Medium', icon: <Zap size={24} className="text-[var(--primary)]" />, x: 500, y: 350 },
    { id: 'response', label: 'Response', icon: <BarChart size={24} className="text-[var(--primary)]" />, x: 700, y: 150 }
  ];
  
  // Adjust node positions for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const mobileNodes = nodes.map(node => {
    if (isMobile) {
      // Compress the x-axis for mobile
      const mobileX = node.x * 0.6;
      // Adjust y positions for models to be more compact
      let mobileY = node.y;
      if (node.id === 'model1') mobileY = 50;
      if (node.id === 'model2') mobileY = 120;
      if (node.id === 'model3') mobileY = 190;
      if (node.id === 'model4') mobileY = 260;
      return { ...node, x: mobileX, y: mobileY };
    }
    return node;
  });
  
  const displayNodes = isMobile ? mobileNodes : nodes;
  
  const edges = [
    { from: 'prompt', to: 'router' },
    { from: 'router', to: 'model1' },
    { from: 'router', to: 'model2' },
    { from: 'router', to: 'model3' },
    { from: 'router', to: 'model4' },
    { from: 'model1', to: 'response' },
    { from: 'model2', to: 'response' },
    { from: 'model3', to: 'response' },
    { from: 'model4', to: 'response' }
  ];
  
  return (
    <div className="w-full py-6 sm:py-12">
      <div className="max-w-5xl mx-auto px-2">
        <div className="relative h-[400px] sm:h-[500px] mb-4 sm:mb-8 overflow-hidden">
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full">
            {edges.map((edge, index) => {
              const fromNode = displayNodes.find(n => n.id === edge.from);
              const toNode = displayNodes.find(n => n.id === edge.to);
              
              if (!fromNode || !toNode) return null;
              
              const isHighlighted = selectedNode === edge.from || selectedNode === edge.to;
              
              // Adjust curve control points for mobile
              const controlPointDistance = isMobile ? 50 : 100;
              
              return (
                <motion.path
                  key={`${edge.from}-${edge.to}`}
                  d={`M${fromNode.x + 30} ${fromNode.y} C${fromNode.x + controlPointDistance} ${fromNode.y}, ${toNode.x - controlPointDistance} ${toNode.y}, ${toNode.x - 30} ${toNode.y}`}
                  stroke={isHighlighted ? 'var(--primary)' : 'var(--border-color)'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  fill="none"
                  strokeDasharray={isHighlighted ? "0" : "5,5"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              );
            })}
          </svg>
          
          {/* Nodes */}
          {displayNodes.map((node) => (
            <motion.div
              key={node.id}
              className={`absolute cursor-pointer ${
                selectedNode === node.id 
                  ? 'z-20' 
                  : 'z-10'
              }`}
              style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: displayNodes.indexOf(node) * 0.1 }}
              onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
            >
              <motion.div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                  selectedNode === node.id
                    ? 'bg-[var(--primary)] bg-opacity-20 border-2 border-[var(--primary)]'
                    : theme === 'dark' ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-white border border-[#eaeaea]'
                } transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {node.icon}
              </motion.div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center whitespace-nowrap">
                <span className={`text-xs sm:text-sm font-medium ${
                  selectedNode === node.id ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'
                }`}>
                  {node.label}
                </span>
              </div>
            </motion.div>
          ))}
          
          {/* Info panel */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div 
                className={`absolute right-0 top-0 w-full sm:w-64 p-3 sm:p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-[#121212] border border-[#333]' : 'bg-white border border-[#eaeaea] shadow-md'
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center">
                  {displayNodes.find(n => n.id === selectedNode)?.icon}
                  <span className="ml-2">{displayNodes.find(n => n.id === selectedNode)?.label}</span>
                </h3>
                
                {selectedNode === 'router' && (
                  <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    <p className="mb-3">The LLM Router analyzes prompts and selects the optimal model based on:</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[var(--primary)] bg-opacity-20 flex items-center justify-center mr-2">
                          <Code size={12} className="text-[var(--primary)]" />
                        </div>
                        <span>Task type detection</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[var(--primary)] bg-opacity-20 flex items-center justify-center mr-2">
                          <Gauge size={12} className="text-[var(--primary)]" />
                        </div>
                        <span>Complexity analysis</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[var(--primary)] bg-opacity-20 flex items-center justify-center mr-2">
                          <Database size={12} className="text-[var(--primary)]" />
                        </div>
                        <span>Cost optimization</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[var(--primary)] bg-opacity-20 flex items-center justify-center mr-2">
                          <Lightbulb size={12} className="text-[var(--primary)]" />
                        </div>
                        <span>Domain expertise matching</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode === 'model1' && (
                  <div>
                    <p className="mb-3 text-xs sm:text-sm text-[var(--text-secondary)]">GPT-4o excels at complex reasoning and coding tasks with exceptional accuracy.</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Reasoning</span>
                          <span className="font-medium">10/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Coding</span>
                          <span className="font-medium">10/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Cost</span>
                          <span className="font-medium">6.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Speed</span>
                          <span className="font-medium">7.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode === 'model2' && (
                  <div>
                    <p className="mb-3 text-xs sm:text-sm text-[var(--text-secondary)]">Claude 3 Sonnet balances performance across multiple domains with strong creative capabilities.</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Reasoning</span>
                          <span className="font-medium">9.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Creative</span>
                          <span className="font-medium">9.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Cost</span>
                          <span className="font-medium">7.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Speed</span>
                          <span className="font-medium">7.5/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode === 'model3' && (
                  <div>
                    <p className="mb-3 text-xs sm:text-sm text-[var(--text-secondary)]">Llama 3 70B offers strong performance with excellent reasoning and coding capabilities.</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Reasoning</span>
                          <span className="font-medium">9.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Coding</span>
                          <span className="font-medium">8.5/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Cost</span>
                          <span className="font-medium">8.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Speed</span>
                          <span className="font-medium">7.5/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode === 'model4' && (
                  <div>
                    <p className="mb-3 text-xs sm:text-sm text-[var(--text-secondary)]">Mistral Medium balances reasoning and coding with exceptional cost efficiency for everyday tasks.</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Reasoning</span>
                          <span className="font-medium">8.5/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Coding</span>
                          <span className="font-medium">8.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Cost</span>
                          <span className="font-medium">9.0/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Speed</span>
                          <span className="font-medium">8.5/10</span>
                        </div>
                        <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              
                {selectedNode === 'prompt' && (
                  <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    <p className="mb-3">User prompts are analyzed through a sophisticated pipeline:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-blue-500">1</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Task Classification</span>
                        </div>
                        <p className="text-xs">Identifies the primary task type using NLP techniques</p>
                      </div>
                      
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-purple-500">2</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Complexity Analysis</span>
                        </div>
                        <p className="text-xs">Evaluates linguistic complexity and reasoning</p>
                      </div>
                      
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-green-500">3</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Domain Detection</span>
                        </div>
                        <p className="text-xs">Identifies specialized knowledge domains</p>
                      </div>
                      
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-pink-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-pink-500">4</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Token Prediction</span>
                        </div>
                        <p className="text-xs">Estimates tokens for cost calculation</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode === 'response' && (
                  <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    <p className="mb-3">The response generation process ensures optimal quality and efficiency:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-blue-500">1</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Quality Optimization</span>
                        </div>
                        <p className="text-xs">Ensures responses meet quality thresholds</p>
                      </div>
                      
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-purple-500">2</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Format Standardization</span>
                        </div>
                        <p className="text-xs">Maintains consistent formatting</p>
                      </div>
                      
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-green-500">3</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Cost Tracking</span>
                        </div>
                        <p className="text-xs">Records token usage and costs</p>
                      </div>
                      
                      <div className="glassmorphism-light p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-pink-500 bg-opacity-20 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-pink-500">4</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">Performance Metrics</span>
                        </div>
                        <p className="text-xs">Captures metrics to improve routing</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LLMOrchestrationAnimation;