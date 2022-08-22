export default {
  Features: {
    AUCTION_OPTION_SALE: ' AUCTION_OPTION_SALE',
    CMS_NOTIFICATIONS: 'CMS_NOTIFICATIONS',
    CMS_FULL_PROFILES: 'CMS_FULL_PROFILES',
    GET_COLLECTION_NEW_ENDPOINT: 'GET_COLLECTION_NEW_ENDPOINT',
  },
  Variables: {
    PARAM: '{PARAM}',
  },
  Regex: {
    DEFAULT_WALLET_ID: /0x[a-fA-F0-9]{40}$/,
    BASE64_IMAGE:
      /^data:image\/(?:gif|png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/,
    BASE64_VIDEO_MP4: /^data:video\/(?:mp4|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/,
  },
}