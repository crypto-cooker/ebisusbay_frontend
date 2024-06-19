import React from 'react';
import {Provider} from 'react-redux';
import * as Sentry from '@sentry/react';

import {ErrorPage} from '@src/Components/ErrorPage';
import store from '@market/state/redux/store';
import {Site24x7LoggingService} from '@src/third-party/site24x7';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {ChakraProvider} from '@chakra-ui/react'

import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";

import '../src/global/assets/styles/style.scss';
import '../src/global/assets/styles/override.scss';
import customTheme from "@src/global/theme/theme";
import {AppProps} from "next/app";
import App from "@src/components-v2/app";
import {Web3Modal} from "@src/components-v2/web3modal";
import {UserProvider} from "@src/components-v2/shared/contexts/user";
import {DM_Sans} from "next/font/google";
import GoogleAnalytics from '@src/components-v2/shared/third-party/google-analytics';
import {ErrorLoggerProvider} from "@market/hooks/use-error-logger";

Site24x7LoggingService.init();
const queryClient = new QueryClient()

config.autoAddCss = false;
const dmSans = DM_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin']
});

export default function MyApp({ Component, pageProps }: AppProps) {
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           // With SSR, we usually want to set some default staleTime
  //           // above 0 to avoid refetching immediately on the client
  //           staleTime: 60 * 1000,
  //         },
  //       },
  //     }),
  // )

  return (
    <main className={dmSans.className}>
      <Provider store={store}>
        <Sentry.ErrorBoundary fallback={() => <ErrorPage />}>
          <ErrorLoggerProvider>
            <QueryClientProvider client={queryClient}>
              <ChakraProvider theme={customTheme}>
                <Web3Modal>
                  <UserProvider>
                    <App Component={Component} {...pageProps} />
                    <GoogleAnalytics  />
                  </UserProvider>
                </Web3Modal>
              </ChakraProvider>
            </QueryClientProvider>
          </ErrorLoggerProvider>
        </Sentry.ErrorBoundary>
      </Provider>
    </main>
  );
}
