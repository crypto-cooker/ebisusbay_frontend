import { Html, Head, Main, NextScript } from 'next/document';
import {appConfig} from "../src/Config";
import Script from "next/script";
const cdn = appConfig('urls.cdn');

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=4" />
        <link rel="icon" type="image/png" href={`${cdn}favicon.png`} sizes="any" />
        <link rel="shortcut icon" type="image/png" href={`${cdn}favicon.png`} sizes="any" />
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

        <Script type="module"
                src="https://js-wc.site24x7static.com/site24x7/client/statusiq_status_widget/statusiq-status-widget.esm.js?08_2022"
                strategy="beforeInteractive"/>
        <Script noModule
                src="https://js-wc.site24x7static.com/site24x7/client/statusiq_status_widget/statusiq-status-widget.js?08_2022"
                strategy="beforeInteractive"/>
      </Head>
      <body>
        <div id="initialLoader">
          <div className="loader"></div>
        </div>
        <Main />
        <NextScript />
        <statusiq-status-widget src="https://status.ebisusbay.com" widget-type="sticky" widget-position="bottom-left"></statusiq-status-widget>
      </body>
    </Html>
  );
}
