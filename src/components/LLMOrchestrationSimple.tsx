import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, ArrowRight, Zap, Cpu, BarChart } from 'lucide-react';

const LLMOrchestrationSimple: React.FC = () => {
  return (
    <div className="w-full py-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-[var(--primary)] bg-opacity-10 flex items-center justify-center mb-6">
            <MessageSquare size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold mb-3">1. Prompt Analysis</h3>
          <p className="text-[var(--text-secondary)] text-base max-w-xs">
            Your prompt is analyzed for task type, complexity, and domain expertise requirements
          </p>
        </motion.div>
        
        <motion.div 
          className="hidden md:block w-24 h-1 bg-[var(--primary)] bg-opacity-30"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ transformOrigin: 'left' }}
        />
        
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-20 h-20 rounded-full bg-[var(--primary)] bg-opacity-10 flex items-center justify-center mb-6">
            <Brain size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold mb-3">2. Model Selection</h3>
          <p className="text-[var(--text-secondary)] text-base max-w-xs">
            The router selects the optimal model based on your task requirements and cost efficiency
          </p>
        </motion.div>
        
        <motion.div 
          className="hidden md:block w-24 h-1 bg-[var(--primary)] bg-opacity-30"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ transformOrigin: 'left' }}
        />
        
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-[var(--primary)] bg-opacity-10 flex items-center justify-center mb-6">
            <ArrowRight size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold mb-3">3. Response Generation</h3>
          <p className="text-[var(--text-secondary)] text-base max-w-xs">
            The selected model generates a high-quality response at the optimal price point
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LLMOrchestrationSimple;