import React from 'react';

import CuratedAuctionCollection from "./CuratedAuctionCollection";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Heading} from "@chakra-ui/react";
import Image from "next/image";

const WorldOfCatsAuction = () => {
  const name = 'World of Cats Auction';
  const description = 'Special customized World Of Cats auctioned for charity. 100% of the proceeds go to World Of Cats charity fund, which will then be given forward to cat shelters. Winner of this auction gets airdropped token id 0 from the World Of Cats collection & can design his own personalized NFT.';
  const image = 'https://cdn-prod.ebisusbay.com/collections/woc-prereveal_yJ1SI3qFp.png';

  return (
    <>
      <PageHead
        title={name}
        description={description}
        url="/world-of-cats"
        image={image}
      />
      <section className="no-bottom shadow-lg" style={{background:'black', color:'white'}}>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 my-auto">
              <div className="text-center">
                <Heading as="h2" size="xl" className="mb-2" style={{color:'white'}}>{name}</Heading>
                <p>{description}</p>
              </div>
            </div>
            <div className="col-sm-6  text-center">
              <Image
                src={image}
                width={168}
                height={300}
                alt="World of Cats"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="gl-legacy container pt-5">
        <div className="row">
          <div className="col-lg-12 pt-3">
            <CuratedAuctionCollection collectionId="0x4Ce0B9608006533dA056170f1efe8eEa771e0d19" />
          </div>
        </div>
      </section>
    </>
  );
};
export default WorldOfCatsAuction;
