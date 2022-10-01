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
import {Box, Center, Heading, Text, VStack} from "@chakra-ui/react";
import Image from "next/image";

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
      isDark ? ImageKitService.buildBannerUrl('/img/background/seashrine-dark.webp') : ImageKitService.buildBannerUrl('/img/background/seashrine-light.webp')});
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
        <Heading as="h6" size="sm">
          <span className="text-uppercase color">Ebisu's Bay Presents: SeaShrine</span>
        </Heading>
          <div className="d-flex">
            <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
              <Box minH={175} minW={150}>
                <img src="https://cdn.ebisusbay.biz/dragon_animation_AiB8XEPbr.gif?tr=w-150"/>
              </Box>
            </Reveal>
            <VStack>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <Heading as="h1" size="xl">
                  A community-based marketplace for rare art NFTs
                </Heading>
              </Reveal>
              <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                <Text className="lead">
                  Now is your chance to mint a VIP founding membership on SeaShrine an Aptos NFT marketplace brought to you by the same team behind Ebisu's Bay!
                </Text>
              </Reveal>
            </VStack>
          </div>
        <Reveal className="onStep call-to-action" keyframes={inline} delay={800} duration={900} triggerOnce>
          <div
            className="min-width-on-column mb-2 w-100 d-inline-flex flex-column flex-md-row flex-lg-column flex-xl-row gap-3 align-items-center"
            style={mobile ? '' : {marginLeft:150}}
          >
            <span
              onClick={() => window.open('https://seashrine.io/#mint', '_self')}
              className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main inline lead"
            >
              Mint Now
            </span>
            {/*<Link href="/apply">*/}
            {/*  <a>*/}
            {/*    <Button type="legacy-outlined">Become a Creator</Button>*/}
            {/*  </a>*/}
            {/*</Link>*/}

            {/*<Button onClick={() => window.open(`/collection/founding-member`, '_self')} type="legacy-outlined">*/}
            {/*  <FontAwesomeIcon icon={faFire} className="me-1" style={{ color: '#ff690e' }} />*/}
            {/*  Become a Founding Member*/}
            {/*</Button>*/}
          </div>
        </Reveal>
        {/*<Reveal className="onStep d-inline" keyframes={inline} delay={900} duration={1200} triggerOnce>*/}
        {/*  <div className="row">*/}
        {/*    <div className="spacer-single"></div>*/}
        {/*    {marketData && (*/}
        {/*      <div className="row">*/}
        {/*        <div className="col-4 col-sm-4 col-md-4 col-12  mb30 ">*/}
        {/*          <div className="de_count text-center text-md-start">*/}
        {/*            <Heading as="h3" size="xl">*/}
        {/*              <span>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))}</span>*/}
        {/*            </Heading>*/}
        {/*            <h5 className="id-color">Volume</h5>*/}
        {/*          </div>*/}
        {/*        </div>*/}

        {/*        <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">*/}
        {/*          <div className="de_count text-center text-md-start">*/}
        {/*            <Heading as="h3" size="xl">*/}
        {/*              <span>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</span>*/}
        {/*            </Heading>*/}
        {/*            <h5 className="id-color">NFTs Sold</h5>*/}
        {/*          </div>*/}
        {/*        </div>*/}

        {/*        <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">*/}
        {/*          <div className="de_count text-center text-md-start">*/}
        {/*            <Heading as="h3" size="xl">*/}
        {/*              <span>{siPrefixedNumber(marketData.totalActive)}</span>*/}
        {/*            </Heading>*/}
        {/*            <h5 className="id-color">Active Listings</h5>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</Reveal>*/}
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

      <section className="gl-legacy container no-bottom no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center pt-5">
              <Heading>Fury Quack Gang</Heading>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-flex align-items-center">
            <div className="mt-3" style={{color:getTheme(userTheme).colors.textColor3}}>
              <p className="fs-5 mb-4">
                "It's us, against all."
              </p>
              <p className="fs-5 mb-4">
                The Fury Quack Gang is an NFTs sub-collection of the Fury Mouse Gang. Counting 3500 Fury Ducks. Like the mice, at night the fury takes hold of them and they ravage everything in their path. These creatures are the enemies number 1 of the Fury Mouse Gang and they want to rule on the World. "Best art work on Cronos."
              </p>
              <p className="fs-5">
                Rally, or die.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 pt-3">
            <div className="mx-auto text-center">
              <img
                src={hostedImage('/img/promos/quack.webp')}
                alt="Fury Quack Gang"
                className="img-fluid"
                width="100%"
              />
            </div>
            <div className="d-flex flex-column align-middle">
              <div className="d-flex justify-content-between flex-wrap">
                <div className="flex-fill mx-auto mt-2" style={{maxWidth:300}}>
                  <a href="https://furyquackgang.com/" target="_blank" rel="noreferrer">
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

      <section className="gl-legacy container no-bottom">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>Current Drops</Heading>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <CurrentDrops />
          </div>
        </div>
      </section>

      <section className="gl-legacy container no-bottom">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>Hot Collections</Heading>
              <div className="small-border"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <HotCollections />
          </div>
        </div>
      </section>

      <section className="gl-legacy container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>New Listings</Heading>
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

      <section className="gl-legacy container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Heading>Frens</Heading>
              <div className="small-border"></div>
            </div>
          </div>
        </div>
        <div className="row align-items-center text-center">
          <div className="col">
            <Center>
              <a href="https://nebkas.ro" target="_blank" rel="noreferrer">
                <img
                  src={hostedImage(userTheme === 'light' ? '/img/logos/nebkas-logo.png' : '/img/logos/nebkas-logo.png')}
                  alt="nebkas.co"
                  width="128px"
                />
              </a>
            </Center>
          </div>
          <div className="col">
            <Center>
              <a href="https://weare.fi/en/" target="_blank" rel="noreferrer">
                <img
                  src={hostedImage(userTheme === 'light' ? '/img/logos/wearefi-logo.png' : '/img/logos/wearefi-white.png')}
                  alt="WeAre Solutions"
                  width={userTheme === 'light' ? '64px' : '160px'}
                />
              </a>
            </Center>
          </div>
          <div className="col">
            <Center>
              <a href="https://crodex.app/" target="_blank" rel="noreferrer">
                <img
                  src={hostedImage(userTheme === 'light' ? '/img/logos/crodex.png' : '/img/logos/crodex-white.png')}
                  alt="CRODEX"
                  width="150px"
                />
              </a>
            </Center>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Home;
