import React, {useEffect} from 'react';
import useCancelGaslessListing from '@src/Components/Account/Settings/hooks/useCancelGaslessListing';
import {toast} from 'react-toastify';
import {createSuccessfulTransactionToastContent, isGaslessListing} from "@src/utils";
import {parseErrorMessage} from "@src/helpers/validator";
import {useContractService} from "@src/components-v2/useUser";

const MyNftCancelDialog = ({ isOpen, listing, onClose }) => {
  const contractService = useContractService();
  const [cancelGaslessListing, response] = useCancelGaslessListing();

  const handleCancelGaslessListing = async () => {
    try {
      await cancelGaslessListing(listing.listingId);
      toast.success('Canceled successfully');
      onClose();
    } catch(error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  }

  const handleCancelLegacyListing = async () => {
    try {
      let tx = await contractService.market.cancelListing(listingId);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }

  useEffect(() => {
    if (isOpen && listing && contractService) {
      if(!isGaslessListing(listing.listingId)){
        handleCancelLegacyListing();
      }
      else{
        handleCancelGaslessListing();
      }
    }
  }, [isOpen, listing, contractService]);

  return <></>;
};

export default MyNftCancelDialog;
