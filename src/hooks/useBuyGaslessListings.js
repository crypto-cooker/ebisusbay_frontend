import { useState } from 'react';
import { Contract, ethers } from "ethers";
import { toast } from 'react-toastify';

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner';
import { useSelector } from "react-redux";
import { appConfig } from "@src/Config";
import { getServerSignature } from '@src/core/cms/endpoints/gaslessListing';
import { buyListing } from '@src/core/cms/endpoints/gaslessListing';

import gaslessListingContract from "@src/Contracts/GaslessListing.json";


const useBuyGaslessListings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();
  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const formatListings = (listings) => {
    return listings.map(listing => (listing.nonce) ? 
      {
        seller: listing.seller,
        coin: '0x0000000000000000000000000000000000000000',
        price: ethers.utils.parseEther(`${listing.price}`),
        token: listing.address,
        id: listing.id,
        amount: 1,
        sellby: listing.expirationDate,
        nonce: listing.nonce
      } : {
        seller: listing.seller,
        coin: listing.address,
        price: ethers.utils.parseEther(`${listing.price}`),
        token: listing.address,
        id: listing.id,
        amount: listing.listingId,
        sellby: 0,
        nonce: 0
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
        const { data: serverSig } = await getServerSignature(signatureInStorage, user.address.toLowerCase(), gaslessListings);

        const buyContract = new Contract(config.contracts.gaslessListing, gaslessListingContract.abi, user.provider.getSigner());
        let price = ethers.utils.parseUnits(`${cartPrice}`);
        const marketContract = user.contractService.market;
        const fees = await marketContract.fee(user.address);
        const calculatedFee = (fees / 10000) * 100
        const total = price.add(price.mul(calculatedFee));

        const { signature, ...sigData } = serverSig;
        const newListing = await buyContract.completeListings(contractListings, sigData, signature, { value: total });

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
