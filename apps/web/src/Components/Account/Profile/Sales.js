import React from 'react';
import MySoldNftCollection from "@src/Components/components/MySoldNftCollection";
import {ciEquals} from "@market/helpers/utils";
import SalesCollection from "@src/Components/components/SalesCollection";
import {useUser} from "@src/components-v2/useUser";

export default function Sales({ address }) {
  const user = useUser();

  return ciEquals(address, user.address) ? (
    <MySoldNftCollection walletAddress={address} />
  ) : (
    <SalesCollection sellerId={address} />
  );
}