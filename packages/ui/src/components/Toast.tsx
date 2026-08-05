import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  onDismiss: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  onDismiss,
  duration = 5000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(id), duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [id, duration, onDismiss]);

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-sky-500 shrink-0" />;
    }
  };

  const getBorderClass = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100';
      case 'error':
        return 'border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100';
      case 'warning':
        return 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-100';
      case 'info':
      default:
        return 'border-sky-500/20 bg-sky-50/90 dark:bg-sky-950/80 text-sky-900 dark:text-sky-100';
    }
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2',
        getBorderClass()
      )}
    >
      {renderIcon()}
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold mb-0.5">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-md"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
