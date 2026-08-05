import React from 'react';
import { createPortal } from 'react-dom';
import { useNotificationStore } from '@/stores/notificationStore';
import { Toast } from '@edukalyan/ui';

export const GlobalToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed top-6 right-6 z-[100000] flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <Toast {...toast} onDismiss={removeToast} />
        </div>
      ))}
    </div>,
    document.body
  );
};
