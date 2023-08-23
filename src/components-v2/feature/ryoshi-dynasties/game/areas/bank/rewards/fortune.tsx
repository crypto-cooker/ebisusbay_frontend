import {useAppSelector} from "@src/Store/hooks";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ApiService} from "@src/core/services/api-service";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import RdButton from "../../../../components/rd-button";
import React, {useCallback, useContext, useEffect, useState} from "react";
import RdProgressBar from "@src/components-v2/feature/ryoshi-dynasties/components/rd-progress-bar";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {round, timeSince} from "@src/utils";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useFortunePrice} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {ethers} from "ethers";
import {commify} from "ethers/lib/utils";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";

const config = appConfig();

const FortuneRewardsTab = () => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);
  const [seasonTimeRemaining, setSeasonTimeRemaining] = useState(0);
  const [burnMalus, setBurnMalus] = useState(0);

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

  useEffect(() => {
    if (rdGameContext) {
      const totalTime = Date.parse(rdGameContext.season.endAt) - Date.parse(rdGameContext.season.startAt);
      const currentElapsed = Date.parse(rdGameContext.season.endAt) - Date.now();
      setSeasonTimeRemaining(Math.floor(((totalTime - currentElapsed) / totalTime) * 100));
      setBurnMalus(rdGameContext!.rewards.burnPercentage / 100);
    }

  }, [rdGameContext]);

  return (
    <Box>
      <Box>
        <Text fontWeight='bold' fontSize='lg'>Current Season Progress ({seasonTimeRemaining}%)</Text>
        <RdProgressBar current={seasonTimeRemaining} max={100} segments={3}/>
      </Box>
      <Box mt={2}>
        <Text fontWeight='bold' fontSize='lg'>Karmic Debt ({round(burnMalus)}%)</Text>
        <RdProgressBar current={burnMalus} max={100} useGrid={false} fillColor='linear-gradient(to left, #B45402, #7D3500)' />
      </Box>
      <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
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
                    <ClaimRow reward={reward} burnMalus={burnMalus} onRefresh={refetch}/>
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
    </Box>
  )
}

