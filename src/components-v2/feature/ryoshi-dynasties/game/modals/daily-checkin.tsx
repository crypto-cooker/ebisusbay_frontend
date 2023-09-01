import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {Box, HStack, Image, SimpleGrid, Text} from "@chakra-ui/react";
import {createSuccessfulTransactionToastContent, pluralize} from "@src/utils";
import {useContext, useEffect, useState} from "react";
import {Contract} from "ethers";
import {toast} from "react-toastify";
import {appConfig} from "@src/Config";
import Resources from "@src/Contracts/Resources.json";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import moment from "moment";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import useAuthedFunction from "@src/hooks/useAuthedFunction";

const config = appConfig();

interface DailyCheckinProps {
  isOpen: boolean;
  onClose: () => void;
  forceRefresh: () => void;
}
const DailyCheckin = ({isOpen, onClose, forceRefresh}: DailyCheckinProps) => {
  const dispatch = useDispatch();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector(state => state.user);
  const [_, getSigner] = useCreateSigner();
  const [streak, setStreak] = useState(0);
  const [streakIndex, setStreakIndex] = useState(0);
  const [nextClaim, setNextClaim] = useState("");

  const [canClaim, setCanClaim] = useState(false);
  const [executingClaim, setExecutingClaim] = useState(false);

  const [runAuthedFunction] = useAuthedFunction();

  const authCheckBeforeClaim = async () => {
    await runAuthedFunction(claimDailyRewards);
  };

  const claimDailyRewards = async () => {
    if (!user.address) return;
      try {
        setExecutingClaim(true);
        let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
        if (!signatureInStorage) {
          const { signature } = await getSigner();
          signatureInStorage = signature;
        }
        if (signatureInStorage) {
          const authorization = await ApiService.withoutKey().ryoshiDynasties.claimDailyRewards(user.address, signatureInStorage);

          const sig = authorization.data.signature;
          const mintRequest = JSON.parse(authorization.data.metadata);

          // console.log('===contract', config.contracts.resources, Resources, user.provider.getSigner());
          const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
          // console.log('===request', mintRequest, sig, authorization);
          const tx = await resourcesContract.mintWithSig(mintRequest, sig);

          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
          setCanClaim(false);
          setNextClaim('in 24 hours');
          rdContext.refreshUser();
          forceRefresh();
        }
      } catch (error: any) {
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setExecutingClaim(false);
      }
  }

  const connectWalletPressed = async () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

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
  }, [user.address, isOpen, rdContext.user])

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
        {!!user.address ? (
          <>
            <SimpleGrid columns={{base: 4, sm: rdContext.config.rewards.daily.length}} gap={1} padding={2} my={4}>
              {rdContext.config.rewards.daily.map((reward, index) => (
                <Box key={index} w='100%' h='55' rounded="lg" color={'#FFD700'}  border={streakIndex == index + 1 ? '2px' : ''}>
                  <Text fontSize={16} color='#aaa' textAlign={'center'}>Day {index + 1}</Text>
                  <HStack justifyContent={'center'} spacing={0.5}>
                    <Text fontSize={18} color={'white'} fontWeight='bold' textAlign={'center'} >{reward}</Text>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="walletIcon" boxSize={4}/>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>

            <Box textAlign='center'>
              <Text as='span'>Your current streak is <strong>{streak} {pluralize(streak, 'day')}</strong>. </Text>
              {canClaim ? (
                <Text as='span'>
                  Claim now to increase your streak and earn {rdContext.config.rewards.daily[streakIndex]} Koban
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
        ) : (
          <Box textAlign='center' mt={4}>
            <RdButton onClick={connectWalletPressed}>Connect Wallet</RdButton>
          </Box>
        )}
      </Box>
    </RdModal>
  )
}

export default DailyCheckin;