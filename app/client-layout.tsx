'use client'

import React, {ReactNode, useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import * as Sentry from '@sentry/react';

import store from '@market/state/redux/store';
import {Site24x7LoggingService} from '@src/third-party/site24x7';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
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
import {Web3Modal} from "@src/components-v2/web3modal";
import {UserProvider} from "@src/components-v2/shared/contexts/user";
import DefaultHead from "@src/components-v2/shared/layout/default-head";
import {getAnalytics} from "@firebase/analytics";
import {initializeApp} from "firebase/app";
import firebaseConfig from "@src/third-party/firebase";
import ClientLayoutState from "./client-layout-state";
import dynamic from "next/dynamic";

Site24x7LoggingService.init();

config.autoAddCss = false;

const firebase = initializeApp(firebaseConfig);
const queryClient = new QueryClient();
const ColorModeScript = dynamic(
  () => import('@chakra-ui/react').then((mod) => mod.ColorModeScript),
  { ssr: false }
);

type ClientLayout = {
  children: ReactNode
}

export default function ClientLayout({children}: ClientLayout) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        getAnalytics(firebase);
      }
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      <Provider store={store}>
        <Sentry.ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={customTheme}>
              <Web3Modal>
                <UserProvider>
                  <ClientLayoutState>
                    <DefaultHead />
                    <div className="wraper">
                      {loading ? (
                        <div id="initialLoader">
                          <div className="loader"></div>
                        </div>
                      ) : (
                        <>
                          {children}
                        </>
                      )}
                    </div>
                  </ClientLayoutState>
                </UserProvider>
              </Web3Modal>
            </ChakraProvider>
          </QueryClientProvider>
        </Sentry.ErrorBoundary>
      </Provider>
    </>
  );
}
