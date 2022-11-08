import React, { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {MyNftPageActions, setStakeCount, setVIPCount} from '../../GlobalState/User';
import { Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  caseInsensitiveCompare,
  createSuccessfulTransactionToastContent,
  round,
  siPrefixedNumber,
  useInterval
} from '../../utils';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryEmpty,
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faBolt,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getTheme } from '../../Theme/theme';
import {hostedImage} from "../../helpers/image";
import {AnyMedia} from "../components/AnyMedia";
import {Box, Heading, Text} from "@chakra-ui/react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getOwnerCollections} from "@src/core/api/next/collectioninfo";
import {getStakedRyoshi} from "@src/core/subgraph/staking";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {appConfig} from "@src/Config";
import InfiniteScroll from "react-infinite-scroll-component";
import NftCard from "@src/Components/components/NftCard";
import RyoshiStakingNftCard from "@src/Components/components/RyoshiStakingNftCard";
import {getNftsForAddress2} from "@src/core/api";
import MyNftCard from "@src/Components/components/MyNftCard";
import {addToBatchListingCart, removeFromBatchListingCart} from "@src/GlobalState/batchListingSlice";
import {addToBatch, removeFromBatch} from "@src/GlobalState/ryoshiStakingCartSlice";

const txExtras = {
  gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
};

const ryoshiCollectionAddress = appConfig('collections').find((c) => c.slug === 'ryoshi-tales-vip').address;
const knownContracts = appConfig('collections');

const RyoshiStaking = () => {
  const user = useSelector((state) => state.user);

  const { data, status, refetch } = useQuery(['RyoshiStaking', user.address], () =>
    getStakedRyoshi(user.address), !!user.address
  )

  console.log('DATA', data);

  return (
    <Box>
      <Heading>Ryoshi Tales VIP Staking</Heading>
      <Text>Earn rewards generated through platform sales &#128640;</Text>

      <RyoshiNftList address={user.address} onSelect={() => console.log('ok')} />
    </Box>
  );
};

export default memo(RyoshiStaking);

const RyoshiNftList = ({onSelect}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftsForAddress2(user.address, user.provider, pageParam, [ryoshiCollectionAddress]);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ['UserRyoshiNfts', user.address],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    })


  const loadMore = () => {
    fetchNextPage();
  };

  console.log('DATA2', data);

  return (
    <div className="d-flex">
      <div className="flex-fill">

        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={loadMore}
          hasMore={hasNextPage}
          style={{ overflow: 'hidden' }}
          loader={
            <div className="row">
              <div className="col-lg-12 text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </div>
          }
        >
          {status === "loading" ? (
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : status === "error" ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              <div className="card-group row g-3">

                {data.pages.map((items, index) => (
                  <React.Fragment key={index}>
                    {items.map((nft, index) => {
                      return (
                        <div
                          className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                          key={`${nft.address}-${nft.id}-${index}`}
                        >
                          <RyoshiStakingNftCard
                            nft={nft}
                            canStake={true}
                            isStaked={false}
                            onAddToBatchButtonPressed={() => dispatch(addToBatch(nft))}
                            onRemoveBatchButtonPressed={() => dispatch(removeFromBatch(nft))}
                          />
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

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

const RewardsCard = () => {
  const user = useSelector((state) => state.user);
  const userTheme = useSelector((state) => {
    return state.user.theme;
  });

  const [firstRunComplete, setFirstRunComplete] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [rewardsInfoLoading, setRewardsInfoLoading] = useState(false);
  const [userPendingRewards, setUserPendingRewards] = useState(0);
  const [userReleasedRewards, setUserReleasedRewards] = useState(0);
  const [globalPaidRewards, setGlobalPaidRewards] = useState(0);
  const [globalStakedTotal, setglobalStakedTotal] = useState(0);

  const getRewardsInfo = async () => {
    if (!user.stakeContract) return;

    if (!firstRunComplete) {
      setRewardsInfoLoading(true);
    }

    try {
      const mGlobalStakedTotal = await user.stakeContract.totalStaked();
      setglobalStakedTotal(parseInt(mGlobalStakedTotal));

      const mUserPendingRewards = await user.stakeContract.getReward(user.address);
      const mGlobalPaidRewards = await user.stakeContract.rewardsPaid();
      const mUserReleasedRewards = await user.stakeContract.getReleasedReward(user.address);

      setUserPendingRewards(ethers.utils.formatEther(mUserPendingRewards));
      setUserReleasedRewards(ethers.utils.formatEther(mUserReleasedRewards));
      setGlobalPaidRewards(ethers.utils.formatEther(mGlobalPaidRewards));
    } catch (error) {
      console.log(error);
    } finally {
      setFirstRunComplete(true);
      setRewardsInfoLoading(false);
    }
  };

  const harvest = async () => {
    if (!user.stakeContract) return;

    try {
      setIsHarvesting(true);
      const amountToHarvest = await user.stakeContract.getReward(user.address);

      if (amountToHarvest.gt(0)) {
        try {
          const tx = await user.stakeContract.harvest(user.address, txExtras);
          const receipt = await tx.wait();
          await getRewardsInfo();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        } catch (err) {
          toast.error(err.message);
        }
      } else {
        toast.error('Amount to harvest is zero');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsHarvesting(false);
    }
  };

  useEffect(() => {
    async function func() {
      await getRewardsInfo();
    }
    func();
  }, []);

  useInterval(() => {
    async function func() {
      if (!isHarvesting && !rewardsInfoLoading) {
        await getRewardsInfo();
      }
    }
    func();
  }, 1000 * 60);

  return (
    <div className="col">
      <div className="card eb-nft__card h-100 shadow px-4">
        <div className="card-body d-flex flex-column">
          <Heading as="h5" size="md" className="mb-2">Rewards</Heading>
          {rewardsInfoLoading ? (
            <Spinner animation="border" role="status" size="sm" className="mx-auto">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-12 col-sm-4 text-center">
                  <div>Total Staked</div>
                  <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                    {globalStakedTotal}
                  </div>
                </div>
                <div className="col-12 col-sm-4 mt-1 mt-sm-0 text-center">
                  <div>Total Harvested</div>
                  <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                    {siPrefixedNumber(round(Number(globalPaidRewards)))} CRO
                  </div>
                </div>
                <div className="col-12 col-sm-4 mt-1 mt-sm-0 text-center">
                  <div>My Harvest</div>
                  <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                    {siPrefixedNumber(round(Number(userReleasedRewards)))} CRO
                  </div>
                </div>
              </div>
              {userPendingRewards > 0 ? (
                <>
                  <p className="text-center my-xl-auto fs-5" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                    You have <strong>{ethers.utils.commify(round(userPendingRewards, 3))} CRO</strong> available for
                    harvest!
                  </p>
                  <button
                    className="btn-main lead mx-1 mb-1 mt-2"
                    onClick={harvest}
                    disabled={!(userPendingRewards > 0)}
                    style={{ width: 'auto' }}
                  >
                    {isHarvesting ? (
                      <>
                        Harvesting...
                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </>
                    ) : (
                      <>Harvest</>
                    )}
                  </button>
                </>
              ) : (
                <p className="text-center my-auto">No harvestable rewards yet. Check back later!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
