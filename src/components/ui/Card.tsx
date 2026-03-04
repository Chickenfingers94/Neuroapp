import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, animate = false }) => {
  const base = `glass-card p-4 ${onClick ? 'cursor-pointer glass-card-hover' : ''} ${className}`;
  if (animate) {
    return (
      <motion.div
        className={base}
        onClick={onClick}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }
  return <div className={base} onClick={onClick}>{children}</div>;
};
