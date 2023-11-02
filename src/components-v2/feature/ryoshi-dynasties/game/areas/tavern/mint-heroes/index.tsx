import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useState} from "react";
import RdModal from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/tavern/mint-heroes/faq-page";
import {Box, Center, Text} from "@chakra-ui/react";

interface MintHeroesProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintHeroes = ({isOpen, onClose}: MintHeroesProps) => {
  const [page, setPage] = useState<string>();

  const handleClose = () => {
    onClose();
  }

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Mint Heroes'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <Center p={4}>
          <Text align='center'>
            Heroes Coming Soon!
          </Text>
        </Center>
      )}
    </RdModal>
  )
}


export default MintHeroes;