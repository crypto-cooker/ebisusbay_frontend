import {Metadata} from "next";
import ClientLayout from "./client-layout";
import Script from "next/script";
import {DM_Sans} from 'next/font/google';
import Head from "next/head";
import {ReactNode} from "react";

const dmSans = DM_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
});


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
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
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <statusiq-status-widget src="https://status.ebisusbay.com" widget-type="sticky" widget-position="bottom-left"></statusiq-status-widget>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Ebisu\'s Bay — The Leading GameFi NFT Marketplace',
  description: 'The first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community.',
  keywords: 'NFT, NFTMarket, Cronos, CronosNFT, NFT Art, CroFam',
  openGraph: {
    siteName: 'Ebisu\'s Bay Marketplace',
    type: 'website',
    url: 'https://app.ebisusbay.com',
    title: 'Ebisu\'s Bay — The Leading GameFi NFT Marketplace',
    description: 'The first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community.',
    images: 'https://app.ebisusbay.com/img/background/banner-ryoshi-light.webp'
  },
  twitter: {
    site: '@EbisusBay',
    card: 'summary_large_image',
    title: 'Ebisu\'s Bay — The Leading GameFi NFT Marketplace',
    description: 'The first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community.',
    images: 'https://app.ebisusbay.com/img/background/banner-ryoshi-light.webp'
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