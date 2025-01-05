import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export function Toast() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
        >
          <span>{toast.message}</span>
          <button className="ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}