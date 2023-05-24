import {Box, Center, Flex, Spinner, Text, VStack} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

//contracts
import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import {createSuccessfulTransactionToastContent} from '@src/utils';
import moment from 'moment';
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {commify} from "ethers/lib/utils";
import {useQuery} from "@tanstack/react-query";

const config = appConfig();

const tabs = {
  emergency: 'emergency',
  rewards: 'rewards'
};

interface WithdrawProps {
  isOpen: boolean;
  onClose: () => void;
}

const Withdraw = ({ isOpen, onClose}: WithdrawProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState(tabs.rewards);

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

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Withdraw'
    >
      <Text textAlign='center' fontSize={14} py={2}>Withdraw accumulated Fortune rewards or your Fortune stake</Text>
      {user.address ? (
        <Box p={4}>
          <Flex direction='row' justify='center' mb={2}>
            <RdTabButton isActive={currentTab === tabs.rewards} onClick={handleBtnClick(tabs.rewards)}>
              Rewards
            </RdTabButton>
            <RdTabButton isActive={currentTab === tabs.emergency} onClick={handleBtnClick(tabs.emergency)}>
              Emergency
            </RdTabButton>
          </Flex>
          <Box>
            {currentTab === tabs.rewards && (
              <WithdrawRewardsTab />
            )}
            {currentTab === tabs.emergency && (
              <EmergencyWithdrawTab />
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

const WithdrawRewardsTab = () => {
  return (
    <Box>
      withdraw here
    </Box>
  )
}

const EmergencyWithdrawTab = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useAppSelector((state) => state.user);

  const [hasDeposited, setHasDeposited] = useState(false);
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [depositLength, setDepositLength] = useState(0);
  const [withdrawDate, setWithdrawDate] = useState<string>();
  const [executingLabel, setExecutingLabel] = useState('Staking...');

  const checkForDeposits = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const bank = new Contract(config.contracts.bank, Bank, readProvider);
    return await bank.deposits(user.address?.toLowerCase());
  }

  const { error, data: deposits, status, refetch } = useQuery(
    ['BankDeposits', user.address],
    checkForDeposits,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false
    }
  );

  const handleEmergencyWithdraw = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Withdrawing...');
      const bank = new Contract(config.contracts.bank, Bank, user.provider.getSigner());
      const tx = await bank.emergencyClose();
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      await refetch();
    } catch (error: any) {
      console.log(error)
      if(error.response !== undefined) {
        console.log(error)
        toast.error(error.response.data.error.metadata.message)
      }
      else {
        toast.error(error);
      }
    } finally {
      setIsExecuting(false);
    }
  }

  useEffect(() => {
    if (!deposits) return;

    if(deposits[0].gt(0)){
      setHasDeposited(true);
      const daysToAdd = Number(deposits[1].div(86400));
      const newDate = new Date(Number(deposits[2].mul(1000)));
      const newerDate = newDate.setDate(newDate.getDate() + daysToAdd);

      setAmountDeposited(Number(ethers.utils.formatEther(deposits[0])));
      setDepositLength(daysToAdd);
      setWithdrawDate(moment(newerDate).format("MMM D yyyy"));
    } else {
      setHasDeposited(false);
    }
  }, [amountDeposited]);

  return (
    <Box py={4}>
      {status === "loading" ? (
        <Center>
          <Spinner />
        </Center>
      ) : status === "error" ? (
        <Center>
          <Text>Error: {(error as any).message}</Text>
        </Center>
      ) : (
        <>
          <Box bgColor='#292626' rounded='md' p={4}>
            <Box mb={6}>
              {hasDeposited && (
                <Box textAlign='center' fontSize={14} mb={4}>
                  <Text as='span'>Your current staking term will end{' '}</Text>
                  <Text as='span' fontWeight='bold'>{withdrawDate}</Text>
                </Box>
              )}
              <Text textAlign='center' fontSize={14}>
                Emergency withdrawal allows staked Fortune tokens to be withdrawn without waiting for the staking term to end.
                However, this will only return 50% of the staked tokens and will burn the rest.
              </Text>
            </Box>
            {hasDeposited ? (
              <Flex direction='row' justify='space-around'>
                <VStack spacing={0}>
                  <Text fontSize='sm'>Total Staked</Text>
                  <Text fontSize='2xl' fontWeight='bold'>{commify(amountDeposited)}</Text>
                </VStack>
                <VStack spacing={0}>
                  <Text fontSize='sm'>Amount To Receive</Text>
                  <Text fontSize='2xl' fontWeight='bold'>{commify(amountDeposited/2)}</Text>
                </VStack>
              </Flex>
            ) : (
              <Box>
                <Text textAlign='center' fontSize={14}>You have no deposits to withdraw at this time.</Text>
              </Box>
            )}
          </Box>

          {hasDeposited && (
            <Box textAlign='center' mt={8} mx={2}>
              <Box ps='20px'>
                <RdButton
                  fontSize={{base: 'xl', sm: '2xl'}}
                  stickyIcon={true}
                  onClick={handleEmergencyWithdraw}
                  isLoading={isExecuting}
                  disabled={isExecuting}
                >
                  {isExecuting ? executingLabel : 'Withdraw'}
                </RdButton>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default Withdraw;