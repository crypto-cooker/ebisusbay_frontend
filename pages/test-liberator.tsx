import { ChangeEvent, useEffect, useState } from 'react';
import { constants, Contract, ethers } from 'ethers';
import { Box, GridItem, HStack, Input, Select, SimpleGrid, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { appConfig } from '@src/Config';
import { ERC20 } from '@src/global/contracts/Abis';
import { JsonRpcProvider } from '@ethersproject/providers';
import { parseErrorMessage } from '@src/helpers/validator';
import { useUser } from '@src/components-v2/useUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PrimaryButton, SecondaryButton } from '@src/components-v2/foundation/button';
import { multicall } from '@wagmi/core';
import { Address, erc20ABI } from 'wagmi';

const readProvider = new JsonRpcProvider(appConfig().rpc.read);
const LiberatorAbi = [{"inputs":[{"internalType":"address","name":"_wcro","type":"address"},{"internalType":"address","name":"_usdc","type":"address"},{"internalType":"address","name":"_frtn","type":"address"},{"internalType":"address","name":"_vvsRouter","type":"address"},{"internalType":"address","name":"_mmfRouter","type":"address"},{"internalType":"address","name":"_ryoshiRouter","type":"address"},{"internalType":"address","name":"_vvsLp","type":"address"},{"internalType":"address","name":"_mmfLp","type":"address"},{"internalType":"address","name":"_ryoshiLP","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Liberation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLP","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountFRTN","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"from","type":"address"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"rewardsFor","outputs":[{"internalType":"uint256","name":"userReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"croDeposited","type":"uint256"},{"internalType":"uint256","name":"usdcDeposited","type":"uint256"},{"internalType":"uint256","name":"lpDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const MMF_LP = '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623';
const VVS_LP = '0xe61Db569E231B3f5530168Aa2C9D50246525b6d6';
const LIBERATOR_ADDRESS = '0x52f1663D8BbcC259470923d0d3B4d1EC0c89C912';

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
  const [lpAddress, setLpAddress] = useState(VVS_LP);
  const [contract, setContract] = useState<Contract>();
  const [liberatorAddress, setLiberatorAddress] = useState<string>(LIBERATOR_ADDRESS);
  const queryClient = useQueryClient();

  const {data, error, refetch} = useQuery({
    queryKey: ['Liberator', user.address, contract?.address],
    queryFn: async () => {
      const data = await multicall({
        contracts: [
          {
            address: LIBERATOR_ADDRESS as Address,
            abi: LiberatorAbi as any,
            functionName: 'totalRewards',
            args: [],
          },
          {
            address: LIBERATOR_ADDRESS as Address,
            abi: LiberatorAbi as any,
            functionName: 'rewardsFor',
            args: [user.address],
          },
          {
            address: MMF_LP as Address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [user.address as Address],
          },
          {
            address: MMF_LP as Address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [user.address as Address, LIBERATOR_ADDRESS],
          },
          {
            address: VVS_LP as Address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [user.address as Address],
          },
          {
            address: VVS_LP as Address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [user.address as Address, LIBERATOR_ADDRESS],
          },
        ],
      });

      console.log('DATA', data);
      return {
        totalRewards: data[0].status === 'success' ? ethers.utils.formatEther(data[0].result) : '0',
        userRewards: data[1].status === 'success' ? ethers.utils.formatEther(data[1].result) : '0',
        mmfBalance: data[2].status === 'success' ? ethers.utils.formatEther(data[2].result) : '0',
        mmfAllowance: data[3].status === 'success' ? data[3].result : 0,
        mmfApproved: data[3].status === 'success' ? data[3].result > 0 : false,
        vvsBalance: data[4].status === 'success' ? ethers.utils.formatEther(data[4].result) : '0',
        vvsAllowance: data[5].status === 'success' ? data[5].result : 0,
        vvsApproved: data[5].status === 'success' ? data[5].result > 0 : false,
      };
    },
    enabled: !!contract?.address && !!user.address
  });

  console.log('Read Data:', data, error);

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

  const approveOperator = async (address: string) => {
    setIsExecutingApproval(true);
    const contract = new Contract(address, ERC20, user.provider.signer);
    const approvalTx = await contract.approve(LIBERATOR_ADDRESS, constants.MaxUint256);
    await approvalTx.wait();
    return address;
  }

  const handleApproval = useMutation({
    mutationFn: approveOperator,
    onSuccess: address => {
      let fields = {};
      if (address === MMF_LP) {
        fields = {
          mmfApproved: true,
          mmfAllowance: constants.MaxUint256
        };
      } else if (address === VVS_LP) {
        fields = {
          vvsApproved: true,
          vvsAllowance: constants.MaxUint256
        };
      } else {
        return;
      }
      queryClient.setQueryData(['Liberator', user.address, contract?.address], (old: any) => ({
        ...old,
        fields,
      }));
    },
    onError: error => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
    onSettled: () => {
      setIsExecutingApproval(false);
    }
  });

  const handleMigration = async () => {
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

    if (!lpAddress) {
      toast.error('Select a DEX');
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
      refetch();
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
      <Select onChange={handleChangeLpAddress} value={lpAddress} placeholder='--- Choose a DEX ---'>
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
                onClick={handleMigration}
                loadingText='Migrating...'
              >
                Migrate
              </PrimaryButton>

              {data?.vvsApproved ? (
                <SecondaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval.mutate(VVS_LP)}
                  loadingText='Approving VVS...'
                >
                  Approve More VVS
                </SecondaryButton>
              ) : (
                <PrimaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval.mutate(VVS_LP)}
                  loadingText='Approving VVS...'
                >
                  Approve VVS
                </PrimaryButton>
              )}
              {data?.mmfApproved ? (
                <SecondaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval.mutate(MMF_LP)}
                  loadingText='Approving MMF...'
                >
                  Approve More MMF
                </SecondaryButton>
              ) : (
                <PrimaryButton
                  isLoading={isExecutingApproval}
                  isDisabled={isExecutingApproval || isExecuting}
                  onClick={() => handleApproval.mutate(MMF_LP)}
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