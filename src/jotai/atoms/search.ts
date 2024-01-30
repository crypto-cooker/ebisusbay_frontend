import {atomWithStorage} from "jotai/utils";
import {atom} from "jotai/index";

export interface SearchHistoryItem {
  address: string;
  name: string;
  slug: string;
  stats: any;
  verification?: {
    verified: boolean;
    doxx: boolean;
    kyc: boolean;
  }
}

export const searchHistoryAtom = atomWithStorage<SearchHistoryItem[]>('eb.search-history', [],{
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)
    try {
      const value = JSON.parse(storedValue ?? '')
      const invalidItems = getInvalidCartItems(value);

      if (invalidItems.length > 0) {
        const validItems = value.filter((item: SearchHistoryItem) => !invalidItems.includes(item));
        localStorage.setItem(key, JSON.stringify(validItems));
        return validItems;
      }

      return value;
    } catch {
      return initialValue
    }
  },
  setItem(key, value) {
    const invalidItems = getInvalidCartItems(value);
    if (invalidItems.length > 0) {
      const validItems = value.filter((item: SearchHistoryItem) => !invalidItems.includes(item));
      localStorage.setItem(key, JSON.stringify(validItems));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
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
          const invalidItems = getInvalidCartItems(newValue);
          if (invalidItems.length > 0) {
            const validItems = newValue.filter((item: SearchHistoryItem) => !invalidItems.includes(item));
            localStorage.setItem(key, JSON.stringify(validItems));
            callback(validItems);
          } else {
            callback(newValue);
          }
        } catch {
          callback(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  },
});

const getInvalidCartItems = (data: any): SearchHistoryItem[] => {
  if (!Array.isArray(data)) return [];

  return data.filter((item: any) => {
    const hasEssentialFields = item.address &&
      item.name &&
      item.slug &&
      item.stats &&
      item.verification;

    return !hasEssentialFields;
  });
};