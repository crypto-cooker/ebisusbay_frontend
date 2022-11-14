import React from 'react';

import Footer from '../../components/Footer';
import CuratedAuctionCollection from "./CuratedAuctionCollection";
import PageHead from "../../Head/PageHead";
import {Heading} from "@chakra-ui/react";
import Image from "next/image";
import ReactPlayer from "react-player";

const CronosMutantApesAuction = () => {
  const name = 'Legendary Mutant Serum Auction';
  const description = 'This is your last chance to get one of the 10 Legendary Serums from Cronos Mutant Apes! \n' +
    'By burning this special Serum you are guaranteed to get one of the 10 Legendary Mutant Apes. \n' +
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
      <section className="no-bottom shadow-lg" style={{
        backgroundImage:`url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color:'white'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 my-auto">
              <Heading as="h2" size="xl" className="mb-2" style={{color:'white'}}>
                {name}
                <span className="ms-2">
                   <Image src={image} width={30} height={30} />
                </span>
              </Heading>
              <p>
                This is your last chance to get one of the 10 Legendary Serums from Cronos Mutant Apes!<br />
                By burning this special Serum you are guaranteed to get one of the 10 Legendary Mutant Apes. <br />
                To do so, you'll just need to hold 1 Cronos Apes and use this DAPP: <a href="https://app.cronosapesnft.com/lab" target="_blank">https://app.cronosapesnft.com/lab</a>
              </p>
            </div>
            <div className="col-md-6 text-center my-auto">
              <div className="player-wrapper">
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
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="gl-legacy container pt-5">
        <div className="row">
          <div className="col-lg-12 pt-3">
            <CuratedAuctionCollection collectionId="0x33e0b91c773d500fb4de87957740f5d200be7371" />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default CronosMutantApesAuction;
