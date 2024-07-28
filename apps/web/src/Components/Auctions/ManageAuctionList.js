import React, {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import {sortAndFetchAuctions} from '@src/core/api';
import Clock from '../components/Clock';
import Link from 'next/link';
import {auctionState} from '@src/core/api/enums';
import {Auction} from '@src/core/models/auction';
import {commify} from 'ethers/lib/utils';
import {
  ciEquals,
  createSuccessfulTransactionToastContent,
  isEventValidNumber,
  secondsToDhms
} from "@market/helpers/utils";
import {toast} from "react-toastify";
import {Input, Spinner} from "@chakra-ui/react";
import {useContractService, useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@market/hooks/useAuthedFunction";

const ManageAuctionList = () => {
  const user = useUser();
  const contractService = useContractService();
  const [runAuthedFunction] = useAuthedFunction();

  const [activeAuctions, setActiveAuctions] = useState([]);
  const [unwithdrawnAuctions, setUnwithdrawnAuctions] = useState([]);
  const [openStartConfirmationDialog, setStartConfirmationDialog] = useState(false);
  const [formError, setFormError] = useState(null);
  const [runTime, setRunTime] = useState(0);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [executingStart, setExecutingStart] = useState(false);
  const [dateLabel, setDateLabel] = useState(null);

  const showConfirmationDialog = (auction) => {
    setSelectedAuction(auction);
    setStartConfirmationDialog(true);
  };
  const hideConfirmationDialog = () => {
    setDateLabel(null);
    setFormError(null);
    setSelectedAuction(null);
    setStartConfirmationDialog(false);
  };

  const handleChangeRunTime = (event) => {
    const { value } = event.target;
    const newRunTime = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
    setRunTime(newRunTime);

    let date = new Date(null);
    date.setSeconds(newRunTime);
    setDateLabel(secondsToDhms(newRunTime));
  };

  const validateRunTime = (value) => {
    setFormError(null);
    const newRunTime = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;

    try {
      BigNumber.from(newRunTime);
    } catch (error) {
      setFormError('Run time is too large');
      return false;
    }

    if (newRunTime < 3600) {
      setFormError('Run time must be greater than 1 hour');
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await sortAndFetchAuctions();
      if (response.auctions === undefined) response.auctions = [];
      const auctions = response.auctions
        .filter((a) => [auctionState.NOT_STARTED, auctionState.ACTIVE].includes(a.state))
        .map((o) => new Auction(o));
      setActiveAuctions(auctions);
      const otherAuctions = response.auctions
        .filter((a) => {
          const isCompleted = ![auctionState.NOT_STARTED, auctionState.ACTIVE].includes(a.state);
          const hasUnwithdrawn = a.bidHistory.some(b => !b.withdrawn && !ciEquals(b.bidder, a.highestBidder));
          const afterTestAuctions = a.timeStarted > 1653891957;
          return isCompleted && hasUnwithdrawn && afterTestAuctions;
        })
        .map((o) => {
          o.unwithdrawnCount = o.bidHistory.filter(b => !b.withdrawn && !ciEquals(b.bidder, o.highestBidder)).length;
          return new Auction(o)
        })
        .sort((a, b) => a.endAt < b.endAt ? 1 : -1);
      setUnwithdrawnAuctions(otherAuctions);
    }
    fetchData();
  }, []);

  const handleStartClick = async () => {
    console.log(selectedAuction.getAuctionHash, selectedAuction.getAuctionIndex, runTime);
    const validation = validateRunTime(runTime);
    if (!validation) {
      return;
    }

    runAuthedFunction(async() => {
      let writeContract = contractService.auction;
      try {
        setExecutingStart(true);
        const tx = await writeContract.start(selectedAuction.getAuctionHash, selectedAuction.getAuctionIndex, runTime);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        hideConfirmationDialog();
      } catch (error) {
        console.log(error);
      } finally {
        setExecutingStart(false);
      }
    });
  };

  const mapStateToHumanReadable = (listing) => {
    switch (listing.state) {
      case auctionState.NOT_STARTED:
        return 'Not Started';
      case auctionState.ACTIVE:
        return listing.getEndAt < Date.now() ? 'Awaiting Acceptance' : 'Active';
      case auctionState.CANCELLED:
        return 'Cancelled';
      case auctionState.SOLD:
        return 'Sold';
      default:
        return 'Unknown';
    }
  };

  const handleReturnBids = async (auction) => {
    runAuthedFunction(async() => {
      let writeContract = contractService.auction;
      try {
        setExecutingStart(true);
        const tx = await writeContract.returnBidsToWallets(auction.getAuctionHash, auction.getAuctionIndex);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
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
        setExecutingStart(false);
      }
    });
  };

  return (
    <div>
      <h2>Active Auctions</h2>
      <div className="card-group mb-4">
        {activeAuctions?.length > 0 ? (
          <>
            {activeAuctions.map((auction, index) => (
              <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                <div className="card eb-nft__card h-100 shadow">
                  <img src={auction.nft.metadata.image} className={`card-img-top marketplace`} alt={auction.nft.metadata.name} />
                  <div className="eb-de_countdown text-center">
                    Ends In:
                    {auction.state !== auctionState.NOT_STARTED ? (
                      <Clock deadline={auction.getEndAt} />
                    ) : (
                      <div className="fw-bold">Not Started</div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="mt-auto">{auction.nft.metadata.name}</h6>
                    <p className="card-text">
                      {commify(auction.getHighestBid)} MAD <br />
                      State: {mapStateToHumanReadable(auction)}
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <Link href={`/auctions/${auction.getAuctionId}`}>
                      View
                    </Link>
                    {auction.state === auctionState.NOT_STARTED && (
                      <span className="cursor-pointer" onClick={() => showConfirmationDialog(auction)}>Start</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>No active auctions</>
        )}
      </div>
      <h2>Complete Unwithdrawn Auctions</h2>
      <div className="card-group">
        {unwithdrawnAuctions &&
          unwithdrawnAuctions.map((auction, index) => (
            <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
              <div className="card eb-nft__card h-100 shadow">
                <img src={auction.nft.image} className={`card-img-top marketplace`} alt={auction.nft.name} />
                <div className="card-body d-flex flex-column">
                  <h6 className="mt-auto">{auction.nft.name}</h6>
                  <p className="card-text">
                    {commify(auction.getHighestBid)} MAD <br />
                    State: {mapStateToHumanReadable(auction)}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <Link href={`/auctions/${auction.getAuctionId}`}>
                    View
                  </Link>
                  <span className="cursor-pointer" onClick={() => handleReturnBids(auction)}>Return {auction.unwithdrawnCount} Bids</span>
                </div>
              </div>
            </div>
          ))}
      </div>
      {openStartConfirmationDialog && user && (
        <div className="checkout">
          <div className="maincheckout">
            <button className="btn-close" onClick={hideConfirmationDialog}>
              x
            </button>
            <div className="heading">
              <h3>Confirm Auction Start</h3>
            </div>
            <p>Start auction and specify how long it should run for.</p>
            <div className="heading mt-3">
              <p>Run Time (in seconds)</p>
              <div className="subtotal">
                <Input
                  className="mb-0"
                  placeholder="Enter Bid"
                  onChange={handleChangeRunTime}
                  onKeyDown={(e) => {
                    if (!isEventValidNumber(e)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            {formError && (
              <div
                className="error"
                style={{
                  color: 'red',
                  marginLeft: '5px',
                }}
              >
                {formError}
              </div>
            )}

            <div className="heading">
              <p>Formatted Run Time</p>
              <div className="subtotal">{dateLabel}</div>
            </div>

            <button
              className="btn-main lead mb-5"
              onClick={handleStartClick}
              disabled={executingStart}
            >
              {executingStart ? (
                <>
                  Starting...
                  <Spinner size='sm' ms={1} />
                </>
              ) : (
                <>Start Auction</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageAuctionList;
