import { useState } from 'react';
import { Contract, ethers } from "ethers";
import { toast } from 'react-toastify';

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner';
import { useSelector } from "react-redux";
import { appConfig } from "@src/Config";
import { getServerSignature } from '@src/core/cms/endpoints/gaslessListing';
import { buyListing } from '@src/core/cms/endpoints/gaslessListing';
import Constants from '@src/constants';

import gaslessListingContract from "@src/Contracts/GaslessListing.json";

const { ItemType } = Constants;

const useBuyGaslessListings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();
  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const formatListings = (listings ) => {
    return listings.map(listing => {
      const weiPrice = ethers.utils.parseEther(`${listing.price}`);

        const offerItem = {
          itemType: !listing.nonce ? (ItemType.LEGACY_LISTING) : (listing.is1155 ? ItemType.ERC1155 : ItemType.ERC721), //ItemType.ERC721
          token: listing.address ,
          identifierOrCriteria: listing.nonce ? listing.id : listing.listingId,
          startAmount: listing.price,
          endAmount: listing.price
         };
      
         const considerationItem = {
          itemType : 0, //Native
          token: ethers.constants.AddressZero,
          identifierOrCriteria: 0,
          startAmount: weiPrice,
          endAmount: weiPrice
         };

         
         const order = {
           offerer : listing.seller,
           offerings: [offerItem],
           considerations: [considerationItem],
           orderType: 0, //OrderType.SELL_NFT_NATIVE -> 0
           startAt: listing.listingTime,
           endAt: listing.expirationDate ?? 9995868693,
           salt: listing.nonce ?? 12345
          };
          
         return order
      }
    )
  }

  const buyGaslessListings = async (listings, cartPrice) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const contractListings = formatListings(listings);

        const gaslessListings = contractListings.filter(({ nonce }) => !!nonce)
        const buyContract = new Contract(config.contracts.gaslessListing, gaslessListingContract.abi, user.provider.getSigner());
        
        const marketContract = user.contractService.market;
        const price = ethers.utils.parseEther(`${cartPrice}`);

        const fee = price.mul(await marketContract.fee(user.address)).div(10_000);
        const total = price.add(fee);

        const { data: serverSig } = await getServerSignature(signatureInStorage, user.address.toLowerCase(), listings, fee);

        const { signature, ...sigData } = serverSig;
        const tx = await buyContract.fillOrders(contractListings, sigData, signature, { value: total });
        await tx.wait()
        const res = await buyListing(signatureInStorage, user.address.toLowerCase(), gaslessListings)
        toast.success('Nft successfully purchased');

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return true;
      } catch (error) {
        console.log(error)
        toast.error('Error');
        setResponse({
          ...response,
          loading: false,
          error: error,
        });
        throw error;
      }
    } else {
      setResponse({
        isLoading: false,
        response: [],
        error: { message: 'Something went wrong' },
      });

      throw new Error();
    }
  };

  return [buyGaslessListings, response];
};

export default useBuyGaslessListings;
