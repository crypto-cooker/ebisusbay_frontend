import React from 'react';
import {caseInsensitiveCompare} from "@src/utils";
import {useAppSelector} from "@src/Store/hooks";
import UserPrivateListings from "@src/components-v2/feature/account/profile/tabs/listings/private-listings";
import UserPublicListings from "@src/components-v2/feature/account/profile/tabs/listings/public-listings";

interface ListingsProps {
  address: string;
}
export default function Listings({ address }: ListingsProps) {
  const user = useAppSelector((state) => state.user);

  return caseInsensitiveCompare(address, user.address) ? (
    <UserPrivateListings walletAddress={address} />
  ) : (
    <UserPublicListings walletAddress={address} />
  )
}