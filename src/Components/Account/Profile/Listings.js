import React from 'react';
import MyListingsCollection from "@src/Components/components/MyListingsCollection";

export default function Listings({ address }) {

  return (
    <><MyListingsCollection walletAddress={address} /></>
  )
}