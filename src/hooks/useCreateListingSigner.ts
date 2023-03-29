import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { appConfig } from "@src/Config";
import {BigNumber, ethers} from "ethers";
import Constants from '@src/constants';
import {useAppSelector} from "@src/Store/hooks";

export interface ListingSignerProps {
  price: number;
  itemType: ItemType;
  collectionAddress: string;
  tokenId: string;
  listingTime: number;
  expirationDate: number;
  salt: number;
}

export enum ItemType {
  // 0: CRO on mainnet, MATIC on polygon, etc.
  NATIVE,

  // 1: ERC721 items
  ERC721,

  // 2: ERC1155 items
  ERC1155,

  // 3: ERC20 items (ERC777 and ERC20 analogues could also technically work)
  ERC20,

  // 4: ERC721 items where a number of tokenIds are supported
  ERC721_WITH_CRITERIA,

  // 5: ERC1155 items where a number of ids are supported
  ERC1155_WITH_CRITERIA,

  // 6: Legacy Listing from OG bay contract
  LEGACY_LISTING
}

export enum OrderType {
  //0: NFTS -> NATIVE
  SELL_NFT_NATIVE
}

export type Order = {
  offerer: string,
  offerings: OfferItem[],
  considerations: OfferItem[],
  orderType: OrderType,
  startAt: number,
  endAt: number,
  salt: number
}

export type OfferItem = {
  itemType: ItemType,
  token: string,
  identifierOrCriteria: BigNumber | number,
  startAmount: BigNumber | number,
  endAmount: BigNumber | number
}

const useSignature = () => {
  const user = useAppSelector((state) => state.user);
  const config = appConfig();

  const [isLoading, setIsLoading] = useState(false);

  const domain = {
    name: 'EB TradeShip',
    version: '1.0',
    chainId: config.chain.id,
    verifyingContract: config.contracts.gaslessListing
  };

  // The named list of all type definitions
  const typeOrder = {
    OfferItem: [
      { name: 'itemType', type: 'uint8' },
      { name: 'token', type: 'address' },
      { name: 'identifierOrCriteria', type: 'uint256' },
      { name: 'startAmount', type: 'uint256' },
      { name: 'endAmount', type: 'uint256' }
    ],
    Order: [
      { name: 'offerer', type: 'address' },
      { name: 'offerings', type: 'OfferItem[]' },
      { name: 'considerations', type: 'OfferItem[]' },
      { name: 'orderType', type: 'uint8' },
      { name: 'startAt', type: 'uint256' },
      { name: 'endAt', type: 'uint256' },
      { name: 'salt', type: 'uint256' }
    ]
  }

  const signMessage = useCallback(
    async (value: Order) => {
      if (!user.provider) throw new Error();
      try {
        const provider = user.provider;
        const signer = provider.getSigner();

        const objectHash = ethers.utils._TypedDataEncoder.hash(domain, typeOrder, value);
        const objectSignature = await signer._signTypedData(domain, typeOrder, value);

        return { objectSignature, objectHash }
      } catch (err: any) {
        console.log(err)
        throw new Error(err);
      }
    },
    [user.provider]
  );

  const createSigner = useCallback(async (signatureValues: ListingSignerProps) => {
    setIsLoading(true);
    const considerationPrice= ethers.utils.parseEther(`${signatureValues.price}`);
    const offerItem = {
      itemType: signatureValues.itemType,
      token: signatureValues.collectionAddress.toLowerCase(),
      identifierOrCriteria: BigNumber.from(signatureValues.tokenId),
      startAmount: 1,
      endAmount: 1
    };

    const considerationItem = {
      itemType: 0, //Native
      token: ethers.constants.AddressZero,
      identifierOrCriteria: 0,
      startAmount: considerationPrice,
      endAmount: considerationPrice
    };

    const order = {
      offerer: user.address!.toLowerCase(),
      offerings: [offerItem],
      considerations: [considerationItem],
      orderType: 0, //OrderType.SELL_NFT_NATIVE -> 0
      startAt: signatureValues.listingTime,
      endAt: signatureValues.expirationDate,
      salt: signatureValues.salt,
    };

    try {

      const signature = await signMessage(order);
      setIsLoading(false);

      return signature;
    } catch (err: any) {
      console.log(err?.message);
      throw new Error(err);

    }
  }, [signMessage]);

  return [isLoading, createSigner] as const;
};

export default useSignature;
