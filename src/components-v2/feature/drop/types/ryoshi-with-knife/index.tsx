import {Box, Container, Heading, Image, ListItem, Stack, Text, UnorderedList} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {useEffect, useState} from "react";
import {Contract, ethers} from "ethers";
import {useUser} from "@src/components-v2/useUser";
import {appConfig} from "@src/Config";
import rwkAbi from "@market/assets/abis/ryoshi-with-knife.json";
import {DropState as statuses} from "@src/core/api/enums";
import Fortune from "@src/global/contracts/Fortune.json";
import * as Sentry from "@sentry/react";
import {useAtom} from "jotai/index";
import {rwkDataAtom} from "@src/components-v2/feature/drop/types/ryoshi-with-knife/atom";
import AuctionBox from "@src/components-v2/feature/drop/types/ryoshi-with-knife/auction-box";
import NextLink from "next/link";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

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
  const [rwkData, setRwkData] = useAtom(rwkDataAtom);

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
      const remainingSupply = defaultInfo.maxSupply - parseInt(ethers.utils.formatEther(totalContributed));

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
        currentSupply: parseInt(ethers.utils.formatEther(totalContributed)),
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
        userContribution: roundUpEtherValue(ethers.utils.formatEther(totalContributed))
      }));
    } catch (e) {
      console.log('Error refreshing user balance', e);
    }
  }

  function roundUpEtherValue(etherValue: string): number {
    const [integral, fractional] = etherValue.split('.');
    if (fractional && fractional.match(/[1-9]/)) {
      // If there are any non-zero digits after the decimal, round up
      return parseInt(integral, 10) + 1;
    } else {
      // No rounding needed
      return parseInt(integral, 10);
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
    if (!!user.address) {
      refreshUserBalance(user.address);
    }
  }, [user.address, user.provider.signer]);

  useEffect(() => {
    if (!!rwkData.readContract) {
      const onMinted = (sender: string, amount: number, totalContributions: number) => {
        const amountEth = parseInt(ethers.utils.formatEther(amount));
        setRwkData((prev) => ({
          ...prev,
          currentSupply: prev.currentSupply + amountEth,
          availableTokenCount: prev.availableTokenCount - amountEth,
          status: prev.availableTokenCount - amountEth < 1 ? statuses.SOLD_OUT : prev.status
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
          <Box>
            sharpest meme on cronos. <NextLink className='color fw-bold' href='https://blog.ebisusbay.com/ryoshi-with-knife-the-new-craze-hitting-cronos-400b743ff569' target='_blank'>view blog post</NextLink>
          </Box>
          <Box my={4}>
            <AuctionBox />
          </Box>
          <Box mt={2}>
            <Text fontWeight='bold'>Sale Details:</Text>
            <UnorderedList>
              <ListItem>50% of RYOSHI supply allocated to public sale</ListItem>
              <ListItem>500,000 FRTN global contribution limit</ListItem>
              <ListItem>Max 10k FRTN per wallet</ListItem>
              <ListItem>Amount of RYOSHI to claim per user is a percentage of user's contribution to the global contribution amount</ListItem>
              <ListItem>Button to claim RYOSHI will be available shortly after sale ends</ListItem>
            </UnorderedList>
          </Box>
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