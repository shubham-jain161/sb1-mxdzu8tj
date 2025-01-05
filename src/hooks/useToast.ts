import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(current => [...current, { id, type, message }]);
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return { toasts, showToast };
}