import { ChangeEvent, useEffect, useState } from 'react';
import { constants, Contract, ethers } from 'ethers';
import { Box, GridItem, HStack, Input, Select, SimpleGrid, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { appConfig } from '@src/Config';
import { ERC20 } from '@src/global/contracts/Abis';
import { JsonRpcProvider } from '@ethersproject/providers';
import { parseErrorMessage } from '@src/helpers/validator';
import { useUser } from '@src/components-v2/useUser';
import { useQuery } from '@tanstack/react-query';
import { PrimaryButton, SecondaryButton } from '@src/components-v2/foundation/button';

const readProvider = new JsonRpcProvider(appConfig().rpc.read);
const LiberatorAbi = [{"inputs":[{"internalType":"address","name":"_wcro","type":"address"},{"internalType":"address","name":"_usdc","type":"address"},{"internalType":"address","name":"_frtn","type":"address"},{"internalType":"address","name":"_vvsRouter","type":"address"},{"internalType":"address","name":"_mmfRouter","type":"address"},{"internalType":"address","name":"_ryoshiRouter","type":"address"},{"internalType":"address","name":"_vvsLp","type":"address"},{"internalType":"address","name":"_mmfLp","type":"address"},{"internalType":"address","name":"_ryoshiLP","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Liberation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLP","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountFRTN","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"from","type":"address"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"rewardsFor","outputs":[{"internalType":"uint256","name":"userReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"croDeposited","type":"uint256"},{"internalType":"uint256","name":"usdcDeposited","type":"uint256"},{"internalType":"uint256","name":"lpDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const MMF_LP = '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623';
const VVS_LP = '0xe61Db569E231B3f5530168Aa2C9D50246525b6d6';
const LIBERATOR_ADDRESS = '0x589A5228A279C72065C8eFF008Fe474302d41d4f';

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
  const [isExecutingApproval, setIsExecutingApproval] = useState(false);
  const [amount, setAmount] = useState('');
  const [lpAddress, setLpAddress] = useState(MMF_LP);
  const [contract, setContract] = useState<Contract>();
  const [liberatorAddress, setLiberatorAddress] = useState<string>(LIBERATOR_ADDRESS);

  const {data, error} = useQuery({
    queryKey: ['Liberator', user.address, contract?.address],
    queryFn: async () => {
      const totalRewards = await contract!.totalRewards();
      const userRewards = await contract!.rewardsFor(user.address);

      const mmfContract = new Contract(MMF_LP, ERC20, readProvider);
      const mmfBalance = await mmfContract.balanceOf(user.address);

      const vvsContract = new Contract(VVS_LP, ERC20, readProvider);
      const vvsBalance = await vvsContract.balanceOf(user.address);

      const mmfAllowance = await mmfContract.allowance(user.address, LIBERATOR_ADDRESS);
      const vvsAllowance = await vvsContract.allowance(user.address, LIBERATOR_ADDRESS);

      return {
        totalRewards: ethers.utils.formatEther(totalRewards),
        userRewards: ethers.utils.formatEther(userRewards),
        mmfBalance: ethers.utils.formatEther(mmfBalance),
        mmfAllowance: mmfAllowance,
        mmfApproved: mmfAllowance > 0,
        vvsBalance: ethers.utils.formatEther(vvsBalance),
        vvsAllowance: vvsAllowance,
        vvsApproved: vvsAllowance > 0,
      };
    },
    enabled: !!contract?.address && !!user.address
  });

  console.log('Read Data:', data);

  const handleChangeLpAddress = (e: ChangeEvent<HTMLSelectElement>) => {
    setLpAddress(e.target.value);
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }

  const handleChangeLiberator = (e: ChangeEvent<HTMLInputElement>) => {
    setLiberatorAddress(e.target.value);
  }

  const handleSelectAmount = (amount: string, address: string) => {
    setLpAddress(address);
    setAmount(amount);
  }

  const handleApproval = async (address: string) => {
    try {
      setIsExecutingApproval(true);
      const contract = new Contract(address, ERC20, user.provider.signer);
      const approvalTx = await contract.approve(LIBERATOR_ADDRESS, constants.MaxUint256);
      await approvalTx.wait();
    } catch (e: any) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecutingApproval(false);
    }
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

    if (!amount) {
      toast.error('Enter an amount');
      return;
    }

    try {
      setIsExecuting(true);
      console.log('executing...');
      console.log('CA:', contract.address);
      console.log('Amount:', ethers.utils.parseEther(amount).toString());
      console.log('LP:', lpAddress);
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
        liberatorAddress,
        LiberatorAbi,
        user.provider.signer
      ));
    }
  }, [user.provider.signer, liberatorAddress]);

  return (
    <SimpleGrid columns={2} gap={2}>
      {!!data && (
        <>
          <Box>Total Rewards</Box>
          <Box textAlign='end'>{data.totalRewards}</Box>
          <Box>User Rewards</Box>
          <Box textAlign='end'>{data.userRewards}</Box>

          <GridItem colSpan={2}><hr /></GridItem>

          <Box>VVS Balance</Box>
          <Box textAlign='end' cursor='pointer' onClick={() => handleSelectAmount(data.vvsBalance, VVS_LP)}>{data.vvsBalance}</Box>
          <Box>VVS Allowance</Box>
          <Box textAlign='end'>{data.vvsAllowance.toString()}</Box>
          <Box>VVS Approved</Box>
          <Box textAlign='end'>{data.vvsApproved ? 'Yes' : 'No'}</Box>

          <Box>MMF Balance</Box>
          <Box textAlign='end' cursor='pointer' onClick={() => handleSelectAmount(data.mmfBalance, MMF_LP)}>{data.mmfBalance}</Box>
          <Box>MMF Allowance</Box>
          <Box textAlign='end'>{data.mmfAllowance.toString()}</Box>
          <Box>MMF Approved</Box>
          <Box textAlign='end'>{data.mmfApproved ? 'Yes' : 'No'}</Box>

          <GridItem colSpan={2}><hr /></GridItem>
        </>
      )}
      <Box my='auto'>Liberator CA:</Box>
      <Input
        placeholder='Contract Address'
        value={liberatorAddress}
        onChange={handleChangeLiberator}
        w={{base: 'auto', lg: '430px'}}
      />
      <Box my='auto'>LP Amount:</Box>
      <Input
        placeholder='Enter amount'
        value={amount}
        onChange={handleChangeAmount}
      />
      <Box my='auto'>DEX:</Box>
      <Select onChange={handleChangeLpAddress} value={lpAddress}>
        <option value={VVS_LP}>VVS</option>
        <option value={MMF_LP}>MMF</option>
      </Select>
      <GridItem colSpan={2}>
        <HStack>
          {!!data && (
            <>
              <PrimaryButton
                isLoading={isExecuting}
                isDisabled={isExecuting}
                onClick={handleGenerateCallData}
                loadingText='Migrating...'
              >
                Migrate
              </PrimaryButton>

              {data?.vvsApproved ? (
                <SecondaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval(VVS_LP)}
                  loadingText='Approving VVS...'
                >
                  Approve More VVS
                </SecondaryButton>
              ) : (
                <PrimaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval(VVS_LP)}
                  loadingText='Approving VVS...'
                >
                  Approve VVS
                </PrimaryButton>
              )}
              {data?.mmfApproved ? (
                <SecondaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval(MMF_LP)}
                  loadingText='Approving MMF...'
                >
                  Approve More MMF
                </SecondaryButton>
              ) : (
                <PrimaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval(MMF_LP)}
                  loadingText='Approving MMF...'
                >
                  Approve MMF
                </PrimaryButton>
              )}
            </>
          )}
        </HStack>
      </GridItem>
    </SimpleGrid>
  )
}