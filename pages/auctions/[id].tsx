import React, {memo} from 'react';

import AuctionComponent from '../../src/Components/components/AuctionComponent';
import MadAuction from "../../src/Components/Auctions/Curated/MadAuction";
import Blood4NftAuction from "../../src/Components/Auctions/Curated/Blood4NftAuction";
import WorldOfCatsAuction from "@src/Components/Auctions/Curated/WorldOfCats";
import CronosMutantApesAuction from "@src/Components/Auctions/Curated/CronosMutantApes";
import {GetServerSidePropsContext} from "next";

const Auction = ({id}: {id: string}) => {
  if (id === 'mad-auction') {
    return (<MadAuction />)
  } else if (id === 'blood-4-nft') {
    return (<Blood4NftAuction />);
  } else if (id === 'world-of-cats') {
    return (<WorldOfCatsAuction />);
  } else if (id === 'mutant-serum') {
    return (<CronosMutantApesAuction />);
  }  else {
    return (<AuctionComponent id={id} />);
  }
};

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
  return {
    notFound: true
  };
  
  // return {
  //   props: {
  //     id: params?.id
  //   },
  // };
};


export default memo(Auction);
