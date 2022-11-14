import React from 'react';
import Footer from '../../components/Footer';
import CuratedAuctionCollection from "./CuratedAuctionCollection";
import PageHead from "../../Head/PageHead";
import {Box, Heading} from "@chakra-ui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {ImageKitService} from "@src/helpers/image";
import Reveal from "react-awesome-reveal";
import styled from "styled-components";
import {keyframes} from "@emotion/react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const HeroSection = styled.section`
  border-radius: 0;
  margin: 0;
  padding: 0 0;
  background-size: cover;
  width: 100%;
  min-height: 75vh;
  position: relative;
  display: flex;
  align-items: center;

  .h-vh {
    height: 100vh;
    display: flex;
    align-items: center;
    background-position: center;
    background-size: cover;
  }
`;
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

const CronosMutantApesAuction = () => {
  const name = 'Legendary Mutant Serum Auction';
  const description = 'This is your last chance to get one of the 10 Legendary Serums from Cronos Mutant Apes! \n' +
    'By burning this special Serum you are guaranteed to get one of the 10 Legendary Mutant Apes (Last Sale: 100K CRO). \n' +
    'To do so, you\'ll just need to hold 1 Cronos Apes and use this DAPP: https://app.cronosapesnft.com/lab.';
  const image = 'https://cdn.ebisusbay.biz/collections/mutant-serum_Lrqx04cXt.gif';
  const background = 'https://cdn.ebisusbay.biz/collections/mutant-serum-auction_pTRuSIxBd.png';
  const video = 'https://cdn.ebisusbay.biz/collections/mutant-serum-auction_43Ax4cE8B.mp4';

  return (
    <>
      <PageHead
        title={name}
        description={description}
        url="/mutant-serum"
        image={image}
      />
      <HeroSection
        className={`jumbotron tint`}
        style={{
          backgroundImage: `url(${ImageKitService.buildBannerUrl(background)})`
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="spacer-single"></div>
              <div className="spacer-double"></div>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <div>
                  <Heading as="h1" size="xl" className="col-white mb-4">{name}</Heading>
                </div>
              </Reveal>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <div className="lead col-white mb-4">
                  <p>This is your last chance to get one of the 10 Legendary Serums from Cronos Mutant Apes!</p>
                  <p>By burning this special Serum you are guaranteed to get one of the 10 Legendary Mutant Apes (Last Sale: 100K CRO).</p>
                  <p>To do so, you'll just need to hold 1 Cronos Apes and use this DAPP: <a href="https://app.cronosapesnft.com/lab" target="_blank">https://app.cronosapesnft.com/lab</a></p>
                </div>
              </Reveal>
              <div className="spacer-10"></div>
            </div>
            <div className="col-lg-6 mb-4 mb-sm-0">
              <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                <Box className="player-wrapper">
                  <ReactPlayer
                    className="react-player"
                    controls
                    url={video}
                    config={{
                      file: {
                        attributes: {
                          onContextMenu: (e) => e.preventDefault(),
                          controlsList: 'nodownload',
                        },
                      },
                    }}
                    muted={true}
                    playing={true}
                    loop={true}
                    width="100%"
                    height="100%"
                  />
                </Box>
              </Reveal>
            </div>
          </div>
        </div>
      </HeroSection>
      <section className="gl-legacy container pt-5">
        <div className="row">
          <div className="col-12 col-md-4 text-center">
            <Image src={image} width={350} height={350} />
          </div>
          <div className="col-12 col-md-8 pt-3">
            <CuratedAuctionCollection collectionId="0x33e0b91c773d500fb4de87957740f5d200be7371" />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default CronosMutantApesAuction;
