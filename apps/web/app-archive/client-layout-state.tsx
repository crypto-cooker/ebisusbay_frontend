import { usePathname } from 'next/navigation';

'use-client';

import React from "react";
import {useGlobalPrices} from "@market/hooks/useGlobalPrices";
import {ExchangePricesContext} from "@src/components-v2/shared/contexts/exchange-prices";
import {useUser} from "@src/components-v2/useUser";
import {getTheme} from "@src/global/theme/theme";
import {createGlobalStyle, ThemeProvider} from "styled-components";
import Header from "@src/components-v2/shared/layout/navbar";
import Footer from "@src/components-v2/shared/layout/footer";
import ScrollToTopBtn from "@src/components-v2/shared/layout/scroll-to-top";
import {toast, ToastContainer} from "react-toastify";
import {useColorMode} from "@chakra-ui/react";

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


export default function ClientLayoutState({children}: { children: React.ReactNode }) {
  const pathname = usePathname();
  const exchangePrices = useGlobalPrices();
  const {theme: userTheme} = useUser();
  const { colorMode } = useColorMode()

  const hideFooter = pathname === '/' || pathname === '/ryoshi';

  return (
    <ThemeProvider theme={getTheme(userTheme)}>
      <ExchangePricesContext.Provider value={{prices: exchangePrices.data ?? []}}>
        <GlobalStyles isDark={userTheme === 'dark'} />
        <Header/>
        <div style={{paddingTop: '74px'}}>
          {children}
        </div>
        {!hideFooter && (
          <>
            <Footer />
            <ScrollToTopBtn />
          </>
        )}
        <ToastContainer
          position={toast.POSITION.BOTTOM_LEFT}
          hideProgressBar={true}
          theme={colorMode}
        />
      </ExchangePricesContext.Provider>
    </ThemeProvider>
  )
}