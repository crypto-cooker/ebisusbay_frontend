import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {keyframes} from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import styled, {createGlobalStyle} from 'styled-components';
import {faFire} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import ListingCollection from '../src/Components/components/ListingCollection';
import HotCollections from '../src/Components/components/HotCollections';
import CurrentDrops from '@src/components-v2/shared/drops/current-drops';
import {getMarketData} from '@src/GlobalState/marketplaceSlice';
import {millisecondTimestamp, newlineText, siPrefixedNumber} from '@src/utils';
import {getTheme, theme} from '@src/Theme/theme';
import {limitSizeOptions} from '@src/Components/components/constants/filter-options';
import LegacyButton from '../src/Components/components/Button';
import {hostedImage} from "@src/helpers/image";
import {appConfig} from "@src/Config";
import Head from "next/head";
import {Center, Heading, SimpleGrid} from "@chakra-ui/react";
import ads from "@src/core/data/ads.json";
import ImageService from "@src/core/services/image";
import {useAppSelector} from "@src/Store/hooks";
import RyoshiDynasties from "@src/components-v2/feature/ryoshi-dynasties/game";
import {ApiService} from "@src/core/services/api-service";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import fallbackConfig from "@src/core/configs/fallbacks/rd-config";
import {useUser} from "@src/components-v2/useUser";

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
    background: #15B619;
    color: #fff;
    animation: mymove 6s infinite alternate-reverse;
  }

  @keyframes mymove {
    from {background-color: #15B619;}
    to {background-color: #b63d15;}
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
    background-image: url(${({ isDark }: {isDark: boolean}) =>
    isDark ? ImageService.translate('/img/background/banner-ryoshi-dark.webp').banner() : ImageService.translate('/img/background/banner-ryoshi-light.webp').banner()});   
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
const featuredAd = ads
  .sort((a, b) => a.weight < b.weight ? 1 : -1)
  .find((ad) => {
    const now = Date.now();
    return now > millisecondTimestamp(ad.start) && (!ad.end || now < millisecondTimestamp(ad.end));
  });

const Home = ({rdConfig}: {rdConfig: RyoshiConfig}) => {
  const history = useRouter();
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < theme.breakpointsNum.md);

  const marketData = useAppSelector((state) => {
    return state.marketplace.marketData;
  });
  const {theme: userTheme} = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const breakpointObserver = ({ target }: {target: any}) => {
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

  const navigateTo = (link: string) => {
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
          <span className="text-uppercase color">Ebisu's Bay Marketplace</span>
        </Heading>
        <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
          <Heading as="h1" size="2xl">
            Discover <span className="color">rare</span> digital art and collect NFTs
          </Heading>
        </Reveal>
        <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
          <p className="lead">
            Ebisu's Bay is dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.
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
              <LegacyButton type="legacy-outlined">Become a Creator</LegacyButton>
            </Link>

            <LegacyButton onClick={() => window.open(`/collection/founding-member`, '_self')} type="legacy-outlined">
              <FontAwesomeIcon icon={faFire} className="me-1" style={{ color: '#ff690e' }} />
              Become a Founding Member
            </LegacyButton>
          </div>
        </Reveal>
        <Reveal className="onStep d-inline" keyframes={inline} delay={900} duration={1200} triggerOnce>
          <div className="row">
            <div className="spacer-single"></div>
            {marketData && (
              <div className="row">
                <div className="col-4 col-sm-4 col-md-4 col-12  mb30 ">
                  <div className="de_count text-center text-md-start">
                    <Heading as="h3" size="xl">
                      <span>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))}</span>
                    </Heading>
                    <h5 className="id-color">Volume</h5>
                  </div>
                </div>

                <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                  <div className="de_count text-center text-md-start">
                    <Heading as="h3" size="xl">
                      <span>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</span>
                    </Heading>
                    <h5 className="id-color">NFTs Sold</h5>
                  </div>
                </div>

                <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                  <div className="de_count text-center text-md-start">
                    <Heading as="h3" size="xl">
                      <span>{siPrefixedNumber(marketData.totalActive)}</span>
                    </Heading>
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
      {/*      <FontAwesomeIcon icon={faBullhorn} /> FORTUNE Token presale ends in <Countdown date={1683586800000} />.{' '}*/}
      {/*      <Link href={'ryoshi-dynasties/token-sale'} style={{fontWeight: 'bold'}}>Enter sale now</Link>*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</section>*/}
      {/*<TokenSale />*/}
      <RyoshiDynasties initialRdConfig={rdConfig}/>
      <Jumbotron.Host isDark={userTheme === 'dark'}>
        {!mobile && <div className="container">{JumbotronData()}</div>}
      </Jumbotron.Host>
      {mobile && JumbotronData()}

      {featuredAd && (
        <section className="gl-legacy container no-bottom no-top">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center pt-5">
                <Heading>{featuredAd.name}</Heading>
                <div className="small-border"></div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex align-items-center">
              <div className="mt-3 fs-5" style={{color:getTheme(userTheme).colors.textColor3}}>
                {newlineText(featuredAd.description)}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 pt-3">
              <div className="mx-auto text-center">
                <img
                  src={featuredAd.image.startsWith('/') ? hostedImage(featuredAd.image) : featuredAd.image}
                  alt={featuredAd.name}
                  className="img-fluid"
                  width="100%"
                />
              </div>
              <div className="d-flex flex-column align-middle">
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="flex-fill mx-auto mt-2" style={{maxWidth:300}}>
                    {featuredAd.links.map((link, index) => (
                      <a key={index} href={link.url} target={link.external ? '_blank' : '_self'} rel="noreferrer">
                        <LegacyButton type="legacy" className="w-100">
                          {link.label}
                        </LegacyButton>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
        <SimpleGrid columns={{base: 2, sm: 2, md: 3, lg: 4}} gap={6}>
          <Center>
            <a href="https://weare.fi/en/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/wearefi-logo.png' : '/img/logos/partners/wearefi-white.png')}
                alt="WeAre Solutions"
                width={userTheme === 'light' ? '64px' : '160px'}
              />
            </a>
          </Center>
          <Center>
            <a href="#">
              <img
                onClick={() => window.logBadgeClick()}
                id="badge-button"
                style={{"width":"240px", "height":"53px"}}
                src={hostedImage(userTheme === 'light' ?
                  '/img/logos/partners/alchemy-light.svg' :
                  '/img/logos/partners/alchemy-dark.svg'
                )}
                alt="Alchemy Supercharged"
              />
            </a>
          </Center>
          <Center>
            <a href="https://www.cronoslabs.org/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/cronos-labs.png' : '/img/logos/partners/cronos-labs-white.png')}
                alt="Cronos Labs"
                width="150px"
              />
            </a>
          </Center>
          <Center>
            <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/coingecko.png' : '/img/logos/partners/coingecko-white.png')}
                alt="CoinGecko"
                width="150px"
              />
            </a>
          </Center>
          <Center>
            <a href="https://www.sentio.xyz/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/sentio.webp' : '/img/logos/partners/sentio-white.webp')}
                alt="sentio"
                width="150px"
              />
            </a>
          </Center>
          <Center>
            <a href="https://crodex.app/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/crodex.png' : '/img/logos/partners/crodex-white.png')}
                alt="CRODEX"
                width="150px"
              />
            </a>
          </Center>
          <Center>
            <a href="https://nebkas.ro" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/nebkas-logo.png' : '/img/logos/partners/nebkas-logo.png')}
                alt="nebkas.co"
                width="128px"
              />
            </a>
          </Center>
          <Center>
            <a href="https://defiolio.com/" target="_blank" rel="noreferrer">
              <img
                src={hostedImage(userTheme === 'light' ? '/img/logos/partners/defiolio.webp' : '/img/logos/partners/defiolio-white.webp')}
                alt="Defiolio"
                width="150px"
              />
            </a>
          </Center>
        </SimpleGrid>
      </section>
    </div>
  );
};
export default Home;

export const getStaticProps = async () => {

  try {
    const rdConfig = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .ryoshiDynasties
      .getGlobalContext();

    return {
      props: {
        rdConfig: rdConfig
      },
    };
  } catch (e) {
    return {
      props: {
        rdConfig: fallbackConfig
      },
    }
  }

}