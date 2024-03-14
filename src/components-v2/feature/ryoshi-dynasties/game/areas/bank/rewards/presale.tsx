import {useAppSelector} from "@src/Store/hooks";
import React, {useCallback, useContext, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {Contract, ethers} from "ethers";
import PresaleVaults from "@src/Contracts/PresaleVaults.json";
import VestingWallet from "@src/Contracts/VestingWallet.json";
import {ERC1155, ERC20} from "@src/Contracts/Abis";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, round} from "@src/utils";
import {Box, Center, Flex, HStack, SimpleGrid, Spacer, Spinner, Stack, Text} from "@chakra-ui/react";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import ImageService from "@src/core/services/image";
import RdButton from "../../../../components/rd-button";
import {commify} from "ethers/lib/utils";
import RdProgressBar from "@src/components-v2/feature/ryoshi-dynasties/components/rd-progress-bar";
import moment from "moment";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {parseErrorMessage} from "@src/helpers/validator";
import {useContractService, useUser} from "@src/components-v2/useUser";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

const PresaleVaultTab = () => {
  const user = useUser();
  const contractService = useContractService();
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingOpenVault, setExecutingOpenVault] = useState(false);
  const [executingExchangeTellers, setExecutingExchangeTellers] = useState(false);
  const [executingClaimFortune, setExecutingClaimFortune] = useState(false);
  const [executingReleaseTellers, setExecutingReleaseTellers] = useState(false);

  const queryClient = useQueryClient();

  // const { activeStep } = useSteps({
  //   index: 1,
  //   count: steps.length,
  // });
  // const stepperOrientation = useBreakpointValue<'horizontal' | 'vertical'>(
  //   {base: 'vertical', lg: 'horizontal'},
  //   {fallback: 'lg'},
  // );

  const { data, status, error, refetch } = useQuery({
    queryKey: ['PresaleVault', user.address],
    queryFn: async () => {
      const totalPresaleBalance = await ApiService.withoutKey().ryoshiDynasties.userTotalPurchased(user.address!);
      const isPresaleParticipant = totalPresaleBalance > 0;

      const presaleVaultsContract = new Contract(config.contracts.presaleVaults, PresaleVaults, readProvider);
      const hasStarted = Number(await presaleVaultsContract.startTime()) > 0;
      const vaultAddress = await presaleVaultsContract.vaults(user.address);

      let tradedTokens = [];
      for (let i = 1; i <= 5; i++) {
        tradedTokens.push(await presaleVaultsContract.tradedTokens(user.address, i));
      }

      let ret = {
        hasVault: false,
        hasStarted,
        vault: {
          address: '',
          balance: 0,
          releasable: 0,
          released: 0,
          completionDate: 0,
          start: 0,
          duration: 0
        },
        vaultAddress: null,
        vaultBalance: 0,
        vestedAmount: 0,
        isPresaleParticipant,
        totalPresaleBalance,
        tradedTokens,
        tradedTokensTotal: tradedTokens.reduce((sum, num) => sum + Number(num), 0)
      }

      // const presaleVault = await ApiService.withoutKey().ryoshiDynasties.presaleVault(user.address!);
      // if (!!presaleVault) {
      //   ret = {
      //     ...ret,
      //     hasVault: true,
      //     vault: {
      //       address: presaleVault.address,
      //       balance: Number(ethers.utils.formatEther(presaleVault.currentBalance)),
      //       releasable: Number(ethers.utils.formatEther(presaleVault.releasedBalance)),
      //       released: Number(ethers.utils.formatEther(presaleVault.releasedBalance)),
      //       completionDate: Number(presaleVault.endTime) * 1000,
      //       start: Number(presaleVault.startTime) * 1000,
      //       duration: Number(presaleVault.duration) * 1000,
      //     }
      //   }
      // }

      if (vaultAddress !== ethers.constants.AddressZero) {
        const vaultAddress = await presaleVaultsContract.vaults(user.address);
        const vestingWallet = new Contract(vaultAddress, VestingWallet, readProvider);
        const releasableAmount = await vestingWallet.releasable(config.contracts.fortune);
        const releasedAmount = await vestingWallet.released(config.contracts.fortune);
        const start = await vestingWallet.start();
        const duration = await vestingWallet.duration();

        const fortuneContract = new Contract(config.contracts.fortune, ERC20, readProvider);
        const vaultBalance = await fortuneContract.balanceOf(vaultAddress);

        ret = {
          ...ret,
          hasVault: true,
          vault: {
            address: vaultAddress,
            balance: Number(ethers.utils.formatEther(vaultBalance)),
            releasable: Number(ethers.utils.formatEther(releasableAmount)),
            released: Number(ethers.utils.formatEther(releasedAmount)),
            completionDate: (Number(start) + Number(duration)) * 1000,
            start: Number(start * 1000),
            duration: Number(duration * 1000),
          }
        }
      }

      const fortuneTellerCollection = config.collections.find((collection: any) => collection.slug === 'fortuneteller');
      const fortuneTellers = await ApiService.withoutKey().getCollectionItems({
        address: fortuneTellerCollection.address,
        sortBy: 'id',
        direction: 'asc',
        pageSize: 5
      });

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

    const isApproved = await fortuneTellerContract.isApprovedForAll(user.address, config.contracts.presaleVaults);
    if (!isApproved) {
      let tx = await fortuneTellerContract.setApprovalForAll(config.contracts.presaleVaults, true);
      await tx.wait();
    }
  };

  const handleCreateVault = useCallback(async () => {
    setExecutingOpenVault(true);
    try {
      const tx = await contractService!.ryoshiPresaleVaults.createVault();
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      await refetch();
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setExecutingOpenVault(false);
    }
  }, [user.wallet.isConnected]);

  const handleExchangeTellers = useCallback(async () => {
    setExecutingExchangeTellers(true);
    try {
      await setApprovalForAll();
      const tellerParams = data!.fortuneTellers.map((teller: any) => [Number(teller.nftId), teller.balance]);
      const tx = await contractService!.ryoshiPresaleVaults.claimBonus(
        tellerParams?.map((teller: any) => teller[0]),
        tellerParams?.map((teller: any) => teller[1])
      );
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      refetch();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingExchangeTellers(false);
    }
  }, [user.wallet.isConnected, data]);

  const handleClaimFortune = useCallback(async () => {
    setExecutingClaimFortune(true);
    try {
      const vestingWallet = new Contract(data!.vault.address!, VestingWallet, user.provider.getSigner());

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
  }, [user.wallet.isConnected, data]);

  const releaseTellers = async () => {
    setExecutingReleaseTellers(true);
    try {
      const tx = await contractService!.ryoshiPresaleVaults.retrieveTellers();
      await tx.wait();
      toast.success('Fortune Tellers have returned to your wallet!');
    } finally {
      setExecutingReleaseTellers(false);
    }
  };

  const handleReleaseTellers = useMutation({
    mutationFn: releaseTellers,
    onSuccess: data => {
      queryClient.setQueryData(['PresaleVault', user.address], (old: any) => ({
        ...old,
        tradedTokens: [],
        tradedTokensTotal: 0
      }));
    },
    onError: error => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  });

  return (
    <Box>
      <RdModalBox>
        <Box textAlign='center'>
          Users who participated in the Fortune Token Presale were able to vest their tokens for extra bonuses. Vesting took place over a 3-season period and is now complete.
        </Box>
      </RdModalBox>
      {status === 'pending' ? (
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
                <Text display='inline'>Fortune tokens in the vault have now been fully vested!</Text>
                {round(data.vault.releasable) > 0 && (
                  <Text display='inline'> Claim your vested amount below.</Text>
                )}
                {data.hasVault ? (
                  <Box mt={4}>
                    <Box mt={2}>
                      <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
                        <Box>
                          <Text fontSize='xs' color='#aaa'>To Claim</Text>
                          <HStack>
                            <FortuneIcon boxSize={6} />
                            <Text fontSize='lg' fontWeight='bold'>{round(data.vault.releasable, 4)}</Text>
                          </HStack>
                        </Box>
                        {round(data.vault.releasable) > 0 && (
                          <RdButton
                            size='sm'
                            isLoading={executingClaimFortune}
                            isDisabled={executingClaimFortune}
                            onClick={handleClaimFortune}
                            loadingText='Claiming'
                          >
                            Claim
                          </RdButton>
                        )}
                      </Stack>
                    </Box>
                    <Box mt={4}>
                      <Flex justify='space-between'>
                        <Box>0</Box>
                        <Box>Vested: {commify(round(data.vault.releasable + data.vault.released))} / {commify(round(data.vault.balance + data.vault.released))}</Box>
                      </Flex>
                      <RdProgressBar current={Date.now() - data.vault.start} max={data.vault.duration} />
                      <Flex justify='space-between'>
                        <Spacer />
                        <Box>Completed: {moment(data.vault.completionDate).format("D MMM yyyy")}</Box>
                      </Flex>
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
                            loadingText='Creating'
                          >
                            Create Vault
                          </RdButton>
                        </Box>
                      </>
                    ) : (
                      <Text>You did not participate in the presale.</Text>
                    )}
                  </Box>
                )}
              </RdModalBox>
              {(data.hasVault) && (
                <RdModalBox mt={2}>
                  <Text fontWeight='bold' fontSize='lg' mb={4}>Fortune Teller Bonus</Text>
                  <Text>Season 1 has ended! Users who have exchanged their Fortune Tellers are now able to have them returned. Additional APR opportunities by staking in the <Text as='span' color='#F48F0C' fontWeight='bold'>Bank</Text> may soon be available for these returned Fortune Tellers.</Text>
                  <Text mt={4}>We thank you for your ongoing support!</Text>
                  {data.tradedTokensTotal > 0 ? (
                    <Box mt={2}>
                      <Box my={4}><hr /></Box>
                      <Stack justify='space-between' direction={{base: 'column', sm: 'row'}}>
                        <Box mx={{base: 'auto', sm: 'inherit'}} w='full' maxW='180px'>
                          <AnyMedia
                            image={ImageService.gif(data.fortuneTellers[data.fortuneTellers.length - 1].image).fixedWidth(180, 180)}
                            title={data.fortuneTellers[data.fortuneTellers.length - 1].name}
                          />
                        </Box>
                        <Box>
                          <SimpleGrid templateColumns='1fr max-content' gap={2} alignItems='baseline'>
                            <Box fontWeight={'bold'} textAlign='end'>Teller</Box>
                            <Box fontWeight={'bold'} textAlign='end'>Amount</Box>
                            {data.fortuneTellers.map((teller) => (
                              <>
                                <Box textAlign='end'>{teller.name}</Box>
                                <Box textAlign='end'>{data.tradedTokens[Number(teller.id) - 1].toString()}</Box>
                              </>
                            ))}
                            <Box textAlign='end'>Total:</Box>
                            <Box textAlign='end' fontWeight='bold' fontSize='lg'>
                              {commify(data.tradedTokensTotal)}
                            </Box>
                          </SimpleGrid>
                        </Box>
                      </Stack>

                      <Box textAlign='end' mt={2}>
                        <RdButton
                          size='md'
                          hoverIcon={false}
                          isLoading={executingReleaseTellers}
                          isDisabled={executingReleaseTellers}
                          onClick={() => handleReleaseTellers.mutate()}
                          loadingText='Returning'
                        >
                          Return
                        </RdButton>
                      </Box>
                    </Box>
                  ) : (
                    <Box textAlign='center' mt={6}>No Fortune Tellers found</Box>
                  )}
                  {/*{data.fortuneTellers && data.fortuneTellers.length > 0 ? (*/}
                  {/*  <Box mt={2}>*/}
                  {/*    <Box my={4}><hr /></Box>*/}
                  {/*    <Stack justify='space-between' direction={{base: 'column', sm: 'row'}}>*/}
                  {/*      <Box mx={{base: 'auto', sm: 'inherit'}} w='full' maxW='180px'>*/}
                  {/*        <AnyMedia*/}
                  {/*          image={ImageService.gif(data.fortuneTellers[0].image).fixedWidth(180, 180)}*/}
                  {/*          title={data.fortuneTellers[0].name}*/}
                  {/*        />*/}
                  {/*      </Box>*/}
                  {/*      <Box>*/}
                  {/*        <SimpleGrid templateColumns='1fr max-content' gap={2} alignItems='baseline'>*/}
                  {/*          <Box fontWeight={'bold'} textAlign='end'>Teller</Box>*/}
                  {/*          <Box fontWeight={'bold'} textAlign='end'>Bonus</Box>*/}
                  {/*          {data.fortuneTellers.map((teller: any) => (*/}
                  {/*            <>*/}
                  {/*              <Box textAlign='end'>{teller.name} (x{teller.balance}):</Box>*/}
                  {/*              <Box textAlign='end'>{commify(teller.balance * rdConfig.presale.bonus[Number(teller.nftId) - 1])}</Box>*/}
                  {/*            </>*/}
                  {/*          ))}*/}
                  {/*          <Box textAlign='end'>Total:</Box>*/}
                  {/*          <Box textAlign='end' fontWeight='bold' fontSize='lg'>*/}
                  {/*            {commify(data.fortuneTellers.reduce((value: number, teller: any) => {*/}
                  {/*              return value + teller.balance * rdConfig.presale.bonus[Number(teller.nftId) - 1];*/}
                  {/*            }, 0))}*/}
                  {/*          </Box>*/}
                  {/*        </SimpleGrid>*/}
                  {/*      </Box>*/}
                  {/*    </Stack>*/}

                  {/*    {data.fortuneTellers.find((teller: any) => teller.nftId === '3') && (*/}
                  {/*      <Alert status='warning' my={2}>*/}
                  {/*        <AlertIcon />*/}
                  {/*        *Note that Cedric "Ceddy" Biscuitworth is only eligible for the Fortune rewards.*/}
                  {/*      </Alert>*/}
                  {/*    )}*/}

                  {/*    <Box textAlign='end' mt={2}>*/}
                  {/*      <RdButton*/}
                  {/*        size='md'*/}
                  {/*        hoverIcon={false}*/}
                  {/*        isLoading={executingExchangeTellers}*/}
                  {/*        isDisabled={executingExchangeTellers}*/}
                  {/*        onClick={handleExchangeTellers}*/}
                  {/*        loadingText='Exchanging'*/}
                  {/*      >*/}
                  {/*        Exchange*/}
                  {/*      </RdButton>*/}
                  {/*    </Box>*/}
                  {/*  </Box>*/}
                  {/*) : (*/}
                  {/*  <Box mt={4}>*/}
                  {/*    No Fortune Tellers in wallet. Pick some up in the <Link href='/collection/fortuneteller' style={{color: '#F48F0C', fontWeight: 'bold'}}>marketplace</Link>.*/}
                  {/*  </Box>*/}
                  {/*)}*/}
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

export default PresaleVaultTab;