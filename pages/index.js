import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { keyframes } from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import styled, { createGlobalStyle } from 'styled-components';
import {faBook, faCoffee, faFire} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Footer from '../src/Components/components/Footer';
import ListingCollection from '../src/Components/components/ListingCollection';
import HotCollections from '../src/Components/components/HotCollections';
import CurrentDrops from '../src/Components/components/CurrentDrops';
import { getMarketData } from '@src/GlobalState/marketplaceSlice';
import { siPrefixedNumber } from '@src/utils';
import {getTheme, theme} from '@src/Theme/theme';
import { limitSizeOptions } from '@src/Components/components/constants/filter-options';
import Button from '../src/Components/components/Button';
import {hostedImage, ImageKitService} from "@src/helpers/image";
import {appConfig} from "@src/Config";
import Head from "next/head";
import {faDiscord, faTwitter} from "@fortawesome/free-brands-svg-icons";

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
  
  .promo {
    padding-bottom: 8px;
    background: #ffee99;
    color: #555;
  }

  @media only screen and (max-width: 1199.98px) {
    .min-width-on-column > span {
      min-width: 200px;
    }  
    .promo {
      padding: 12px 0 !important;
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
  Host: styled.div`
    background-image: url(${({ isDark }) =>
      isDark ? ImageKitService.buildBannerUrl('/img/background/banner-dark.webp') : ImageKitService.buildBannerUrl('/img/background/Ebisus-bg-1_L.webp')});
    background-size: cover;
    background-repeat: no-repeat;
    height: max(100vh, 800px);
    display: flex;
    align-items: center;

    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
      max-width: ${({ theme }) => theme.breakpoints.md};
      height: 200px;
    }
  `,
  Data: styled.div`
    max-width: 700px;

    padding: 1.5rem !important;
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: ${({ theme }) => theme.colors.bgColor2};
    border-radius: 10px;
  `,
};

const Home = () => {
  const history = useRouter();
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < theme.breakpointsNum.md);

  const marketData = useSelector((state) => {
    return state.marketplace.marketData;
  });
  const userTheme = useSelector((state) => {
    return state.user.theme;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const breakpointObserver = ({ target }) => {
        const { innerWidth } = target;
        const newValue = innerWidth < theme.breakpointsNum.md;
        setMobile(newValue);
      };

      window.addEventListener('resize', breakpointObserver);

      return () => {
        window.removeEventListener('resize', breakpointObserver);
      };
    }
  }, [dispatch]);

  const navigateTo = (link) => {
    history.push(link);
  };

  useEffect(
    function () {
      dispatch(getMarketData());
    },
    [dispatch]
  );

  const JumbotronData = () => {
    return (
      <Jumbotron.Data>
        <h6>
          <span className="text-uppercase color">Ebisu's Bay Marketplace</span>
        </h6>
        <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
          <h1>
            Discover <span className="color">rare</span> digital art and collect NFTs
          </h1>
        </Reveal>
        <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
          <p className="lead">
            Ebisu's Bay is the first and largest NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT
            community.
          </p>
        </Reveal>
        <Reveal className="onStep call-to-action" keyframes={inline} delay={800} duration={900} triggerOnce>
          <div className="min-width-on-column mb-2 w-100 d-inline-flex flex-column flex-md-row flex-lg-column flex-xl-row gap-3   align-items-center">
            <span
              onClick={() => window.open('/marketplace', '_self')}
              className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main inline lead"
            >
              Explore
            </span>
            <Link href="/apply">
              <a>
                <Button type="legacy-outlined">Become a Creator</Button>
              </a>
            </Link>

            <Button onClick={() => window.open(`/collection/founding-member`, '_self')} type="legacy-outlined">
              <FontAwesomeIcon icon={faFire} className="me-1" style={{ color: '#ff690e' }} />
              Become a Founding Member
            </Button>
          </div>
        </Reveal>
        <Reveal className="onStep d-inline" keyframes={inline} delay={900} duration={1200} triggerOnce>
          <div className="row">
            <div className="spacer-single"></div>
            {marketData && (
              <div className="row">
                <div className="col-4 col-sm-4 col-md-4 col-12  mb30 ">
                  <div className="de_count text-center text-md-start">
                    <h3>
                      <span>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))}</span>
                    </h3>
                    <h5 className="id-color">Volume</h5>
                  </div>
                </div>

                <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                  <div className="de_count text-center text-md-start">
                    <h3>
                      <span>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</span>
                    </h3>
                    <h5 className="id-color">NFTs Sold</h5>
                  </div>
                </div>

                <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                  <div className="de_count text-center text-md-start">
                    <h3>
                      <span>{siPrefixedNumber(marketData.totalActive)}</span>
                    </h3>
                    <h5 className="id-color">Active Listings</h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </Jumbotron.Data>
    );
  };

  return (
    <div>
      <Head>
        <title>Ebisu's Bay Marketplace</title>
        <link rel="canonical" key="link_canonical" href={appConfig('urls.app')} />
      </Head>
      <GlobalStyles />
      {/*<section className="promo">*/}
      {/*  <div className="d-flex justify-content-center px-3">*/}
      {/*    <p className="my-auto me-3">*/}
      {/*      <FontAwesomeIcon icon={faBullhorn} /> The Cronos chain is currently experiencing intermittent issues*/}
      {/*      preventing successful transactions. For Metamask users, please try temporarily changing your RPC URL*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</section>*/}
      <Jumbotron.Host isDark={userTheme === 'dark'}>
        {!mobile && <div className="container">{JumbotronData()}</div>}
      </Jumbotron.Host>
      {mobile && JumbotronData()}

      <section className="container no-bottom no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center pt-5">
              <h2>ClubCRO</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-flex align-items-center">
            <div className="mt-3" style={{color:getTheme(userTheme).colors.textColor3}}>
              <p>
                ClubCRO is a conglomerate who share a belief that everyone should have control over their money, data and identity. We understand the mission of CRO within the context of mass adoption and the wider financial landscape.
              </p>
              <p>
                We're creating our own community validator which will run nodes to process network transactions and help secure the Crypto.org Chain, return staking rewards for 8 more years to fund our weekly giveaways, and will also give us voting power on major Cronos decisions.
              </p>

              <p className="text-center">
                The weekly giveaways will return 15,000 CRO in the form of:<br />
                <span className="fw-bold">1st place: 7,500 CRO</span><br />
                <span className="fw-bold">2nd place: 5,000 CRO</span><br />
                <span className="fw-bold">3rd place: 2,500 CRO</span><br />
                & if you don’t win, we will buy back your NFT for 5,000 CRO!
              </p>

              <div style={{fontSize: 12}}>
              <div>
                *You may win multiple times. After each win, your NFT will be placed on an automatic 4-week hold, and will automatically be re-entered after the holding period
              </div>
              <div>
                *Buybacks will occur at the 4-year mark and every 2 years thereafter, until the end of the program
              </div>
              <div>
                *This is the very first asset-backed NFT on Cronos
              </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 pt-3">
            <div className="mx-auto text-center">
              <img
                src={hostedImage('/img/promos/clubcro.webp')}
                alt="ClubCRO"
                className="img-fluid"
                width="100%"
                style={{maxWidth: '600px'}}
              />
            </div>
            <div className="card-body d-flex flex-column align-middle">
              <div className="d-flex justify-content-between flex-wrap">
                <div className="flex-fill mx-1 mt-2">
                  <a href="https://clubcro.fi/files/ClubCRO_whitepaper.pdf" target="_blank" rel="noreferrer">
                    <Button type="legacy-outlined" className="w-100">
                      <FontAwesomeIcon icon={faBook} className="me-1"/> Whitepaper
                    </Button>
                  </a>
                </div>
                <div className="flex-fill mx-1 mt-2">
                  <a href="https://twitter.com/ClubCRO" target="_blank" rel="noreferrer">
                    <Button type="legacy-outlined" className="w-100">
                      <FontAwesomeIcon icon={faTwitter} className="me-1"/> Twitter
                    </Button>
                  </a>
                </div>
                <div className="flex-fill mx-1 mt-2">
                  <a href="https://discord.gg/YbXEd44xdZ" target="_blank" rel="noreferrer">
                    <Button type="legacy-outlined" className="w-100">
                      <FontAwesomeIcon icon={faDiscord} className="me-1"/> Discord
                    </Button>
                  </a>
                </div>
                <div className="flex-fill mx-1 mt-2">
                  <a href="https://clubcro.fi/elite-mint" target="_blank" rel="noreferrer">
                    <Button type="legacy" className="w-100">
                       Mint Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container no-bottom">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Current Drops</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <CurrentDrops />
          </div>
        </div>
      </section>

      <section className="container no-bottom">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <HotCollections />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Listings</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <ListingCollection limitSize={limitSizeOptions.md} showLoadMore={false} />
          </div>
          <div className="col-lg-12">
            <div className="spacer-single"></div>
            <span onClick={() => navigateTo(`/marketplace`)} className="btn-main lead m-auto">
              View Marketplace
            </span>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Frens</h2>
              <div className="small-border"></div>
            </div>
          </div>
        </div>
        <div className="row align-items-center text-center">
          <div className="col">
            <a href="https://nebkas.ro" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/nebkas-logo.png' : '/img/logos/nebkas-logo.png')}
                alt="nebkas.co"
                width="128px"
              />
            </a>
          </div>
          <div className="col">
            <a href="https://weare.fi/en/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/wearefi-logo.png' : '/img/logos/wearefi-white.png')}
                alt="WeAre Solutions"
                width={userTheme === 'light' ? '64px' : '160px'}
              />
            </a>
          </div>
          <div className="col">
            <a href="https://phenix.finance/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/phenix.svg' : '/img/logos/phenix-white.svg')}
                alt="Phenix Finance"
                width="100px"
              />
            </a>
          </div>
          <div className="col">
            <a href="https://crodex.app/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/crodex.png' : '/img/logos/crodex-white.png')}
                alt="CRODEX"
                width="150px"
              />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Home;
