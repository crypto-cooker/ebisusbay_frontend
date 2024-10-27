'use client'

import React, {ReactNode, useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import * as Sentry from '@sentry/react';

import store from '@market/state/redux/store';
import {Site24x7LoggingService} from '@src/third-party/site24x7';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ChakraProvider} from '@chakra-ui/react'

import customTheme from "@src/global/theme/theme";
import {Web3Modal} from "@src/components-v2/web3modal";
import {UserProvider} from "@src/components-v2/shared/contexts/user";
import DefaultHead from "@src/components-v2/shared/layout/default-head";
import {getAnalytics} from "@firebase/analytics";
import {initializeApp} from "firebase/app";
import firebaseConfig from "@src/third-party/firebase";
import ClientLayoutState from "./client-layout-state";
import dynamic from "next/dynamic";
import {State} from "wagmi";

Site24x7LoggingService.init();

const firebase = initializeApp(firebaseConfig);
const queryClient = new QueryClient();
const ColorModeScript = dynamic(
  () => import('@chakra-ui/react').then((mod) => mod.ColorModeScript),
  { ssr: false }
);

type ClientLayout = {
  children: ReactNode,
  initialState: State | undefined,
}

export default function ClientLayout({children, initialState}: ClientLayout) {
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
          <ChakraProvider theme={customTheme}>
            <Web3Modal initialState={initialState}>
              <QueryClientProvider client={queryClient} >
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
              </QueryClientProvider>
            </Web3Modal>
          </ChakraProvider>
        </Sentry.ErrorBoundary>
      </Provider>
    </>
  );
}
