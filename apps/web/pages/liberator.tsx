import React, { useEffect, useState } from 'react';
import { constants, Contract, ethers } from 'ethers';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import { useQuery } from '@tanstack/react-query';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import { StandardContainer } from '@src/components-v2/shared/containers';
import { Card } from '@src/components-v2/foundation/card';
import FortuneIcon from '@src/components-v2/shared/icons/fortune';
import ImageService from '@src/core/services/image';
import PageHead from '@src/components-v2/shared/layout/page-head';
import { getTheme } from '@src/global/theme/theme';
import Countdown from 'react-countdown';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {round} from '@market/helpers/utils';
import {wagmiConfig} from "@src/wagmi";
import { Address, erc20Abi } from 'viem';
import {readContracts} from "@wagmi/core";
import DecimalAbbreviatedNumber from "@src/components-v2/shared/decimal-abbreviated-number";

const ENABLED = true;
const LiberatorAbi = [{"inputs":[{"internalType":"address","name":"_wcro","type":"address"},{"internalType":"address","name":"_usdc","type":"address"},{"internalType":"address","name":"_frtn","type":"address"},{"internalType":"address","name":"_vvsRouter","type":"address"},{"internalType":"address","name":"_mmfRouter","type":"address"},{"internalType":"address","name":"_ryoshiRouter","type":"address"},{"internalType":"address","name":"_vvsLp","type":"address"},{"internalType":"address","name":"_mmfLp","type":"address"},{"internalType":"address","name":"_ryoshiLP","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Liberation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLP","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountFRTN","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"from","type":"address"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mmfRouter","outputs":[{"internalType":"contract IRyoshiRouter01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"rewardsFor","outputs":[{"internalType":"uint256","name":"userReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ryoshiRouter","outputs":[{"internalType":"contract IRyoshiRouter01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdc","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"croDeposited","type":"uint256"},{"internalType":"uint256","name":"usdcDeposited","type":"uint256"},{"internalType":"uint256","name":"lpDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vvsRouter","outputs":[{"internalType":"contract IRyoshiRouter01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wcro","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const LIBERATOR_ADDRESS = '0xF08c8212C5065F653EFd191f075C9De0c5E70618';
const EB_WCROUSDC_ADDRESS = '0xaf1a4a7dce423a3ee04a8868dc1997bcece9b560';

enum LiberatedDexKey {
  VVS = 'vvs',
  MMF = 'mmf',
}

interface LiberatedDex {
  key: LiberatedDexKey;
  name: string;
  address: string;
  logo: string;
  lp: string;
}

const MappedLiberatedDexes: {[key in LiberatedDexKey]: LiberatedDex} = {
  [LiberatedDexKey.VVS]: {
    key: LiberatedDexKey.VVS,
    name: 'VVS',
    address: '0xe61Db569E231B3f5530168Aa2C9D50246525b6d6',
    logo: ImageService.translate('/img/icons/tokens/vvs.webp').convert(),
    lp: 'WCRO/USDC'
  },
  [LiberatedDexKey.MMF]: {
    key: LiberatedDexKey.MMF,
    name: 'MMF',
    address: '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623',
    logo: ImageService.translate('/img/icons/tokens/mad.webp').convert(),
    lp: 'WCRO/USDC'
  }
}

export default function Page() {
  const user = useUser();
  const [isExecuting, setIsExecuting] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedDexKey, setSelectedDexKey] = useState<LiberatedDexKey>(LiberatedDexKey.VVS);
  const [contract, setContract] = useState<Contract>();
  const [liberatorAddress, setLiberatorAddress] = useState<string>(LIBERATOR_ADDRESS);
  const selectedDex = MappedLiberatedDexes[selectedDexKey];
  const [claiming, setClaiming] = useState(false);

  const {data: globalData, refetch: refetchGlobal} = useQuery({
    queryKey: ['LiberatorGlobal'],
    queryFn: async () => {
      const data = await readContracts(wagmiConfig, {
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

      const totalRewards = data[0].status === 'success' ? data[0].result as bigint : 0;
      const endTime = data[1].status === 'success' ? data[1].result as number : 0;

      return {
        totalRewards: ethers.utils.formatEther(totalRewards),
        endTime
      };
    }
  });

  const {data: userData, refetch: refetchUser} = useQuery({
    queryKey: ['LiberatorUser', user.address],
    queryFn: async () => {
      const data = await readContracts(wagmiConfig,{
        contracts: [
          {
            address: LIBERATOR_ADDRESS as Address,
            abi: LiberatorAbi as any,
            functionName: 'rewardsFor',
            args: [user.address as Address],
          },
          {
            address: MappedLiberatedDexes.mmf.address as Address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [user.address as Address],
          },
          {
            address: MappedLiberatedDexes.mmf.address as Address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [user.address as Address, LIBERATOR_ADDRESS],
          },
          {
            address: MappedLiberatedDexes.vvs.address as Address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [user.address as Address],
          },
          {
            address: MappedLiberatedDexes.vvs.address as Address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [user.address as Address, LIBERATOR_ADDRESS],
          },
          {
            address: LIBERATOR_ADDRESS as Address,
            abi: LiberatorAbi as any,
            functionName: 'userInfo',
            args: [user.address as Address],
          },
          {
            address: EB_WCROUSDC_ADDRESS as Address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [user.address as Address],
          }
        ],
      });

      const userInfo = data[5].result as [number, number, number];
      return {
        userRewards: data[0].status === 'success' ? ethers.utils.formatEther(data[0].result as number) : '0',
        mmfBalance: data[1].status === 'success' ? ethers.utils.formatEther(data[1].result) : '0',
        mmfAllowance: data[2].status === 'success' ? data[2].result : 0,
        mmfApproved: data[2].status === 'success' ? data[2].result > 0 : false,
        vvsBalance: data[3].status === 'success' ? ethers.utils.formatEther(data[3].result) : '0',
        vvsAllowance: data[4].status === 'success' ? data[4].result : 0,
        vvsApproved: data[4].status === 'success' ? data[4].result > 0 : false,
        userInfo: data[5].status === 'success' ? {
          croDeposited: ethers.utils.formatEther(userInfo[0]),
          usdcDeposited: ethers.utils.formatUnits(userInfo[1], 6),
          lpDebt: ethers.utils.formatEther(userInfo[2])
        } : {croDeposited: 0, usdcDeposited: 0, lpDebt: 0},
        ebBalance: data[6].status === 'success' ? ethers.utils.formatEther(data[6].result) : '0',
      };
    },
    enabled: !!user.address
  });

  const handleChangeDex = (dex: LiberatedDexKey) => {
    setSelectedDexKey(dex);
  }

  const handleChangeAmount = (value: string) => {
    setAmount(value);
  }

  const handleMaxLp = () => {
    if (selectedDex.address === MappedLiberatedDexes.mmf.address) {
      setAmount(userData?.mmfBalance || '');
    } else if (selectedDex.address === MappedLiberatedDexes.vvs.address) {
      setAmount(userData?.vvsBalance || '');
    }
  }

  const handleSelectAmount = (amount: string, dex: LiberatedDexKey) => {
    setSelectedDexKey(dex);
    setAmount(amount);
  }

  const handleApprovalSuccess = (approvedDex: LiberatedDex) => {
    refetchUser();
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

    if (isNaN(Number(amount)) || !(Number(amount) > 0)) {
      toast.error('Enter a valid amount');
      return;
    }

    if (!selectedDexKey || !selectedDex) {
      toast.error('Select a DEX');
      return;
    }

    try {
      setIsExecuting(true);
      const tx = await contract.migrate(ethers.utils.parseEther(amount), selectedDex.address);
      await tx.wait();
      toast.success('Transaction successful');
      setAmount('');
      refetchUser();
      refetchGlobal();
    } catch (e: any) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleClaimRewards = async () => {
    try {
      setClaiming(true);
      const tx = await contract?.withdraw();
      await tx?.wait();
      toast.success('Rewards claimed!');
      refetchUser();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setClaiming(false);
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

  const selectedMmf = selectedDexKey === LiberatedDexKey.MMF;
  const selectedVvs = selectedDexKey === LiberatedDexKey.VVS;
  const isInApprovedState = (selectedMmf && userData?.mmfApproved) || (selectedVvs && userData?.vvsApproved);
  const canClaim = !!userData && Number(userData.userRewards) > 0 && !!globalData?.endTime && Date.now() / 1000 > globalData.endTime;

  const renderer = ({ completed }: { completed:boolean }) => {
    return completed && canClaim ? (
      <PrimaryButton
        onClick={handleClaimRewards}
        isLoading={claiming}
        isDisabled={claiming}
        loadingText='Claim'
        size='sm'
      >
        Claim
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

  const maxAmountInput = () => {
    if (selectedDex.address === MappedLiberatedDexes.mmf.address) return Number(userData?.mmfBalance || 0);
    else if (selectedDex.address === MappedLiberatedDexes.vvs.address) return Number(userData?.vvsBalance || 0);
    return 0;
  }

  return (
    <>
      <PageHead
        title="Migrate Your LP | Ebisu's Bay Marketplace"
        description="Liberate your VVS and MMF LP tokens towards Ebisu's Bay DEX"
        url="/liberator"
        image={ImageService.translate('/img/promos/liberator/liberator-banner.webp').convert()}
      />
      <StandardContainer mt={{ base: 4, sm: 6 }}>
        <Image src={ImageService.translate('/img/promos/liberator/liberator-header.webp').convert()} />
        <Card mt={2}>
          Starting July 4th, users have the opportunity to migrate their VVS and MMF LP tokens to Ebisu's Bay DEX! The Liberator will migrate <strong>WCRO/USDC</strong> LP tokens and will also earn FRTN rewards based on the amount of LP tokens migrated.
        </Card>
        {ENABLED ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={2} mt={2}>
              <Card flex={1}>
                <Box fontWeight='bold' fontSize='sm' mb={2}>Rewards Pool</Box>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 0, sm: 2 }}>
                  {!!globalData && (
                    <>
                      <Box>Total Rewards</Box>
                      <Stack justify={{ base: 'start', sm: 'end' }} direction={{ base: 'row-reverse', sm: 'row' }}>
                        <Box ms={{ base: 0, sm: 2 }} fontWeight='bold' fontSize='lg'>{globalData.totalRewards}</Box>
                        <FortuneIcon boxSize={6} />
                      </Stack>
                    </>
                  )}

                  <HStack spacing={0} h='24px' mt={{base: 2, sm: 0}}>
                    <>Your Rewards</>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton aria-label='User Rewards Info' icon={<QuestionOutlineIcon />} variant='unstyled'/>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <Box>Amount of FRTN earned from migrated LP tokens. Can be claimed after {globalData?.endTime ? formatTimestamp(globalData.endTime) : 'TBA' }</Box>
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
                    <Stack justify={{ base: 'start', sm: 'end' }} direction={{ base: 'row-reverse', sm: 'row' }}>
                      <Box ms={{ base: 0, sm: 2 }} fontWeight='bold' fontSize='lg'>{userData?.userRewards || '-'}</Box>
                      {!!userData?.userRewards && <FortuneIcon boxSize={6} />}
                    </Stack>
                  </Box>

                  <HStack spacing={0} h='24px' mt={{base: 2, sm: 0}}>
                    <>Pending LP</>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton aria-label='User Rewards Info' icon={<QuestionOutlineIcon />} variant='unstyled'/>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <Box>Amount of WCRO/USDC liquidity added to Ebisu's Bay DEX once rewards have been claimed after {globalData?.endTime ? formatTimestamp(globalData.endTime) : 'TBA' }</Box>
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
                  <Flex justify={{ base: 'start', sm: 'end' }} fontWeight='bold'>
                    <DecimalAbbreviatedNumber value={!!userData ? userData.userInfo.lpDebt : '-'} />
                  </Flex>
                  {!!userData?.userInfo && (
                    <>
                      <Box fontSize='xs' className='text-muted'>Total Deposited</Box>
                      <Flex fontSize='xs' justify={{ base: 'start', sm: 'end' }} className='text-muted'>
                        {round(userData?.userInfo.croDeposited ?? 0, 4)} CRO + {round(userData?.userInfo.usdcDeposited ?? 0, 4)} USDC
                      </Flex>
                    </>
                  )}

                  {canClaim && (
                    <GridItem colSpan={{ base: 1, sm: 2 }}>
                      <Flex justify='end'>
                        <Countdown
                          date={globalData.endTime * 1000}
                          renderer={renderer}
                        />
                      </Flex>
                    </GridItem>
                  )}
                </SimpleGrid>
              </Card>
              <Card flex={1}>
                <Box fontWeight='bold' fontSize='sm' mb={2}>Your LP Balances</Box>
                <SimpleGrid columns={2} gap={2}>
                  <HStack>
                    <Image src={MappedLiberatedDexes.vvs.logo} w='30px'/>
                    <Box>VVS</Box>
                  </HStack>
                  <Box
                    textAlign='end'
                    cursor='pointer'
                    onClick={() => handleSelectAmount(userData?.vvsBalance ?? '0', LiberatedDexKey.VVS)}
                    fontWeight='bold'
                  >
                    <DecimalAbbreviatedNumber value={!!userData ? userData.vvsBalance : '-'} />
                  </Box>

                  <HStack>
                    <Image src={MappedLiberatedDexes.mmf.logo} w='30px'/>
                    <Box>MMF</Box>
                  </HStack>
                  <Box
                    textAlign='end'
                    cursor='pointer'
                    onClick={() => handleSelectAmount(userData?.mmfBalance ?? '0', LiberatedDexKey.MMF)}
                    fontWeight='bold'
                  >
                    <DecimalAbbreviatedNumber value={!!userData ? userData.mmfBalance : '-'} />

                  </Box>

                  <HStack>
                    <Image src={ImageService.translate('/img/logo-dark.svg').convert()} w='30px'/>
                    <Box>Ebisu's Bay</Box>
                  </HStack>
                  <Box textAlign='end' fontWeight='bold'>
                    <DecimalAbbreviatedNumber value={!!userData ? userData.ebBalance : '-'} />
                  </Box>
                </SimpleGrid>
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
                          isActive={selectedDex.address === tab.address}
                          onClick={() => handleChangeDex(key as LiberatedDexKey)}
                          rounded='3px'
                          variant='tab'
                          color={selectedDex.address === tab.address ? 'white' : getTheme(user.theme).colors.textColor3}
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
                          <NumberInput
                            min={1}
                            max={maxAmountInput()}
                            value={amount}
                            onChange={handleChangeAmount}
                            flex={1}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
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
                                <Image src={selectedDex.logo} w='30px'/>
                                <Box ms={2} fontWeight='bold' fontSize='lg'>
                                  Migrating LP from {selectedDex.name}
                                </Box>
                              </HStack>
                            </Box>
                            <PrimaryButton
                              isLoading={isExecuting}
                              isDisabled={isExecuting || isNaN(Number(amount)) || Number(amount) <= 0}
                              onClick={handleMigration}
                              loadingText='Migrating...'
                              w={{base: 'full', sm: 'auto'}}
                              size='lg'
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
                    <Box fontSize='xs' mt={2} textAlign='center' className='text-muted'>
                      Migrated LP will be held until {globalData?.endTime ? formatTimestamp(globalData.endTime) : 'TBA' }. After this date, claiming will reward FRTN and add liquidity to the WCRO/USDC pair on Ebisu's Bay. Amount received is proportional to the amount migrated.
                    </Box>
                  </Box>
                </>
              ) : (
                <Flex justify='center' direction='column'>
                  <Box textAlign='center'>Connect wallet to start migrating your VVS and MMF LP to Ebisu's Bay DEX</Box>
                  <PrimaryButton onClick={() => user.connect()} mt={2}>
                    Connect wallet
                  </PrimaryButton>
                </Flex>
              )}
            </Card>
          </>
        ) : (
          <Card mt={2}>
            <Box textAlign='center'>Liberator will be available soon!</Box>
          </Card>
        )}
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