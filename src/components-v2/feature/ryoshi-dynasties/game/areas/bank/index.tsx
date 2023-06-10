import {useCallback, useState} from 'react';
import {AspectRatio, Box, Icon, Image, useBreakpointValue, useDisclosure, VStack} from '@chakra-ui/react';

import StakeFortune from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune';
import StakeNFTs from './stake-nft';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useAppSelector} from "@src/Store/hooks";
import {useWindowSize} from "@src/hooks/useWindowSize";
import BankerBubbleBox, {
  TypewriterText
} from "@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box";
import {appConfig} from "@src/Config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCoins, faGift, faImage, faSuitcaseMedical} from "@fortawesome/free-solid-svg-icons";
import Rewards from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/rewards";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from 'react-redux';
import ImageService from "@src/core/services/image";

interface BankerSceneProps {
  address: string;
  onBack: () => void;
}

const bankerImages = {
  idle: '/img/battle-bay/gifBanker/eyeblink.gif',
  talking: '/img/battle-bay/gifBanker/mouth.gif',
};

const Bank = ({address, onBack} : BankerSceneProps) => {
  const dispatch = useDispatch();

  const { isOpen: isOpenStakeFortune, onOpen: onOpenStakeFortune, onClose: onCloseStakeFortune} = useDisclosure();
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseRewards} = useDisclosure();

  const [bankerImage, setBankerImage] = useState(bankerImages.talking);
  const user = useAppSelector((state) => state.user);
  const windowSize = useWindowSize();
  const config = appConfig();
  const abbreviateButtonText = useBreakpointValue<boolean>(
    {base: true, sm: false},
    {fallback: 'sm'},
  );

  const handleExit = useCallback(() => {
    setBankerImage(bankerImages.talking);
    onBack();
  }, []);

  const greetings = ['Greetings, traveler. I am the best person to talk to when it comes to your $Fortune possessions… or lack-thereof… which I could help you address.',
                  'Hail, brave hero! How may I assist you with your $Fortune possessions today? Stake, purchase, or withdraw?',
                  'Welcome, honored guest! Ready to ride the waves of fortune? Stake, purchase, or withdraw your tokens with me.',
                  'Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, that our world has gone through quite an evolution.', 
                  'I am here to help all citizens of the Lotus Galaxy stake, purchase or withdraw their tokens. How may I help?',
                  'Blessings, traveler! Let me guess, you want me to help with your Fortune possessions. Say no more. What can I do for you today?']

  const handleAuthedNavigation = useCallback((fn: () => void) => {
    if (!!user.address) {
      fn();
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }, [user.address]);

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow='hidden'
    >
    <Box>

    <StakeFortune address={address} isOpen={isOpenStakeFortune} onClose={onCloseStakeFortune} />
    <StakeNFTs isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
    <Rewards isOpen={isOpenWithdraw} onClose={onCloseRewards}/>

    <AspectRatio ratio={1920/1080} overflow='visible'>
      <Image
        src={ImageService.translate('/img/battle-bay/bankinterior/bank_interior_background_desktop_animated.png').convert()}
        minH='calc(100vh - 74px)'
      />
    </AspectRatio>
    <Image
      src={bankerImage}
      w='800px'
      position='absolute'
      bottom={0}
      left={0}
    />
      <Box
        position='absolute'
        top={{base: 5, md: 10, lg: 16}}
        left={{base: 0, md: 10, lg: 16}}
        w={{base: 'full', md: '600px'}}
        pe={!!windowSize.height && windowSize.height < 600 ? {base: '60px', sm: '150px', md: '0px'} : {base: '5px', md: '0px'}}
        ps={{base: '5px', md: '0px'}}
        rounded='lg'
      >
        <BankerBubbleBox fontSize={{base: 'md', sm: 'lg', md: 'xl'}} color='white'>
          {(
            <TypewriterText
              text={[greetings[Math.floor(Math.random() * greetings.length)]]}
              onComplete={() => setBankerImage(bankerImages.idle)}
            />
          )}
        </BankerBubbleBox>
      </Box>
      <Box
        position='absolute'
        right={-1}
        bottom={20}
        w={abbreviateButtonText ? '60px' : '269px'}
      >
        <VStack spacing={4} align='end'>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handleAuthedNavigation(onOpenStakeFortune)}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faCoins} />
            ) : (
              <>Stake $Fortune </>
            )}
          </RdButton>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faImage} />
            ) : (
              <>Stake NFTs </>
            )}
          </RdButton>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handleAuthedNavigation(onOpenWithdraw)}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faGift} />
            ) : (
              <>Rewards</>
            )}
          </RdButton>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={onBack}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faArrowRightFromBracket} />
            ) : (
              <>Exit</>
            )}
          </RdButton>
        </VStack>
      </Box>
    </Box>
    </Box>
  );
}

export default Bank;