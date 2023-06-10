import {Box, Center, Flex, HStack, Image, SimpleGrid, Spinner, Stack, Text, VStack} from "@chakra-ui/react"
import React, {useCallback, useContext, useState} from "react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

//contracts
import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import PresaleVaults from "@src/Contracts/PresaleVaults.json";
import VestingWallet from "@src/Contracts/VestingWallet.json";
import {createSuccessfulTransactionToastContent, round} from '@src/utils';
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {commify} from "ethers/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import ImageService from "@src/core/services/image";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import Link from "next/link";
import {ERC1155, ERC20} from "@src/Contracts/Abis";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

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
              <EmergencyWithdrawTab />
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

const FortuneRewardsTab = () => {
  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();

  const checkForRewards = async () => {
    return ApiService.withoutKey().ryoshiDynasties.getSeasonalRewards(user.address!);
  }

  const { error, data: rewards, status, refetch } = useQuery(
    ['BankSeasonalRewards', user.address],
    checkForRewards,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false
    }
  );

  const handleWithdraw = async (amount: number, seasonId: number) => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, amount, seasonId, signatureInStorage)
      await user.contractService?.ryoshiPlatformRewards.withdraw(auth.data.reward, auth.data.signature);
    }
  }

  return (
      <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
        <Box textAlign='center'>
          Fortune rewards accumulate from Fortune staking, marketplace listings, and from playing the game and can be withdrawn at any time.
          However, only withdrawing at the end of a season will allow you to claim the full amount of rewards.
        </Box>
        {status === "loading" ? (
          <Center py={4}>
            <Spinner />
          </Center>
        ) : status === "error" ? (
          <Center py={4}>
            <Text>Error: {(error as any).message}</Text>
          </Center>
        ) : (
          <>
            {rewards.data.rewards.length > 0 ? (
              <>
                <Box py={4}><hr /></Box>
                {rewards.data.rewards.map((reward: any) => (
                  <>
                    <Flex justify='space-between' mt={2}>
                      <VStack align='start' spacing={0}>
                        <Text fontSize='xl' fontWeight='bold'>Season {commify(reward.blockId)}</Text>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
                          <Text>{reward.currentRewards}</Text>
                        </HStack>
                      </VStack>
                      <RdButton hoverIcon={false} onClick={() => handleWithdraw(Number(reward.currentRewards), Number(reward.seasonId))}>
                        Claim
                      </RdButton>
                    </Flex>
                  </>
                ))}
              </>
            ) : (
              <Box mt={2}>
                <Text textAlign='center' fontSize={14}>You have no rewards to withdraw at this time.</Text>
              </Box>
            )}
          </>
        )}
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
    return [];
  }

  const { error, data: deposits, status, refetch } = useQuery(
    ['BankDeposits', user.address],
    checkForDeposits,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false
    }
  );

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
          <RdModalBox textAlign='center'>
            Coming Soon
          </RdModalBox>
        </>
      )}
    </Box>
  )
}


const steps = [
  { title: 'First', description: 'Open Vault' },
  { title: 'Second', description: 'Date & Time' },
  { title: 'Third', description: 'Select Rooms' },
]

