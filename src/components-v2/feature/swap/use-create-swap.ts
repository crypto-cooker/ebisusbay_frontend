import {useState} from 'react';
import {upsertListing} from '@src/core/cms/endpoints/gaslessListing';
import UUID from "uuid-int";
import {getItemType} from "@src/helpers/chain";
import {appConfig} from "@src/Config";
import {useContractService, useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {BarterState} from "@src/jotai/atoms/swap";
import useCreateOrderSigner, {ItemType, OfferItem, OrderSignerProps} from "@src/hooks/use-create-order-signer";
import {BigNumber, ethers} from "ethers";
import {ciEquals} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";

const generator = UUID(0);
const config = appConfig();

export interface PendingSwap {
  collectionAddress: string;
  tokenId: string;
  price: number;
  amount: number;
  expirationDate: number;
  is1155: boolean;
  currencySymbol?: string;
  listingId?: string;
}

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useCreateSwap = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });

  const [_, signOrder] = useCreateOrderSigner();
  const { requestSignature } = useEnforceSignature();

  const user = useUser();

  const createSwap = async (barterState: BarterState) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();

      const makerItems: OfferItem[] = [];
      for (const nft of barterState.userA.nfts) {
        const itemType = await getItemType(nft.nftAddress);
        makerItems.push({
          itemType,
          token: nft.nftAddress,
          identifierOrCriteria: BigNumber.from(nft.nftId),
          startAmount: nft.amountSelected,
          endAmount: nft.amountSelected
        });
      }
      for (const nft of barterState.userA.erc20) {
        makerItems.push({
          itemType: ciEquals(nft.address, ethers.constants.AddressZero) ? ItemType.NATIVE : ItemType.ERC20,
          token: nft.address,
          identifierOrCriteria: 0,
          startAmount: nft.amount,
          endAmount: nft.amount
        });
      }

      const takerItems: OfferItem[] = [];
      for (const nft of barterState.userB.nfts) {
        const itemType = await getItemType(nft.nftAddress);
        takerItems.push({
          itemType,
          token: nft.nftAddress,
          identifierOrCriteria: BigNumber.from(nft.nftId),
          startAmount: nft.amountSelected,
          endAmount: nft.amountSelected
        });
      }
      for (const nft of barterState.userB.erc20) {
        takerItems.push({
          itemType: ciEquals(nft.address, ethers.constants.AddressZero) ? ItemType.NATIVE : ItemType.ERC20,
          token: nft.address,
          identifierOrCriteria: 0,
          startAmount: nft.amount,
          endAmount: nft.amount
        });
      }

      const startDate = Date.now();
      const endDate = Math.floor(barterState.endDate ?
        barterState.endDate.getTime() / 1000 :
        (startDate + barterState.duration!) / 1000
      );

      const orderSignerProps: OrderSignerProps = {
        taker: barterState.userA.address,
        makerItems: makerItems,
        takerItems: takerItems,
        startDate: Math.floor(Date.now() / 1000),
        endDate: endDate,
        salt: generator.uuid(),
      };

      const {objectSignature, objectHash} = await signOrder(orderSignerProps);

      const res = await ApiService.withoutKey().createSwap({
        makerAddress: user.address!,
        makerTokenAddresses: orderSignerProps.makerItems.map(item => item.token),
        makerTokenIds: orderSignerProps.makerItems.map(item => item.identifierOrCriteria.toString()),
        makerQuantities: orderSignerProps.makerItems.map(item => item.startAmount),
        takerAddress: orderSignerProps.taker,
        takerTokenAddresses: orderSignerProps.takerItems.map(item => item.token),
        takerTokenIds: orderSignerProps.takerItems.map(item => item.identifierOrCriteria.toString()),
        takerQuantities: orderSignerProps.takerItems.map(item => item.startAmount),
        startDate: orderSignerProps.startDate,
        endDate: orderSignerProps.endDate,
        salt: orderSignerProps.salt,
        signature: objectSignature,
        digest: objectHash
      }, user.address!, signature);

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return [createSwap, response] as const;
};

export default useCreateSwap;
