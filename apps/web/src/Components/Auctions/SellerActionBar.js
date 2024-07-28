import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {createSuccessfulTransactionToastContent} from '@market/helpers/utils';
import {auctionState} from '@src/core/api/enums';
import {getAuctionDetails} from '@market/state/redux/slices/auctionSlice';
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {useAppDispatch} from "@market/state/redux/store/hooks";

const SellerActionBar = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const contractService = useContractService();
  const [runAuthedFunction] = useAuthedFunction();

  const [awaitingAcceptace, setAwaitingAcceptace] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [executingStart, setExecutingStart] = useState(false);
  const [executingCancel, setExecutingCancel] = useState(false);
  const [executingAcceptBid, setExecutingAcceptBid] = useState(false);
  const listing = useSelector((state) => state.auction.auction);

  const executeStartAuction = async () => {
    setExecutingStart(true);
    await runFunction(async (writeContract) => {
      console.log('starting auction...', listing.getAuctionIndex, listing.auctionHash);
      return (await writeContract.start(listing.auctionHash)).wait();
    });
    setExecutingStart(false);
  };

  const executeCancelAuction = async () => {
    setExecutingCancel(true);
    await runFunction(async (writeContract) => {
      console.log('cancelling auction...', listing.getAuctionIndex, listing.auctionHash);
      return (await writeContract.cancel(listing.auctionHash)).wait();
    });
    setExecutingCancel(false);
  };

  const executeAcceptBid = async () => {
    setExecutingAcceptBid(true);
    await runFunction(async (writeContract) => {
      console.log('accepting highest bid...', listing.getAuctionIndex, listing.auctionHash, listing.getHighestBidder);
      return (await writeContract.accept(listing.auctionHash)).wait();
    });
    setExecutingAcceptBid(false);
  };

  const executeIncreaseAuctionTime = async (minutes) => {
    await runFunction(async (writeContract) => {
      console.log(`adding ${minutes}m to the auction time...`, listing.getAuctionIndex, listing.auctionHash);
      return (await writeContract.updateRuntime(listing.auctionHash, minutes)).wait();
    });
  };

  const runFunction = async (fn) => {
    runAuthedFunction(async() => {
      try {
        let writeContract = contractService.auction;
        const receipt = await fn(writeContract);
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        dispatch(getAuctionDetails(listing.getAuctionId));
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
    });
  };

  useEffect(() => {
    setAwaitingAcceptace(listing.state === auctionState.ACTIVE && listing.getEndAt < Date.now());
    setIsComplete(listing.state === auctionState.SOLD || listing.state === auctionState.CANCELLED);
  }, [listing]);

  return (
    <div className="mt-4">
      <h4>Seller Options</h4>
      <div className="d-flex flex-row justify-content-between">
        {user.address ? (
          <>
            {listing.state === auctionState.NOT_STARTED && (
              <PrimaryButton
                onClick={executeStartAuction}
                isLoading={executingStart}
                loadingText='Starting'
                mb={5}
                me={15}
              >
                Start Auction
              </PrimaryButton>
            )}
            {!awaitingAcceptace && !isComplete && (
              <>
                <PrimaryButton
                  onClick={executeCancelAuction}
                  isLoading={executingCancel}
                  loadingText='Cancelling'
                  mb={5}
                  me={15}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => executeIncreaseAuctionTime(5)}
                  mb={5}
                  me={15}
                >
                  Increase Time (5m)
                </PrimaryButton>
              </>
            )}
            {awaitingAcceptace && !isComplete && (
              <PrimaryButton
                onClick={executeAcceptBid}
                isLoading={executingAcceptBid}
                loadingText='Accepting Bid'
                mb={5}
                me={15}
              >
                Accept Bid
              </PrimaryButton>
            )}
          </>
        ) : (
          <>
            <span>Connect wallet above to manage auction</span>
          </>
        )}
      </div>
    </div>
  );
};
export default SellerActionBar;
