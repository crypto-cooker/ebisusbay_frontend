import {useEffect, useState} from "react";
import {useAppSelector} from "@src/Store/hooks";
import {Contract, ethers} from "ethers";
import {Box, Button, Text, VStack} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {GetServerSidePropsContext} from "next";
import * as process from "process";
import StakeABI from "@src/Contracts/Stake.json";
import Membership from "@src/Contracts/EbisusBayMembership.json";
import {appConfig} from "@src/Config";
import {ApiService} from "@src/core/services/api-service";
import Market from "@src/Contracts/Marketplace.json";
import {ciEquals} from "@src/utils";

const config = appConfig();

function Test() {
  return (
    <Box m={4}>
      <VStack align='start'>
        <GetRoyaltiedCollections />
      </VStack>
    </Box>
  )
}

export default Test;


const GetRoyaltiedCollections = () => {
  const [isExecuting, setIsExecuting] = useState(false);


  const handleGetRoyalties = async () => {
    try {
      setIsExecuting(true);
      await getRoyalties();
    } catch (e) {
      console.log(e);
    } finally {
      setIsExecuting(false);
    }
  }

  const getRoyalties = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const marketContract = new Contract(config.contracts.market, Market.abi, readProvider);
    const values = [];
    for (const knownContract of config.collections) {
      try {
        const isRoyaltyStandard = await marketContract.isRoyaltyStandard(knownContract.address);
        const royalty = await marketContract.getRoyalty(knownContract.address);
        const shouldRecord = isRoyaltyStandard && royalty.ipHolder !== ethers.constants.AddressZero;
        if (!shouldRecord) continue;

        const standardRoyalty = await marketContract.getStandardNFTRoyalty(knownContract.address, 1, 10000);
        values.push({
          address: knownContract.address,
          name: knownContract.name,
          marketIpHolder: royalty.ipHolder,
          marketPercent: royalty.percent,
          standardIpHolder: standardRoyalty.ipHolder,
          standardPercent: Number(standardRoyalty.royaltyAmount),
          isEqual: ciEquals(royalty.ipHolder, standardRoyalty.ipHolder) && royalty.percent === Number(standardRoyalty.royaltyAmount)
        });
      } catch (e) {
        console.log(`Error with address ${knownContract.address}`, e);
      }
    }

    console.log('RESULT', JSON.stringify(values));
  }

  // useEffect(() => {
  //   getStakings();
  // }, [user.address]);

  return (
    <Box>
      <Button isLoading={isExecuting} isDisabled={isExecuting} onClick={handleGetRoyalties}>
        Get Royalties
      </Button>
    </Box>
  )
};

const gameLoopAbi = [
  "function curSeason() view returns (uint16)",
  "function newSeason()"
];

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.req.headers.host?.startsWith('localhost') || process.env.NODE_ENV !== 'development') {
    return {
      destination: `/`,
      permanent: false,
    }
  }

  return { props: { } }
}