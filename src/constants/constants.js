export default {
  Features: {
    CMS_LISTING: 'cmsListing',
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
};
