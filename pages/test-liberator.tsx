import { ChangeEvent, useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { Box, Input, Select, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { appConfig } from '@src/Config';
import { ERC20 } from '@src/global/contracts/Abis';
import { JsonRpcProvider } from '@ethersproject/providers';
import { parseErrorMessage } from '@src/helpers/validator';
import { useUser } from '@src/components-v2/useUser';
import { useQuery } from '@tanstack/react-query';
import { PrimaryButton } from '@src/components-v2/foundation/button';

const readProvider = new JsonRpcProvider(appConfig().rpc.read);
const LiberatorAbi = [{"inputs":[{"internalType":"address","name":"_wcro","type":"address"},{"internalType":"address","name":"_usdc","type":"address"},{"internalType":"address","name":"_frtn","type":"address"},{"internalType":"address","name":"_vvsRouter","type":"address"},{"internalType":"address","name":"_mmfRouter","type":"address"},{"internalType":"address","name":"_ryoshiRouter","type":"address"},{"internalType":"address","name":"_vvsLp","type":"address"},{"internalType":"address","name":"_mmfLp","type":"address"},{"internalType":"address","name":"_ryoshiLP","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Liberation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLP","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountFRTN","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"from","type":"address"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"rewardsFor","outputs":[{"internalType":"uint256","name":"userReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"croDeposited","type":"uint256"},{"internalType":"uint256","name":"usdcDeposited","type":"uint256"},{"internalType":"uint256","name":"lpDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const MMF_LP = '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623';
const VVS_LP = '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623';
const LIBERATOR_ADDRESS = '0x9C3F1168004f42a2616053035D20c80f8d362Eda';

function Test() {
  return (
    <Box m={4}>
      <VStack align='start'>
        <Liberator />
      </VStack>
    </Box>
  )
}

export default Test;

const Liberator = () => {
  const user = useUser();
  const [isExecuting, setIsExecuting] = useState(false);
  const [amount, setAmount] = useState('');
  const [lpAddress, setLpAddress] = useState(MMF_LP);
  const [contract, setContract] = useState<Contract>();

  const {data, error} = useQuery({
    queryKey: ['Liberator', user.address, contract?.address],
    queryFn: async () => {
      const rewards = await contract!.rewardsFor(user.address);

      const mmfContract = new Contract(MMF_LP, ERC20, readProvider);
      const mmfBalance = await mmfContract.balanceOf(user.address);

      const vvsContract = new Contract(VVS_LP, ERC20, readProvider);
      const vvsBalance = await vvsContract.balanceOf(user.address);

      return {
        rewards: ethers.utils.formatEther(rewards),
        mmfBalance: ethers.utils.formatEther(mmfBalance),
        vvsBalance: ethers.utils.formatEther(vvsBalance)
      };
    },
    enabled: !!contract && !!user.address
  });
  console.log('asd', data, error);

  const handleChangeLpAddress = (e: ChangeEvent<HTMLSelectElement>) => {
    setLpAddress(e.target.value);
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }

  const handleGenerateCallData = async () => {
    if (!user.address) {
      toast.error('Please connect your wallet to continue');
      return;
    }

    if (!contract) {
      toast.error('Contract not set');
      return;
    }

    try {
      setIsExecuting(true);
      console.log('executing...', contract.address, ethers.utils.parseEther(amount).toString(), lpAddress);
      const tx = await contract.migrate(ethers.utils.parseEther(amount), lpAddress);
      await tx.wait();
      toast.success('Transaction successful');
    } catch (e: any) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
    }
  }

  useEffect(() => {
    if (user.provider.signer) {
      setContract(new Contract(
        LIBERATOR_ADDRESS,
        LiberatorAbi,
        user.provider.signer
      ));
    }
  }, [user.provider.signer]);

  return (
    <Box>
      {!!data && (
        <>
          <Box>Rewards: {data.rewards}</Box>
          <Box>MMF Balance: {data.mmfBalance}</Box>
          <Box>VVS Balance: {data.vvsBalance}</Box>
        </>
      )}
      <Input
        mt={4}
        placeholder='Enter amount'
        value={amount}
        onChange={handleChangeAmount}
      />
      <Select onChange={handleChangeLpAddress}>
        <option value={MMF_LP}>MMF</option>
        <option value={VVS_LP}>VVS</option>
      </Select>
      <PrimaryButton
        mt={4}
        isLoading={isExecuting}
        isDisabled={isExecuting}
        onClick={handleGenerateCallData}
        loadingText='Generating...'
      >
        Migrate
      </PrimaryButton>
    </Box>
  )
}