const ClaimRow = ({reward, burnMalus, onRefresh}: {reward: any, burnMalus: number, onRefresh: () => void}) => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [executingClaim, setExecutingClaim] = useState(false);
  const [executingCompound, setExecutingCompound] = useState(false);
  const [executingCancelCompound, setExecutingCancelCompound] = useState(false);
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);
  const [existingAuthWarningOpenWithProps, setExistingAuthWarningOpenWithProps] = useState<{type: string, onCancel: () => void, onCancelComplete: () => void} | boolean>(false);

  const isCurrentSeason = rdGameContext?.season.blockId === reward.blockId;
  const queryClient = useQueryClient();

  const handleClaim = async (amountAsString: string, seasonId: number, force = false) => {
    try {
      setExecutingClaim(true);
      onCloseConfirmation();
      const flooredAmount = Math.floor(Number(amountAsString));

      let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        const pendingAuths = await ApiService.withoutKey().ryoshiDynasties.getPendingFortuneAuthorizations(user.address!, signatureInStorage);
        const pendingCompound = pendingAuths.rewards.find((auth: any) => auth.type === 'COMPOUND');
        const pendingClaim = pendingAuths.rewards.find((auth: any) => auth.type === 'WITHDRAWAL');;
        const mustCancelClaim = !!pendingClaim && pendingClaim.seasonId !== seasonId;

        if (!force && (pendingCompound || mustCancelClaim)) {
          setExistingAuthWarningOpenWithProps({
            type: !!pendingClaim ? 'CLAIM' : 'COMPOUND',
            onCancel: async () => {
              if (pendingClaim) await handleCancelClaim(pendingClaim.seasonId);
              else await handleCancelCompound(Number(pendingCompound.vaultIndex), pendingCompound.seasonId);
            },
            onCancelComplete: () => {
              setExistingAuthWarningOpenWithProps(false);
              handleClaim(amountAsString, seasonId, true);
            }
          });
          return;
        }

        const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, flooredAmount, seasonId, signatureInStorage)
        const tx = await user.contractService?.ryoshiPlatformRewards.withdraw(auth.data.reward, auth.data.signature);
        await tx.wait();

        queryClient.setQueryData(
          ['BankSeasonalRewards', user.address],
          (oldData: any) => {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                rewards: oldData.data.rewards.map((reward: any) => {
                  if (reward.seasonId === seasonId) {
                    return {
                      ...reward,
                      currentRewards: '0'
                    }
                  }
                  return reward;
                })
              }
            }
          }
        );

        toast.success('Withdraw success!');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setExecutingClaim(false);
    }
  }

  const handleCancelClaim = async (seasonId: number) => {
    try {
      setExecutingClaim(true);
      const flooredAmount = Math.floor(Number(reward.currentRewards));

      let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(user.address!, flooredAmount, seasonId, signatureInStorage)
        const tx = await user.contractService?.ryoshiPlatformRewards.withdraw(auth.data.reward, auth.data.signature);
        await tx.wait();
        toast.success('Previous request cancelled');
      }
    }
    // catch (e) {
    //   console.log(e);
    // }
    finally {
      setExecutingClaim(false);
    }
  }

  const handleCompound = async (vault: FortuneStakingAccount, seasonId: number, force = false) => {
    try {
      setExecutingCompound(true);
      const flooredAmount = convertToNumberAndRoundDown(reward.currentRewards);

      let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        const pendingAuths = await ApiService.withoutKey().ryoshiDynasties.getPendingFortuneAuthorizations(user.address!, signatureInStorage);
        const pendingCompound = pendingAuths.rewards.find((auth: any) => auth.type === 'COMPOUND');
        const pendingClaim = pendingAuths.rewards.find((auth: any) => auth.type === 'WITHDRAWAL');
        const mustCancelCompound = !!pendingCompound && Number(pendingCompound.vaultIndex) !== Number(vault.index);

        if (!force && (pendingClaim || mustCancelCompound)) {
          setExistingAuthWarningOpenWithProps({
            type: !!pendingClaim ? 'CLAIM' : 'COMPOUND',
            onCancel: async () => {
              if (pendingClaim) await handleCancelClaim(pendingClaim.seasonId);
              else await handleCancelCompound(vault.index, pendingCompound.seasonId);
            },
            onCancelComplete: () => {
              setExistingAuthWarningOpenWithProps(false);
              handleCompound(vault, seasonId, true);
            }
          });
          return;
        }

        const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsCompoundAuthorization(user.address!, flooredAmount, seasonId, vault.index, signatureInStorage)

        const tx = await user.contractService?.ryoshiPlatformRewards.compound(auth.data.reward, auth.data.signature);
        await tx.wait();

        queryClient.setQueryData(
          ['BankSeasonalRewards', user.address],
        (oldData: any) => {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                rewards: oldData.data.rewards.map((reward: any) => {
                  if (reward.seasonId === seasonId) {
                    return {
                      ...reward,
                      currentRewards: '0'
                    }
                  }
                  return reward;
                })
              }
            }
          }
        );

        toast.success('Compound complete!');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setExecutingCompound(false);
    }
  }

  const handleCancelCompound = async (vaultIndex: number, seasonId: number) => {
    try {
      setExecutingCancelCompound(true);
      const flooredAmount = convertToNumberAndRoundDown(reward.currentRewards);

      let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        const auth = await ApiService.withoutKey().ryoshiDynasties.requestSeasonalRewardsCompoundAuthorization(user.address!, flooredAmount, seasonId, vaultIndex, signatureInStorage)
        const tx = await user.contractService?.ryoshiPlatformRewards.cancelCompound(auth.data.reward, auth.data.signature);
        await tx.wait();
        toast.success('Previous request cancelled');
      }
    }
    // catch (e) {
    //   console.log(e);
    // }
    finally {
      setExecutingCancelCompound(false);
    }
  }

  return (
    <>
      {isCurrentSeason ? (
        <>
          <CurrentSeasonRecord
            reward={reward}
            onClaim={onOpenConfirmation}
            isExecutingClaim={executingClaim}
            onCompound={handleCompound}
            isExecutingCompound={executingCompound || executingCancelCompound}
          />
        </>
      ) : (
        <SeasonRecord
          reward={reward}
          onClaim={() => handleClaim(reward.currentRewards, Number(reward.seasonId))}
          isExecutingClaim={executingClaim}
          onCompound={handleCompound}
        />
      )}

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
          <Text>Warning: Claiming from the current season is subject to a {round(burnMalus)}% Karmic Debt <strong>burn</strong> of <strong>{round(Number(reward.currentRewards) * burnMalus / 100, 3)} FRTN</strong>. At this point in the season, you will only be able to claim <Text as='span' color='#FDAB1A' fontWeight='bold'>{round(Number(reward.currentRewards) * (1 - burnMalus / 100), 3)} FRTN</Text></Text>
        </RdModalAlert>
        <RdModalFooter>
          <Stack justify='center' direction='row' spacing={6}>
            <RdButton
              onClick={onCloseConfirmation}
              size='lg'
            >
              Cancel
            </RdButton>
            <RdButton
              onClick={() => handleClaim(reward.currentRewards, Number(reward.seasonId))}
              size='lg'
            >
              Confirm
            </RdButton>
          </Stack>
        </RdModalFooter>
      </RdModal>
    </>
  )
}
export default FortuneRewardsTab;

