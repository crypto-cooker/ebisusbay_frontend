import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";
import {ColorModeScript} from "@chakra-ui/react";
import customTheme from "@src/Theme/theme";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=4" />
        <link rel="icon" type="image/png" href={`/favicon.png`} sizes="any" />
        <link rel="shortcut icon" type="image/png" href={`/favicon.png`} sizes="any" />
        <link rel="manifest" href="/site.webmanifest?v=3" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=3" color="#5bbad5" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#ffffff" />
        <meta content="text/html;charset=utf-8" httpEquiv="Content-Type" />
        <meta content="" name="keywords" />
        <meta content="" name="author" />

        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

        {/* Site 24x7 */}
        <Script type="module"
                src="https://js-wc.site24x7static.com/site24x7/client/statusiq_status_widget/statusiq-status-widget.esm.js?12_2024"
                strategy="beforeInteractive"/>
        <Script noModule
                src="https://js-wc.site24x7static.com/site24x7/client/statusiq_status_widget/statusiq-status-widget.js?12_2024"
                strategy="beforeInteractive"/>

        {/* Alchemy */}
        <Script strategy="beforeInteractive">
          const BADGE_ID = 'xhfjcoQoaZOdb4VhRFk5q5z9BuBctt7n';
        </Script>
        <Script
          src="https://static.alchemyapi.io/scripts/analytics/badge-analytics.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <div id="initialLoader">
          <div className="loader"></div>
        </div>
        <ColorModeScript initialColorMode={customTheme.config.initialColorMode}/>
        <Main/>
        <NextScript/>
        <statusiq-status-widget src="https://status.ebisusbay.com" widget-type="sticky" widget-position="bottom-left"></statusiq-status-widget>
      </body>
    </Html>
  );
}
