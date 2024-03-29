import {Box, Center, Container, Flex, Heading, Image, Link, Progress, Stack, VStack} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import Countdown from "react-countdown";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import React, {useEffect, useMemo, useState} from "react";
import {constants, Contract, ethers} from "ethers";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {appConfig} from "@src/Config";
import rwkAbi from "@src/Assets/abis/ryoshi-with-knife.json";
import {getTheme} from "@src/Theme/theme";
import {ciEquals, percentage, pluralize} from "@src/utils";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import RefundBox from "@src/components-v2/feature/drop/types/dutch/refund-box";
import {DropState as statuses} from "@src/core/api/enums";
import Fortune from "@src/Contracts/Fortune.json";
import * as Sentry from "@sentry/react";
import {useAtom} from "jotai/index";
import {dutchAuctionDataAtom} from "@src/components-v2/feature/drop/types/dutch/atom";
import {rwkDataAtom} from "@src/components-v2/feature/drop/types/ryoshi-with-knife/atom";
import AuctionBox from "@src/components-v2/feature/drop/types/ryoshi-with-knife/auction-box";

const config = appConfig();
const rwkAddress = config.contracts.ryoshiWithKnife;
const eagerApprovalThreshold = 10000;
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

const startTimestamp = 0;
// const startTimestamp = 1711746000000;
type EventProps = {
  startTime: number;
  endTime: number;
  amountRaised: number;
  address: string;
  maxSupply: number;
  currentSupply: number;
  complete: boolean;
}

const defaultInfo: EventProps = {
  startTime: 1711746000000,
  endTime: 1711753200000,
  amountRaised: 0,
  address: config.contracts.ryoshiWithKnife,
  maxSupply: 500000,
  currentSupply: 0,
  complete: false
}