const PresaleVaultTab = () => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingOpenVault, setExecutingOpenVault] = useState(false);
  const [executingExchangeTellers, setExecutingExchangeTellers] = useState(false);
  const [executingClaimFortune, setExecutingClaimFortune] = useState(false);

  // const { activeStep } = useSteps({
  //   index: 1,
  //   count: steps.length,
  // });
  // const stepperOrientation = useBreakpointValue<'horizontal' | 'vertical'>(
  //   {base: 'vertical', lg: 'horizontal'},
  //   {fallback: 'lg'},
  // );

  const { data, status, error, refetch } = useQuery({
    queryKey: ['PresaleVault'],
    queryFn: async () => {
      const totalPresaleBalance = await ApiService.withoutKey().ryoshiDynasties.userTotalPurchased(user.address!);
      const isPresaleParticipant = totalPresaleBalance > 0;

      const presaleVaultsContract = new Contract(config.contracts.presaleVaults, PresaleVaults, readProvider);
      const hasStarted = Number(await presaleVaultsContract.startTime()) > 0;
      const vaultAddress = await presaleVaultsContract.vaults(user.address);

      let ret = {
        hasVault: false,
        hasStarted,
        vaultAddress: null,
        vaultBalance: 0,
        vestedAmount: 0,
        isPresaleParticipant,
        totalPresaleBalance
      }

      if (vaultAddress !== ethers.constants.AddressZero) {
        const vaultAddress = await presaleVaultsContract.vaults(user.address);
        const vestingWallet = new Contract(vaultAddress, VestingWallet, readProvider);
        const vestedAmount = await vestingWallet.releasable(config.contracts.fortune);

        const fortuneContract = new Contract(config.contracts.fortune, ERC20, readProvider);
        const vaultBalance = await fortuneContract.balanceOf(vaultAddress);

        ret = {
          ...ret,
          hasVault: true,
          vaultAddress,
          vaultBalance,
          vestedAmount
        }
      }

      const fortuneTellerCollection = config.collections.find((collection: any) => collection.slug === 'fortuneteller');
      const fortuneTellers = await ApiService.withoutKey().getWallet(user.address!, {
        collection: [fortuneTellerCollection.address]
      })

      return {
        ...ret,
        fortuneTellers: fortuneTellers.data.sort((a: any, b: any) => Number(b.nftId) - Number(a.nftId))
      }
    },
    enabled: !!user.address,
    refetchOnWindowFocus: false
  });

  const setApprovalForAll = async () => {
    const fortuneTellerCollection = config.collections.find((collection: any) => collection.slug === 'fortuneteller');

    const fortuneTellerContract = new Contract(fortuneTellerCollection.address, ERC1155, user.provider.getSigner());

    const isApproved = await fortuneTellerContract.isApprovedForAll(config.contracts.presaleVaults, user.address);
    if (!isApproved) {
      let tx = await fortuneTellerContract.setApprovalForAll(config.contracts.presaleVaults, true);
      await tx.wait();
    }
  };

  const handleCreateVault = useCallback(async () => {
    setExecutingOpenVault(true);
    try {
      const tx = await user.contractService!.ryoshiPresaleVaults.createVault();
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      await refetch();
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setExecutingOpenVault(false);
    }
  }, [user]);

  const handleExchangeTellers = useCallback(async () => {
    setExecutingExchangeTellers(true);
    try {
      await setApprovalForAll();
      const tellerParams = data!.fortuneTellers.map((teller: any) => [Number(teller.nftId), teller.balance]);
      const tx = await user.contractService!.ryoshiPresaleVaults.claimBonus(
        tellerParams?.map((teller: any) => teller[0]),
        tellerParams?.map((teller: any) => teller[1])
      );
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      refetch();
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setExecutingExchangeTellers(false);
    }
  }, [user, data]);

  const handleClaimFortune = useCallback(async () => {
    setExecutingClaimFortune(true);
    try {
      const vestingWallet = new Contract(data!.vaultAddress!, VestingWallet, user.provider.getSigner());

      const tx = await vestingWallet.release(config.contracts.fortune);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      refetch();
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setExecutingClaimFortune(false);
    }
  }, [user, data]);

  return (
    <Box>
      <RdModalBox>
        <Box textAlign='center'>
          Users who participated in the Fortune Token Presale can now begin vesting their tokens. Those also holding Fortune Teller NFTs can exchange them for bonus Fortune tokens and Fortune Guards.
        </Box>
      </RdModalBox>
      {status === 'loading' ? (
        <Center mt={2}>
          <Spinner />
        </Center>
      ) : status === 'error' ? (
        <Box textAlign='center' mt={2}>
          {(error as any).message}
        </Box>
      ) : !!data && (
        <>
          {data.hasStarted ? (
            <>
              <RdModalBox mt={2}>
                <Text fontWeight='bold' fontSize='lg' mb={4}>Vesting Vault</Text>
                {data.hasVault ? (
                  <Box>
                    <Box>
                      <Text fontSize='xs' color='#aaa'>Vault Total</Text>
                      <HStack>
                        <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
                        <Text fontSize='lg' fontWeight='bold'>{commify(round(Number(ethers.utils.formatEther(data.vaultBalance)), 4))}</Text>
                      </HStack>
                    </Box>

                    <Box mt={2}>
                      <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
                        <Box>
                          <Text fontSize='xs' color='#aaa'>Vested</Text>
                          <HStack>
                            <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
                            <Text fontSize='lg' fontWeight='bold'>{commify(round(Number(ethers.utils.formatEther(data.vestedAmount)), 4))}</Text>
                          </HStack>
                        </Box>
                        <RdButton
                          size='sm'
                          isLoading={executingClaimFortune}
                          isDisabled={executingClaimFortune}
                          onClick={handleClaimFortune}
                        >
                          {executingClaimFortune ? 'Claiming' : 'Claim'}
                        </RdButton>
                      </Stack>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    {data.isPresaleParticipant ? (
                      <>
                        <Text>Your total presale balance is <strong>{commify(data.totalPresaleBalance)}</strong>. Create a vault now to begin vesting your Fortune tokens. Fortune rewards gained from trading in Fortune Tellers will also begin vesting here.</Text>
                        <Box textAlign='end' mt={2}>
                          <RdButton
                            hoverIcon={false}
                            onClick={handleCreateVault}
                            isLoading={executingOpenVault}
                            isDisabled={executingOpenVault}
                          >
                            {executingOpenVault ? 'Creating' : 'Create Vault'}
                          </RdButton>
                        </Box>
                      </>
                    ) : data.fortuneTellers.length > 0 ? (
                      <Text>You did not participate in the presale. However, you can still trade-in your Fortune Tellers in exchange for bonus Fortune tokens and Fortune Guards.</Text>
                    ) : (
                      <Text>You did not participate in the presale.</Text>
                    )}
                  </Box>
                )}
              </RdModalBox>
              {(data.hasVault || !data.isPresaleParticipant) && (
                <RdModalBox mt={2}>
                  <Text fontWeight='bold' fontSize='lg' mb={4}>Fortune Teller Bonus</Text>
                  <Text>Exchange your Fortune Tellers to receive bonus Fortune tokens and Fortune Guards. These Fortune Guards are the key to minting Heroes.</Text>
                  {data.fortuneTellers && data.fortuneTellers.length > 0 ? (
                    <Box mt={2}>
                      <Box my={4}><hr /></Box>
                      <Stack justify='space-between' direction={{base: 'column', sm: 'row'}}>
                        <Box mx={{base: 'auto', sm: 'inherit'}} w='full' maxW='180px'>
                          <AnyMedia
                            image={ImageService.gif(data.fortuneTellers[0].image).fixedWidth(180, 180)}
                            title={data.fortuneTellers[0].name}
                          />
                        </Box>
                        <Box>
                          <SimpleGrid templateColumns='1fr max-content' gap={2} alignItems='baseline'>
                            <Box fontWeight={'bold'} textAlign='end'>Teller</Box>
                            <Box fontWeight={'bold'} textAlign='end'>Bonus</Box>
                            {data.fortuneTellers.map((teller: any) => (
                              <>
                                <Box textAlign='end'>{teller.name} (x{teller.balance}):</Box>
                                <Box textAlign='end'>{commify(teller.balance * rdConfig.presale.bonus[Number(teller.nftId) - 1])}</Box>
                              </>
                            ))}
                            <Box textAlign='end'>Total:</Box>
                            <Box textAlign='end' fontWeight='bold' fontSize='lg'>
                              {commify(data.fortuneTellers.reduce((value: number, teller: any) => {
                                return value + teller.balance * rdConfig.presale.bonus[Number(teller.nftId) - 1];
                              }, 0))}
                            </Box>
                          </SimpleGrid>
                        </Box>
                      </Stack>
                      <Box textAlign='end' mt={2}>
                        <RdButton
                          size='md'
                          hoverIcon={false}
                          isLoading={executingExchangeTellers}
                          isDisabled={executingExchangeTellers}
                          onClick={handleExchangeTellers}
                        >
                          {executingExchangeTellers ? 'Exchanging' : 'Exchange'}
                        </RdButton>
                      </Box>
                    </Box>
                  ) : (
                    <Box mt={4}>
                      No Fortune Tellers in wallet. Pick some up on the <Link href='/collection/fortuneteller' style={{textDecoration: 'underline'}}>marketplace</Link>.
                    </Box>
                  )}
                </RdModalBox>
              )}
            </>
          ) : (
            <RdModalBox mt={2} textAlign='center'>
              Vesting wallets will be starting soon.
            </RdModalBox>
          )}
        </>
      )}
    </Box>
  )
}
export default Rewards;