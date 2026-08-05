import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={twMerge(clsx(base, variants[variant], sizes[size], className))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
