import {Box, Flex, Image, Text, VStack} from "@chakra-ui/react"
import React, {useCallback, useState} from "react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import PresaleVaultTab from "./presale";
import FortuneRewardsTab from "./fortune";
import {ArrowBackIcon} from "@chakra-ui/icons";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/rewards/faq-page";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";
import ResourcesTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/rewards/resources";

const tabs = {
  fortune: 'fortune',
  resources: 'resources',
  presale: 'presale'
};

interface WithdrawProps {
  isOpen: boolean;
  onClose: () => void;
}

const Rewards = ({ isOpen, onClose}: WithdrawProps) => {
  const user = useUser();
  const [currentTab, setCurrentTab] = useState(tabs.fortune);
  const [page, setPage] = useState<string>();

  const handleConnect = async () => {
    user.connect();
  }

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleClose = useCallback(() => {
    setCurrentTab(tabs.fortune);
    onClose();
  }, []);

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
      title='Rewards'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <>
          <Text textAlign='center' fontSize={14} py={2}>Withdraw accumulated Fortune rewards or your Fortune stake</Text>
          {user.address ? (
            <Box p={4}>
              <Flex direction='row' justify='center' mb={2}>
                <RdTabButton isActive={currentTab === tabs.fortune} onClick={handleBtnClick(tabs.fortune)}>
                  Fortune
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.resources} onClick={handleBtnClick(tabs.resources)}>
                  Resources
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.presale} onClick={handleBtnClick(tabs.presale)}>
                  Presale
                </RdTabButton>
              </Flex>
              <Box>
                {currentTab === tabs.fortune && (
                  <FortuneRewardsTab />
                  // <RdModalBox>
                  //   <VStack>
                  //     <Image
                  //       src={ImageService.translate('/img/ryoshi-dynasties/icons/lock.png').convert()}
                  //       alt="lockIcon"
                  //       boxSize={12}
                  //     />
                  //     <Text>Coming Soon</Text>
                  //   </VStack>
                  // </RdModalBox>
                )}
                {currentTab === tabs.resources && (
                  <ResourcesTab />
                )}
                {currentTab === tabs.presale && (
                  <PresaleVaultTab />
                )}
              </Box>
            </Box>
          ) : (
            <Box textAlign='center' pb={4} mx={2}>
              <Box ps='20px'>
                <RdButton
                  w='250px'
                  fontSize={{base: 'xl', sm: '2xl'}}
                  stickyIcon={true}
                  onClick={handleConnect}
                >
                  Connect
                </RdButton>
              </Box>
            </Box>
          )}
        </>
      )}
    </RdModal>
  )
}

export default Rewards;