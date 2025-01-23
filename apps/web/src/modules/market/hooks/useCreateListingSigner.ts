import {useCallback, useState} from 'react';
import {ethers} from "ethers";
import {useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";
import {useSignTypedData} from "wagmi";
import {useAppChainConfig} from "@src/config/hooks";
import {ChainId} from "@pancakeswap/chains";
import {CmsToken} from "@/components-v2/global-data-fetcher";
import {parseUnits} from "viem";

export interface ListingSignerProps {
  price: string;
  itemType: ItemType;
  collectionAddress: string;
  tokenId: string;
  listingTime: number;
  expirationDate: number;
  salt: number;
  amount: number;
  currency?: CmsToken;
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
  identifierOrCriteria: bigint | number,
  startAmount: bigint | number,
  endAmount: bigint | number
}


const useSignature = (chainId?: number) => {
  const user = useUser();
  const {config} = useAppChainConfig(chainId);
  const { signTypedDataAsync } = useSignTypedData();

  const [isLoading, setIsLoading] = useState(false);

  const domain = {
    name: 'EB TradeShip',
    version: '1.0',
    chainId: chainId ?? ChainId.CRONOS,
    verifyingContract: config.contracts.gaslessListing
  };

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

  function stringed(v: any) {
    return JSON.stringify(v, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    );
  }

  const signMessage = useCallback(async (value: Order) => {
    if (!user.wallet.isConnected) throw new Error();
    try {
      const objectHash = ethers.utils._TypedDataEncoder.hash(domain, typeOrder, value);
      const objectSignature = await signTypedDataAsync({
        domain,
        types: typeOrder,
        primaryType: 'Order',
        message: value
      });

      return { objectSignature, objectHash }
    } catch (err: any) {
      Sentry.captureException(err);
      console.log(err)
      throw err;
    }
  }, [user.wallet.isConnected, user.wallet.address, user.provider.signer]);

  const createSigner = useCallback(async (signatureValues: ListingSignerProps) => {
    setIsLoading(true);

    const isNative = !signatureValues.currency || signatureValues.currency.address === ethers.constants.AddressZero;
    const decimals = signatureValues.currency?.decimals ?? 18;

    const considerationPrice= parseUnits(`${signatureValues.price}`, decimals);
    const offerItem = {
      itemType: signatureValues.itemType,
      token: signatureValues.collectionAddress.toLowerCase(),
      identifierOrCriteria: BigInt(signatureValues.tokenId),
      startAmount: signatureValues.amount ?? 1,
      endAmount: signatureValues.amount ?? 1
    };

    const considerationItem = {
      itemType: isNative ? ItemType.NATIVE : ItemType.ERC20,
      token: signatureValues.currency?.address ?? ethers.constants.AddressZero,
      identifierOrCriteria: BigInt(0),
      startAmount: considerationPrice,
      endAmount: considerationPrice
    };

    const order = {
      offerer: user.address!.toLowerCase(),
      offerings: [offerItem],
      considerations: [considerationItem],
      orderType: isNative ? OrderType.SELL_NFT_NATIVE : OrderType.SELL_NFT_TOKEN,
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
