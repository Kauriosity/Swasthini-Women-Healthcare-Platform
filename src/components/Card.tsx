import React from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-secondary p-6 ${className}`}>
      {children}
    </div>
  );
}
