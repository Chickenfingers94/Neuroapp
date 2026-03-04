import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => (
  <main className={`max-w-2xl mx-auto px-4 pb-24 pt-4 ${className}`}>
    {children}
  </main>
);
