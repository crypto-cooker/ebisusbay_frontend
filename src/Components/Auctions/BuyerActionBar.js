import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {constants, Contract, ethers} from 'ethers';
import {Card, Form, Spinner} from 'react-bootstrap';
import MetaMaskOnboarding from '@metamask/onboarding';
import {toast} from 'react-toastify';
import Countdown from 'react-countdown';

import config from '../../Assets/networks/rpc_config.json';
import AuctionContract from '../../Contracts/DegenAuction.json';
import {caseInsensitiveCompare, createSuccessfulTransactionToastContent, devLog, isEventValidNumber} from '../../utils';
import {auctionState} from '../../core/api/enums';
import {updateAuctionFromBidEvent} from '../../GlobalState/auctionSlice';
import {chainConnect, connectAccount} from '../../GlobalState/User';
import {ERC20} from "../../Contracts/Abis";
import Button from "../components/Button";

const BuyerActionBar = () => {
  const dispatch = useDispatch();

  const [bidAmount, setBidAmount] = useState(0);
  const [rebidAmount, setRebidAmount] = useState(0);
  // const [minimumBid, setMinimumBid] = useState(1);
  const [bidError, setBidError] = useState('');
  const [awaitingAcceptance, setAwaitingAcceptance] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isAuctionOwner, setIsAuctionOwner] = useState(false);
  const [executingBid, setExecutingBid] = useState(false);
  // const [executingIncreaseBid, setExecutingIncreaseBid] = useState(false);
  const [executingWithdraw, setExecutingWithdraw] = useState(false);
  const [executingAcceptBid, setExecutingAcceptBid] = useState(false);
  const [executingApproveContract, setExecutingApproveContract] = useState(false);

  const user = useSelector((state) => state.user);
  const bidHistory = useSelector((state) => state.auction.bidHistory.filter((i) => !i.withdrawn));
  const listing = useSelector((state) => state.auction.auction);
  const minBid = useSelector((state) => state.auction.minBid);

  const isHighestBidder = useSelector((state) => {
    return listing.getHighestBidder && caseInsensitiveCompare(user.address, listing.getHighestBidder);
  });
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [openRebidDialog, setOpenRebidDialog] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
  const readContract = new Contract(config.mm_auction_contract, AuctionContract.abi, readProvider);

  const showBidDialog = () => {
    setOpenBidDialog(true);
  };
  const hideBidDialog = () => {
    setOpenBidDialog(false);
  };
  const showIncreaseBidDialog = () => {
    setOpenRebidDialog(true);
  };
  const hideIncreaseBidDialog = () => {
    setOpenRebidDialog(false);
  };

  const executeBid = (amount) => async () => {
    setExecutingBid(true);
    await runFunction(async (writeContract) => {
      let bid = ethers.utils.parseUnits(amount.toString());
      console.log('placing bid...', listing.getAuctionIndex, listing.getAuctionHash, bid.toString());
      return (
        await writeContract.bid(listing.getAuctionHash, listing.getAuctionIndex, bid)
      ).wait();
    });
    setExecutingBid(false);
    hideBidDialog();
    hideIncreaseBidDialog();
  };

  const executeWithdrawBid = () => async () => {
    setExecutingWithdraw(true);
    await runFunction(async (writeContract) => {
      console.log('withdrawing bid...', listing.getAuctionIndex, listing.getAuctionHash);
      return (await writeContract.withdraw(listing.getAuctionHash, listing.getAuctionIndex)).wait();
    });
    setExecutingWithdraw(false);
  };

  const executeAcceptBid = () => async () => {
    setExecutingAcceptBid(true);
    await runFunction(async (writeContract) => {
      console.log('accepting highest bid...', listing.getAuctionIndex, listing.getAuctionHash, listing.getHighestBidder);
      return (await writeContract.accept(listing.getAuctionHash, listing.getAuctionIndex)).wait();
    });
    setExecutingAcceptBid(false);
  };

  const executeApproveContract = async () => {
    setExecutingApproveContract(true);
    await runFunction(async (auctionContract) => {
      setIsApproved(true);
      return {transactionHash:''}
    });
    setExecutingApproveContract(false);
  };

  const ensureApproved = async (auctionContract) => {
    if (!isApproved) {
      console.log('approving contract...', user.address, auctionContract.address);
      const tokenAddress = config.known_tokens.mad.address;
      let tokenContract = await new ethers.Contract(tokenAddress, ERC20, user.provider.getSigner());
      let tx = await tokenContract.approve(auctionContract.address, constants.MaxUint256);
      return tx.wait();
    }
  };

  const checkApproval = async (auctionContract) => {
    if (!user.provider) return false;

    const tokenAddress = config.known_tokens.mad.address;
    let tokenContract = await new ethers.Contract(tokenAddress, ERC20, user.provider.getSigner());
    const allowance = await tokenContract.allowance(user.address, auctionContract.address);

    return allowance.gt(0);
  }

  const runFunction = async (fn) => {
    if (user.address) {

      try {
        let writeContract = await new ethers.Contract(
          config.mm_auction_contract,
          AuctionContract.abi,
          user.provider.getSigner()
        );
        await ensureApproved(writeContract);
        const receipt = await fn(writeContract);
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        //dispatch(getAuctionDetails(listing.getAuctionId));
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

  useEffect(() => {
    setAwaitingAcceptance(listing.state === auctionState.ACTIVE && listing.getEndAt < Date.now());
    setIsComplete(listing.state === auctionState.SOLD || listing.state === auctionState.CANCELLED);
    setIsAuctionOwner(caseInsensitiveCompare(listing.seller, user.address));
  }, [listing, user]);

  useEffect(() => {
    async function func() {
      const approved = await checkApproval(readContract);
      setIsApproved(approved);
    }
    func();
  }, [user.provider])

  useEffect(() => {
    readContract.on('Bid', async (auctionHash, auctionIndex, bidIndex, sender, amount) => {
      devLog('checking', listing.getAuctionIndex, auctionIndex);
      if (caseInsensitiveCompare(listing.getAuctionHash, auctionHash) && auctionIndex.toString() === listing.getAuctionIndex.toString()) {
        devLog(`[AUCTIONS] Caught Bid event for Auction:     ${auctionHash}-${auctionIndex}`, bidIndex, sender, amount);
        try {
          let price: string = ethers.utils.formatEther(amount);
          let bidder = sender;
          dispatch(updateAuctionFromBidEvent(price));
        } catch (error) {
          console.log(error);
        }
      }
    })
  }, []);

  const myBid = () => {
    return bidHistory.find((b) => caseInsensitiveCompare(b.bidder, user.address))?.price ?? 0;
  };

  const handleChangeBidAmount = (event) => {
    const { value } = event.target;

    const newBid = parseFloat(value);
    setBidAmount(newBid);

    if (newBid < minBid) {
      setBidError(`Bid must be at least ${minBid} MAD`);
    } else {
      setBidError(false);
    }
  };

  const handleChangeRebidAmount = (event) => {
    const { value } = event.target;

    const newBid = parseFloat(value);
    setRebidAmount(newBid);
    const minRebid = minBid - myBid();

    if (newBid < minRebid) {
      setBidError(`Bid must be increased by at least ${minRebid} MAD`);
    } else {
      setBidError(false);
    }
  };

  const connectWalletPressed = () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

  const ActionButtons = () => {
    const hasBeenOutbid = myBid() > 0 && !isHighestBidder;
    const inAcceptanceState = listing.state === auctionState.ACTIVE && awaitingAcceptance && (isHighestBidder || isAuctionOwner);
    return (
      <>
        {inAcceptanceState ? (
          <div className="col">
            <div className="d-flex flex-column">
              <Button type="legacy" style={{ width: 'auto' }} onClick={executeAcceptBid()} disabled={executingAcceptBid}>
                {executingAcceptBid ? (
                  <>
                    Accepting
                    <Spinner animation="border" role="status" size="sm" className="ms-1">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                ) : (
                  <>Accept Auction</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="col-12 col-sm-6">
              <div className="d-flex flex-column">
                {listing.state === auctionState.ACTIVE && !isHighestBidder && !hasBeenOutbid && !awaitingAcceptance && (
                  <Button type="legacy" style={{ width: 'auto' }} onClick={showBidDialog} disabled={executingBid}>
                    Place Bid
                  </Button>
                )}

                {listing.state === auctionState.ACTIVE && hasBeenOutbid && !awaitingAcceptance && (
                  <Button type="legacy" style={{ width: 'auto' }} onClick={showIncreaseBidDialog} disabled={executingBid}>
                    Increase Bid
                  </Button>
                )}
              </div>
            </div>
            <div className="col-12 col-sm-6 mt-3 mt-sm-0">
              <div className="d-flex flex-column">
                {hasBeenOutbid && (
                  <Button type="legacy-outlined" style={{ width: 'auto' }} onClick={executeWithdrawBid()} disabled={executingWithdraw}>
                    {executingWithdraw ? (
                      <>
                        Withdrawing
                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </>
                    ) : (
                      <>Withdraw Bid</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="price-action-bar">
      <Card className="mb-4 border-1 shadow pab-card">
        {listing.state === auctionState.ACTIVE && !awaitingAcceptance && !isComplete && (
          <div
            className="text-center badge m-1 fs-6"
            style={{ backgroundImage: 'linear-gradient(to right, #35669e, #218cff)' }}
          >
            Ends in: <Countdown date={listing.getEndAt} />
          </div>
        )}
        <Card.Body>
          <div>
            <div className="my-auto fw-bold">
              {listing.state === auctionState.NOT_STARTED && (
                <>
                  <h6>Starting Bid:</h6>{' '}
                  <span className="fs-3 ms-1">{ethers.utils.commify(listing.getHighestBid)} MAD</span>
                </>
              )}
              {listing.state === auctionState.ACTIVE && bidHistory.length === 0 && !awaitingAcceptance && (
                <>
                  <h6>Starting Bid:</h6>{' '}
                  <span className="fs-3 ms-1">{ethers.utils.commify(listing.getHighestBid)} MAD</span>
                </>
              )}
              {listing.state === auctionState.ACTIVE && bidHistory.length > 0 && !awaitingAcceptance && (
                <>
                  <h6>Current Bid:</h6>{' '}
                  <span className="fs-3 ms-1">{ethers.utils.commify(listing.getHighestBid)} MAD</span>
                </>
              )}
              {listing.state === auctionState.ACTIVE && awaitingAcceptance && <div className="text-center">AUCTION HAS ENDED</div>}
              {listing.state === auctionState.SOLD && (
                <div className="text-center">AUCTION HAS BEEN SOLD FOR {ethers.utils.commify(listing.getHighestBid)} MAD</div>
              )}
              {listing.state === auctionState.CANCELLED && <div className="text-center">AUCTION HAS BEEN CANCELLED</div>}
            </div>
          </div>
          <div className="row mt-2">
            {((!isAuctionOwner && !isComplete) ||
              (awaitingAcceptance && isHighestBidder) ||
              (myBid() > 0 && !isHighestBidder)) && (
              <>
                {listing.state !== auctionState.NOT_STARTED ? (
                  <>
                    {user.address ? (
                      <>
                        {user.correctChain ? (
                          <>
                            {isApproved ? (
                              <ActionButtons />
                            ) : (
                              <div className="col">
                                <div className="d-flex flex-column">
                                  <Button type="legacy" style={{ width: 'auto' }} onClick={executeApproveContract} disabled={executingApproveContract}>
                                    {executingApproveContract ? (
                                      <>
                                        Approving...
                                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                                          <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                      </>
                                    ) : (
                                      <>Approve MAD</>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="my-auto">Switch network to bid</span>
                        )}
                      </>
                    ) : (
                      <div className="col">
                        <div className="d-flex flex-column">
                          <Button type="legacy" style={{ width: 'auto' }} onClick={connectWalletPressed}>
                            Connect to bid
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <span className="my-auto">Auction has not started yet</span>
                  </>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {openBidDialog && user && (
        <div className="checkout">
          <div className="maincheckout">
            <button className="btn-close" onClick={hideBidDialog}>
              x
            </button>
            <div className="heading">
              <h3>Place Bid</h3>
            </div>
            <p>Your bid must be at least {minBid} MAD</p>
            <div className="heading mt-3">
              <p>Your bid (MAD)</p>
              <div className="subtotal">
                <Form.Control
                  className="mb-0"
                  type="text"
                  placeholder="Enter Bid"
                  onChange={handleChangeBidAmount}
                  onKeyDown={(e) => {
                    if (!isEventValidNumber(e)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            {bidError && (
              <div
                className="error"
                style={{
                  color: 'red',
                  marginLeft: '5px',
                }}
              >
                {bidError}
              </div>
            )}

            <button
              className="btn-main lead mb-5"
              onClick={executeBid(bidAmount)}
              disabled={!!bidError || executingBid}
            >
              {executingBid ? (
                <>
                  Confirming Bid...
                  <Spinner animation="border" role="status" size="sm" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </>
              ) : (
                <>Confirm Bid</>
              )}
            </button>
          </div>
        </div>
      )}

      {openRebidDialog && user && (
        <div className="checkout">
          <div className="maincheckout">
            <button className="btn-close" onClick={hideIncreaseBidDialog}>
              x
            </button>
            <div className="heading">
              <h3>Increase Bid</h3>
            </div>
            <p>You must increase your bid by at least {minBid - myBid()} MAD</p>
            <div className="heading mt-3">
              <p>Increase Bid By (MAD)</p>
              <div className="subtotal">
                <Form.Control
                  type="text"
                  placeholder="Enter Bid"
                  onChange={handleChangeRebidAmount}
                  onKeyDown={(e) => {
                    if (!isEventValidNumber(e)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            {bidError && (
              <div
                className="error"
                style={{
                  color: 'red',
                  marginLeft: '5px',
                }}
              >
                {bidError}
              </div>
            )}

            <div className="heading">
              <p>Total Bid</p>
              <div className="subtotal">{parseFloat(myBid()) + parseFloat(rebidAmount)} MAD</div>
            </div>

            <button
              className="btn-main lead mb-5"
              onClick={executeBid(rebidAmount)}
              disabled={!!bidError || executingBid}
            >
              {executingBid ? (
                <>
                  Confirming Bid...
                  <Spinner animation="border" role="status" size="sm" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </>
              ) : (
                <>Confirm Bid</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default BuyerActionBar;
