import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {Box, Icon, useDisclosure, VStack} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import RdButton from "../../../components/rd-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faShield} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import {useWindowSize} from "@src/hooks/useWindowSize";
import EditFactionForm
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/edit";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {useUser} from "@src/components-v2/useUser";
import CreateFactionForm
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/create";
import RyoshiTotals
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-ryoshi";
import Diplomacy from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/diplomacy";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {toast} from "react-toastify";
import * as Sentry from "@sentry/nextjs";

interface AllianceCenterSceneProps {
  onBack: () => void;
}

const AllianceCenter = ({onBack}: AllianceCenterSceneProps) => {
  const user = useUser();
  const [runAuthedFunction] = useAuthedFunction();
  const {requestSignature} = useEnforceSignature();
  const [abbreviateButtonText, setAbbreviateButtonText] = useState(false);
  const windowSize = useWindowSize();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

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

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow='hidden'
    >
      <Box width='100vw' height='100vh' position='relative'>
        <Box
          position='absolute'
          width='100%'
          height='100%'
          bgImage={`url(${ImageService.translate('/img/ryoshi-dynasties/village/background-alliance-center.webp').convert()})`}
          bgPosition='center'
          bgRepeat='no-repeat'
          bgSize='cover'
          opacity={0.2}
        />
        {/*<Box>*/}
        {/*  asdf*/}
        {/*</Box>*/}
        {/*<Flex*/}
        {/*  position='relative'*/}
        {/*  width='100%'*/}
        {/*  height='100%'*/}
        {/*  align='center'*/}
        {/*  justify='center'*/}
        {/*  direction='column'*/}
        {/*  zIndex='docked'*/}
        {/*>*/}
        {/*  asdaasdasdd*/}
        {/*</Flex>*/}
      </Box>
      <Box
        position='absolute'
        right={-1}
        bottom={20}
        zIndex={10}
        h='auto'
        w={abbreviateButtonText ? '60px' : '269px'}
      >
        <VStack spacing={4} align='end' h='full'>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handleAuthedNavigation(handleManageFaction)}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faShield} />
            ) : (
              <>Manage Faction</>
            )}
          </RdButton>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handleAuthedNavigation(onOpenRyoshiTotals)}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faShield} />
            ) : (
              <>Manage Ryoshi</>
            )}
          </RdButton>
          <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handleAuthedNavigation(onOpenDiplomacy)}>
            {abbreviateButtonText ? (
              <Icon as={FontAwesomeIcon} icon={faShield} />
            ) : (
              <>Diplomacy</>
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
      {!!rdContext.user && (
        <>
          {!!rdContext.user.faction && (
            <EditFactionForm isOpen={isOpenEditFaction} onClose={onCloseEditFaction} faction={rdContext.user.faction} handleClose={onCloseEditFaction} isRegistered={!!rdContext.user.season.faction} />
          )}
          <CreateFactionForm isOpen={isOpenCreateFaction} onClose={onCloseCreateFaction} handleClose={onCloseCreateFaction} />
          <RyoshiTotals isOpen={isOpenRyoshiTotals} onClose={onCloseRyoshiTotals} />
          <Diplomacy isOpen={isOpenDiplomacy} onClose={onCloseDiplomacy} />
        </>
      )}
    </Box>
  );
}

export default AllianceCenter;