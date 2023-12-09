import React, {useCallback, useEffect, useState} from 'react';
import {AspectRatio, Box, Icon, Image, Text, useDisclosure, useMediaQuery, VStack} from '@chakra-ui/react';

import StakeFortune from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune';
import StakeNFTs from './stake-nft';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useWindowSize} from "@src/hooks/useWindowSize";
import BankerBubbleBox, {
  TypewriterText
} from "@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCoins, faGift, faImage} from "@fortawesome/free-solid-svg-icons";
import Rewards from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/rewards";
import ImageService from "@src/core/services/image";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {motion} from "framer-motion";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {useUser} from "@src/components-v2/useUser";

interface BankerSceneProps {
  address: string;
  onBack: () => void;
}

const bankerImages = {
  idle: '/img/battle-bay/gifBanker/eyeblink.gif',
  talking: '/img/battle-bay/gifBanker/mouth.gif',
};

const Bank = ({address, onBack} : BankerSceneProps) => {
  const [runAuthedFunction] = useAuthedFunction();

  const { isOpen: isOpenStakeFortune, onOpen: onOpenStakeFortune, onClose: onCloseStakeFortune} = useDisclosure();
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseRewards} = useDisclosure();
  const { isOpen: isBlockingModalOpen, onOpen: onOpenBlockingModal, onClose: onCloseBlockingModal } = useDisclosure();

  const [bankerImage, setBankerImage] = useState(bankerImages.talking);
  const user = useUser();
  const windowSize = useWindowSize();
  const [shouldAbbreviateHorizontal] = useMediaQuery('(max-width: 800px)');
  const [abbreviateButtonText, setAbbreviateButtonText] = useState(false);
  const { isOpen:isOpenOverlay, onToggle } = useDisclosure()

  useEffect(() => {
    const shouldAbbreviateVertical = !!windowSize.height && windowSize.height < 800;
    setAbbreviateButtonText(shouldAbbreviateVertical && shouldAbbreviateHorizontal);
  }, [windowSize, shouldAbbreviateHorizontal]);

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
    runAuthedFunction(fn);
  }, [user.address]);

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
     }
  }

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
        <RdModal
          isOpen={isBlockingModalOpen}
          onClose={onCloseBlockingModal}
          title='Coming Soon'
        >
          <RdModalAlert>
            <Text>This area is currently unavailable, either due to maintenance, or a game that has yet to be started. Check back again soon!</Text>
          </RdModalAlert>
        </RdModal>
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          >

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
          pe={!!windowSize.height && windowSize.height < 800 ? {base: '60px', sm: '150px', md: '0px'} : {base: '5px', md: '0px'}}
          ps={{base: '5px', md: '0px'}}
          rounded='lg'
        >
          <BankerBubbleBox fontSize={{base: 'md', sm: 'lg', md: 'xl'}} color='white'>
            {(
              <TypewriterText
                text={[
                  greetings[Math.floor(Math.random() * greetings.length)],
                  '<br /><br />Stake Fortune to stake your Fortune tokens and earn troops. Stake NFTs to boost your staking APR. Go to "Rewards" to claim your Fortune rewards.'
                ]}
                onComplete={() => setBankerImage(bankerImages.idle)}
              />
            )}
          </BankerBubbleBox>
        </Box>


          </motion.div>

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