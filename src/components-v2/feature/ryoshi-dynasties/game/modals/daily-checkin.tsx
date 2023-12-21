import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ApiService} from "@src/core/services/api-service";
import {Box, HStack, Image, SimpleGrid, Text} from "@chakra-ui/react";
import {pluralize} from "@src/utils";
import {useContext, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {appConfig} from "@src/Config";
import moment from "moment";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface DailyCheckinProps {
  isOpen: boolean;
  onClose: () => void;
  forceRefresh: () => void;
}
const DailyCheckin = ({isOpen, onClose, forceRefresh}: DailyCheckinProps) => {
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();

  const [streak, setStreak] = useState(0);
  const [streakIndex, setStreakIndex] = useState(0);
  const [nextClaim, setNextClaim] = useState("");

  const [canClaim, setCanClaim] = useState(false);
  const [executingClaim, setExecutingClaim] = useState(false);

  const [runAuthedFunction] = useAuthedFunction();
  const {isSignedIn, signin, requestSignature} = useEnforceSigner();

  const isEligibleForBonus = useMemo(() => {
    // const inscriptionsPromoEndDate = new Date('2024-01-01');
    // const isInscriptionsPromoLive = new Date() < inscriptionsPromoEndDate;
    // if (!isInscriptionsPromoLive) return false;
    //
    // const crosInscription = user.inscriptions.find(inscription => inscription.tick === 'cros');
    // return crosInscription && crosInscription.amount >= 1000000
    return false;
  }, []);

  const kobanMultiplier = isEligibleForBonus ? 10 : 1;

  const authCheckBeforeClaim = async () => {
    await runAuthedFunction(claimDailyRewards);
  };

  const handleSignin = async () => {
    await signin();
  }

  const claimDailyRewards = async () => {
    if (!user.address) return;
      try {
        setExecutingClaim(true);
        const signature = await requestSignature();
        await ApiService.withoutKey().ryoshiDynasties.claimDailyRewards(user.address, signature);
        toast.success('Success!');
        setCanClaim(false);
        setNextClaim('in 24 hours');
        rdContext.refreshUser();
        forceRefresh();
      } catch (error: any) {
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setExecutingClaim(false);
      }
  }

  useEffect(() => {
    if (isOpen) {
      if (!user.address || !rdContext.user) {
        setCanClaim(false);
        setStreak(0);
        return;
      }

      const claimData = rdContext.user.dailyRewards;
      setStreak(claimData.streak);
      setStreakIndex(claimData.streak % rdContext.config.rewards.daily.length);
      if(!claimData.nextClaim) {
        setCanClaim(true);
      } else if(Date.parse(claimData.nextClaim) <= Date.now()) {
        setCanClaim(true);
      } else {
        setCanClaim(false);
        let date = new Date(claimData.nextClaim);
        setNextClaim('at ' + date.getHours() + ":" + moment(new Date(date)).format("mm") + " on " +
          moment(new Date(date)).format("MMM") + " "+ date.getDate()+ " " + date.getFullYear());
      }
    }
  }, [user.address, isOpen, rdContext.user, isSignedIn])

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Claim Daily Reward'
    >
      <Box mx={1} pb={4}>
        <Text align='center'>
          Earn Koban by checking in daily. Multiply your rewards by claiming multiple days in a row!
        </Text>
        {isEligibleForBonus && (
          <Text align='center' fontWeight='bold' color='#FFD700' mt={2}>
            You are eligible for a 10x bonus!
          </Text>
        )}
        <AuthenticationRdButton
          connectText='Connect and sign in to claim your daily reward'
          signinText='Sign in to claim your daily reward'
        >
          <>
            <SimpleGrid columns={{base: 4, sm: rdContext.config.rewards.daily.length}} gap={1} padding={2} my={4}>
              {rdContext.config.rewards.daily.map((reward, index) => (
                <Box key={index} w='100%' h='55' rounded="lg" color={'#FFD700'}  border={streakIndex == index + 1 ? '2px' : ''}>
                  <Text fontSize={16} color='#aaa' textAlign={'center'}>Day {index + 1}</Text>
                  <HStack justifyContent={'center'} spacing={0.5}>
                    <Text fontSize={18} color={'white'} fontWeight='bold' textAlign={'center'} >{reward * kobanMultiplier}</Text>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="walletIcon" boxSize={4}/>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>

            <Box textAlign='center'>
              <Text as='span'>Your current streak is <strong>{streak} {pluralize(streak, 'day')}</strong>. </Text>
              {canClaim ? (
                <Text as='span'>
                  Claim now to increase your streak and earn {rdContext.config.rewards.daily[streakIndex] * kobanMultiplier} Koban
                </Text>
              ) : (
                <Text as='span'>
                  Claim again {nextClaim}
                </Text>
              )}
            </Box>

            {canClaim && (
              <Box textAlign='center' mt={4}>
                <RdButton
                  stickyIcon={true}
                  onClick={authCheckBeforeClaim}
                  isLoading={executingClaim}
                  disabled={executingClaim}
                  loadingText='Claiming'
                >
                  Claim Koban
                </RdButton>
              </Box>
            )}
          </>
        </AuthenticationRdButton>
      </Box>
    </RdModal>
  )
}

export default DailyCheckin;