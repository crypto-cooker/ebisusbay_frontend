import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { initializeApp } from 'firebase/app';
import { initializeAnalytics } from 'firebase/analytics';

import ScrollToTopBtn from '@src/modules/layout/navbar/ScrollToTop';
import Header from '@src/components-v2/shared/layout/navbar';
import firebaseConfig from './Firebase/firebase_config';
import { initProvider } from './GlobalState/User';
import { appInitializer } from './GlobalState/InitSlice';
import { getTheme } from './Theme/theme';
import DefaultHead from "@src/components-v2/shared/layout/default-head";
import {useColorMode} from "@chakra-ui/react";
import {syncCartStorage} from "@src/GlobalState/cartSlice";
import Footer from "@src/components-v2/shared/layout/footer";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: smooth;
  }
  .jumbotron.tint{
    background-color: rgba(0,0,0,0.6);
    background-blend-mode: multiply;
  }
  .jumbotron.breadcumb.no-bg.tint {
    background-image: url(${({ isDark }) =>
      isDark ? '/img/background/header-dark.webp' : '/img/background/Ebisu-DT-Header.webp'});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
  }
    
  @media only screen and (max-width: 768px) {
    .jumbotron.breadcumb.no-bg.tint {
      background-image: url(${({ isDark }) =>
        isDark ? '/img/background/mobile-header-dark.webp' : '/img/background/Ebisu-Mobile-Header.webp'});
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
`;

function App({ Component, pageProps }) {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode()

  const userTheme = useSelector((state) => {
    return state.user.theme;
  });

  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', userTheme);
  }

  useEffect(() => {
    dispatch(appInitializer());
  }, [dispatch]);

  useEffect(() => {
    const firebase = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
      initializeAnalytics(firebase);
      dispatch(initProvider());
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('initialLoader');
      if (loader) loader.style.display = 'none';
    }
  }, []);

  useEffect(() => {
    dispatch(syncCartStorage());
  }, []);

  return (
    <ThemeProvider theme={getTheme(userTheme)}>
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
    </ThemeProvider>
  );
}

export default App;
