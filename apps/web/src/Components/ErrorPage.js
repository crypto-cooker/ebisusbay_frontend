import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle, default as styled } from 'styled-components';

import { getMarketData } from '@market/state/redux/slices/marketplaceSlice';
import { useAppDispatch } from "@market/state/redux/store/hooks";
import { theme } from '../global/theme/theme';
import { hostedImage } from "../helpers/image";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
   }
`;

const GlobalStyles = createGlobalStyle`
  .header-card {
    background: #FFFFFFDD;
    border-radius: 10px;
  }
    
  .de_count h3 {
    font-size: 36px;
    margin-bottom: 0px;
  }
  
  @media only screen and (max-width: 1199.98px) {
    .min-width-on-column > span {
      min-width: 200px;
    }  
  }
  
  @media only screen and (max-width: 464px) {
    .header-card .call-to-action {
        text-align: center !important
    }
    
    //  jumbotron
    .h-vh {
      height: unset !important;
      min-height: 100vh;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
`;

const Jumbotron = {
  Host: styled.div.attrs(({ theme }) => ({
    className: '',
  }))`
    background-image: url(${() =>
      hostedImage('/img/background/banner-ryoshi-dark.webp')});
    background-size: cover;
    height: max(100vh, 800px);
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      max-width: 768px;
      height: 200px;
    }
  `,
  Data: styled.div.attrs(({ theme }) => ({
    className: '',
  }))`
    max-width: 700px;

    padding: 1.5rem !important;
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: #212428dd;
    border-radius: 10px;
  `,
};

export const ErrorPage = () => {
  const dispatch = useAppDispatch();

  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < theme.breakpointsNum.md);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const breakpointObserver = ({ target }) => {
      const { innerWidth } = target;
      const newValue = innerWidth < theme.breakpointsNum.md;
      setMobile(newValue);
    };

    window.addEventListener('resize', breakpointObserver);

    return () => {
      window.removeEventListener('resize', breakpointObserver);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMarketData());
    // eslint-disable-next-line
  }, []);

  const JumbotronData = () => {
    return (
      <Jumbotron.Data>
        <h6>
          <span className="text-uppercase color">SORRY SOMETHING WENT WRONG</span>
        </h6>
        <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
          <h3>Either something went wrong or the page doesn't exist anymore.</h3>
        </Reveal>

        <Reveal className="onStep call-to-action" keyframes={inline} delay={800} duration={900} triggerOnce>
          <div className="min-width-on-column mb-2 w-100 d-inline-flex flex-column flex-md-row flex-lg-column flex-xl-row gap-3   align-items-center">
            <span
              onClick={() => typeof window !== 'undefined' && window.open('/', '_self')}
              className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main inline lead"
            >
              GO TO HOMEPAGE
            </span>
          </div>
        </Reveal>
      </Jumbotron.Data>
    );
  };

  return (
    <div>
      <GlobalStyles />
      <Jumbotron.Host isDark={true}>
        {!mobile && <div className="container">{JumbotronData()}</div>}
      </Jumbotron.Host>
      {mobile && JumbotronData()}
    </div>
  );
};

export default ErrorPage;
