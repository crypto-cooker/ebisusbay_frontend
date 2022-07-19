import React from 'react';
import MySoldNftCollection from "@src/Components/components/MySoldNftCollection";

export default function Sales({ address }) {

  return (
    <><MySoldNftCollection walletAddress={address} /></>
  )
}