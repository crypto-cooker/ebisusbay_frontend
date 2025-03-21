import React, {useState} from 'react';

import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import {createSuccessfulTransactionToastContent} from '@market/helpers/utils';
import {ERC721} from '@src/global/contracts/Abis';
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useContractService, useUser} from "@src/components-v2/useUser";

const CreateAuction = () => {
  const user = useUser();
  const contractService = useContractService();

  const [nftAddress, setNftAddress] = useState('');
  const [nftId, setNftId] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [executing, setExecuting] = useState(false);

  async function onCreatePressed() {
    if (!nftAddress || !nftId || !startingBid) return;

    let bid = ethers.utils.parseUnits(startingBid);
    console.log('writing...', nftAddress, nftId, bid);
    try {
      setExecuting(true);
      await setApprovalForAll();
      const tx = await contractService.auction.createAuction(nftAddress, nftId, bid);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setNftAddress('');
      setNftId('');
      setStartingBid('');
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    } finally {
      setExecuting(false);
    }
  }

  const setApprovalForAll = async () => {
    try {
      const isApproved = await contractService.auction.isApproved(nftAddress, user.address);
      if (!isApproved) {
        let writeContract = await new ethers.Contract(nftAddress, ERC721, user.provider.getSigner());
        let tx = await writeContract.setApprovalForAll(contractService.auction.address, true);
        await tx.wait();
      }
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <h1>Create an Auction</h1>
        </div>
      </div>
      <div>
        <form>
          <h2>Contract Address: </h2>
          <input
            className="form-control"
            type="text"
            placeholder="e.g. 0x3D483b8b288c53a123f1e9DAf29ec2B5Ab18e528"
            onChange={(event) => setNftAddress(event.target.value)}
          />
          <h2>NFT ID: </h2>
          <input
            className="form-control"
            type="text"
            placeholder="e.g. 1"
            onChange={(event) => setNftId(event.target.value)}
          />
          <h2>Starting Bid (MAD): </h2>
          <input
            className="form-control"
            type="text"
            placeholder="e.g. 10 MAD"
            onChange={(event) => setStartingBid(event.target.value)}
          />
        </form>
        <br />
        <PrimaryButton
          onClick={onCreatePressed}
          loadingText='Creating...'
          isLoading={executing}
        >
          Create
        </PrimaryButton>
      </div>
    </div>
  );
};
export default CreateAuction;
