export const LOCAL_STORAGE_ITEMS = {
  theme: 'THEME',
  authSignature: 'AUTH_SIGNATURE',
  cart: 'CART',
  searchVisits: 'SEARCH_VISITS',
  dismissRdAnnouncement: 'DISMISS_RD_ANNOUNCEMENT',
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