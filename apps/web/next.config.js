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
    const supportedChains = [
      'cronos',
      '25',
      'cronos-testnet',
      '338',
      'cronos-zkevm',
      '388',
      'cronos-zkevm-testnet',
      '282'
    ];
    const chainPattern = supportedChains.join('|');

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
        source: `/collection/:slug((?!${chainPattern}).*)`,
        destination: '/collection/cronos/:slug',
        permanent: true,
      },
      {
        source: `/collection/:slug((?!${chainPattern}).*)/:id`,
        destination: '/collection/cronos/:slug/:id',
        permanent: true,
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
        destination: '/dex/swap',
        permanent: false,
      },
      {
        source: '/#/swap',
        destination: '/dex/swap',
        permanent: true,
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