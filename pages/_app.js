import React from 'react';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react';

import { ErrorPage } from '../src/Components/ErrorPage';
import store from '../src/Store/store';
import App from '../src/App';
import { SentryLoggingService } from '../src/services/sentry-logging.service';
import { Site24x7LoggingService } from '../src/services/site24x7-logging.service';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";

import '../src/Assets/styles/style.scss';
import '../src/Assets/styles/override.scss';

SentryLoggingService.init();
Site24x7LoggingService.init();
const queryClient = new QueryClient()

config.autoAddCss = false;

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Sentry.ErrorBoundary fallback={() => <ErrorPage />}>
          <QueryClientProvider client={queryClient}>
            <App Component={Component} pageProps={pageProps} />
          </QueryClientProvider>
        </Sentry.ErrorBoundary>
      </Provider>
    </>
  );
}
