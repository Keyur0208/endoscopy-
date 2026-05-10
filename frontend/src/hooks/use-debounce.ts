import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export type UseDebounceReturn = string;

// Debounce Hook
export function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedSearch(delay = 300) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  return {
    query,
    setQuery,
    debouncedQuery,
  };
}
