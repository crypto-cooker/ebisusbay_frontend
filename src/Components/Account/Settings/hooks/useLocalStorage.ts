import { useState, useEffect } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // Set state to current value of localStorage on mount
    const currentValue = window.localStorage.getItem(key);
    if (currentValue !== null) {
      try {
        console.log('setting stored value1', JSON.parse(currentValue))
        setStoredValue(JSON.parse(currentValue));
      } catch {
        console.log('setting stored value2', currentValue)
        setStoredValue(currentValue as T);
      }
    }

    // Listen for changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      console.log('handleStorageChange0', e)
      if (e.key === key) {
        try {
          console.log('handleStorageChange1')
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          console.log('handleStorageChange2', newValue);
          setStoredValue(newValue);
        } catch {
          console.log('handleStorageChange3', e)
          setStoredValue(e.newValue as T);
          console.log('handleStorageChange4', e.newValue)
        }
      }
      console.log('handleStorageChange5')
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    console.log('setValue', valueToStore)
    setStoredValue(prevValue => value instanceof Function ? value(prevValue) : value);

    if (typeof valueToStore === 'string') {
      window.localStorage.setItem(key, valueToStore as string);
    } else {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
