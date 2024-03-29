import {useAtom} from "jotai";
import {Box, Center, Flex, Heading, HStack, Progress, SimpleGrid, Stack, VStack} from "@chakra-ui/react";
import {DropState as statuses} from "@src/core/api/enums";
import {getTheme} from "@src/Theme/theme";
import Countdown, {zeroPad} from "react-countdown";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import React, {useState} from "react";
import {percentage, round} from "@src/utils";
import {Contract, ethers} from "ethers";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useUser} from "@src/components-v2/useUser";
import {rwkDataAtom} from "@src/components-v2/feature/drop/types/ryoshi-with-knife/atom";
import MintBox from "@src/components-v2/feature/drop/types/ryoshi-with-knife/mint-box";
import ClaimBox from "@src/components-v2/feature/drop/types/ryoshi-with-knife/claim-box";
import Fortune from "@src/Contracts/Fortune.json";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";

interface ContractInfo {

}

interface AuctionBoxProps {

}

const config = appConfig();

const AuctionBox = ({}: AuctionBoxProps) => {
  const user = useUser();
  const [rwkData, setRwkData] = useAtom(rwkDataAtom);

  const renderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    if (completed) {
      return (
        <HStack justify='end'>
          <Box>Starting...</Box>
        </HStack>
      );
    } else {
      let timeStr = `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
      if (days > 0) timeStr = `${zeroPad(days)}:${timeStr}`;
      return <Box fontSize='lg' fontWeight='bold'>{timeStr}</Box>;
    }
  };

  const handleTimerComplete = () => {
    rwkData.refreshContract();
  }

  const [isEagerApproving, setIsEagerApproving] = useState(false);
  const handleEagerApproval = async () => {
    if (!user.address) return;

    try {
      setIsEagerApproving(true);
      const spendingLimit = '10000';
      const spendingLimitWei = ethers.utils.parseEther(spendingLimit);

      const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.signer);
      const allowance = await fortuneContract.allowance(user.address, rwkData.address);

      if (allowance.sub(spendingLimitWei) < 0) {
        const approvalTx = await fortuneContract.approve(rwkData.address, ethers.utils.parseEther(spendingLimit));
        await approvalTx.wait();
        toast.success('Spending limit approved!');
      } else {
        toast.info('Already approved');
      }

    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsEagerApproving(false);
    }
  }

  return (
    <Box
      className="card shadow"
      mt={2}
      borderColor={getTheme(user.theme).colors.borderColor3}
      borderWidth={1}
      bgColor={getTheme(user.theme).colors.bgColor5}
      p={4}
      rounded='2xl'
      maxW='650px'
    >
      <Center>
        <Stack direction='row' spacing={6}>
          <Box textAlign="center">
            <Heading as="h6" size="xs" className="mb-1">Contribution Limit</Heading>
            <HStack justify='center' my={1}>
              <FortuneIcon boxSize={4} />
              <Heading as="h5" size="sm">{commify(rwkData.maxSupply)}</Heading>
            </HStack>
          </Box>
          {!!user.address && (
            <Box textAlign="center">
              <Heading as="h6" size="xs" className="mb-1">Your Balance</Heading>
              <HStack justify='center' my={1}>
                <FortuneIcon boxSize={4} />
                <Heading as="h5" size="sm">{commify(round(rwkData.userBalance))}</Heading>
              </HStack>
            </Box>
          )}
        </Stack>
      </Center>
      <Box my={2}>
        <hr />
      </Box>
      <SimpleGrid columns={2}>
        <Box fontSize="xl" fontWeight='bold' className="mb-1">{rwkData.status < statuses.LIVE ? <>Starting in</> : <>Ends in</>}</Box>
        <Box textAlign='end' my='auto'>
          {rwkData.status === statuses.LIVE ? (
            <Countdown
              key={1}
              date={rwkData.endTime}
              renderer={renderer}
              onComplete={handleTimerComplete}
            />
          ) : rwkData.status > statuses.LIVE ? (
            <>Ended</>
          ) : (rwkData.status < statuses.LIVE && !rwkData.startTime) ? (
            <>TBA</>
          ) : (
            <Countdown
              key={0}
              date={rwkData.startTime}
              renderer={renderer}
              onComplete={handleTimerComplete}
            />
          )}
        </Box>
        {!!user.address && rwkData.status >= statuses.LIVE && (
          <>
            <Box>Your spend</Box>
            <Box textAlign='end'>{commify(rwkData.userContribution ?? 0)}</Box>
          </>
        )}
        {!!user.address && !!rwkData.address && rwkData.status < statuses.LIVE && (
          <>
            <VStack align='start' spacing={0}>
              <Box>Approve spending limit</Box>
              <Box fontSize='sm'>Avoid an extra approval transaction before sale starts</Box>
            </VStack>
            <Box textAlign='end' my='auto'>
              <PrimaryButton
                size='sm'
                onClick={handleEagerApproval}
                isLoading={isEagerApproving}
                isDisabled={isEagerApproving}
              >
                Approve
              </PrimaryButton>
            </Box>
          </>
        )}
        {/*<Box>*/}
        {/*  Estimated reward*/}
        {/*</Box>*/}
        {/*<HStack justify='end'>*/}
        {/*  <FortuneIcon boxSize={6} />*/}
        {/*  <Box ms={2} fontWeight='bold' fontSize='lg'>TBA</Box>*/}
        {/*</HStack>*/}
      </SimpleGrid>
      {rwkData.status === statuses.LIVE ? (
        <Box mt={2}>
          <Box>
            <Flex justify='space-between' mt={3} mb={1}>
              <Box fontWeight='bold'>{percentage(rwkData.currentSupply.toString(), rwkData.maxSupply.toString())}% complete</Box>
              <Box>{ethers.utils.commify(rwkData.currentSupply.toString())} / {ethers.utils.commify(rwkData.maxSupply.toString())}</Box>
            </Flex>
            <Progress
              size='sm'
              value={percentage(rwkData.currentSupply.toString(), rwkData.maxSupply.toString())}
              bg='white'
              rounded='lg'
              hasStripe
              sx={{
                "& > div:first-of-type": {
                  transitionProperty: "width",
                },
              }}
            />
          </Box>
          <AuthenticationGuard>
            {({isConnected, connect}) => (
              <>
                {isConnected ? (
                  <>
                    {/*<Box textAlign='center' mt={4}>You can mint up to <strong>{rwkData.canMint}</strong> {pluralize(rwkData.canMint, 'Hero', 'Heroes')} at the current price</Box>*/}
                    <Stack direction={{base: 'column', sm: 'row'}} justify='space-evenly' textAlign='center' mt={4}>
                      <MintBox />
                    </Stack>
                  </>
                ) : (
                  <Center mt={4}>
                    <PrimaryButton onClick={connect}>
                      Connect Wallet
                    </PrimaryButton>
                  </Center>
                )}
              </>
            )}
          </AuthenticationGuard>
        </Box>
      ) : rwkData.status === statuses.SOLD_OUT ? (
        <Box textAlign='center' mt={4}>
          <Box border='1px solid' rounded='sm'>SOLD OUT</Box>
          {!!user.address && (
            <Box mt={4}><ClaimBox /></Box>
          )}
        </Box>
      ) : rwkData.status === statuses.EXPIRED && (
        <Box textAlign='center' mt={4}>
          <Box border='1px solid' rounded='sm'>ENDED</Box>
          {!!user.address && (
            <Box mt={4}><ClaimBox /></Box>
          )}
        </Box>
      )}
      {!!rwkData.address && (
        <Box textAlign='center' mt={4} fontSize='sm' fontStyle='italic'>
          Contract: {rwkData.address}
        </Box>
      )}
    </Box>
  )
}

export default AuctionBox;