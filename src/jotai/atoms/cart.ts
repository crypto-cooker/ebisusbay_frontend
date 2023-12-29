import {atomWithStorage} from "jotai/utils";
import {atom} from "jotai/index";

export interface CartItem {
  listingId: string;
  name: string;
  image: string;
  price: number | string;
  address: string;
  id: string;
  rank?: number;
  amount: number;
  currency: string;
  isBundle?: boolean;
}

export const cartOpenAtom = atom<boolean>(false);
export const cartItemsAtom = atomWithStorage<CartItem[]>('eb.cart', [],{
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)
    try {
      const value = JSON.parse(storedValue ?? '')
      const invalidItems = getInvalidCartItems(value);

      if (invalidItems.length > 0) {
        const validItems = value.filter((item: CartItem) => !invalidItems.includes(item));
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
      const validItems = value.filter((item: CartItem) => !invalidItems.includes(item));
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
            const validItems = newValue.filter((item: CartItem) => !invalidItems.includes(item));
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

const getInvalidCartItems = (data: any): CartItem[] => {
  if (!Array.isArray(data)) return [];

  return data.filter((item: any) => {
    const hasEssentialFields = item.listingId &&
      item.price &&
      item.address &&
      item.id &&
      item.amount &&
      item.currency;

    const validPrice = !isNaN(Number(item.price));

    return !hasEssentialFields || !validPrice;
  });
};