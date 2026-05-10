import { useWatch } from 'react-hook-form';
import { useState, useEffect } from 'react';

type StatusMode = 'create' | '';

export function useFormStatus<T extends Record<string, any>>(
  fieldName: keyof T,
  control: any,
  currentData?: T
) {
  const watchValue = useWatch({ name: fieldName as string, control });
  const [status, setStatus] = useState<StatusMode>('create');

  useEffect(() => {
    if (currentData) {
      if (watchValue === currentData?.[fieldName]) {
        setStatus(''); // allow inactive if same record
      } else {
        setStatus('create'); // only active for new value
      }
    } else {
      setStatus('create'); // fresh create mode
    }
  }, [watchValue, currentData, fieldName]);

  return status;
}
