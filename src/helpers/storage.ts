import {caseInsensitiveCompare} from "@src/utils";

export const LOCAL_STORAGE_ITEMS = {
  theme: 'THEME',
  authSignature: 'AUTH_SIGNATURE',
  cart: 'CART',
  searchVisits: 'SEARCH_VISITS',
  dismissRdAnnouncement: 'DISMISS_RD_ANNOUNCEMENT',
};

export const setThemeInStorage = (theme: string) => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.theme, theme);
};

export const getThemeInStorage = () => {
  return localStorage.getItem(LOCAL_STORAGE_ITEMS.theme);
};

export const getCartInStorage = () => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  try {
    if (storage) return JSON.parse(storage);
  } catch (e) {
    clearCartInStorage();
    return [];
  }
};

type CartItem = {
  name: string;
  image: string;
  price: number;
  address: string;
  id: string;
  rank: number;
  amount: number;
  currency: string;
}

export const addToCartInStorage = (listingId: string, {name, image, price, address, id, rank, amount = 1, currency}: CartItem) => {
  let storage = getCartInStorage();
  const cart = storage ? JSON.parse(storage) : [];
  if (!cart.some((o: any) => o.listingId === listingId)) {
    cart.push({listingId, name, image, price, address, id, rank, amount, currency});
    localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, JSON.stringify(cart));
  }
};

export const removeFromCartInStorage = (listingId: string) => {
  let storage = getCartInStorage();
  let cart = storage ? JSON.parse(storage) : [];
  cart = cart.filter((o: any) => o.listingId !== listingId);
  localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, JSON.stringify(cart));
};

export const clearCartInStorage = () => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, JSON.stringify([]));
};

export const getSearchVisitsInStorage = () => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.searchVisits);
  if (storage) return JSON.parse(storage);
  return [];
};

export const addToSearchVisitsInStorage = (collection: any) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.searchVisits);
  const items = storage ? JSON.parse(storage) : [];
  if (!items.map((o: any) => o.address.toLowerCase()).includes(collection.address.toLowerCase())) {
    items.push(collection);
    localStorage.setItem(LOCAL_STORAGE_ITEMS.searchVisits, JSON.stringify(items));
  }
};

export const removeSearchVisitFromStorage = (address: string) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.searchVisits);
  let items = storage ? JSON.parse(storage) : [];
  items = items.filter((o: any) => !caseInsensitiveCompare(o.address, address));
  localStorage.setItem(LOCAL_STORAGE_ITEMS.searchVisits, JSON.stringify(items));
};

export const getBooleanValue = (key: string) => {
  return localStorage.getItem(key);
}

export const setBooleanValue = (key: string, value: boolean) => {
  localStorage.setItem(key, value.toString());
}

export const persistRdAnnouncementDismissal = () => {
  setBooleanValue(LOCAL_STORAGE_ITEMS.dismissRdAnnouncement, true);
}

export const isRdAnnouncementDismissed = () => {
  return getBooleanValue(LOCAL_STORAGE_ITEMS.dismissRdAnnouncement);
}