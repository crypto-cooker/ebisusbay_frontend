import React, { ChangeEvent, useEffect, useState } from 'react';
import { constants, Contract, ethers } from 'ethers';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  VStack
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { ERC20 } from '@src/global/contracts/Abis';
import { parseErrorMessage } from '@src/helpers/validator';
import { useUser } from '@src/components-v2/useUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import { multicall } from '@wagmi/core';
import { Address, erc20ABI } from 'wagmi';
import { StandardContainer } from '@src/components-v2/shared/containers';
import { Card } from '@src/components-v2/foundation/card';
import FortuneIcon from '@src/components-v2/shared/icons/fortune';
import ImageService from '@src/core/services/image';
import PageHead from '@src/components-v2/shared/layout/page-head';
import { getTheme } from '@src/global/theme/theme';
import Countdown from 'react-countdown';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

const LiberatorAbi = [{"inputs":[{"internalType":"address","name":"_wcro","type":"address"},{"internalType":"address","name":"_usdc","type":"address"},{"internalType":"address","name":"_frtn","type":"address"},{"internalType":"address","name":"_vvsRouter","type":"address"},{"internalType":"address","name":"_mmfRouter","type":"address"},{"internalType":"address","name":"_ryoshiRouter","type":"address"},{"internalType":"address","name":"_vvsLp","type":"address"},{"internalType":"address","name":"_mmfLp","type":"address"},{"internalType":"address","name":"_ryoshiLP","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Liberation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLP","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountFRTN","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"from","type":"address"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mmfRouter","outputs":[{"internalType":"contract IRyoshiRouter01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"rewardsFor","outputs":[{"internalType":"uint256","name":"userReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ryoshiRouter","outputs":[{"internalType":"contract IRyoshiRouter01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdc","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"croDeposited","type":"uint256"},{"internalType":"uint256","name":"usdcDeposited","type":"uint256"},{"internalType":"uint256","name":"lpDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vvsRouter","outputs":[{"internalType":"contract IRyoshiRouter01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wcro","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const LIBERATOR_ADDRESS = '0x52f1663D8BbcC259470923d0d3B4d1EC0c89C912';

enum LiberatedDexKey {
  VVS = 'vvs',
  MMF = 'mmf',
}

interface LiberatedDex {
  name: string;
  address: string;
  logo: string;
  lp: string;
}

const MappedLiberatedDexes: {[key in LiberatedDexKey]: LiberatedDex} = {
  [LiberatedDexKey.VVS]: {
    name: 'VVS',
    address: '0xe61Db569E231B3f5530168Aa2C9D50246525b6d6',
    logo: ImageService.translate('/img/icons/tokens/vvs.webp').convert(),
    lp: 'WCRO/USDC'
  },
  [LiberatedDexKey.MMF]: {
    name: 'MMF',
    address: '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623',
    logo: ImageService.translate('/img/icons/tokens/mad.webp').convert(),
    lp: 'WCRO/USDC'
  }
}

export default function Page() {
  const user = useUser();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecutingApproval, setIsExecutingApproval] = useState(false);
  const [amount, setAmount] = useState('');
  const [dexKey, setDexKey] = useState<LiberatedDexKey>(LiberatedDexKey.VVS);
  const [contract, setContract] = useState<Contract>();
  const [liberatorAddress, setLiberatorAddress] = useState<string>(LIBERATOR_ADDRESS);
  const queryClient = useQueryClient();
  const dex = MappedLiberatedDexes[dexKey];
  const [withdrawing, setWithdrawing] = useState(false);

  const {data: globalData} = useQuery({
    queryKey: ['LiberatorGlobal', contract?.address],
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
            functionName: 'endTime',
            args: [],
          },
        ],
      });

      console.log('help', data[1])
      return {
        totalRewards: data[0].status === 'success' ? ethers.utils.formatEther(data[0].result) : '0',
        endTime: data[1].status === 'success' ? Number(data[1].result) : 0
      };
    },
    enabled: !!contract?.address
  });

  const {data: userData, refetch} = useQuery({
    queryKey: ['LiberatorUser', user.address],
    queryFn: async () => {
      const data = await multicall({
        contracts: [
          {
            address: LIBERATOR_ADDRESS as Address,
            abi: LiberatorAbi as any,
            functionName: 'rewardsFor',
            args: [user.address],
          },
          {
            address: MappedLiberatedDexes.mmf.address as Address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [user.address as Address],
          },
          {
            address: MappedLiberatedDexes.mmf.address as Address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [user.address as Address, LIBERATOR_ADDRESS],
          },
          {
            address: MappedLiberatedDexes.vvs.address as Address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [user.address as Address],
          },
          {
            address: MappedLiberatedDexes.vvs.address as Address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [user.address as Address, LIBERATOR_ADDRESS],
          },
          {
            address: LIBERATOR_ADDRESS as Address,
            abi: LiberatorAbi as any,
            functionName: 'userInfo',
            args: [user.address as Address],
          },
        ],
      });

      return {
        userRewards: data[0].status === 'success' ? ethers.utils.formatEther(data[0].result) : '0',
        mmfBalance: data[1].status === 'success' ? ethers.utils.formatEther(data[1].result) : '0',
        mmfAllowance: data[2].status === 'success' ? data[2].result : 0,
        mmfApproved: data[2].status === 'success' ? data[2].result > 0 : false,
        vvsBalance: data[3].status === 'success' ? ethers.utils.formatEther(data[3].result) : '0',
        vvsAllowance: data[4].status === 'success' ? data[4].result : 0,
        vvsApproved: data[4].status === 'success' ? data[4].result > 0 : false,
        userInfo: data[5].status === 'success' ? data[5].result : {croDeposited: 0, usdcDeposited: 0, lpDebt: 0}
      };
    },
    enabled: !!user.address
  });

  console.log('Read Data:', globalData, userData);

  const handleChangeDex = (dex: LiberatedDexKey) => {
    setDexKey(dex);
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }

  const handleMaxLp = () => {
    if (dex.address === MappedLiberatedDexes.mmf.address) {
      setAmount(userData?.mmfBalance || '');
    } else if (dex.address === MappedLiberatedDexes.vvs.address) {
      setAmount(userData?.vvsBalance || '');
    }
  }

  const handleSelectAmount = (amount: string, dex: LiberatedDexKey) => {
    setDexKey(dex);
    setAmount(amount);
  }

  const handleApprovalSuccess = (dex: LiberatedDex) => {
    let fields = {};
    if (dex.address === MappedLiberatedDexes.mmf.address) {
      fields = {
        mmfApproved: true,
        mmfAllowance: constants.MaxUint256
      };
    } else if (dex.address === MappedLiberatedDexes.vvs.address) {
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
  }

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

    if (!dexKey) {
      toast.error('Select a DEX');
      return;
    }

    try {
      setIsExecuting(true);
      console.log('executing...');
      console.log('CA:', contract.address);
      console.log('Amount:', ethers.utils.parseEther(amount).toString());
      console.log('LP:', dexKey);
      const tx = await contract.migrate(ethers.utils.parseEther(amount), dexKey);
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

  const handleWithdrawRewards = async () => {
    try {
      setWithdrawing(true);
      const tx = await contract?.withdraw();
      await tx?.wait();
      toast.success('Rewards withdrawn');
      refetch();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setWithdrawing(false);
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

  const selectedMmf = dexKey === 'mmf';
  const selectedVvs = dexKey === 'vvs';
  const isInApprovedState = (selectedMmf && userData?.mmfApproved) || (selectedVvs && userData?.vvsApproved);

  const renderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    return completed ? (
      <PrimaryButton
        onClick={handleWithdrawRewards}
        isLoading={withdrawing}
        isDisabled={withdrawing}
        loadingText='Withdrawing...'
      >
        Withdraw
      </PrimaryButton>
    ) : <></>;
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
      timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-GB', options).replace('UTC', 'UTC');
  }

  return (
    <>
      <PageHead
        title="Liberate Your LP"
        description="Liberate your VVS and MMF tokens and move them to Ebisu's Bay DEX"
        url="/liberator"
        image={ImageService.translate('/img/promos/liberator.webp').convert()}
      />
      <StandardContainer>
        <Image src={ImageService.translate('/img/promos/liberator.webp').convert()} />
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={2} mt={2}>
          <Card flex={1}>
            <Box fontWeight='bold' fontSize='sm' mb={2}>Rewards Pool</Box>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 0, sm: 2 }}>
              {!!globalData && (
                <>
                  <Box>Total Rewards</Box>
                  <HStack justify={{ base: 'start', sm: 'end' }}>
                    <Box ms={{ base: 0, sm: 2 }} fontWeight='bold' fontSize='lg'>{globalData.totalRewards}</Box>
                    <FortuneIcon boxSize={6} />
                  </HStack>
                </>
              )}
              {!!userData && (
                <>
                  <HStack spacing={0}>
                    <>Your Rewards</>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton aria-label='User Rewards Info' icon={<QuestionOutlineIcon />} variant='unstyled'/>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <Box>Amount of FRTN earned from migrated LP tokens. Can be withdrawn after {globalData?.endTime ? formatTimestamp(globalData.endTime) : 'TBA' }</Box>
                          {!!globalData?.endTime && (
                            <Countdown
                              date={globalData.endTime * 1000}
                              renderer={renderer}
                            />
                          )}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </HStack>
                  <Box textAlign='end' my='auto'>
                    <HStack justify={{ base: 'start', sm: 'end' }}>
                      <Box ms={{ base: 0, sm: 2 }} fontWeight='bold' fontSize='lg'>{userData.userRewards}</Box>
                      <FortuneIcon boxSize={6} />
                    </HStack>
                    {!!globalData?.endTime && (
                      <Countdown
                        date={globalData.endTime * 1000}
                        renderer={renderer}
                      />
                    )}
                  </Box>
                </>
              )}
            </SimpleGrid>
          </Card>
          <Card flex={1}>
            <Box fontWeight='bold' fontSize='sm' mb={2}>Your LP Balances</Box>
            {!!userData ? (
              <SimpleGrid columns={2} gap={2}>
                <Box>VVS</Box>
                <Box
                  textAlign='end'
                  cursor='pointer'
                  onClick={() => handleSelectAmount(userData.vvsBalance, LiberatedDexKey.VVS)}
                  fontWeight='bold'
                >
                  {userData.vvsBalance}
                </Box>

                <Box>MMF</Box>
                <Box
                  textAlign='end'
                  cursor='pointer'
                  onClick={() => handleSelectAmount(userData.mmfBalance, LiberatedDexKey.MMF)}
                  fontWeight='bold'
                >
                  {userData.mmfBalance}
                </Box>
              </SimpleGrid>
            ) : !user.address && (
              <PrimaryButton onClick={() => user.connect()}>
                Connect wallet
              </PrimaryButton>
            )}
          </Card>
        </SimpleGrid>
        <Card mt={2}>
          {!!user.address ? (
            <>
              <VStack align='start'>
                <FormControl>
                  <FormLabel fontWeight='bold' fontSize='sm'>DEX:</FormLabel>
                  {Object.entries(MappedLiberatedDexes).map(([key, tab]) => (
                    <Button
                      key={tab.address}
                      isActive={dex.address === tab.address}
                      onClick={() => handleChangeDex(key as LiberatedDexKey)}
                      rounded='3px'
                      variant='tab'
                      color={dex.address === tab.address ? 'white' : getTheme(user.theme).colors.textColor3}
                      leftIcon={<Image src={tab.logo} w='30px'/>}
                    >
                      {tab.name}
                    </Button>
                  ))}
                </FormControl>
                {isInApprovedState && (
                  <FormControl>
                    <FormLabel fontWeight='bold' fontSize='sm'>LP Amount:</FormLabel>
                    <Stack direction='row'>
                      <Input
                        placeholder='Enter amount'
                        value={amount}
                        onChange={handleChangeAmount}
                      />
                      <Button onClick={handleMaxLp}>
                        Max
                      </Button>
                    </Stack>
                  </FormControl>
                )}
              </VStack>
              <Box mt={6}>
                {!!userData && (
                  <>
                    {isInApprovedState ? (
                      <Stack justify='space-between' align='center' direction={{base: 'column', sm: 'row'}}>
                        <Box>
                          <HStack justify='end'>
                            <Image src={dex.logo} w='30px'/>
                            <Box ms={2} fontWeight='bold' fontSize='lg'>
                              Migrating LP from {dex.name}
                            </Box>
                          </HStack>
                        </Box>
                        <PrimaryButton
                          isLoading={isExecuting}
                          isDisabled={isExecuting}
                          onClick={handleMigration}
                          loadingText='Migrating...'
                          w={{base: 'full', sm: 'auto'}}
                        >
                          Migrate
                        </PrimaryButton>
                      </Stack>
                    ) : (
                      <Flex justify='center'>
                        {selectedMmf && !userData.mmfApproved ? (
                          <ApprovalButton
                            approvalName='MMF'
                            isApproved={userData.mmfApproved}
                            dex={MappedLiberatedDexes.mmf}
                            onSuccess={() => handleApprovalSuccess(MappedLiberatedDexes.mmf)}
                          />
                        ) : selectedVvs && !userData.vvsApproved && (
                          <ApprovalButton
                            approvalName='VVS'
                            isApproved={userData.vvsApproved}
                            dex={MappedLiberatedDexes.vvs}
                            onSuccess={() => handleApprovalSuccess(MappedLiberatedDexes.vvs)}
                          />
                        )}
                      </Flex>
                    )}
                  </>
                )}
                <Box fontSize='xs' mt={2} textAlign='center'>
                  Migrated LP will be added as liquidity to the WCRO/USDC pair on Ebisu's Bay DEX. Rewards are held until {globalData?.endTime ? formatTimestamp(globalData.endTime) : 'TBA' }. During this time, you will earn FRTN rewards based on the amount of LP migrated.
                </Box>
              </Box>
            </>
          ) : (
            <Flex justify='center' direction='column'>
              <Box textAlign='center'>Connect wallet to start migrating your VVS and MMF LP to Ebisu's Bay DEX</Box>
              <PrimaryButton onClick={() => user.connect()}>
                Connect wallet
              </PrimaryButton>
            </Flex>
          )}
        </Card>
      </StandardContainer>
    </>
  )
}

interface ApprovalButtonProps {
  approvalName: string;
  dex: LiberatedDex;
  isApproved: boolean;
  onSuccess: () => void;
}

const ApprovalButton = ({approvalName, isApproved, dex, onSuccess}: ApprovalButtonProps) => {
  const user = useUser();
  const [isExecutingApproval, setIsExecutingApproval] = useState(false);

  const handleApproval = async () => {
    try {
      setIsExecutingApproval(true);
      const contract = new Contract(dex.address, ERC20, user.provider.signer);
      const approvalTx = await contract.approve(LIBERATOR_ADDRESS, constants.MaxUint256);
      await approvalTx.wait();
      onSuccess();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecutingApproval(false);
    }
  }

  return !isApproved && (
    <PrimaryButton
      isLoading={isExecutingApproval}
      isDisabled={isExecutingApproval}
      onClick={handleApproval}
      loadingText='Approving...'
    >
      Approve {approvalName}
    </PrimaryButton>
  )
}