import { useState } from 'react';
import {Contract, ethers} from "ethers";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {useSelector} from "react-redux";
import {appConfig} from "@src/Config";
import Bundle from "@src/Contracts/Bundle.json";
import { createBundle as createBundleRequest } from '@src/core/cms/endpoints/blundles';

const useCreateBundle = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();

  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const createBundle = async (formData) => {
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

        const bundleContract = new Contract(config.contracts.bundle, Bundle.abi, user.provider.getSigner());

        const arrays = formData.nfts.reduce((object, nft)=> {
          return {
            tokens: [...object.tokens, nft.nft.address],
            ids: [...object.ids, nft.nft.id],
            nftImages: [...object.nftImages, {image: nft.nft.image, address: nft.nft.address, id: nft.nft.id}]
          }
        }, {
          tokens: [],
          ids: [],
          nftImages: []
        })
        const newBundle = await bundleContract.wrap(arrays.tokens, arrays.ids) 
        let tbAwait = await newBundle.wait();
        const res = await createBundleRequest(user.address, signatureInStorage, {title: formData.values.title, description: formData.values.description, nftImages: [...arrays.nftImages]})

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return true;
      } catch (error) {
        console.log(error)
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

  return [createBundle, response];
};

export default useCreateBundle;
