import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {Contract, ethers} from 'ethers';
import {toast} from 'react-toastify';
import MetaMaskOnboarding from '@metamask/onboarding';
import {useDispatch} from 'react-redux';

import {
  createSuccessfulAddCartContent,
  createSuccessfulTransactionToastContent,
  shortAddress,
  timeSince
} from '@src/utils';
import {chainConnect, connectAccount} from '@src/GlobalState/User';
import {getNftDetails} from '@src/GlobalState/nftSlice';
import {addToCart, openCart} from "@src/GlobalState/cartSlice";
import {useAppSelector} from "@src/Store/hooks";
import ContractService from "@src/core/contractService";
import {TransactionReceipt} from "@ethersproject/abstract-provider";
import ListingItem from "@src/components-v2/feature/nft/tabs/listings/item";

interface ListingsRowProps {
  listing: any;
  nft: any;
}

export default function ListingsRow({ listing, nft }: ListingsRowProps) {
  const dispatch = useDispatch();
  const history = useRouter();

  const user = useAppSelector((state) => state.user);

  const [executingBuy, setExecutingBuy] = useState(false);

  const executeBuy = (amount: number) => async () => {
    setExecutingBuy(true);
    await runFunction(async (writeContract) => {
      let price = ethers.utils.parseUnits(amount.toString());
      return (
        await writeContract.makePurchase(listing.listingId, {
          value: price,
        })
      ).wait();
    });
    setExecutingBuy(false);
  };

  const runFunction = async (fn: (c: Contract) => Promise<TransactionReceipt>) => {
    if (user.address) {
      try {
        const receipt = await fn((user.contractService! as ContractService).market);
        dispatch(getNftDetails(listing.nftAddress, listing.nftId));
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error: any) {
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
      }
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      listingId: listing.listingId,
      name: nft.name,
      image: nft.image,
      price: listing.price,
      address: listing.nftAddress,
      id: listing.nftId,
      rank: nft.rank
    }));
    toast.success(createSuccessfulAddCartContent(() => dispatch(openCart())));
  };

  return (
    <ListingItem
      route="/account"
      buttonText="Add to Cart"
      primaryTitle="Listed by"
      user={listing.seller}
      time={timeSince(listing.listingTime)}
      price={ethers.utils.commify(listing.price)}
      primaryText={shortAddress(listing.seller)}
      onClick={handleAddToCart}
      isProcessing={executingBuy}
    />
  );
}
