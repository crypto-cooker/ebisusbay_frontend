import {ApiService} from "@src/core/services/api-service";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  VStack,
  Wrap
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import RdButton from "../../../../components/rd-button";
import React, {useCallback, useContext, useEffect, useState} from "react";
import RdProgressBar from "@src/components-v2/feature/ryoshi-dynasties/components/rd-progress-bar";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {createSuccessfulTransactionToastContent, round, timeSince} from "@market/helpers/utils";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert, RdModalBox, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useFortunePrice} from "@market/hooks/useGlobalPrices";
import {appConfig} from "@src/config";
import {toast} from "react-toastify";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {ethers} from "ethers";
import {commify} from "ethers/lib/utils";
import {FortuneStakingAccount, StakingAccount} from "@src/core/services/api-service/graph/types";
import moment from 'moment';
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";
import {useContractService, useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";
import {AppChainConfig, SUPPORTED_RD_CHAIN_CONFIGS, SupportedChainId} from "@src/config/chains";
import {ChainLogo} from "@dex/components/logo";
import {getAppChainConfig, useAppChainConfig} from "@src/config/hooks";
import {usePlatformRewardsContract} from "@src/global/hooks/contracts";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";

const config = appConfig();

const FortuneRewardsTab = () => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const [seasonTimeRemaining, setSeasonTimeRemaining] = useState(0);
  const [burnMalus, setBurnMalus] = useState(0);

  const checkForRewards = async () => {
    return ApiService.withoutKey().ryoshiDynasties.getSeasonalRewards(user.address!);
  }

  const { error, data: rewards, status, refetch } = useQuery({
    queryKey: ['BankSeasonalRewards', user.address],
    queryFn: checkForRewards,
    enabled: !!user.address,
    refetchOnWindowFocus: false
  });

  // useEffect(() => {
  //   if (rdGameContext) {
  //     const totalTime = Date.parse(rdGameContext.season.endAt) - Date.parse(rdGameContext.season.startAt);
  //     const currentElapsed = Date.parse(rdGameContext.season.endAt) - Date.now();
  //     setSeasonTimeRemaining(Math.floor(((totalTime - currentElapsed) / totalTime) * 100));
  //     // setBurnMalus(rdGameContext!.rewards.burnPercentage / 100);
  //   }
  //
  // }, [rdGameContext]);

  useEffect(() => {
    if (!!rewards?.data?.rewards) {
      setBurnMalus(rewards.data.rewards.currentBurnPercentage / 100);
    }
  }, [rewards]);

  return (
    <Box>
      {/*<Box>*/}
      {/*  <Text fontWeight='bold' fontSize='lg'>Current Season Progress ({seasonTimeRemaining}%)</Text>*/}
      {/*  <RdProgressBar current={seasonTimeRemaining} max={100} segments={3}/>*/}
      {/*</Box>*/}
      <Box mt={2}>
        <Text fontWeight='bold' fontSize='lg'>Karmic Debt ({round(burnMalus)}%)</Text>
        <RdProgressBar current={burnMalus} max={100} useGrid={false} fillColor='linear-gradient(to left, #B45402, #7D3500)' />
      </Box>
      <RdModalBox mt={4}>
        <Box textAlign='center'>
          Fortune rewards accumulate from Fortune staking, marketplace listings, and from playing the game and can be withdrawn at any time.
          Compound to an existing vault to multiply your rewards!
        </Box>
        {status === 'pending' ? (
          <Center py={4}>
            <Spinner />
          </Center>
        ) : status === "error" ? (
          <Center py={4}>
            <Text>Error: {(error as any).message}</Text>
          </Center>
        ) : (
          <>
            {!!rewards.data.rewards ? (
              <>
                <ClaimRow reward={rewards.data.rewards} burnMalus={burnMalus} onRefresh={refetch} />
              </>
            ) : (
              <Box mt={2}>
                <Text textAlign='center' fontSize={14}>You have no rewards to withdraw at this time.</Text>
              </Box>
            )}
          </>
        )}
      </RdModalBox>
      {!!rewards?.data.rewards && rewards.data.rewards.rewardsHistory.length > 0 && (
        <RewardsBreakdown rewardsHistory={rewards.data.rewards.rewardsHistory} />
      )}
    </Box>
  )
}

