import React, {memo} from 'react';
import {getListing} from "@src/core/api";
import {GetServerSidePropsContext} from "next";


const Listing = () => {
  return <></>;
};

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {

  if (!query.id) {
    return {
      notFound: true
    }
  }
  let listing = await getListing(query.id);

  if (!listing) {
    return {
      notFound: true
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: `/collection/${listing.nftAddress}/${listing.nftId}`
    }
  }
}
export default memo(Listing);

