import React from 'react';
import {caseInsensitiveCompare} from "@market/helpers/utils";
import UserPrivateListings from "@src/components-v2/feature/account/profile/tabs/listings/private-listings";
import UserPublicListings from "@src/components-v2/feature/account/profile/tabs/listings/public-listings";
import {useUser} from "@src/components-v2/useUser";

interface ListingsProps {
  address: string;
}
export default function Listings({ address }: ListingsProps) {
  const user = useUser();

  return caseInsensitiveCompare(address, user.address) ? (
    <UserPrivateListings walletAddress={address} />
  ) : (
    <UserPublicListings walletAddress={address} />
  )
}