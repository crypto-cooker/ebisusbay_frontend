import useAuthedFunction from '@market/hooks/useAuthedFunction';
import { AspectRatio, Box, Icon, Image, useDisclosure, useMediaQuery, VStack } from '@chakra-ui/react';
import ImageService from '@src/core/services/image';
import RdButton from '../../../components/rd-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBalanceScale, faShieldAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react';
import { useWindowSize } from '@market/hooks/useWindowSize';
import EditFactionForm
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/edit';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import CreateFactionForm
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/create';
import RyoshiTotals from '@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-ryoshi';
import Diplomacy from '@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/diplomacy';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/nextjs';
import { motion } from 'framer-motion';
import BankerBubbleBox, {
  TypewriterText
} from '@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box';

const greeterImages = {
  idle: '/img/ryoshi-dynasties/village/buildings/alliance-center/greeter-idle.png',
  talking: '/img/ryoshi-dynasties/village/buildings/alliance-center/greeter-talking.png',
};

const greetings = [
  'Greetings Ambassador. What would you like to accomplish today?',
];

interface AllianceCenterSceneProps {
  onBack: () => void;
}

const AllianceCenter = ({onBack}: AllianceCenterSceneProps) => {
  const [runAuthedFunction] = useAuthedFunction();
  const {requestSignature} = useEnforceSignature();
  const windowSize = useWindowSize();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [greeterImage, setGreeterImage] = useState(greeterImages.talking);
  const [abbreviateButtonText, setAbbreviateButtonText] = useState(false);
  const [shouldAbbreviateHorizontal] = useMediaQuery('(max-width: 800px)');

  const { isOpen: isOpenCreateFaction, onOpen: onOpenCreateFaction, onClose: onCloseCreateFaction} = useDisclosure();
  const { isOpen: isOpenEditFaction, onOpen: onOpenEditFaction, onClose: onCloseEditFaction} = useDisclosure();
  const { isOpen: isOpenRyoshiTotals, onOpen: onOpenRyoshiTotals, onClose: onCloseRyoshiTotals} = useDisclosure();
  const { isOpen: isOpenDiplomacy, onOpen: onOpenDiplomacy, onClose: onCloseDiplomacy} = useDisclosure();


  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
    }
  }

  const handleManageFaction = () => {
    if (!!rdContext.user && !!rdContext.user.faction) {
      onOpenEditFaction();
    } else {
      onOpenCreateFaction();
    }
  }

  const handleAuthedNavigation = async (fn: () => void) => {
    try {
      await requestSignature();
    } catch (e) {
      Sentry.captureException(e);
      toast.error('Please sign in to continue');
    }

    runAuthedFunction(fn);
  }

  useEffect(() => {
    const shouldAbbreviateVertical = !!windowSize.height && windowSize.height < 800;
    setAbbreviateButtonText(shouldAbbreviateVertical && shouldAbbreviateHorizontal);
  }, [windowSize, shouldAbbreviateHorizontal]);

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow='hidden'
    >
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
      >
        <Box
          position='absolute'
          right={-1}
          bottom={20}
          zIndex={10}
          w={abbreviateButtonText ? '60px' : '269px'}
        >
          <VStack spacing={4} align='end'>
            <RdButton size={{ base: 'md', sm: 'lg' }} w='full' hoverIcon={!abbreviateButtonText}
                      onClick={() => handleAuthedNavigation(handleManageFaction)}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faShieldAlt} />
              ) : (
                <>Manage Faction</>
              )}
            </RdButton>
            <RdButton size={{ base: 'md', sm: 'lg' }} w='full' hoverIcon={!abbreviateButtonText}
                      onClick={() => handleAuthedNavigation(onOpenRyoshiTotals)}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faUsers} />
              ) : (
                <>Ryoshi Dispatch</>
              )}
            </RdButton>
            <RdButton size={{ base: 'md', sm: 'lg' }} w='full' hoverIcon={!abbreviateButtonText}
                      onClick={() => handleAuthedNavigation(onOpenDiplomacy)}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faBalanceScale} />
              ) : (
                <>Diplomacy</>
              )}
            </RdButton>
            <RdButton size={{ base: 'md', sm: 'lg' }} w='full' hoverIcon={!abbreviateButtonText} onClick={onBack}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faArrowRightFromBracket} />
              ) : (
                <>Exit</>
              )}
            </RdButton>
          </VStack>
        </Box>

        {!!rdContext.user && (
          <>
            {!!rdContext.user.faction && (
              <EditFactionForm isOpen={isOpenEditFaction} onClose={onCloseEditFaction} faction={rdContext.user.faction}
                               isRegistered={!!rdContext.user.season.faction} />
            )}
            <CreateFactionForm isOpen={isOpenCreateFaction} onClose={onCloseCreateFaction}
                               handleClose={onCloseCreateFaction} />
            <RyoshiTotals isOpen={isOpenRyoshiTotals} onClose={onCloseRyoshiTotals} />
            <Diplomacy isOpen={isOpenDiplomacy} onClose={onCloseDiplomacy} />
          </>
        )}

        <AspectRatio ratio={1920/1080} overflow='visible' >
          <Image
            position={'absolute'}
            opacity={0.9}
            zIndex={0}
            src={ImageService.translate('/img/ryoshi-dynasties/village/background-alliance-center.webp').convert()}
            minH='calc(100vh - 74px)'
          />
        </AspectRatio>

        <Image
          src={ImageService.translate(greeterImage).convert()}
          w='800px'
          position='absolute'
          bottom={{ base: 12, md: 0 }}
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
                  '<br /><br />You can create a faction or delegate your troops to the factions of your favorite NFTs and tokens. To check your status with a faction, press the diplomacy button.'
                ]}
                onComplete={() => setGreeterImage(greeterImages.idle)}
              />
            )}
          </BankerBubbleBox>
        </Box>
      </motion.div>
    </Box>
);
}

export default AllianceCenter;