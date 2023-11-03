import {useAtom} from "jotai";
import {dutchAuctionDataAtom} from "@src/components-v2/feature/drop/types/dutch/atom";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Progress,
  SimpleGrid,
  Spacer,
  Stack
} from "@chakra-ui/react";
import {DropState as statuses} from "@src/core/api/enums";
import {getTheme} from "@src/Theme/theme";
import {useAppSelector} from "@src/Store/hooks";
import Countdown, {zeroPad} from "react-countdown";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import React from "react";
import {percentage, pluralize} from "@src/utils";
import {ethers} from "ethers";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import MintBox from "@src/components-v2/feature/drop/types/dutch/mint-box";
import RefundBox from "@src/components-v2/feature/drop/types/dutch/refund-box";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ContractInfo {

}

interface AuctionBoxProps {

}

const AuctionBox = ({}: AuctionBoxProps) => {
  const user = useAppSelector((state) => state.user);
  const [auctionData, setAuctionData] = useAtom(dutchAuctionDataAtom);

  const renderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    if (completed) {
      return (
        <HStack justify='end'>
          <Box>Starting next round...</Box>
          <IconButton
            aria-label='Refresh'
            icon={<Icon as={FontAwesomeIcon} icon={faRefresh} />}
            onClick={auctionData.refreshContract}
            size='sm'
          />
        </HStack>
      );
    } else {
      let timeStr = `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
      if (days > 0) timeStr = `${zeroPad(days)}:${timeStr}`;
      return <Box fontSize='lg' fontWeight='bold'>{timeStr}</Box>;
    }
  };

  const handleTimerComplete = () => {
    auctionData.refreshContract();
  }

  return (
    <Box
      className="card shadow"
      mt={2}
      borderColor={getTheme(user.theme).colors.borderColor3}
      borderWidth={2}
      bgColor={getTheme(user.theme).colors.bgColor5}
      p={4}
      rounded='2xl'
    >

      <Center>
        <Stack direction='row' spacing={6}>
          <Box textAlign="center">
            <Heading as="h6" size="xs" className="mb-1">Start Price</Heading>
            <HStack justify='center' my={1}>
              <FortuneIcon boxSize={4} />
              <Heading as="h5" size="sm">{commify(auctionData.startPrice)}</Heading>
            </HStack>
          </Box>
          <Box textAlign="center">
            <Heading as="h6" size="xs" className="mb-1">Max Supply</Heading>
            <Heading as="h5" size="sm">{auctionData.maxSupply}</Heading>
          </Box>
        </Stack>
      </Center>
      <Box  my={2}>
        <hr />
      </Box>
      <SimpleGrid columns={2}>
        <Box fontSize="xl" fontWeight='bold' className="mb-1">{auctionData.status < statuses.LIVE ? <>Mint starting in</> : <>Next round starts</>}</Box>
        <Box textAlign='end' my='auto'>
          {auctionData.status === statuses.LIVE ? (
            <Countdown
              key={auctionData.currentRound}
              date={auctionData.nextRoundTime}
              renderer={renderer}
              onComplete={handleTimerComplete}
            />
          ) : auctionData.status > statuses.LIVE ? (
            <>Ended</>
          ) : (auctionData.status < statuses.LIVE && !auctionData.nextRoundTime) ? (
            <>TBA</>
          ) : (
            <Countdown
              key={0}
              date={auctionData.nextRoundTime}
              renderer={renderer}
              onComplete={handleTimerComplete}
            />
          )}
        </Box>
        <Box>Current Round</Box>
        <Box textAlign='end'>{auctionData.currentRound}</Box>
        <Box>
          {auctionData.status === statuses.LIVE ?
            <>Current Price</>
          : auctionData.status < statuses.LIVE ?
            <>Starting Price</>
          :
            <>Final Price</>
          }
        </Box>
        <HStack justify='end'>
          <FortuneIcon boxSize={6} />
          <Box ms={2} fontWeight='bold' fontSize='lg'>{auctionData.currentPrice ? commify(auctionData.currentPrice) : 'TBA'}</Box>
        </HStack>
        <Spacer />
        <Box fontSize='sm' fontWeight='bold' mt={2} textAlign='end'>
          <Link href={`/collection/${auctionData.drop?.collection ?? 'ryoshi-heroes'}`} className='color'>
            View collection
          </Link>
        </Box>
      </SimpleGrid>
      {auctionData.status === statuses.LIVE ? (
        <Box mt={2}>
          <Box>
            <Flex justify='space-between' mt={3} mb={1}>
              <Box fontWeight='bold'>{percentage(auctionData.currentSupply.toString(), auctionData.maxSupply.toString())}% minted</Box>
              <Box>{ethers.utils.commify(auctionData.currentSupply.toString())} / {ethers.utils.commify(auctionData.maxSupply.toString())}</Box>
            </Flex>
            <Progress
              size='sm'
              value={percentage(auctionData.currentSupply.toString(), auctionData.maxSupply.toString())}
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
                    <Box textAlign='center' mt={4}>You can mint up to <strong>{auctionData.canMint}</strong> {pluralize(auctionData.canMint, 'Hero', 'Heroes')} at the current price</Box>
                    <Stack direction={{base: 'column', sm: 'row'}} justify='space-evenly' textAlign='center' mt={4}>
                      <MintBox />
                      <RefundBox />
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
      ) : auctionData.status === statuses.SOLD_OUT ? (
        <Box textAlign='center' mt={4}>
          <Box border='1px solid' rounded='sm'>SOLD OUT</Box>
          {!!user.address && (
            <Box mt={4}><RefundBox /></Box>
          )}
        </Box>
      ) : auctionData.status === statuses.EXPIRED && (
        <Box textAlign='center' mt={4}>
          <Box border='1px solid' rounded='sm'>ENDED</Box>
          {!!user.address && (
            <Box mt={4}><RefundBox /></Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default AuctionBox;