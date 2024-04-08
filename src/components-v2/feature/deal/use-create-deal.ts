import {useState} from 'react';
import UUID from "uuid-int";
import {getItemType} from "@src/helpers/chain";
import {appConfig} from "@src/Config";
import {useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {BarterState} from "@src/jotai/atoms/deal";
import useCreateOrderSigner, {ItemType, OfferItem, OrderSignerProps} from "@src/hooks/use-create-order-signer";
import {ethers} from "ethers";
import {ciEquals} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";

const generator = UUID(0);
const config = appConfig();

export interface PendingDeal {
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

export const isTokenAddressType = (type: number) => [ItemType.NATIVE, ItemType.ERC20].includes(type);
export const isNftAddressType = (type: number) => [ItemType.ERC721, ItemType.ERC1155].includes(type);

const useCreateDeal = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });

  const [_, signOrder] = useCreateOrderSigner();
  const { requestSignature } = useEnforceSignature();

  const user = useUser();

  const createDeal = async (barterState: BarterState) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();

      const makerItems: OfferItem[] = [];
      for (const nft of barterState.maker.nfts) {
        const itemType = await getItemType(nft.nftAddress);
        makerItems.push({
          itemType,
          token: nft.nftAddress,
          identifierOrCriteria: nft.nftId.toString(),
          startAmount: nft.amountSelected,
          endAmount: nft.amountSelected
        });
      }
      for (const token of barterState.maker.erc20) {
        const amount = ethers.utils.parseUnits(token.amount.toString(), token.decimals);
        makerItems.push({
          itemType: ciEquals(token.address, ethers.constants.AddressZero) ? ItemType.NATIVE : ItemType.ERC20,
          token: token.address,
          identifierOrCriteria: 0,
          startAmount: amount,
          endAmount: amount
        });
      }

      const takerItems: OfferItem[] = [];
      for (const nft of barterState.taker.nfts) {
        const itemType = await getItemType(nft.nftAddress);
        takerItems.push({
          itemType,
          token: nft.nftAddress,
          identifierOrCriteria: nft.nftId.toString(),
          startAmount: nft.amountSelected,
          endAmount: nft.amountSelected
        });
      }
      for (const token of barterState.taker.erc20) {
        const amount = ethers.utils.parseUnits(token.amount.toString(), token.decimals);
        takerItems.push({
          itemType: ciEquals(token.address, ethers.constants.AddressZero) ? ItemType.NATIVE : ItemType.ERC20,
          token: token.address,
          identifierOrCriteria: 0,
          startAmount: amount,
          endAmount: amount
        });
      }

      const startDate = Date.now();
      const endDate = Math.floor(barterState.endDate ?
        barterState.endDate.getTime() / 1000 :
        (startDate + barterState.duration!) / 1000
      );

      const orderSignerProps: OrderSignerProps = {
        taker: barterState.taker.address,
        makerItems: makerItems,
        takerItems: takerItems,
        startDate: Math.floor(Date.now() / 1000),
        endDate: endDate,
        salt: generator.uuid(),
      };

      const {objectSignature, objectHash} = await signOrder(orderSignerProps);

      const res = await ApiService.withoutKey().createDeal({
        makerAddress: user.address!,
        makerTokenAddresses: orderSignerProps.makerItems.map(item => item.token),
        makerTokenIds: orderSignerProps.makerItems.map(item => item.identifierOrCriteria.toString()),
        makerQuantities: orderSignerProps.makerItems.map(item => item.endAmount.toString()),
        takerAddress: orderSignerProps.taker,
        takerTokenAddresses: orderSignerProps.takerItems.map(item => item.token),
        takerTokenIds: orderSignerProps.takerItems.map(item => item.identifierOrCriteria.toString()),
        takerQuantities: orderSignerProps.takerItems.map(item => item.endAmount.toString()),
        startDate: orderSignerProps.startDate,
        endDate: orderSignerProps.endDate,
        salt: orderSignerProps.salt,
        signature: objectSignature,
        digest: objectHash,
        parentId: barterState.parentId,
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

  return [createDeal, response] as const;
};

export default useCreateDeal;
