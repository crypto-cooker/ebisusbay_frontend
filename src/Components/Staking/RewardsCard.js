import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, round, siPrefixedNumber, useInterval} from "@src/utils";
import {Heading} from "@chakra-ui/react";
import {Spinner} from "react-bootstrap";
import {getTheme} from "@src/Theme/theme";

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

export default RewardsCard;