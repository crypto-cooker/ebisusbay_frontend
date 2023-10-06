export default {
  Features: {
    AUCTION_OPTION_SALE: ' AUCTION_OPTION_SALE',
    CMS_COLLECTIONS: 'CMS_COLLECTIONS',
    VERIFIED_SWITCH_COLLECTION: 'VERIFIED_SWITCH_COLLECTION',
    VERIFIED_SWITCH_MARKETPLACE: 'VERIFIED_SWITCH_MARKETPLACE',
    UNVERIFIED_WARNING: 'UNVERIFIED_WARNING',
    REPORT_COLLECTION: 'REPORT_COLLECTION'
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
  ItemType: {
    NATIVE: 0,
    ERC721: 1,
    ERC1155: 2,
    ERC20: 3,
    LEGACY_LISTING: 6
  }
}