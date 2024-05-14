import {Metadata} from "next";
import ClientLayout from "./client-layout";
import Script from "next/script";
import {DM_Sans} from 'next/font/google';
import Head from "next/head";
import {ReactNode} from "react";

import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";

import '../src/global/assets/styles/style.scss';
import '../src/global/assets/styles/override.scss';
import GoogleAnalytics from '@src/components-v2/shared/third-party/google-analytics';

const dmSans = DM_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

config.autoAddCss = false;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <GoogleAnalytics  />
      <Head>
        <Script type="module"
                src="https://js-wc.site24x7static.com/site24x7/client/statusiq_status_widget/statusiq-status-widget.esm.js?12_2024"
                strategy="beforeInteractive"></Script>
        <Script noModule
                src="https://js-wc.site24x7static.com/site24x7/client/statusiq_status_widget/statusiq-status-widget.js?12_2024"
                strategy="beforeInteractive"></Script>

        {/* Alchemy */}
        <Script strategy="beforeInteractive">
          const BADGE_ID = 'xhfjcoQoaZOdb4VhRFk5q5z9BuBctt7n';
        </Script>
        <Script
          src="https://static.alchemyapi.io/scripts/analytics/badge-analytics.js"
          strategy="beforeInteractive">
        </Script>
      </Head>
      <body className={dmSans.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <statusiq-status-widget src="https://status.ebisusbay.com" widget-type="sticky" widget-position="bottom-left"></statusiq-status-widget>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Ebisu\'s Bay | GameFi - NFT Market - DEX',
  description: 'A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.',
  keywords: 'NFT, NFTMarket, DEX, Cronos, CronosNFT, NFT Art, CroFam',
  openGraph: {
    siteName: 'Ebisu\'s Bay Marketplace',
    type: 'website',
    url: 'https://app.ebisusbay.com',
    title: 'Ebisu\'s Bay | GameFi - NFT Market - DEX',
    description: 'A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.',
    images: 'https://app.ebisusbay.com/img/background/banner-default.webp'
  },
  twitter: {
    site: '@EbisusBay',
    card: 'summary_large_image',
    title: 'Ebisu\'s Bay | GameFi - NFT Market - DEX',
    description: 'A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.',
    images: 'https://app.ebisusbay.com/img/background/banner-default.webp'
  },
  manifest: '/manifest.json?v=1',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png?v=4',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg?v=3',
        color: '#5bbad5'
      }
    ]
  },
  other: {
    'msapplication-TileColor': '#ffc40d',
    'theme-color': '#ffffff',
  }
}