const RyoshiWithKnife = () => {
  const user = useUser();
  const [isClient, setIsClient] = useState(false);
  const [canEagerlyApprove, setCanEagerlyApprove] = useState(false);
  // const contractService = useContractService();
  const [contractData, setContractData] = useState<EventProps>(defaultInfo);
  const [rwkData, setRwkData] = useAtom(rwkDataAtom);

  const startDate = `${new Date(contractData.startTime).toDateString()}, ${new Date(contractData.startTime).toTimeString()}`;
  const hasStarted = Date.now() > contractData.startTime;

  // const frtnContract = useMemo(() => {
  //   const frtn = config.tokens['frtn'];
  //   return contractService?.erc20(frtn.address);
  // }, [contractService]);

  // const isApproved = useMemo(async () => {
  //   const allowance = await frtnContract.allowance(user.address, rwkAddress);
  //   if (allowance.sub(eagerApprovalThreshold) <= 0) {
  //     user.balances.frtn
  //     const approvalTx = await frtnContract.approve(rwkAddress, constants.MaxUint256);
  //     await approvalTx.wait();
  //   }
  // }, [frtnContract, rwkAddress, eagerApprovalThreshold, user.address, user.]);

  // const getInitialUserState = async () => {
  //   if (user.address && frtnContract) {
  //     // const allowance = await frtnContract.allowance(user.address, rwkAddress);
  //     // setCanEagerlyApprove(allowance.sub(eagerApprovalThreshold) <= 0);
  //   }
  // }

  // const getInitialContractState = async () => {
  //   const contract = new Contract(rwkAddress, rwkAbi, readProvider);
  //   const startTime = await contract.saleStartTimestamp();
  //   const endTime  = await contract.saleEndTimestamp();
  //   console.log('data', parseInt(startTime), parseInt(endTime))
  //   setContractData({
  //     startTime: !!startTime ? parseInt(startTime) * 1000 : defaultInfo.startTime,
  //     endTime: !!endTime ? parseInt(endTime) * 1000 : defaultInfo.endTime
  //   });
  // }

  // const approveFrtn = async () => {
  //   if (!frtnContract) return;
  //
  //   const allowance = await frtnContract.allowance(user.address, rwkAddress);
  //   if (allowance.sub(eagerApprovalThreshold) <= 0) {
  //     user.balances.frtn
  //     const approvalTx = await frtnContract.approve(rwkAddress, constants.MaxUint256);
  //     await approvalTx.wait();
  //   }
  // }
  //
  // const handleEagerApproval = async () => {
  //   if (canEagerlyApprove) {
  //     await approveFrtn();
  //   }
  // }
  //
  // const handlePurchase = async (amount: number) => {
  //   // const tx = await contractService!.ryoshiWithKnife.purchase(amount);
  //   // await tx.wait();
  // }


  const calculateStatus = (availableTokenCount: number) => {
    const sTime = new Date(defaultInfo.startTime);
    const eTime = new Date(defaultInfo.endTime);
    const now = new Date();

    if (!defaultInfo.startTime || !defaultInfo.address || sTime > now) return statuses.NOT_STARTED;
    else if (availableTokenCount < 1) return statuses.SOLD_OUT;
    else if (!defaultInfo.endTime || eTime > now) return statuses.LIVE;
    else if (defaultInfo.endTime && eTime < now) return statuses.EXPIRED;
    else return statuses.NOT_STARTED;
  };

  const calculateStatusFromContract = (startTime: number, endTime: number, availableTokenCount: number) => {
    const sTime = new Date(startTime);
    const eTime = new Date(endTime);
    const now = new Date();

    if (!startTime || !defaultInfo.address || sTime > now) return statuses.NOT_STARTED;
    else if (availableTokenCount < 1) return statuses.SOLD_OUT;
    else if (!endTime || eTime > now) return statuses.LIVE;
    else if (endTime && eTime < now) return statuses.EXPIRED;
    else return statuses.NOT_STARTED;
  };

  const retrieveEventInfo = async () => {
    // Don't do any contract stuff if the drop does not have an address
    if (!defaultInfo.address || !defaultInfo.startTime) {
      setRwkData((prev) => ({
        ...prev,
        address: defaultInfo.address,
        isUsingContract: false,
        status: calculateStatus(defaultInfo.complete ? defaultInfo.currentSupply : 0),
        maxSupply: defaultInfo.maxSupply,
        availableTokenCount: defaultInfo.currentSupply,
        currentSupply: 0,
        startTime: defaultInfo.startTime,
        endTime: defaultInfo.endTime
      }));
      return;
    }

    try {
      const readContract = rwkData.readContract ?? new ethers.Contract(defaultInfo.address, rwkAbi, readProvider);
      // const writeContract = !!user.address ? new ethers.Contract(drop.address, abi, user.provider) : undefined;
      const startTime = await readContract.saleStartTimestamp();
      const endTime  = await readContract.saleEndTimestamp();
      const totalContributed  = await readContract.totalFRTNContributed();
      const remainingSupply = defaultInfo.maxSupply - parseInt(totalContributed);

      setRwkData((prev) => ({
        ...prev,
        address: defaultInfo.address,
        isUsingContract: true,
        status: calculateStatusFromContract(
          parseInt(startTime) * 1000,
          parseInt(endTime) * 1000,
          remainingSupply
        ),
        readContract,
        maxSupply: defaultInfo.maxSupply,
        availableTokenCount: remainingSupply,
        currentSupply: parseInt(totalContributed),
        refreshContract: () => {
          retrieveEventInfo();
        },
        startTime: parseInt(startTime) * 1000,
        endTime: parseInt(endTime) * 1000
      }));

      if (!!user.address) {
        const writeContract = new ethers.Contract(defaultInfo.address, rwkAbi, user.provider.signer);
        const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
        const userBalance = await fortuneContract.balanceOf(user.address);
        setRwkData((prev) => ({
          ...prev,
          writeContract,
          userBalance: parseInt(ethers.utils.formatEther(userBalance))
        }));
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const refreshUserBalance = async (address: string) => {
    try {
      const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
      const userBalance = await fortuneContract.balanceOf(address);


      const rwkContract = rwkData.readContract ?? new ethers.Contract(defaultInfo.address, rwkAbi, readProvider);
      const totalContributed  = await rwkContract.frtnContributions(address);

      setRwkData((prev) => ({
        ...prev,
        userBalance: parseInt(ethers.utils.formatEther(userBalance)),
        userContribution: parseInt(totalContributed)
      }));
    } catch (e) {
      console.log('Error refreshing user balance', e);
    }
  }

  useEffect(() => {
    setRwkData((prev) => ({
      ...prev,
      refreshContract: () => {
        retrieveEventInfo();
      },
      onUserMinted: (address: string) => {
        refreshUserBalance(address)
      }
    }));
  }, []);

  useEffect(() => {
    retrieveEventInfo();
  }, [user.address]);

  useEffect(() => {
    if (!!rwkData.readContract) {
      const onMinted = (sender: string, amount: number, totalContributions: number) => {
        setRwkData((prev) => ({
          ...prev,
          currentSupply: prev.currentSupply + Number(amount),
          availableTokenCount: prev.availableTokenCount - Number(amount),
          status: prev.availableTokenCount - amount < 1 ? statuses.SOLD_OUT : prev.status
        }));
      };

      rwkData.readContract.on('ContributionUpdated', onMinted);
      return () => {
        rwkData.readContract?.off('ContributionUpdated', onMinted);
      };
    }
  }, [rwkData.readContract]);

  return (
    <Container maxW='container.lg' mt={8}>
      <Box>
        <Image
          src={ImageService.translate('/img/ryoshi-with-knife/promo.webp').convert()}
          rounded='lg'
        />
      </Box>
      <Stack direction={{base: 'column', sm: 'row'}} mt={4} justify='space-between'>
        <Box w='full'>
          <Heading>ryoshi with knife</Heading>
          <AuctionBox />
          {/*{hasStarted ? (*/}
          {/*  <Box*/}
          {/*    className="card shadow"*/}
          {/*    mt={2}*/}
          {/*    borderColor={getTheme(user.theme).colors.borderColor3}*/}
          {/*    borderWidth={2}*/}
          {/*    bgColor={getTheme(user.theme).colors.bgColor5}*/}
          {/*    p={4}*/}
          {/*    rounded='2xl'*/}
          {/*  >*/}
          {/*    <Box mt={2}>*/}
          {/*      <Box>*/}
          {/*        <Flex justify='space-between' mt={3} mb={1}>*/}
          {/*          <Box fontWeight='bold'>{percentage(rwkData.currentSupply.toString(), rwkData.maxSupply.toString())}% minted</Box>*/}
          {/*          <Box>{ethers.utils.commify(rwkData.currentSupply.toString())} / {ethers.utils.commify(rwkData.maxSupply.toString())}</Box>*/}
          {/*        </Flex>*/}
          {/*        <Progress*/}
          {/*          size='sm'*/}
          {/*          value={percentage(rwkData.currentSupply.toString(), rwkData.maxSupply.toString())}*/}
          {/*          bg='white'*/}
          {/*          rounded='lg'*/}
          {/*          hasStripe*/}
          {/*          sx={{*/}
          {/*            "& > div:first-of-type": {*/}
          {/*              transitionProperty: "width",*/}
          {/*            },*/}
          {/*          }}*/}
          {/*        />*/}
          {/*      </Box>*/}
          {/*      <AuthenticationGuard>*/}
          {/*        {({isConnected, connect}) => (*/}
          {/*          <>*/}
          {/*            {isConnected ? (*/}
          {/*              <>*/}
          {/*                /!*<Box textAlign='center' mt={4}>You can mint up to <strong>{rwkData.canMint}</strong> {pluralize(rwkData.canMint, 'Hero', 'Heroes')} at the current price</Box>*!/*/}
          {/*                <Stack direction={{base: 'column', sm: 'row'}} justify='space-evenly' textAlign='center' mt={4}>*/}
          {/*                  /!*<MintBox />*!/*/}
          {/*                  /!*<RefundBox />*!/*/}
          {/*                </Stack>*/}
          {/*              </>*/}
          {/*            ) : (*/}
          {/*              <Center mt={4}>*/}
          {/*                <PrimaryButton onClick={connect}>*/}
          {/*                  Connect Wallet*/}
          {/*                </PrimaryButton>*/}
          {/*              </Center>*/}
          {/*            )}*/}
          {/*          </>*/}
          {/*        )}*/}
          {/*      </AuthenticationGuard>*/}
          {/*    </Box>*/}
          {/*  </Box>*/}
          {/*) : (*/}
          {/*  <VStack align='start' mt={2}>*/}
          {/*    <Box>*/}
          {/*      Starts in: {isClient ? <Countdown date={contractData.startTime}/> : 'soon'}*/}
          {/*    </Box>*/}
          {/*    {isClient && (*/}
          {/*      <Box>*/}
          {/*        {startDate}*/}
          {/*      </Box>*/}
          {/*    )}*/}
          {/*    <Link href='https://blog.ebisusbay.com/ryoshi-with-knife-the-new-craze-hitting-cronos-400b743ff569'>*/}
          {/*      <PrimaryButton>*/}
          {/*        More Info*/}
          {/*      </PrimaryButton>*/}
          {/*    </Link>*/}
          {/*  </VStack>*/}
          {/*)}*/}
        </Box>
        <Box>
          <Image
            src="/img/ryoshi-with-knife.png"
            w={400}
          />
        </Box>
      </Stack>
    </Container>
  )
}

export default RyoshiWithKnife;


const MintBox = () => {

}