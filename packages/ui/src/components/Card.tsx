import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glass = false, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm transition-all duration-200',
          glass
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
            : 'bg-white dark:bg-slate-900',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
