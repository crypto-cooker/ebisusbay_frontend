// const withTM = require('next-transpile-modules')(['ethers']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'ipfs.io',
      'app.ebisusbay.com',
      'files.ebisusbay.com',
      'gateway.ebisusbay.com',
      'crohomes.mypinata.cloud',
      'cdn.marbleverse.io',
    ],
  },
};

module.exports = nextConfig;
// module.exports = nextConfig;
