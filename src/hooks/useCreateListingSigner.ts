import {useCallback, useState} from 'react';
import {appConfig} from "@src/Config";
import {BigNumber, ethers} from "ethers";
import {useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";

export interface ListingSignerProps {
  price: string;
  itemType: ItemType;
  collectionAddress: string;
  tokenId: string;
  listingTime: number;
  expirationDate: number;
  salt: number;
  amount: number;
  currency?: string;
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
  SELL_NFT_NATIVE,

  //1: ERC20, ERC721, ERC1155 -> ERC20, ERC721, ERC1155
  TOKEN_TRADES,

  //2: NFT -> ERC20
  SELL_NFT_TOKEN,

  OFFER
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
  const user = useUser();
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

  const signMessage = useCallback(async (value: Order) => {
    if (!user.wallet.isConnected) throw new Error();
    try {
      const signer = user.provider.signer;

      const objectHash = ethers.utils._TypedDataEncoder.hash(domain, typeOrder, value);
      const objectSignature = await signer!._signTypedData(domain, typeOrder, value);

      return { objectSignature, objectHash }
    } catch (err: any) {
      Sentry.captureException(err);
      console.log(err)
      throw err;
    }
  }, [user.wallet.isConnected, user.wallet.address, user.provider.signer]);

  const createSigner = useCallback(async (signatureValues: ListingSignerProps) => {
    setIsLoading(true);
    const considerationPrice= ethers.utils.parseEther(`${signatureValues.price}`);
    const offerItem = {
      itemType: signatureValues.itemType,
      token: signatureValues.collectionAddress.toLowerCase(),
      identifierOrCriteria: BigNumber.from(signatureValues.tokenId),
      startAmount: signatureValues.amount ?? 1,
      endAmount: signatureValues.amount ?? 1
    };

    const considerationItem = {
      itemType: signatureValues.currency ? ItemType.ERC20 : ItemType.NATIVE,
      token: signatureValues.currency ?? ethers.constants.AddressZero,
      identifierOrCriteria: 0,
      startAmount: considerationPrice,
      endAmount: considerationPrice
    };

    const order = {
      offerer: user.address!.toLowerCase(),
      offerings: [offerItem],
      considerations: [considerationItem],
      orderType: signatureValues.currency ? OrderType.SELL_NFT_TOKEN : OrderType.SELL_NFT_NATIVE,
      startAt: signatureValues.listingTime,
      endAt: signatureValues.expirationDate,
      salt: signatureValues.salt,
    };

    try {

      const signature = await signMessage(order);
      setIsLoading(false);

      return signature;
    } catch (err: any) {
      Sentry.captureException(err);
      console.log(err?.message);
      throw err;

    }
  }, [signMessage]);

  return [isLoading, createSigner] as const;
};

export default useSignature;