const RewardsBreakdown = ({rewardsHistory}: {rewardsHistory: any}) => {
  const useTable = useBreakpointValue(
    {base: false, sm: true},
    {fallback: 'sm'}
  )

  const mappings: {[key: string]: string} = {
    APR: 'APR',
  }

  const formatString = (str: string): string =>
    mappings[str] ?? str.replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char: string) => char.toUpperCase());

  return (
    <RdModalBox mt={4}>
      <Accordion allowToggle>
        <AccordionItem style={{borderWidth:'0'}}>
          {({ isExpanded }) => (
            <>
              <AccordionButton px={0}>
                <Flex justify='space-between' w='full' align='center'>
                  <Box>{isExpanded ? 'Hide' : 'View'} recent rewards</Box>
                  <Box ms={4}>
                    <AccordionIcon/>
                  </Box>
                </Flex>
              </AccordionButton>
              <AccordionPanel pb={0} px={1}>
                {useTable ? (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th ps={3}>Date</Th>
                        <Th>Type</Th>
                        <Th pe={3} isNumeric>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {rewardsHistory.map((reward: any) => (
                        <Tr key={reward.id}>
                          <Td py={1} ps={3}>{new Date(reward.timestamp).toLocaleString()}</Td>
                          <Td py={1} maxW={{sm: '140px', md: '180px', lg: '230px'}}>
                            <Box>{formatString(reward.type)}</Box>
                            {(!!reward.metadata?.type || !!reward.metadata?.name) && (
                              <Box fontSize='xs' color='#aaa' noOfLines={2}>({reward.metadata.type && <>{reward.metadata.type}: </>}{reward.metadata.name})</Box>
                            )}
                          </Td>
                          <Td py={1} pe={3} isNumeric>
                            <HStack justify='end'>
                              <Box>{round(reward.amount, 3)}</Box>
                              <FortuneIcon boxSize={4}/>
                            </HStack>
                            {reward.status === 'PENDING' && (
                              <Box fontStyle='italic' color='#aaa'>(Pending)</Box>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <>
                    {rewardsHistory.map((reward: any) => (
                      <Box my={3}>
                        <Flex direction='column'>
                          <HStack justify='space-between'>
                            <HStack justify='end'>
                              <FortuneIcon boxSize={4}/>
                              <Box>{commify(round(reward.amount, 3))}</Box>
                            </HStack>
                            <Tag variant='solid' alignSelf='end' size='sm'>{new Date(reward.timestamp).toLocaleString()}</Tag>
                          </HStack>
                          <Wrap justify='end' mt={1}>
                            <Tag py={1} size='sm' colorScheme={reward.status === 'PENDING' ? undefined : 'blue'} variant='solid'>{formatString(reward.type)}</Tag>
                            {reward.status === 'PENDING' && (
                              <Tag variant='solid' size='sm'>Pending</Tag>
                            )}
                          </Wrap>
                        </Flex>
                        {(!!reward.metadata?.type || !!reward.metadata?.name) && (
                          <Box color='#aaa' fontSize='xs'>({reward.metadata.type && <>{reward.metadata.type}: </>}{reward.metadata.name})</Box>
                        )}
                      </Box>
                    ))}
                  </>
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </RdModalBox>
  )
}

const ClaimRow = ({reward, burnMalus, onRefresh}: {reward: any, burnMalus: number, onRefresh: () => void}) => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const contractService = useContractService();
  const [executingClaim, setExecutingClaim] = useState(false);
  const [executingCompound, setExecutingCompound] = useState(false);
  const [executingCancelCompound, setExecutingCancelCompound] = useState(false);
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);
  const [existingAuthWarningOpenWithProps, setExistingAuthWarningOpenWithProps] = useState<{type: string, onCancel: () => void, onCancelComplete: () => void} | boolean>(false);
  const { config: chainConfig } = useAppChainConfig();
  const [targetChainConfig, setTargetChainConfig] = useState<AppChainConfig>(chainConfig);
  const rewardsContract = usePlatformRewardsContract(targetChainConfig.chain.id);
  const isCurrentSeason = rdGameContext?.season.blockId === reward.blockId;
  const queryClient = useQueryClient();
  const {requestSignature} = useEnforceSignature();
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { callWithGasPrice } = useCallWithGasPrice();
  const needsNetworkChange = activeChainId !== targetChainConfig.chain.id;

  const handleClaim = async (amountAsString: string, seasonId: number, force = false) => {
    try {
      setExecutingClaim(true);

      await handleSyncNetwork();

      onCloseConfirmation();
      const flooredAmount = Math.floor(Number(amountAsString));

      const signature = await requestSignature();
      const pendingAuths = await ApiService.withoutKey().ryoshiDynasties.getPendingFortuneAuthorizations(user.address!, signature);

      const pendingCompound = pendingAuths.rewards.find((auth: any) => auth.type === 'COMPOUND' && moment().diff(moment(auth.timestamp), 'minutes') < 5);
      const pendingClaim = pendingAuths.rewards.find((auth: any) => auth.type === 'WITHDRAWAL' && moment().diff(moment(auth.timestamp), 'minutes') < 5);
      const mustCancelClaim = !!pendingClaim && pendingClaim.seasonId !== seasonId;

      if (!force && (pendingCompound || mustCancelClaim)) {
        setExistingAuthWarningOpenWithProps({
          type: !!pendingClaim ? 'CLAIM' : 'COMPOUND',
          onCancel: async () => {
            if (pendingClaim) await handleCancelClaim(pendingClaim.chainId);
            else await handleCancelCompound(Number(pendingCompound.vaultIndex), pendingCompound.chainId);
          },
          onCancelComplete: () => {
            setExistingAuthWarningOpenWithProps(false);
            handleClaim(amountAsString, seasonId, true);
          }
        });
        return;
      }

      const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, flooredAmount, signature, targetChainConfig.chain.id)
      const tx = await callWithGasPrice(rewardsContract, 'withdraw', [auth.data.reward, auth.data.signature]);

      queryClient.setQueryData(
        ['BankSeasonalRewards', user.address],
        (oldData: any) => {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              rewards: {
                ...oldData.data.rewards,
                currentRewards: '0'
              }
            }
          }
        }
      );

      toast.success(createSuccessfulTransactionToastContent(tx?.hash, targetChainConfig.chain.id));
    } catch (e: any) {
      console.log(e);
      Sentry.captureException(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingClaim(false);
    }
  }

  const handleCancelClaim = async (chainId: number) => {
    try {
      setExecutingClaim(true);

      await handleSyncNetwork();

      const flooredAmount = Math.floor(Number(reward.currentRewards));
      const signature = await requestSignature();
      const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, flooredAmount, signature, chainId)
      if (auth) {
        const tx = await callWithGasPrice(rewardsContract, 'cancelWithdraw', [auth.data.reward, auth.data.signature]);
        toast.success(createSuccessfulTransactionToastContent(tx?.hash, targetChainConfig.chain.id));
      }
    }
    // catch (e) {
    //   console.log(e);
    // }
    finally {
      setExecutingClaim(false);
    }
  }

  const handleCompound = async (vault: FortuneStakingAccount, seasonId: number, force = false, chainId: SupportedChainId) => {
    try {
      setExecutingCompound(true);

      if (activeChainId !== chainId) {
        await switchNetworkAsync(chainId);
        return;
      }

      const flooredAmount = convertToNumberAndRoundDown(reward.currentRewards);

      const signature = await requestSignature();
      const pendingAuths = await ApiService.withoutKey().ryoshiDynasties.getPendingFortuneAuthorizations(user.address!, signature);
      const pendingCompound = pendingAuths.rewards.find((auth: any) => auth.type === 'COMPOUND' && moment().diff(moment(auth.timestamp), 'minutes') < 5);
      const pendingClaim = pendingAuths.rewards.find((auth: any) => auth.type === 'WITHDRAWAL' && moment().diff(moment(auth.timestamp), 'minutes') < 5);
      const mustCancelCompound = !!pendingCompound && Number(pendingCompound.vaultIndex) !== Number(vault.index);

      if (!force && (pendingClaim || mustCancelCompound)) {
        setExistingAuthWarningOpenWithProps({
          type: !!pendingClaim ? 'CLAIM' : 'COMPOUND',
          onCancel: async () => {
            if (pendingClaim) await handleCancelClaim(pendingClaim.chainId);
            else await handleCancelCompound(vault.index, pendingCompound.chainId);
          },
          onCancelComplete: () => {
            setExistingAuthWarningOpenWithProps(false);
            handleCompound(vault, seasonId, true, chainId);
          }
        });
        return;
      }

      const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsCompoundAuthorization(user.address!, flooredAmount, vault.index, signature, chainId)
      const tx = await callWithGasPrice(rewardsContract, 'compound', [auth.data.reward, auth.data.signature]);

      queryClient.setQueryData(
        ['BankSeasonalRewards', user.address],
      (oldData: any) => {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              rewards: {
                ...oldData.data.rewards,
                currentRewards: '0'
              }
            }
          }
        }
      );

      toast.success(createSuccessfulTransactionToastContent(tx?.hash, chainId));
    } catch (e) {
      console.log(e);
      Sentry.captureException(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingCompound(false);
    }
  }

  const handleCancelCompound = async (vaultIndex: number, chainId: number) => {
    try {
      setExecutingCancelCompound(true);
      const flooredAmount = convertToNumberAndRoundDown(reward.currentRewards);

      const signature = await requestSignature();
      const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsCompoundAuthorization(user.address!, flooredAmount, vaultIndex, signature, chainId)
      if (auth) {
        const tx = await callWithGasPrice(rewardsContract, 'cancelCompound', [auth.data.reward, auth.data.signature]);
        toast.success(createSuccessfulTransactionToastContent(tx?.hash, chainId));
      }
    }
    // catch (e) {
    //   console.log(e);
    // }
    finally {
      setExecutingCancelCompound(false);
    }
  }

  const handleChangeTargetChain = (chainId: SupportedChainId) => {
    const _targetChainConfig = getAppChainConfig(chainId);
    setTargetChainConfig(_targetChainConfig);
  }

  // Syncs wallet network to target network
  const handleSyncNetwork = async () => {
    if (needsNetworkChange) {
      await switchNetworkAsync(targetChainConfig.chain.id);
    }
  }

  return (
    <>
      <CurrentSeasonRecord
        reward={reward}
        onClaim={onOpenConfirmation}
        isExecutingClaim={executingClaim}
        onCompound={handleCompound}
        isExecutingCompound={executingCompound || executingCancelCompound}
      />

      <PendingAuthorizationWarningDialog
        isOpen={!!existingAuthWarningOpenWithProps}
        onClose={() => setExistingAuthWarningOpenWithProps(false)}
        type={(existingAuthWarningOpenWithProps as any)!.type}
        onExecuteCancel={(existingAuthWarningOpenWithProps as any)!.onCancel}
        onCancelComplete={(existingAuthWarningOpenWithProps as any)!.onCancelComplete}
      />

      <RdModal
        isOpen={isConfirmationOpen}
        onClose={onCloseConfirmation}
        title='Confirm'
      >
        <RdModalAlert>
          {burnMalus === 100 ? (
            <Text>Error: Karmic Debt is at <Text as='span' color='#FDAB1A' fontWeight='bold'>100%</Text>. You will not be able to claim any FRTN at this time.</Text>
          ) : burnMalus === 0 ? (
            <Text>You can now claim the full amount of <Text as='span' color='#FDAB1A' fontWeight='bold'>{commify(round(Number(reward.currentRewards) * (1 - burnMalus / 100), 3))} FRTN</Text></Text>
          ) : (
            <Text>Warning: Claiming from the current season is subject to a {round(burnMalus)}% Karmic Debt <strong>burn</strong> of <strong>{round(Number(reward.currentRewards) * burnMalus / 100, 3)} FRTN</strong>. You will only be able to claim <Text as='span' color='#FDAB1A' fontWeight='bold'>{round(Number(reward.currentRewards) * (1 - burnMalus / 100), 3)} FRTN</Text></Text>
          )}
        </RdModalAlert>
        <RdModalFooter>
          {burnMalus === 100 ? (
            <Box textAlign='center'>
              <RdButton
                onClick={onCloseConfirmation}
                size='md'
              >
                Close
              </RdButton>
            </Box>
          ) : (
            <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
              <HStack justify='center' mb={{base: 2, sm: 0}}>
                <ButtonGroup isAttached variant='outline'>
                  {SUPPORTED_RD_CHAIN_CONFIGS.map(({name, chain}) => (
                    <IconButton
                      key={chain.id}
                      aria-label={chain.name}
                      icon={<ChainLogo chainId={chain.id} />}
                      isActive={targetChainConfig.chain.id === chain.id}
                      onClick={() => handleChangeTargetChain(chain.id)}
                    />
                  ))}
                </ButtonGroup>
                <VStack fontSize='sm' align='start' spacing={0}>
                  <Box>Claim To</Box>
                  <Box fontWeight='semibold'>{targetChainConfig.name}</Box>
                </VStack>
              </HStack>
              <Stack justify='center' direction='row' spacing={6}>
                {needsNetworkChange ? (
                  <RdButton
                    onClick={handleSyncNetwork}
                    size='md'
                  >
                    Switch Network
                  </RdButton>
                ) : (
                  <>
                    <RdButton
                      onClick={onCloseConfirmation}
                      size='md'
                    >
                      Cancel
                    </RdButton>
                    <RdButton
                      onClick={() => handleClaim(reward.currentRewards, Number(reward.seasonId))}
                      size='md'
                    >
                      Confirm
                    </RdButton>
                  </>
                )}
              </Stack>
            </Stack>
          )}
        </RdModalFooter>
      </RdModal>
    </>
  )
}
export default FortuneRewardsTab;

const CurrentSeasonRecord = ({reward, onClaim, isExecutingClaim, onCompound, isExecutingCompound}: SeasonRecordProps) => {
  const user = useUser();
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVaultIndex, setSelectedVaultIndex] = useState(0);
  const [feeCompoundVaults, setFeeCompoundVaults] = useState<any[]>([]);
  const [noFeeCompoundVaults, setNoFeeCompoundVaults] = useState<any[]>([]);

  const sortRule = (a: FortuneStakingAccount, b: FortuneStakingAccount) => Number(b.endTime) - Number(a.endTime);

  const { data: accounts, status, error, refetch } = useQuery({
    queryKey: ['UserStakeAccount', user.address],
    queryFn: async () => {
      const accountsByChain = [];
      for (const chainConfig of SUPPORTED_RD_CHAIN_CONFIGS) {
        const account = await ApiService.forChain(chainConfig.chain.id).ryoshiDynasties.getBankStakingAccount(user.address!);
        if (!account) continue;

        accountsByChain.push({
          chain: {
            id: chainConfig.chain.id as SupportedChainId,
            name: chainConfig.name
          },
          vaults: account.vaults.filter((vault) => {
            const endTime = vault.endTime * 1000;
            const now = Date.now();
            const threshold = 60*60*24*90*1000; // 90 days
            return vault.open && endTime - now >= threshold;
          }).sort(sortRule)
        });
      }

      return accountsByChain;
    },
    enabled: !!user.address,
  });

  const handleExpandCompound = useCallback(async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    setIsExpanded(true);
  }, [isExpanded]);

  const handleSelectVault = useCallback(async (vault: any, chainId: SupportedChainId) => {
    setSelectedVaultIndex(vault.index);
    onCompound(vault, Number(reward.seasonId), false, chainId);
  }, [onCompound]);

  // useEffect(() => {
  //   const sortRule = (a: FortuneStakingAccount, b: FortuneStakingAccount) => Number(b.endTime) - Number(a.endTime);
  //
  //   // setFeeCompoundVaults(account?.vaults.filter((vault) => {
  //   //   const endTime = vault.endTime * 1000;
  //   //   const now = Date.now();
  //   //   const threshold = 60*60*24*90*1000; // 90 days
  //   //   return vault.open && endTime - now < threshold && endTime - now > 0;
  //   // }).sort(sortRule) || []);
  //
  //   setNoFeeCompoundVaults(account?.vaults.filter((vault) => {
  //     const endTime = vault.endTime * 1000;
  //     const now = Date.now();
  //     const threshold = 60*60*24*90*1000; // 90 days
  //     return vault.open && endTime - now >= threshold;
  //   }).sort(sortRule) || []);
  // }, [account]);

  return (
    <Accordion index={isExpanded ? [0] : undefined} allowToggle>
      <AccordionItem style={{borderWidth:'0'}}>
        <Flex justify='space-between' mt={2} direction={{base: 'column', md: 'row'}}>
          <VStack align='start' spacing={0}>
            <Text fontSize='xl' fontWeight='bold'>
              Current Rewards
            </Text>
            <HStack>
              <FortuneIcon boxSize={6} />
              <Text fontSize='lg' fontWeight='bold'>{round(convertToNumberAndRoundDown(reward.currentRewards), 3)}</Text>
              <Text as='span' ms={1} fontSize='sm' color="#aaa">~${round((fortunePrice ? Number(fortunePrice.usdPrice) : 0) * reward.currentRewards, 2)}</Text>
            </HStack>
            {reward.currentRewards === reward.totalRewards && (
              <Text fontSize='sm' color='#aaa'>{round(reward.aprRewards, 3)} staking + {round(reward.listingRewards, 3)} listing rewards</Text>
            )}
          </VStack>
          <Flex direction='column' mt={{base: 2, md: 0}}>
            <Spacer />
            <Stack direction={{base: 'column', sm: 'row'}}>
              <RdButton
                size='sm'
                w='full'
                onClick={onClaim}
                isLoading={isExecutingClaim}
                loadingText='Claiming...'
              >
                Claim
              </RdButton>
              {!isExecutingClaim && (
                <AccordionButton w='full' p={0}>
                  <RdButton
                    w='full'
                    size='sm'
                    onClick={handleExpandCompound}
                  >
                    Compound
                  </RdButton>
                </AccordionButton>
              )}
            </Stack>
            <Spacer />
          </Flex>
        </Flex>
        <AccordionPanel>
          {!!accounts && accounts.length > 0 && reward.canCompound ? (
            <>
              <Box mb={2}>
                <Box fontWeight='bold'>Compound to Vault</Box>
                <Box fontSize='sm' color="#aaa">Only vaults that expire later than 90 days are eligible for compounding and will cost zero Karmic Debt</Box>
              </Box>
              <VStack align='stretch'>
                {accounts.map((account) => (
                  <>
                    <HStack mt={2}>
                      <ChainLogo chainId={account.chain.id} width={24} height={24} />
                      <Box>{account.chain.name}</Box>
                    </HStack>
                    {account.vaults.length > 0 ? (
                      <SimpleGrid columns={{base: 2, sm: 3, md: 4}} gap={4}>
                        {account.vaults.map((vault) => (
                          <Box
                            key={vault.index}
                            height='full'
                            w='full'
                            p={2}
                            bg='whiteAlpha.200'
                            rounded='md'
                          >
                            <VStack w='full' align='start'>
                              <Box textAlign='center' w='full' mb={2} fontWeight='bold' fontSize='lg'>
                                Vault {Number(vault.index) + 1}
                              </Box>
                              <Grid templateColumns='26px 1fr' w='full' fontSize='xs' fontWeight='normal' gap={2}>
                                <GridItem textAlign='start'>
                                  <FortuneIcon boxSize={4} />
                                </GridItem>
                                <GridItem textAlign='end'>
                                  <Box as='span'>{commify(round(Number(ethers.utils.formatEther(vault.balance))))}</Box>
                                </GridItem>
                                <GridItem textAlign='start'>
                                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={4}/>
                                </GridItem>
                                <GridItem textAlign='end'>
                                  <Box as='span'>{Math.floor(((Number(ethers.utils.formatEther(vault.balance)) * Number(vault.length / (86400)) / 1080) / rdConfig.bank.staking.fortune.mitamaTroopsRatio))}</Box>
                                </GridItem>
                                <GridItem textAlign='start'>
                                  Exp:
                                </GridItem>
                                <GridItem textAlign='end'>
                                  <Box as='span'>{timeSince(vault.endTime)}</Box>
                                </GridItem>
                              </Grid>
                            </VStack>
                            <Button
                              size='sm'
                              mt={1}
                              w='full'
                              variant='outline'
                              onClick={() => handleSelectVault(vault, account.chain.id)}
                              isLoading={isExecutingCompound && selectedVaultIndex === vault.index}
                              isDisabled={(isExecutingCompound && selectedVaultIndex === vault.index) || reward.currentRewards < 1}
                            >
                              Choose
                            </Button>
                          </Box>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Text align='center' color='#aaa'>No vaults found</Text>
                    )}
                  </>
                ))}
              </VStack>
            </>
          ) : !reward.canCompound && +reward.currentRewards < 1 ? (
            <Text align='center'>No rewards to compound</Text>
          ) : !reward.canCompound ? (
            <Text align='center'>Compound cooldown reached. Compound again in {timeSince(reward.nextCompound * 1000)}</Text>
          ) : (
            <Text align='center'>No vaults found. Create a $Fortune vault from the Bank screen and then use the vault here to start compounding</Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

interface SeasonRecordProps {
  reward: any;
  onClaim: () => void;
  isExecutingClaim: boolean;
  onCompound: (vault: FortuneStakingAccount, seasonId: number, force: boolean, chainId: SupportedChainId) => void;
  isExecutingCompound?: boolean;
}

interface VaultIndexWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCancel: () => Promise<void>;
  onCancelComplete: () => void;
  type: 'CLAIM' | 'COMPOUND';
}

const PendingAuthorizationWarningDialog = ({isOpen, onClose, onExecuteCancel, onCancelComplete, type}: VaultIndexWarningDialogProps) => {
  const [executingCancel, setExecutingCancel] = useState(false);

  const handleExecuteCancel = async () => {
    try {
      setExecutingCancel(true);
      await onExecuteCancel();
      onCancelComplete();
    } finally {
      setExecutingCancel(false);
    }
  }

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Confirm'
    >
      <RdModalAlert>
        <Text>There is currently a pending {type === 'CLAIM' ? 'claim' : 'compound'}. This must be cancelled before proceeding. Press the <strong>Confirm</strong> button below to continue.</Text>
        <Text mt={2}>Alternatively, you can close this dialog and wait 5 minutes before requesting again.</Text>
      </RdModalAlert>
      <RdModalFooter>
        <Stack justify='center' direction='row' spacing={6}>
          {!executingCancel && (
            <RdButton
              onClick={onClose}
              size='lg'
            >
              Cancel
            </RdButton>
          )}
          <RdButton
            onClick={handleExecuteCancel}
            size='lg'
            isLoading={executingCancel}
            isDisabled={executingCancel}
            loadingText='Confirming'
          >
            Confirm
          </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}

// Round down decimals so that user can't claim more than they have
function convertToNumberAndRoundDown(numStr: string): number {
  const precision = 13; // the precision you want to keep
  const parts = numStr.split('.');
  if (parts.length === 2 && parts[1].length > precision) {
    parts[1] = parts[1].substring(0, precision);
    numStr = parts.join('.');
  }
  return Number(numStr);
}