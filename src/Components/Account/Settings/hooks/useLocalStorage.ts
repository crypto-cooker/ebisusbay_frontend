import { useState, useEffect } from 'react';

const useLocalStorage = <T>(key: string, initialValue?: T): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;

      // Try parsing, if it's not a string, it should be JSON
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const handleCustomStorageChange = () => {
    const value = window.localStorage.getItem(key);
    if (value) {
      try {
        setStoredValue(JSON.parse(value));
      } catch {
        setStoredValue(value as T);
      }
    }
  };

  const handleNativeStorageChange = (e: StorageEvent) => {
    if (e.key === key) {
      try {
        const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
        setStoredValue(newValue);
      } catch {
        setStoredValue(e.newValue as T);
      }
    }
  };

  useEffect(() => {
    // Listen for custom events (from same tab/window)
    window.addEventListener('custom-storage-event', handleCustomStorageChange);
    // Listen for native storage events (from other tabs/windows)
    window.addEventListener('storage', handleNativeStorageChange);

    return () => {
      window.removeEventListener('custom-storage-event', handleCustomStorageChange);
      window.removeEventListener('storage', handleNativeStorageChange);
    };
  }, [key, initialValue]);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = (value) => {
    const valueToStore = (typeof value === "function")
      ? (value as (prevValue: T | undefined) => T)(storedValue)
      : value;

    setStoredValue(valueToStore);

    if (typeof valueToStore === 'string') {
      window.localStorage.setItem(key, valueToStore as string);
    } else {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }

    // Dispatch a custom event to notify of the change within the same tab/window
    const event = new Event('custom-storage-event');
    window.dispatchEvent(event);
  };


  return [storedValue, setValue];
};

export default useLocalStorage;
