import {Box, Center, Flex, Text, VStack} from "@chakra-ui/react"
import React, {useContext, useState} from "react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

//contracts
import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import {createSuccessfulTransactionToastContent} from '@src/utils';
import moment from 'moment';
import {commify} from "ethers/lib/utils";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

const steps = {
  form: 'form',
  complete: 'complete'
};

interface WithdrawProps {
  vault: FortuneStakingAccount;
  onReturn: () => void;
}

const WithdrawVaultPage = ({ vault, onReturn }: WithdrawProps) => {
  const { refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(steps.form);

  const handleConnect = async () => {
    user.connect();
  }

  const handleComplete = () => {
    setCurrentStep(steps.complete);
    refreshUser();
  }

  return (
    <Box mx={1} pb={6}>
      <Text textAlign='center' fontSize={14} py={2}>Withdraw accumulated Fortune rewards or your Fortune stake</Text>
      {user.address ? (
        <Box p={4}>
          {currentStep === steps.form && (
            <WithdrawForm vault={vault} onComplete={handleComplete}/>
          )}
          {currentStep === steps.complete && (
            <WithdrawComplete onReturn={onReturn} />
          )}
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
    </Box>
  )
}

interface WithdrawFormProps {
  vault: FortuneStakingAccount;
  onComplete: () => void;
}
const WithdrawForm = ({vault, onComplete}: WithdrawFormProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useUser();

  const [amountDeposited, setAmountDeposited] = useState(0);
  const [withdrawDate, setWithdrawDate] = useState<string>();
  const [executingLabel, setExecutingLabel] = useState('Staking...');


  const handleEmergencyWithdraw = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Withdrawing...');
      const bank = new Contract(config.contracts.bank, Bank, user.provider.getSigner());
      const tx = await bank.emergencyClose(vault.index);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      onComplete();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <Box>
      <Box bgColor='#292626' rounded='md' p={4}>
        <Box mb={6}>
          <Box textAlign='center' fontSize={14} mb={4}>
            <Text as='span'>Your current staking term will end{' '}</Text>
            <Text as='span' fontWeight='bold'>{moment(vault.endTime * 1000).format("D MMM yyyy")}</Text>
          </Box>
          <Text textAlign='center' fontSize={14}>
            Emergency withdrawal allows staked Fortune tokens to be withdrawn without waiting for the staking term to end.
            However, this will only return 50% of the staked tokens and will burn the rest.
          </Text>
        </Box>
        <Flex direction='row' justify='space-around'>
          <VStack spacing={0}>
            <Text fontSize='sm'>Total Staked</Text>
            <Text fontSize='2xl' fontWeight='bold'>{commify(Number(ethers.utils.formatEther(vault.balance)))}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize='sm'>Amount To Receive</Text>
            <Text fontSize='2xl' fontWeight='bold'>{commify(Number(ethers.utils.formatEther(vault.balance))/2)}</Text>
          </VStack>
        </Flex>
      </Box>

      <Box textAlign='center' mt={8} mx={2}>
        <Box ps='20px'>
          <RdButton
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={handleEmergencyWithdraw}
            isLoading={isExecuting}
            disabled={isExecuting}
            loadingText={executingLabel}
          >
            Withdraw
          </RdButton>
        </Box>
      </Box>
    </Box>
  )
}

const WithdrawComplete = ({onReturn}: {onReturn: () => void}) => {
  return (
    <Box py={4}>
      <Center>
        Withdraw complete!
      </Center>
      <Box textAlign='center' mt={8} mx={2}>
        <Box ps='20px'>
          <RdButton
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={onReturn}
          >
            Back To Vaults
          </RdButton>
        </Box>
      </Box>
    </Box>
  )
}

export default WithdrawVaultPage;