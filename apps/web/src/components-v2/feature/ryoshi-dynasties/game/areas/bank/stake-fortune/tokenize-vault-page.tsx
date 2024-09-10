import {Box, Stack, Text} from "@chakra-ui/react"
import React, {useContext, useState} from "react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {Contract} from "ethers";
import {appConfig} from "@src/config";
import {toast} from "react-toastify";
import Bank from "@src/global/contracts/Bank.json";
import {createSuccessfulTransactionToastContent} from '@market/helpers/utils';
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import Link from "next/link";
import {useUser} from "@src/components-v2/useUser";
import {useWriteContract} from "wagmi";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useBankContract} from "@src/global/hooks/contracts";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";

const steps = {
  form: 'form',
  complete: 'complete'
};

interface TokenizeVaultProps {
  vault: FortuneStakingAccount;
  onReturn: () => void;
}

const TokenizeVaultPage = ({ vault, onReturn }: TokenizeVaultProps) => {
  const { refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [currentStep, setCurrentStep] = useState(steps.form);

  const handleComplete = () => {
    setCurrentStep(steps.complete);
    refreshUser();
  }

  return (
    <Box mx={1} pb={6} px={2}>
      <Text textAlign='center' fontSize={14} py={2}>Turn your vault into an NFT to be transferred or sold on the marketplace. All Bank benefits will be paused until imported back into a vault in the Bank. This includes APR, Mitama, and Troops. A 5% burn fee on the vault's balance will be applied.</Text>
      <AuthenticationRdButton requireSignin={false}>
        <Box p={4}>
          {currentStep === steps.form && (
            <TokenizeForm vault={vault} onComplete={handleComplete}/>
          )}
          {currentStep === steps.complete && (
            <TokenizeComplete onReturn={onReturn} />
          )}
        </Box>
      </AuthenticationRdButton>
    </Box>
  )
}

interface TokenizeFormProps {
  vault: FortuneStakingAccount;
  onComplete: () => void;
}
const TokenizeForm = ({vault, onComplete}: TokenizeFormProps) => {
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const [isExecuting, setIsExecuting] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const user = useUser();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice()
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();

  const handleTokenize = async () => {
    try {
      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      setIsExecuting(true);
      // const txHash = await writeContractAsync({
      //   address: chainConfig.contracts.bank,
      //   abi: Bank,
      //   functionName: 'boxAccount',
      //   args: [vault.index],
      // });
      // toast.success(createSuccessfulTransactionToastContent(txHash, bankChainId));

      // const txHash = await bankContract.write.boxAccount(
      //   [vault.index],
      //   {
      //     account: user.address!,
      //     chain: chainConfig.chain
      //   }
      // );
      // toast.success(createSuccessfulTransactionToastContent(txHash, bankChainId));

      const tx = await callWithGasPrice(bankContract, 'boxAccount', [vault.index]);
      toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));

      // const bank = new Contract(chainConfig.contracts.bank, Bank, user.provider.getSigner());
      // const tx = await bank.boxAccount(vault.index);
      // const receipt = await tx.wait();
      // toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash, bankChainId));
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
      <Text px={2} textAlign='center' fontSize={14} py={2}>Once converted, your NFT will be available in your inventory.</Text>
      <Box ps='20px' textAlign='center' mt={4}>
        <RdButton
          fontSize={{base: 'xl', sm: '2xl'}}
          stickyIcon={true}
          isLoading={isExecuting}
          isDisabled={isExecuting}
          onClick={handleTokenize}
        >
          Convert
        </RdButton>
      </Box>
    </Box>
  )
}

const TokenizeComplete = ({onReturn}: {onReturn: () => void}) => {
  const user = useUser();

  return (
    <Box py={4}>
      <Box textAlign='center'>
        Conversion complete! You can now view your Vault NFT in your inventory.
      </Box>
      <Box textAlign='center' mt={8} mx={2}>
        <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
          <Link href={`/account/${user.address}`}>
            <RdButton size={{base: 'md', md: 'lg'}} w={{base: 'full', sm: 'auto'}}>
              View Inventory
            </RdButton>
          </Link>
          <RdButton size={{base: 'md', md: 'lg'}} onClick={onReturn} w={{base: 'full', sm: 'auto'}}>
            Back To Vaults
          </RdButton>
        </Stack>
      </Box>
    </Box>
  )
}

export default TokenizeVaultPage;