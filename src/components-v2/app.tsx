import React, {useEffect, useState} from 'react';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import {toast, ToastContainer} from 'react-toastify';
import {initializeApp} from 'firebase/app';
import {getAnalytics} from "@firebase/analytics";

import ScrollToTopBtn from '@src/components-v2/shared/layout/scroll-to-top';
import Header from '@src/components-v2/shared/layout/navbar';
import firebaseConfig from '../third-party/firebase';
import {getTheme} from '../global/theme/theme';
import DefaultHead from "@src/components-v2/shared/layout/default-head";
import {Box, Button, HStack, Text, useColorMode, VStack} from "@chakra-ui/react";
import Footer from "@src/components-v2/shared/layout/footer";
import {AppProps} from "next/app";
import {ExchangePricesContext} from "@src/components-v2/shared/contexts/exchange-prices";
import {useGlobalPrices} from "@market/hooks/useGlobalPrices";
import {useUser} from "@src/components-v2/useUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBullhorn} from "@fortawesome/free-solid-svg-icons";
import * as Sentry from "@sentry/nextjs";
import {usePollBlockNumber} from "@eb-pancakeswap-web/state/block/hooks";
import {useAccountEventListener} from "@eb-pancakeswap-web/hooks/useAccountEventListener";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: smooth;
  }
  .jumbotron.tint{
    background-color: rgba(0,0,0,0.6);
    background-blend-mode: multiply;
  }
  .jumbotron.breadcumb.no-bg.tint {
    background-image: url(${({ isDark }: {isDark: boolean}) =>
      isDark ? '/img/background/header-dark.webp' : '/img/background/Ebisu-DT-Header.webp'});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
  }
    
  @media only screen and (max-width: 768px) {
    .jumbotron.breadcumb.no-bg.tint {
      background-image: url(${({ isDark }: {isDark: boolean}) =>
        isDark ? '/img/background/mobile-header-dark.webp' : '/img/background/Ebisu-Mobile-Header.webp'});
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
`;


const firebase = initializeApp(firebaseConfig);

function GlobalHooks() {
  useAccountEventListener()
  return null
}

function App({ Component, ...pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode()
  const exchangePrices = useGlobalPrices();
  const {theme: userTheme} = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('initialLoader');
      if (loader) loader.style.display = 'none';
    }
  }, []);

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
    <ThemeProvider theme={getTheme(userTheme)}>
      <ExchangePricesContext.Provider value={{prices: exchangePrices.data ?? []}}>
        <GlobalHooks />
        <DefaultHead />
        <div className="wraper">
          <GlobalStyles isDark={userTheme === 'dark'} />
          <Header />
          <div style={{paddingTop:'74px'}}>
            <Component {...pageProps} />
          </div>
          <Footer />
          <ScrollToTopBtn />
          <ToastContainer
            position={toast.POSITION.BOTTOM_LEFT}
            hideProgressBar={true}
            theme={colorMode}
          />
        </div>
      </ExchangePricesContext.Provider>
    </ThemeProvider>
  );
}

export default App;


const Notice = () => {
  const getInitialVisibility = () => {
    const storedVisibility = sessionStorage.getItem('showNotice');
    return storedVisibility !== null ? storedVisibility === 'true' : true;
  };

  const [isVisible, setIsVisible] = useState(getInitialVisibility);

  useEffect(() => {
    sessionStorage.setItem('showNotice', isVisible.toString());
  }, [isVisible]);

  return isVisible ? (
    <Box py={2} px={3} bg='#b63d15'>
      <VStack textAlign='center' spacing={0}>
        <HStack>
          <FontAwesomeIcon icon={faBullhorn} className="my-auto"/>
          <Text>
            The Cronos chain is currently experiencing intermittent issues. Some site functions may be temporarily unavailable until chain issues are resolved
          </Text>
        </HStack>
        <Box>
          <Button variant='link' size='sm' onClick={() => setIsVisible(false)}>Hide</Button>
        </Box>
      </VStack>
    </Box>
  ) : null;
};