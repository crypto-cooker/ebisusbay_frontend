import {Box, Flex, Text} from "@chakra-ui/react"
import React, {useCallback, useState} from "react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import PresaleVaultTab from "./presale";
import ResourcesTab from "./resources";
import FortuneRewardsTab from "./fortune";

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
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState(tabs.fortune);

  const handleConnect = async () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleClose = useCallback(() => {
    setCurrentTab(tabs.fortune);
    onClose();
  }, []);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Rewards'
      isCentered={false}
    >
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
    </RdModal>
  )
}

export default Rewards;