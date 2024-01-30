import React, {useEffect, useState} from "react";
import {Contract, ethers} from "ethers";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, round, siPrefixedNumber, useInterval} from "@src/utils";
import {getTheme} from "@src/Theme/theme";
import StakeABI from "@src/Contracts/Stake.json";
import {appConfig} from "@src/Config";
import {Box, Center, Link, SimpleGrid, Spinner, Text} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useUser} from "@src/components-v2/useUser";
import NextLink from "next/link";
import {GasWriter} from "@src/core/chain/gas-writer";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const stakeContract = new Contract(config.contracts.stake, StakeABI.abi, readProvider);

const RewardsCard = () => {
  const user = useUser();
  const userTheme = user.theme;

  const [firstRunComplete, setFirstRunComplete] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [rewardsInfoLoading, setRewardsInfoLoading] = useState(false);

  // Stats
  const [userPendingRewards, setUserPendingRewards] = useState<string | number>(0);
  const [userStakedTotal, setUserStakedTotal] = useState<string | number>(0);
  const [userReleasedRewards, setUserReleasedRewards] = useState<string | number>(0);
  const [globalPaidRewards, setGlobalPaidRewards] = useState<string | number>(0);
  const [globalStakedTotal, setGlobalStakedTotal] = useState<string | number>(0);

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
      const mUserStakedTotal = await stakeContract.amountRyoshiStaked(user.address);

      setUserPendingRewards(ethers.utils.formatEther(mUserPendingRewards));
      setUserReleasedRewards(ethers.utils.formatEther(mUserReleasedRewards));
      setUserStakedTotal(mUserStakedTotal);
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
          const writeContract = new Contract(config.contracts.stake, StakeABI.abi, user.provider.getSigner());
          const tx = await GasWriter.withContract(writeContract).call(
            'harvest',
            user.wallet.address
          );
          const receipt = await tx.wait();
          await getRewardsInfo();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        } catch (err: any) {
          toast.error(err.message);
        }
      } else {
        toast.error('Amount to harvest is zero');
      }
    } catch (err: any) {
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
            <Center>
              <Spinner size='sm' />
            </Center>
          ) : (
            <>
              <Box>
                <SimpleGrid columns={{base: 1, sm: 2, md: 4}} textAlign="center">
                  <Box>
                    <div>Global Staked</div>
                    <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                      {globalStakedTotal}
                    </div>
                  </Box>
                  <Box>
                    <div>Global Harvested</div>
                    <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                      {siPrefixedNumber(round(Number(globalPaidRewards)))} CRO
                    </div>
                  </Box>
                  <Box>
                    <div>My Stake</div>
                    <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                      {user.address ? `${siPrefixedNumber(round(Number(userStakedTotal)))}` : '-'}
                    </div>
                  </Box>
                  <Box>
                    <div>My Harvest</div>
                    <div className="fw-bold" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                      {user.address ? `${siPrefixedNumber(round(Number(userReleasedRewards)))} CRO` : '-'}
                    </div>
                  </Box>
                </SimpleGrid>
              </Box>
              {user.address && (
                <div className="mt-4">
                  {Number(userPendingRewards) > 0 && (
                    <>
                      <p className="text-center my-xl-auto fs-5" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                        You have <strong>{ethers.utils.commify(round(userPendingRewards, 3))} CRO</strong> available for
                        harvest!
                      </p>
                      <PrimaryButton
                        w='full'
                        mb={1}
                        mt={2}
                        onClick={harvest}
                        disabled={!(Number(userPendingRewards) > 0)}
                        loadingText='Harvesting...'
                        isLoading={isHarvesting}
                      >
                        Harvest
                      </PrimaryButton>
                    </>
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