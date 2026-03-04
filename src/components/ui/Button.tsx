import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'text-slate-400 hover:text-slate-200 transition-colors duration-200',
};
const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', loading, className = '', disabled, ...props
}) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    className={`${variants[variant]} ${sizes[size]} font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    disabled={disabled || loading}
    {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
  >
    {loading ? <span className="animate-spin mr-2">⟳</span> : null}
    {children}
  </motion.button>
);
