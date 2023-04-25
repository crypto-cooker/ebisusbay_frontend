// const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    dangerouslyAllowSVG: false,
    domains: [
      'ipfs.io',
      'app.ebisusbay.com',
      'files.ebisusbay.com',
      'gateway.ebisusbay.com',
      'ebisusbay.mypinata.cloud',
      'res.cloudinary.com',
      'ebisusbay.imgix.net',
      'metadata.cronos.domains',
      'ik.imagekit.io',
      'cdn.ebisusbay.com',
      'cdn.ebisusbay.biz',
      'ebisusbay-prod.b-cdn.net',
      'ebisusbay-dev.b-cdn.net',
      'ebisusbay-test.b-cdn.net',
    ],
    formats: ['image/webp'],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: '/brand/:slug',
        destination: '/brands/:slug',
        permanent: true,
      },
      {
        source: '/drops/founding-member',
        destination: '/collection/founding-member',
        permanent: true,
      },
      {
        source: '/drops/carkayous',
        destination: '/drops/carkayous-feral-fish',
        permanent: true,
      },
      {
        source: '/drops/trooprz-skills-boost',
        destination: '/drops/trooprz-skillz-boost',
        permanent: true,
      },
      {
        source: '/drops/painted-pandas',
        destination: '/drops/painted-pandaz',
        permanent: true,
      },
      {
        source: '/drops/boss-frogz',
        destination: '/drops/trooprz-boss-frogz',
        permanent: true,
      },
      {
        source: '/collection/vip-founding-member',
        destination: '/collection/founding-member',
        permanent: true,
      },
      {
        source: '/collection/vip-founding-member/:id',
        destination: '/collection/founding-member/:id',
        permanent: true,
      },
      {
        source: '/collection/mad-treehouse',
        destination: '/collection/mm-treehouse',
        permanent: true,
      },
      {
        source: '/collection/weird-apes-club-v2',
        destination: '/collection/weird-apes-club',
        permanent: true,
      },
      {
        source: '/collection/degen-mad-meerkat',
        destination: '/collection/mad-meerkat-degen',
        permanent: true,
      },
      {
        source: '/collection/degen-mad-meerkat/:id',
        destination: '/collection/mad-meerkat-degen/:id',
        permanent: true,
      },
      {
        source: '/collection/carkayous',
        destination: '/collection/carkayous-feral-fish',
        permanent: true,
      },
      {
        source: '/collection/carkayous/:id',
        destination: '/collection/carkayous-feral-fish/:id',
        permanent: true,
      },
      {
        source: '/collection/corruption',
        destination: '/collection/cpb-bananas',
        permanent: true,
      },
      {
        source: '/collection/corruption/:id',
        destination: '/collection/cpb-bananas/:id',
        permanent: true,
      },
      {
        source: '/collection/troopz-sketchz',
        destination: '/collection/trooprz-sketchz',
        permanent: true,
      },
      {
        source: '/collection/troopz-sketchz/:id',
        destination: '/collection/trooprz-sketchz/:id',
        permanent: true,
      },
      {
        source: '/collection/killacats',
        destination: '/collection/killakatz',
        permanent: true,
      },
      {
        source: '/collection/killacats/:id',
        destination: '/collection/killakatz/:id',
        permanent: true,
      },
      {
        source: '/collection/boss-frogz',
        destination: '/collection/trooprz-boss-frogz',
        permanent: true,
      },
      {
        source: '/collection/boss-frogz/:id',
        destination: '/collection/trooprz-boss-frogz/:id',
        permanent: true,
      },
      {
        source: '/collection/seasonal-cats',
        destination: '/collection/world-of-cats-seasonal',
        permanent: true,
      },
      {
        source: '/collection/seasonal-cats/:id',
        destination: '/collection/world-of-cats-seasonal/:id',
        permanent: true,
      },
      {
        source: '/collection/dr-boo-resurrection',
        destination: '/collection/imagine-artists',
        permanent: true,
      },
      {
        source: '/collection/dr-boo-resurrection/:id',
        destination: '/collection/imagine-artists/:id',
        permanent: true,
      },
      {
        source: '/collection/inventorapes',
        destination: '/collection/inventorsapes',
        permanent: true,
      },
      {
        source: '/collection/inventorapes/:id',
        destination: '/collection/inventorsapes/:id',
        permanent: true,
      },
      {
        source: '/mad-auction',
        destination: '/auctions/mad-auction',
        permanent: false,
      },
      {
        source: '/sales_bot',
        destination:
          'https://discord.com/api/oauth2/authorize?client_id=976699886890254356&permissions=269503504&scope=bot%20applications.commands',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
