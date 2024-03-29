import {useAtom} from "jotai";
import {Box, Center, Flex, Heading, HStack, Progress, SimpleGrid, Spacer, Stack} from "@chakra-ui/react";
import {DropState as statuses} from "@src/core/api/enums";
import {getTheme} from "@src/Theme/theme";
import Countdown, {zeroPad} from "react-countdown";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import React from "react";
import {percentage, round} from "@src/utils";
import {ethers} from "ethers";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import Link from "next/link";
import {useUser} from "@src/components-v2/useUser";
import {rwkDataAtom} from "@src/components-v2/feature/drop/types/ryoshi-with-knife/atom";
import MintBox from "@src/components-v2/feature/drop/types/ryoshi-with-knife/mint-box";
import ClaimBox from "@src/components-v2/feature/drop/types/ryoshi-with-knife/claim-box";

interface ContractInfo {

}

interface AuctionBoxProps {

}

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
            <Heading as="h6" size="xs" className="mb-1">Allocation</Heading>
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
                <Heading as="h5" size="sm">{commify(round(user.balances.frtn))}</Heading>
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
        {!!user.address && (
          <>
            <Box>Your spend</Box>
            <Box textAlign='end'>{rwkData.userContribution}</Box>
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
    </Box>
  )
}

export default AuctionBox;