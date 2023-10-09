import React, {memo} from 'react';
import {GetServerSidePropsContext} from "next";
import {ApiService} from "@src/core/services/api-service";


const Listing = () => {
  return <></>;
};

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  if (!query.id) {
    return {
      notFound: true
    }
  }

  let listings = await ApiService.withKey(process.env.EB_API_KEY as string).getListings({
    listingId: [query.id as string]
  });

  if (listings.data.length < 1) {
    return {
      notFound: true
    }
  }

  const listing = listings.data[0];

  return {
    redirect: {
      permanent: false,
      destination: `/collection/${listing.nftAddress}/${listing.nftId}`
    }
  }
}
export default memo(Listing);

