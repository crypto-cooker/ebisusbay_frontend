import React from 'react';
import MyListingsCollection from "@src/Components/components/MyListingsCollection";
import {useSelector} from "react-redux";
import {caseInsensitiveCompare} from "@src/utils";
import SalesCollection from "@src/Components/components/SalesCollection";
import ListingCollection from "@src/Components/components/ListingCollection";

export default function Listings({ address }) {
  const user = useSelector((state) => state.user);

  return caseInsensitiveCompare(address, user.address) ? (
    <MyListingsCollection walletAddress={address} />
  ) : (
    <ListingCollection sellerId={address} />
  )
}