const LOCAL_STORAGE_ITEMS = {
  theme: 'THEME',
  authSignature: 'AUTH_SIGNATURE',
  cart: 'CART',
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

export const addToCartInStorage = (item) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  const cart = storage ? JSON.parse(storage) : [];
  if (item.market != null && cart.map((o) => !o.market?.id).includes(item.market.id)) {
    cart.push(item);
    localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, JSON.stringify(cart));
  }
};

export const removeFromCartInStorage = (item) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  let cart = storage ? JSON.parse(storage) : [];
  cart = cart.filter((o) => o.market.id !== item.market.id);
  localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, JSON.stringify(cart));
};

export const clearCartInStorage = () => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.cart, []);
};