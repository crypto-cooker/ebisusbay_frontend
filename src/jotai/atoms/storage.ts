import {atomWithStorage} from "jotai/utils";

type StorageSigner = {
  address: string;
  signature: string;
  date: Date;
}

export const storageSignerAtom =  atomWithStorage<StorageSigner>(
  'eb.auth-signature',
  {
    address: '',
    signature: '',
    date: new Date(),
  },
  {
    getItem(key, initialValue) {
      const storedValue = localStorage.getItem(key)
      try {
        return JSON.parse(storedValue ?? '')
      } catch {
        return initialValue
      }
    },
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem(key) {
      localStorage.removeItem(key)
    },
    subscribe(key, callback, initialValue) {
      if (
        typeof window === 'undefined' ||
        typeof window.addEventListener === 'undefined'
      ) {
        return () => {};
      }

      const handleStorageChange = (e: StorageEvent) => {
        if (e.storageArea === localStorage && e.key === key) {
          let newValue;
          try {
            newValue = JSON.parse(e.newValue ?? '');
          } catch {
            newValue = initialValue;
          }
          callback(newValue);
        }
      };

      window.addEventListener('storage', handleStorageChange)

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    },
  });

