import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setStakeCount, setVIPCount} from '@src/GlobalState/User';
import {Form, Spinner} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {createSuccessfulTransactionToastContent} from '@src/utils';
import {ethers} from 'ethers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faBatteryEmpty,
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import {hostedImage} from "@src/helpers/image";
import {AnyMedia} from "../components/AnyMedia";
import {Box, Heading, HStack, Link, Tag, Text} from "@chakra-ui/react";

const txExtras = {
  gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
};

const LegacyStaking = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const stakeCount = user.stakeCount;
  const vipCount = user.vipCount;
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Allow exception to be thrown for other functions to catch it
  const setApprovalForAll = async () => {
    const isApproved = await user.membershipContract.isApprovedForAll(user.stakeContract.address, user.address);
    if (!isApproved) {
      let tx = await user.membershipContract.setApprovalForAll(user.stakeContract.address, true, txExtras);
      await tx.wait();
    }
  };

  const approve = async () => {
    try {
      setIsApproving(true);
      await setApprovalForAll();
      setIsApproved(true);
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setIsApproving(false);
    }
  };

  // const stake = async (quantity) => {
  //   if (!user.stakeContract || quantity === 0) return;
  //   if (quantity > vipCount) {
  //     toast.error('You do not have enough available VIPs');
  //     return;
  //   }
  //   try {
  //     if (!isApproved) await approve();
  //     const tx = await user.stakeContract.stake(quantity, txExtras);
  //     const receipt = await tx.wait();
  //     dispatch(setStakeCount(stakeCount + quantity));
  //     dispatch(setVIPCount(vipCount - quantity));
  //     toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  const unStake = async (quantity) => {
    if (!user.stakeContract || quantity <= 0) return;
    if (quantity > stakeCount) {
      toast.error('You do not have enough available VIPs');
      return;
    }
    try {
      const tx = await user.stakeContract.unstake(quantity, { gasPrice: 5000000000000 });
      const receipt = await tx.wait();
      dispatch(setStakeCount(stakeCount - quantity));
      dispatch(setVIPCount(vipCount + quantity));
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function checkApproval() {
      try {
        const isApproved = await user.membershipContract.isApprovedForAll(user.address, user.stakeContract.address);
        setIsApproved(isApproved);
      } catch (e) {
        console.log(e);
      } finally {
        setIsInitializing(false);
      }
    }
    if (!user.connectingWallet && user.membershipContract) {
      checkApproval();
    }
    // eslint-disable-next-line
  }, [user.connectingWallet]);

  // const PromptToPurchase = () => {
  //   return (
  //     <p className="text-center" style={{ color: 'black' }}>
  //       You do not have any VIP Founding Member NFTs. Pick some up in the{' '}
  //       <a href="/collection/vip-founding-member" className="fw-bold">
  //         secondary marketplace
  //       </a>
  //     </p>
  //   );
  // };

  const DynamicBattery = () => {
    if (!(stakeCount + vipCount > 0)) return <FontAwesomeIcon icon={faBatteryEmpty} />;

    const percent = stakeCount / (stakeCount + vipCount);
    if (percent >= 1) return <FontAwesomeIcon icon={faBatteryFull} />;
    if (percent >= 0.75) return <FontAwesomeIcon icon={faBatteryThreeQuarters} />;
    else if (percent >= 0.5) return <FontAwesomeIcon icon={faBatteryHalf} />;
    else if (percent > 0) return <FontAwesomeIcon icon={faBatteryQuarter} />;
    else return <FontAwesomeIcon icon={faBatteryEmpty} />;
  };

  return (
    <>
      <Box>
        <div className="row">
          <Heading>Legacy VIP Founding Member Staking</Heading>
          {isApproved && (
            <HStack spacing={2} my={2}>
              <Tag>
                <DynamicBattery />
                <Text ms={1}>VIPs Staked {stakeCount}</Text>
              </Tag>
              <Tag>
                <FontAwesomeIcon icon={faBolt} />
                <Text ms={1}>VIPs Available: {vipCount}</Text>
              </Tag>
            </HStack>
          )}
          <Text my={2}>
            The original VIP Founding Member NFTs are migrating to the Ryoshi Tales VIP collection.
            Starting on November 11th, holders will need to migrate them in order to retain the same benefits as before.{' '}
            <Link href="https://blog.ebisusbay.com/ebisus-bay-vip-split-506b05c619c7" isExternal>
              <span className="color">Learn more</span>
            </Link>
          </Text>
        </div>
        <div className="row">
          <div className="col-md-4 text-center">
            <AnyMedia
              video={hostedImage('QmX97CwY2NcmPmdS6XtcqLFMV2JGEjnEWjxBQbj4Q6NC2i.mp4')}
              videoProps={
                {autoPlay: true}
              }
            />
          </div>
          <div className="col-md-8">
            <div className="item_info">
              {!isInitializing && isApproved && (
                <>
                  {stakeCount + vipCount > 0 && (
                    <>
                      <div className="row g-3">
                        <div>
                          <div className="row g-3">
                            <div className="col">
                              <StakeCard
                                buttonName="Unstake"
                                buttonActionName="Unstaking..."
                                threshold={stakeCount}
                                stake={unStake}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {!isInitializing && !isApproved && (
                <div className="card eb-nft__card h-100 shadow px-4">
                  <div className="card-body d-flex flex-row justify-content-center">
                    <span className="my-auto">
                      <button className="btn-main lead me-2" onClick={approve}>
                        {isApproving ? (
                          <>
                            Approving...
                            <Spinner animation="border" role="status" size="sm" className="ms-1">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>Approve</>
                        )}
                      </button>
                    </span>
                    <span className="my-auto text-center">Please approve the staking contract to continue</span>
                  </div>
                </div>
              )}

              {isInitializing && (
                <div className="text-center">
                  <Spinner animation="border" role="status" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default memo(LegacyStaking);

const StakeCard = ({ stake, threshold, buttonName, buttonActionName }) => {
  const [quantity, setQuantity] = useState(1);
  const [isStaking, setIsStaking] = useState(false);

  const onAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= threshold) {
      setQuantity(parseInt(e.target.value));
    }
  };

  const execute = async () => {
    try {
      setIsStaking(true);
      await stake(quantity);
    } finally {
      setIsStaking(false);
    }
  };

  useEffect(() => {
    if (quantity > threshold) {
      setQuantity(threshold);
    } else if (quantity === 0 && threshold > 0) {
      setQuantity(1);
    }
    // eslint-disable-next-line
  }, [threshold]);

  return (
    <div className="card eb-nft__card h-100 shadow px-4">
      <div className="card-body d-flex flex-column text-center">
        <Heading as="h5" size="md" className="mb-2">{buttonName}</Heading>
        <div className="row row-cols-1 g-3">
          <div>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Input the amount"
              className="mx-auto"
              onChange={onAmountChange}
              value={quantity}
              style={{ width: '80px', marginBottom: 0, appearance: 'none' }}
            />
          </div>

          <div className="btn-group mt-4 flex-wrap">
            <button
              className="btn-main lead mx-1 mb-2 mx-auto"
              onClick={execute}
              disabled={quantity === 0 || threshold === 0}
            >
              {isStaking ? (
                <>
                  {buttonActionName}
                  <Spinner animation="border" role="status" size="sm" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </>
              ) : (
                <>{buttonName}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
