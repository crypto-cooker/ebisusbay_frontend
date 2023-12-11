import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import {toast, ToastContainer} from 'react-toastify';
import {initializeApp} from 'firebase/app';
import {getAnalytics} from "@firebase/analytics";

import ScrollToTopBtn from '@src/components-v2/shared/layout/scroll-to-top';
import Header from '@src/components-v2/shared/layout/navbar';
import firebaseConfig from '../third-party/firebase';
import {getTheme} from '../Theme/theme';
import DefaultHead from "@src/components-v2/shared/layout/default-head";
import {useColorMode} from "@chakra-ui/react";
import {syncCartStorage} from "@src/GlobalState/cartSlice";
import Footer from "@src/components-v2/shared/layout/footer";
import {AppProps} from "next/app";
import {ExchangePricesContext} from "@src/components-v2/shared/contexts/exchange-prices";
import {useGlobalPrices} from "@src/hooks/useGlobalPrices";
import {useUser} from "@src/components-v2/useUser";

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

function App({ Component, ...pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode()
  const exchangePrices = useGlobalPrices();
  const {theme: userTheme} = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getAnalytics(firebase);
    }
  }, []);

  useEffect(() => {
    dispatch(syncCartStorage());
    setLoading(false);
  }, []);

  return (
    <ThemeProvider theme={getTheme(userTheme)}>
      <ExchangePricesContext.Provider value={{prices: exchangePrices.data ?? []}}>
        <DefaultHead />
        <div className="wraper">
          {loading ? (
            <div id="initialLoader">
              <div className="loader"></div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </ExchangePricesContext.Provider>
    </ThemeProvider>
  );
}

export default App;