const CurrentSeasonRecord = ({reward, onClaim, isExecutingClaim, onCompound, isExecutingCompound}: SeasonRecordProps) => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVaultIndex, setSelectedVaultIndex] = useState(0);
  const [feeCompoundVaults, setFeeCompoundVaults] = useState<any[]>([]);
  const [noFeeCompoundVaults, setNoFeeCompoundVaults] = useState<any[]>([]);

  const { data: account, status, error, refetch } = useQuery(
    ['UserStakeAccount', user.address],
    () => ApiService.withoutKey().ryoshiDynasties.getBankStakingAccount(user.address!),
    {
      enabled: !!user.address,
    }
  )

  const handleExpandCompound = useCallback(async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    setIsExpanded(true);
  }, [isExpanded]);

  const handleSelectVault = useCallback(async (vault: any) => {
    setSelectedVaultIndex(vault.index);
    onCompound(vault, Number(reward.seasonId));
  }, [onCompound]);

  useEffect(() => {
    const sortRule = (a: FortuneStakingAccount, b: FortuneStakingAccount) => Number(b.endTime) - Number(a.endTime);

    setFeeCompoundVaults(account?.vaults.filter((vault) => {
      const endTime = vault.endTime * 1000;
      const now = Date.now();
      const threshold = 60*60*24*90*1000; // 90 days
      return vault.open && endTime - now < threshold && endTime - now > 0;
    }).sort(sortRule) || []);

    setNoFeeCompoundVaults(account?.vaults.filter((vault) => {
      const endTime = vault.endTime * 1000;
      const now = Date.now();
      const threshold = 60*60*24*90*1000; // 90 days
      return vault.open && endTime - now >= threshold;
    }).sort(sortRule) || []);
  }, [account]);

  return (
    <Accordion index={isExpanded ? [0] : undefined} allowToggle>
      <AccordionItem style={{borderWidth:'0'}}>
        <Flex justify='space-between' mt={2}>
          <VStack align='start' spacing={0}>
            <Text fontSize='xl' fontWeight='bold'>
              Current Season
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
          <Flex direction='column'>
            <Spacer />
            <Stack direction={{base: 'column', sm: 'row'}}>
              {!isExecutingClaim && (
                <AccordionButton w='full' p={0}>
                  <RdButton
                    size='sm'
                    onClick={handleExpandCompound}
                  >
                    Compound
                  </RdButton>
                </AccordionButton>
              )}
              <Flex direction='column'>
                <Spacer />
                <RdButton
                  size='sm'
                  onClick={onClaim}
                  isLoading={isExecutingClaim}
                  loadingText='Claiming...'
                >
                  Claim
                </RdButton>
                <Spacer />
              </Flex>
            </Stack>
            <Spacer />
          </Flex>
        </Flex>
        <AccordionPanel>
          {!!account && account.vaults.length > 0 ? (
            <>
              <Box mb={2}>
                <Box fontWeight='bold'>No Fee Vaults</Box>
                <Box fontSize='sm' color="#aaa">Compounding to vaults that expire later than 90 days will cost zero Karmic Debt</Box>
              </Box>
              {noFeeCompoundVaults.length > 0 ? (
                <SimpleGrid columns={{base: 2, sm: 3, md: 4}} gap={4}>
                  {noFeeCompoundVaults.map((vault, index) => (
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
                        onClick={() => handleSelectVault(vault)}
                        isLoading={isExecutingCompound && selectedVaultIndex === vault.index}
                        isDisabled={isExecutingCompound && selectedVaultIndex === vault.index}
                      >
                        Choose
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Text align='center' color='#aaa'>No vaults found</Text>
              )}
              <Box my={2}>
                <Box fontWeight='bold'>Karmic Debt Vaults</Box>
                <Box fontSize='sm' color="#aaa">Compounding to vaults that expire sooner than 90 days are still subject to Karmic Debt</Box>
              </Box>
              {feeCompoundVaults.length > 0 ? (
                <SimpleGrid columns={{base: 2, sm: 3, md: 4}} gap={4}>
                  {feeCompoundVaults.map((vault, index) => (
                    <Box
                      key={vault.index}
                      height='full'
                      w='full'
                      p={2}
                      bg='whiteAlpha.200'
                      rounded='md'
                    >
                      <VStack w='full' align='start'>
                        <Box textAlign='center' w='full' mb={2}>
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
                        onClick={() => handleSelectVault(vault)}
                        isLoading={isExecutingCompound && selectedVaultIndex === vault.index}
                        isDisabled={isExecutingCompound && selectedVaultIndex === vault.index}
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
  onCompound: (vault: FortuneStakingAccount, seasonId: number) => void;
  isExecutingCompound?: boolean;
}

const SeasonRecord = ({reward, onClaim, isExecutingClaim}: SeasonRecordProps) => {
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);

  return (
    <Flex justify='space-between' mt={2}>
      <VStack align='start' spacing={0}>
        <Text fontSize='xl' fontWeight='bold'>
          {`Season ${reward.blockId}`}
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
      <Flex direction='column'>
        <Spacer />
        <Stack direction='row'>
          <RdButton
            size='sm'
            onClick={onClaim}
            isLoading={isExecutingClaim}
            loadingText='Claiming...'
          >
            Claim
          </RdButton>
        </Stack>
        <Spacer />
      </Flex>
    </Flex>
  )
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
  const [_, getSigner] = useCreateSigner();

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
        <Text>There is currently a pending {type === 'CLAIM' ? 'claim' : 'compound'}. This must be cancelled before proceeding. Press the <strong>Confirm</strong> button below to continue</Text>
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