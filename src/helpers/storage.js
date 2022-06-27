const LOCAL_STORAGE_ITEMS = {
  theme: 'THEME',
  authSignature: 'AUTH_SIGNATURE',
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
