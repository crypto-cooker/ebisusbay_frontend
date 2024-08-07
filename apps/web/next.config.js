const { withSentryConfig } = require("@sentry/nextjs");
const path = require('path');

const workerDeps = [
  '/packages/smart-router/',
  '/packages/swap-sdk/',
  '/packages/token-lists/',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: false,
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
      'ebisusbay-test-no-op.b-cdn.net',
      'ebisusbay-prod-no-op.b-cdn.net',
      'cdn-prod.ebisusbay.com',
      'cdn-dev.ebisusbay.biz',
      'cdn-test.ebisusbay.biz',
    ],
    formats: ['image/webp'],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  transpilePackages: [
    '@pancakeswap/token-lists',
    '@pancakeswap/utils',
    '@tanstack/query-core',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { webpack, isServer, defaultLoaders }) => {
    config.externals.push(
        "pino-pretty",
        "lokijs",
        "encoding"
    );
    if (!isServer) {
      config.resolve.alias.fs = false;
    }

    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        defaultLoaders.babel,
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
      include: [
        path.resolve(__dirname, '../eb-pancake-frontend/packages'),
      ],
      exclude: /node_modules/,
    });

    config.resolve.alias['jotai'] = path.resolve(__dirname, 'node_modules/jotai');
    config.optimization.minimize = false;

    config.plugins.push(
        new webpack.DefinePlugin({
          __SENTRY_DEBUG__: false,
          __SENTRY_TRACING__: false,
        })
    );

    // Ensure proper handling of worker dependencies (only if relevant)
    if (!isServer && config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups.workerChunks = {
        chunks: 'all',
        test(module) {
          const resource = module.nameForCondition?.() ?? '';
          return resource ? workerDeps.some((d) => resource.includes(d)) : false;
        },
        priority: 31,
        name: 'worker-chunks',
        reuseExistingChunk: true,
      };
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/deal/create',
        destination: '/deal',
        permanent: false,
      },
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
        source: '/collection/crypto-hodlem',
        destination: '/collection/ryoshi-playing-cards',
        permanent: true,
      },
      {
        source: '/collection/crypto-hodlem/:id',
        destination: '/collection/ryoshi-playing-cards/:id',
        permanent: true,
      },
      {
        source: '/collection/jafc-comics',
        destination: '/collection/jafc-comic-rtg-covers',
        permanent: true,
      },
      {
        source: '/collection/jafc-comics/:id',
        destination: '/collection/jafc-comic-rtg-covers/:id',
        permanent: true,
      },
      {
        source: '/drops/crypto-hodlem',
        destination: '/drops/ryoshi-playing-cards',
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
      {
        source: '/izanamiscradle/:id',
        destination: '/api/izanamiscradle/:id',
        permanent: false,
      },
      {
        source: '/swap',
        destination:
          'https://swap.ebisusbay.com/#/swap',
        permanent: false,
        basePath: false,
      },
      {
        source: '/#/swap',
        destination:
          'https://swap.ebisusbay.com/#/swap',
        permanent: false,
        basePath: false,
      },
      {
        source: '/dex/add',
        destination: '/dex/add/v2',
        permanent: false,
      },
      // {
      //   source: '/dex/swap',
      //   destination:
      //     'https://swap.ebisusbay.com/#/swap',
      //   permanent: false,
      //   basePath: false,
      // }
    ];
  }
};

const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "ebisus-bay",
  project: "eb-web",
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  automaticVercelMonitors: false,
}

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryOptions
);