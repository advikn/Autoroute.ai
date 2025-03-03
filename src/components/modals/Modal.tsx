import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, icon }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [onClose]);

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div className="modal-container">
      <motion.div
        className="fixed inset-0 modal-overlay flex items-center justify-center p-2 sm:p-4 overflow-hidden"
        style={{ zIndex: 99999 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          ref={modalRef}
          className={`modal-content rounded-lg w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col ${
            theme === 'dark' 
              ? 'bg-black bg-opacity-90 backdrop-blur-md' 
              : 'bg-white bg-opacity-90 backdrop-blur-md'
          }`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 modal-header">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center">
              {icon && <span className="mr-2 text-[var(--text-primary)]">{icon}</span>}
              {title}
            </h2>
            <motion.button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--border-color)] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X size={18} className="text-[var(--text-primary)]" />
            </motion.button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Modal;