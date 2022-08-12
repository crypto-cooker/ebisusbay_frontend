import React from 'react';
import MySoldNftCollection from "@src/Components/components/MySoldNftCollection";
import {caseInsensitiveCompare} from "@src/utils";
import MyListingsCollection from "@src/Components/components/MyListingsCollection";
import SalesCollection from "@src/Components/components/SalesCollection";
import {useSelector} from "react-redux";

export default function Sales({ address }) {
  const user = useSelector((state) => state.user);

  return caseInsensitiveCompare(address, user.address) ? (
    <MySoldNftCollection walletAddress={address} />
  ) : (
    <SalesCollection sellerId={address} />
  );
}