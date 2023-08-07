import {caseInsensitiveCompare} from "@src/utils";

export const LOCAL_STORAGE_ITEMS = {
  theme: 'THEME',
  authSignature: 'AUTH_SIGNATURE',
  cart: 'CART',
  searchVisits: 'SEARCH_VISITS'
};

export const setThemeInStorage = (theme) => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.theme, theme);
};

export const getThemeInStorage = () => {
  return localStorage.getItem(LOCAL_STORAGE_ITEMS.theme);
};

export const setAuthSignerInStorage = (signer) => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.authSignature, JSON.stringify(signer));
};

export const getAuthSignerInStorage = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEMS.authSignature));
};

export const removeAuthSignerInStorage = () => {
  return localStorage.removeItem(LOCAL_STORAGE_ITEMS.authSignature);
};

export const getCartInStorage = () => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  if (storage) return JSON.parse(storage);
  return [];
};

export const addToCartInStorage = (listingId, {name, image, price, address, id, rank, amount = 1, currency}) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  const cart = storage ? JSON.parse(storage) : [];
  if (!cart.some((o) => o.listingId === listingId)) {
    cart.push({listingId, name, image, price, address, id, rank, amount, currency});
    localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, JSON.stringify(cart));
  }
};

export const removeFromCartInStorage = (listingId) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  let cart = storage ? JSON.parse(storage) : [];
  cart = cart.filter((o) => o.listingId !== listingId);
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

export const addToSearchVisitsInStorage = (collection) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.searchVisits);
  const items = storage ? JSON.parse(storage) : [];
  if (!items.map((o) => o.address.toLowerCase()).includes(collection.address.toLowerCase())) {
    items.push(collection);
    localStorage.setItem(LOCAL_STORAGE_ITEMS.searchVisits, JSON.stringify(items));
  }
};

export const removeSearchVisitFromStorage = (address) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.searchVisits);
  let items = storage ? JSON.parse(storage) : [];
  items = items.filter((o) => !caseInsensitiveCompare(o.address, address));
  localStorage.setItem(LOCAL_STORAGE_ITEMS.searchVisits, JSON.stringify(items));
};