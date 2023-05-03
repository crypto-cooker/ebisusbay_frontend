import { useState, useRef, useEffect, useCallback} from 'react';
import {
  Button,
  Box,
  Flex,
  Image,
  useDisclosure,
  useMediaQuery,
  Text,
  AspectRatio,
  Stack,
  useBreakpointValue,
  VStack,
  Icon

} from '@chakra-ui/react';

import EmergencyWithdraw from './bank/components/EmergencyWithdraw';
import StakeFortune from './bank/components/StakeFortune';
import StakeNFTs from './bank/components/StakeNFTs';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useAppSelector} from "@src/Store/hooks";
import {useWindowSize} from "@src/hooks/useWindowSize";
import BankerBubbleBox, {TypewriterText} from "@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box";
import {appConfig} from "@src/Config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCircleInfo, faDollarSign} from "@fortawesome/free-solid-svg-icons";
import localFont from 'next/font/local';

interface BankerSceneProps {
  onBack: () => void;
  isVisible:boolean;
}

const bankerImages = {
  idle: '/img/battle-bay/gifBanker/eyeblink.gif',
  talking: '/img/battle-bay/gifBanker/mouth.gif',
};

const Bank = ({onBack, isVisible} : BankerSceneProps) => {

  const { isOpen: isOpenStakeFortune, onOpen: onOpenStakeFortune, onClose: onCloseStakeFortune} = useDisclosure();
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure();

  const [bankerImage, setBankerImage] = useState(bankerImages.talking);
  const [isExecuting, setIsExecuting] = useState(false);
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

 var greetings = ['Greetings, traveler. I am the best person to talk to when it comes to your $Fortune possessions… or lack-thereof… which I could help you address.',
                  'Hail, brave hero! How may I assist you with your $Fortune possessions today? Stake, purchase, or withdraw?',
                  'Welcome, honored guest! Ready to ride the waves of fortune? Stake, purchase, or withdraw your tokens with me.',
                  'Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, that our world has gone through quite an evolution.', 
                  'I am here to help all citizens of the Lotus Galaxy stake, purchase or withdraw their tokens. How may I help?',
                  'Blessings, traveler! Let me guess, you want me to help with your Fortune possessions. Say no more. What can I do for you today?']
  
  const randomGreeting = useState(greetings[Math.floor(Math.random() * greetings.length)]);

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
    >
    <Box>

    <StakeFortune isOpen={isOpenStakeFortune} onClose={onCloseStakeFortune}/>
    <StakeNFTs isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs}/>
    <EmergencyWithdraw isOpen={isOpenWithdraw} onClose={onCloseWithdraw}/>

    <AspectRatio ratio={1920/1080} overflow='visible'>
      <Image
        src='/img/battle-bay/bankinterior/bank_interior_background_desktop_animated.png'
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
        <BankerBubbleBox fontSize={{base: 'md', sm: 'lg', md: 'xl'}}>
          {(
            <TypewriterText
              text={[
                'Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, our world has gone through quite an evolution.<br /><br />',
                Date.now() > config.tokenSale.publicStart ?
                  'The $Fortune token presale is now open to the public! Press the "Buy $Fortune" button to get started.' :
                Date.now() > config.tokenSale.vipStart ?
                  'The $Fortune token presale is now open to VIPs! Press the "Buy $Fortune" button to get started.' :
                  'The $Fortune token presale will be held here on May 1st at 8pm UTC. VIPs will have exclusive access to the sale for one hour before the public sale.'
              ]}
              onComplete={() => setBankerImage(bankerImages.idle)}
            />
          )}
        </BankerBubbleBox>
      </Box>
      <Box
        position='absolute'
        right={-1}
        bottom={20}
        w={abbreviateButtonText ? '60px' : '250px'}
      >
        <VStack spacing={4} align='end'>
          {Date.now() > config.tokenSale.vipStart && (
            <RdButton w='full' hideIcon={abbreviateButtonText} onClick={() => onOpenStakeFortune()}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faDollarSign} />
              ) : (
                <>Stake $Fortune </>
              )}
            </RdButton>
          )}
          <RdButton w='full' hideIcon={abbreviateButtonText} onClick={() => onOpenStakeNFTs()}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faDollarSign} />
            ) : (
              <> Stake NFTs </>
            )}
          </RdButton>
          <RdButton w='full' hideIcon={abbreviateButtonText} onClick={() => onOpenWithdraw()}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faDollarSign} />
            ) : (
              <> Emergency Withdraw </>
            )}
          </RdButton>
          <RdButton w='full' hideIcon={abbreviateButtonText} onClick={() => onBack()}>
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