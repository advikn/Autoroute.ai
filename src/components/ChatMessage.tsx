import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ReactMarkdown from 'react-markdown';
import { User, CreditCard, Copy, Check, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import ModelLogo from './ModelLogo';
import { useTheme } from '../context/ThemeContext';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);
  const language = className?.replace('language-', '') || 'text';

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#F2F2F7]'} rounded-xl overflow-hidden border border-[var(--border-color)]`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] bg-opacity-50">
        <div className="flex items-center">
          <Terminal size={14} className="text-[var(--primary)] mr-2" />
          <span className="text-xs font-medium uppercase">{language}</span>
        </div>
        <motion.button
          onClick={handleCopy}
          className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
        </motion.button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed">
        <code className={`language-${language} text-sm font-mono`}>
          {children}
        </code>
      </pre>
    </div>
  );
};

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, model, estimatedCost } = message;
  const { theme } = useTheme();
  
  const isUser = role === 'user';
  
  return (
    <motion.div
      className={`flex mb-3 sm:mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className={`max-w-[90%] sm:max-w-[85%] rounded-lg p-3 sm:p-4 ${
        isUser 
          ? `${theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#4A4AFF]'} text-${theme === 'dark' ? '[var(--text-primary)]' : 'white'} rounded-[20px] rounded-tr-[5px]` 
          : `${theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#E5E5EA]'} text-${theme === 'dark' ? '[var(--text-primary)]' : 'black'} rounded-[20px] rounded-tl-[5px]`
      }`}>
        <div className="flex items-center mb-1.5 sm:mb-2">
          {isUser ? (
            <motion.div
              className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-[#0A84FF]'
              }`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <User size={12} className={theme === 'dark' ? 'text-[var(--primary)]' : 'text-white'} />
            </motion.div>
          ) : (
            model && (
              <motion.div 
                className="mr-2 sm:mr-3"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <ModelLogo modelName={model} size={24} />
              </motion.div>
            )
          )}
          
          <div className="flex items-center text-xs sm:text-sm">
            {isUser ? (
              <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-white' : 'text-white'}`}>You</span>
            ) : (
              <span className="truncate max-w-[80px] sm:max-w-none text-xs sm:text-sm">
                {model || 'Assistant'}
              </span>
            )}
          </div>
          {!isUser && estimatedCost && (
          <motion.div
            className={`ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A] text-[var(--primary)]' 
                : 'bg-[#E5E5EA] text-[var(--primary)]'
            } border border-[var(--primary)] border-opacity-20`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide">Cost:</span>
            <span className="font-mono text-xs font-medium">${estimatedCost.toFixed(6)}</span>
          </motion.div>
          )}
        </div>
        
        <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert' : ''} text-sm sm:text-base leading-relaxed ${isUser ? 'text-white' : ''}`}>
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                if (inline) {
                  return <code {...props}>{children}</code>;
                }
                return (
                  <div className="not-prose">
                    <CodeBlock className={className}>{String(children)}</CodeBlock>
                  </div>
                );
              },
              p: ({ children }) => {
                return <div className="mb-4 last:mb-0">{children}</div>;
              }
            }}
          >{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;