import { useState, useCallback } from 'react';

export type DialogType = 'error' | 'success' | 'info' | 'warning';

export interface DialogOptions {
  onConfirm?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
}

interface DialogState extends DialogOptions {
  title: string;
  message: string;
  type: DialogType;
}

export function useStatusDialog() {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const hideDialog = useCallback(() => {
    setDialog((prev) => {
      prev?.onCancel?.();
      return null;
    });
  }, []);

  const showDialog = useCallback(
    (title: string, message: string, type: DialogType = 'info', options: DialogOptions = {}) => {
      setDialog({ title, message, type, ...options });
    },
    []
  );

  return {
    dialog,
    isOpen: Boolean(dialog),
    hideDialog,
    showDialog,
  };
}
