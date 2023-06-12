import {useAppSelector} from "@src/Store/hooks";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ApiService} from "@src/core/services/api-service";
import {useQuery} from "@tanstack/react-query";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import {Box, Center, Flex, Heading, HStack, Image, Spinner, Text, VStack} from "@chakra-ui/react";
import {commify} from "ethers/lib/utils";
import ImageService from "@src/core/services/image";
import RdButton from "../../../../components/rd-button";
import React, {useContext, useEffect, useState} from "react";
import RdProgressBar from "@src/components-v2/feature/ryoshi-dynasties/components/rd-progress-bar";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";


const FortuneRewardsTab = () => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [seasonTimeRemaining, setSeasonTimeRemaining] = useState(0);

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

    const flooredAmount = convertToNumberAndRoundDown(amountAsString);
    console.log('test1', amountAsString);
    console.log('test2', flooredAmount);

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, flooredAmount, seasonId, signatureInStorage)
      await user.contractService?.ryoshiPlatformRewards.withdraw(auth.data.reward, auth.data.signature);
    }
  }

  useEffect(() => {
    if (rdGameContext) {
      const totalTime = Date.parse(rdGameContext.season.endAt) - Date.parse(rdGameContext.season.startAt);
      const currentElapsed = Date.parse(rdGameContext.season.endAt) - Date.now();
      setSeasonTimeRemaining(Math.floor((currentElapsed / totalTime) * 100));
    }

  }, [rdGameContext]);

  return (
    <Box>
      <Box>
        <Text fontWeight='bold' fontSize='lg'>Current Season Progress ({seasonTimeRemaining}%)</Text>
        <RdProgressBar current={seasonTimeRemaining} max={100} useGrid={true} segments={3}/>
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
                    <Flex justify='space-between' mt={2}>
                      <VStack align='start' spacing={0}>
                        <Text fontSize='xl' fontWeight='bold'>Season {commify(reward.blockId)}</Text>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
                          <Text>{reward.currentRewards}</Text>
                        </HStack>
                      </VStack>
                      <RdButton hoverIcon={false} onClick={() => handleWithdraw(reward.currentRewards, Number(reward.seasonId))}>
                        Claim
                      </RdButton>
                    </Flex>
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


export default FortuneRewardsTab;