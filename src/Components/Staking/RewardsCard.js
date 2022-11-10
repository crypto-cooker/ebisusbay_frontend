import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Contract, ethers} from "ethers";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, round, siPrefixedNumber, useInterval} from "@src/utils";
import {Spinner} from "react-bootstrap";
import {getTheme} from "@src/Theme/theme";
import StakeABI from "@src/Contracts/Stake.json";
import {appConfig} from "@src/Config";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {txExtras} from "@src/core/constants";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const stakeContract = new Contract(config.contracts.stake, StakeABI.abi, readProvider);

const RewardsCard = () => {
  const dispatch = useDispatch();
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
  const [globalStakedTotal, setGlobalStakedTotal] = useState(0);

  const getRewardsInfo = async () => {
    if (!stakeContract) return;

    if (!firstRunComplete) {
      setRewardsInfoLoading(true);
    }

    try {
      const mGlobalStakedTotal = await stakeContract.totalStaked();
      setGlobalStakedTotal(parseInt(mGlobalStakedTotal));

      const mGlobalPaidRewards = await stakeContract.rewardsPaid();
      setGlobalPaidRewards(ethers.utils.formatEther(mGlobalPaidRewards));

      await getUserInfo();
    } catch (error) {
      console.log(error);
    } finally {
      setFirstRunComplete(true);
      setRewardsInfoLoading(false);
    }
  };

  const getUserInfo = async () => {
    if (!user.address) return;

    try {
      const mUserPendingRewards = await stakeContract.getReward(user.address);
      const mUserReleasedRewards = await stakeContract.getReleasedReward(user.address);

      setUserPendingRewards(ethers.utils.formatEther(mUserPendingRewards));
      setUserReleasedRewards(ethers.utils.formatEther(mUserReleasedRewards));
    } catch (error) {
      console.log(error);
    }
  }

  const harvest = async () => {
    if (!stakeContract) return;

    try {
      setIsHarvesting(true);
      const amountToHarvest = await stakeContract.getReward(user.address);

      if (amountToHarvest.gt(0)) {
        try {
          const tx = await stakeContract.harvest(user.address, txExtras);
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

  useEffect(() => {
    async function func() {
      await getUserInfo();
    }
    if (user.address) {
      func();
    }
  }, [user.address]);

  return (
    <div className="col">
      <div className="card eb-nft__card h-100 shadow px-4">
        <div className="card-body d-flex flex-column">
          {rewardsInfoLoading ? (
            <Spinner animation="border" role="status" size="sm" className="mx-auto">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              <div className="row">
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
                    {user.address ? `${siPrefixedNumber(round(Number(userReleasedRewards)))} CRO` : '-'}
                  </div>
                </div>
              </div>
              {user.address && (
                <div className="mt-4">
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
                        style={{ width: '100%' }}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsCard;