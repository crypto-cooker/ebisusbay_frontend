import {useAppSelector} from "@src/Store/hooks";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ApiService} from "@src/core/services/api-service";
import {useQuery} from "@tanstack/react-query";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import {Box, Center, Flex, HStack, Image, Spacer, Spinner, Stack, Text, useDisclosure, VStack} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import RdButton from "../../../../components/rd-button";
import React, {useContext, useEffect, useState} from "react";
import RdProgressBar from "@src/components-v2/feature/ryoshi-dynasties/components/rd-progress-bar";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {round} from "@src/utils";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useFortunePrice} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";

const config = appConfig();

const FortuneRewardsTab = () => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);
  const [seasonTimeRemaining, setSeasonTimeRemaining] = useState(0);
  const [burnMalus, setBurnMalus] = useState(0);

  const checkForRewards = async () => {
    return ApiService.withoutKey().ryoshiDynasties.getSeasonalRewards(user.address!);
  }

  const { error, data: rewards, status, refetch } = useQuery(
    ['BankSeasonalRewards', user.address],
    checkForRewards,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    if (rdGameContext) {
      const totalTime = Date.parse(rdGameContext.season.endAt) - Date.parse(rdGameContext.season.startAt);
      const currentElapsed = Date.parse(rdGameContext.season.endAt) - Date.now();
      setSeasonTimeRemaining(Math.floor(((totalTime - currentElapsed) / totalTime) * 100));
      setBurnMalus(rdGameContext!.rewards.burnPercentage / 100);
    }

  }, [rdGameContext]);

  return (
    <Box>
      <Box>
        <Text fontWeight='bold' fontSize='lg'>Current Season Progress ({seasonTimeRemaining}%)</Text>
        <RdProgressBar current={seasonTimeRemaining} max={100} segments={3}/>
      </Box>
      <Box mt={2}>
        <Text fontWeight='bold' fontSize='lg'>Karmic Debt ({round(burnMalus)}%)</Text>
        <RdProgressBar current={burnMalus} max={100} useGrid={false} fillColor='linear-gradient(to left, #B45402, #7D3500)' />
      </Box>
      <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
        <Box textAlign='center'>
          Fortune rewards accumulate from Fortune staking, marketplace listings, and from playing the game and can be withdrawn at any time.
          However, only withdrawing at the end of a season will allow you to claim the full amount of rewards.
        </Box>
        {status === "loading" ? (
          <Center py={4}>
            <Spinner />
          </Center>
        ) : status === "error" ? (
          <Center py={4}>
            <Text>Error: {(error as any).message}</Text>
          </Center>
        ) : (
          <>
            {rewards.data.rewards.length > 0 ? (
              <>
                <Box py={4}><hr /></Box>
                {rewards.data.rewards.map((reward: any) => (
                  <>
                    <ClaimRow reward={reward} burnMalus={burnMalus} />
                  </>
                ))}
              </>
            ) : (
              <Box mt={2}>
                <Text textAlign='center' fontSize={14}>You have no rewards to withdraw at this time.</Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

const ClaimRow = ({reward, burnMalus}: {reward: any, burnMalus: number}) => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [executingClaim, setExecutingClaim] = useState(false);
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);

  const isCurrentSeason = rdGameContext?.season.blockId === reward.blockId;

  // Round down decimals so that user can't claim more than they have
  function convertToNumberAndRoundDown(numStr: string): number {
    const precision = 13; // the precision you want to keep
    const parts = numStr.split('.');
    if (parts.length === 2 && parts[1].length > precision) {
      parts[1] = parts[1].substring(0, precision);
      numStr = parts.join('.');
    }
    return Number(numStr);
  }

  const handleWithdraw = async (amountAsString: string, seasonId: number) => {
    try {
      setExecutingClaim(true);
      onCloseConfirmation();
      const flooredAmount = convertToNumberAndRoundDown(amountAsString);

      let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, flooredAmount, seasonId, signatureInStorage)
        await user.contractService?.ryoshiPlatformRewards.withdraw(auth.data.reward, auth.data.signature);
      }
    } finally {
      setExecutingClaim(false);
    }
  }

  return (
    <Flex justify='space-between' mt={2}>
      <VStack align='start' spacing={0}>
        <Text fontSize='xl' fontWeight='bold'>
          {isCurrentSeason ? 'Current Season' : `Season ${reward.blockId}`}
        </Text>
        <HStack>
          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
          <Text fontSize='lg' fontWeight='bold'>{round(convertToNumberAndRoundDown(reward.currentRewards), 3)}</Text>
          <Text as='span' ms={1} fontSize='sm' color="#aaa">~${round((fortunePrice ? Number(fortunePrice.usdPrice) : 0) * reward.totalRewards, 2)}</Text>
        </HStack>
        <Text fontSize='sm' color='#aaa'>{round(reward.aprRewards, 3)} staking + {round(reward.listingRewards, 3)} listing rewards</Text>

      </VStack>
      <Flex direction='column'>
        <Spacer />
        <RdButton
          size='sm'
          onClick={() => isCurrentSeason ? onOpenConfirmation() : handleWithdraw(reward.currentRewards, Number(reward.seasonId))}
          isLoading={executingClaim}
          loadingText='Claiming...'
        >
          Claim
        </RdButton>
        <Spacer />
      </Flex>
      <RdModal
        isOpen={isConfirmationOpen}
        onClose={onCloseConfirmation}
        title='Confirm'
      >
        <RdModalAlert>
          <Text>Warning: Claiming from the current season is subject to a {round(burnMalus)}% Karmic Debt <strong>burn</strong> of <strong>{round(Number(reward.currentRewards) * burnMalus / 100, 3)} FRTN</strong>. At this point in the season, you will only be able to claim <Text as='span' color='#FDAB1A' fontWeight='bold'>{round(Number(reward.currentRewards) * (1 - burnMalus / 100), 3)} FRTN</Text></Text>
        </RdModalAlert>
        <RdModalFooter>
          <Stack justify='center' direction='row' spacing={6}>
            <RdButton
              onClick={onCloseConfirmation}
              size='lg'
            >
              Cancel
            </RdButton>
            <RdButton
              onClick={() => handleWithdraw(reward.currentRewards, Number(reward.seasonId))}
              size='lg'
            >
              Confirm
            </RdButton>
          </Stack>
        </RdModalFooter>
      </RdModal>
    </Flex>
  )
}
export default FortuneRewardsTab;