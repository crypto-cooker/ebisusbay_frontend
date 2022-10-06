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

export const addToCartInStorage = (listingId, {name, image, price, address, id}) => {
  let storage = localStorage.getItem(LOCAL_STORAGE_ITEMS.cart);
  const cart = storage ? JSON.parse(storage) : [];
  if (!cart.map((o) => o.listingId).includes(listingId)) {
    cart.push({listingId, name, image, price, address, id});
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