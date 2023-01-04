import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {appConfig} from "@src/Config";
import { ERC721 } from "@src/Contracts/Abis";
import { Contract, ethers } from "ethers";
import { toast } from 'react-toastify';

const useSignature = () => {
  const user = useSelector((state) => state.user);
  const config = appConfig();

  const [isLoading, setIsLoading] = useState(false);

  const domain = {
    name: 'EB TradeShip',
    version: '1.0',
    chainId: config.chain.id,
    verifyingContract: config.contracts.gaslessListing
  };

  // The named list of all type definitions
  const types = {
    Listing: [
      { name: 'seller', type: 'address' },
      { name: 'coin', type: 'address' },
      { name: 'price', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'sellby', type: 'uint256' },
      { name: 'nonce', type: 'uint256' }
    ]
  };

  const checkApproval = async (nftAddress) => {
    const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.gaslessListing);
  };

  const approveContract = useCallback(async (nftAddress) => {
    try {
      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.gaslessListing, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    } finally {
      setExecutingApproval(false);
    }
  }, [user]);

  const signMessage = useCallback(
    async (value) => {
      if (!user.provider) throw new Error();
      console.log(value)
      try {
        const provider = user.provider;
        const signer = provider.getSigner();
        return await signer._signTypedData(domain, types, value);
      } catch (err) {
        console.log(err)
        throw new Error(err);
      }
    },
    [user.provider]
  );

  const createSigner = useCallback(async (signatureValues) => {
    setIsLoading(true);
    const weiPrice = ethers.utils.parseEther(signatureValues.price)
    const value = {
      seller: user.address,
      coin: '0x0000000000000000000000000000000000000000',
      price: weiPrice,
      token: signatureValues.collectionAddress,
      id: signatureValues.tokenId ,
      amount: 1,
      sellby: signatureValues.expirationDate,
      nonce: signatureValues.nonce,
    };

    try {
      const isApprove = await checkApproval(signatureValues.collectionAddress);
      if(!isApprove){
        await approveContract(signatureValues.collectionAddress)
      }
      const signature = await signMessage(value);
      setIsLoading(false);

      return signature;
    } catch (err) {
      console.log(err?.message);
      throw new Error(err);

    }
  }, [signMessage]);

  return [isLoading, createSigner];
};

export default useSignature;
