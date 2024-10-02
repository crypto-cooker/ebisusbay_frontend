import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
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
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  VStack
} from "@chakra-ui/react"
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {commify} from "ethers/lib/utils";
import moment from 'moment';

//contracts
import {ethers} from "ethers";
import {appConfig} from "@src/config";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, round} from '@market/helpers/utils';
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import {ApiService} from "@src/core/services/api-service";
import {useQuery} from "@tanstack/react-query";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {parseErrorMessage} from "@src/helpers/validator";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGem} from "@fortawesome/free-solid-svg-icons";
import {useUser} from "@src/components-v2/useUser";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {SUPPORTED_RD_CHAIN_CONFIGS, SupportedChainId} from "@src/config/chains";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useBankContract} from "@src/global/hooks/contracts";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {ChainId} from "@pancakeswap/chains";
import VaultSummary from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/vault-summary";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";

const config = appConfig();

interface StakePageProps {
  onEditVault: (vault: FortuneStakingAccount, type: string) => void;
  onCreateVault: (vaultIndex: number, vaultType: VaultType) => void;
  onWithdrawVault: (vault: FortuneStakingAccount) => void;
  onTokenizeVault: (vault: FortuneStakingAccount) => void;
  initialChainId: SupportedChainId;
  onUpdateChainContext: (chainId: SupportedChainId) => void;
  onUpdateVaultContext: (vaultType: VaultType) => void;
}

const StakePage = ({onEditVault, onCreateVault, onWithdrawVault, onTokenizeVault, initialChainId, onUpdateChainContext, onUpdateVaultContext}: StakePageProps) => {
  const user = useUser();
  const [currentTab, setCurrentTab] = useState<SupportedChainId>(initialChainId);
  const [currentVaultType, setCurrentVaultType] = useState<VaultType>(VaultType.TOKEN);

  const { data: account, status, error, refetch } = useQuery({
    queryKey: ['UserStakeAccount', user.address, currentTab],
    queryFn: () => ApiService.forChain(currentTab).ryoshiDynasties.getBankStakingAccount(user.address!),
    enabled: !!user.address && !!currentTab,
  });

  const [vaultGroup, setVaultGroup] = useState<any>(account?.vaults);

  const handleConnect = async () => {
    user.connect();
  }

  const handleTabChange = useCallback((chainId: SupportedChainId) => {
    setCurrentTab(chainId);
    handleVaultTypeChange(VaultType.TOKEN);
    onUpdateChainContext(chainId);
  }, []);

  const handleVaultTypeChange = useCallback((vaultType: VaultType) => {
    setVaultGroup(vaultType === VaultType.LP ? account?.lpVaults : account?.vaults);
    setCurrentVaultType(vaultType);
    onUpdateVaultContext(vaultType)
  }, [account]);

  const handleCreateVault = useCallback((vaultIndex: number, vaultType: VaultType) => {
    onCreateVault(vaultIndex, vaultType);
  }, []);

  // Set initial vaultGroup state if account query initially returns undefined
  useEffect(() => {
    if (!vaultGroup && !!account) {
      setVaultGroup(account.vaults)
    }
  }, [account]);

  return (
    <>
      <Box mx={1} pb={6}>
        {!!user.address ? (
          <>
            <Text align='center' pt={2} py={2} fontSize='sm'>Stake Fortune and Fortune LPs to earn $FRTN and receive troops for battle. Stake more to receive more troops and higher APRs.</Text>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={2}>
                {SUPPORTED_RD_CHAIN_CONFIGS.map(({name, chain}) => (
                  <RdTabButton key={chain.id} isActive={currentTab === chain.id} onClick={() => handleTabChange(chain.id)}>
                    {name}
                  </RdTabButton>
                ))}
              </SimpleGrid>
            </Flex>
            <Box mt={4}>
              {status === 'pending' ? (
                <Center>
                  <Spinner size='lg' />
                </Center>
              ) : status === 'error' ? (
                <Center>
                  <Text>{(error as any).message}</Text>
                </Center>
              ) : (
                <>
                  <HStack justify='end' align='center' fontSize='sm'>
                    <Box>Vault Type</Box>
                    <ButtonGroup isAttached variant='outline' size='sm'>
                      <Button
                        aria-label='Fortune Token Vaults'
                        isActive={currentVaultType === VaultType.TOKEN}
                        onClick={() => handleVaultTypeChange(VaultType.TOKEN)}
                      >
                        Token
                      </Button>
                      <Button
                        aria-label='Fortune LP Vaults'
                        isActive={currentVaultType === VaultType.LP}
                        onClick={() => handleVaultTypeChange(VaultType.LP)}
                      >
                        LP
                      </Button>
                    </ButtonGroup>
                  </HStack>
                  {!!vaultGroup && vaultGroup.length > 0 ? (
                    <>
                      <Accordion defaultIndex={[0]} allowToggle>
                        {vaultGroup.map((vault, index) => (
                          <Box key={`${currentTab}${vault.vaultId}`} mt={2}>
                            <VaultSummary
                              vault={vault}
                              vaultType={currentVaultType}
                              index={index}
                              onEditVault={(type: string) => onEditVault(vault, type)}
                              onWithdrawVault={() => onWithdrawVault(vault)}
                              onTokenizeVault={() => onTokenizeVault(vault)}
                              onClosed={refetch}
                            />
                          </Box>
                        ))}
                      </Accordion>
                    </>
                  ) : (
                    <Box mt={4} textAlign='center'>No {currentVaultType} vaults found</Box>
                  )}
                </>
              )}
            </Box>
            {currentVaultType === VaultType.LP && (
              <RdModalBox mt={2} textAlign='center'>
                <strong>Note:</strong> Values for APR, Mitama, and Troops are approximate and may change often to match the current supply of FRTN in the LP
              </RdModalBox>
            )}
            <Flex justifyContent='space-around' mt={8}>
              <RdButton
                fontSize={{base: 'xl', sm: '2xl'}}
                onClick={() => handleCreateVault(!!account ? account.vaults.length : 0, VaultType.TOKEN)}
              >
                + New FRTN Vault
              </RdButton>
              <RdButton
                fontSize={{base: 'xl', sm: '2xl'}}
                onClick={() => handleCreateVault(!!account ? account.lpVaults.length : 0, VaultType.LP)}
              >
                + New LP Vault
              </RdButton>
            </Flex>
          </>
        ) : (
          <VStack fontSize='sm' mt={2} spacing={8}>
            <Text>Receive Troops and $Mitama by staking $Fortune. Receive more by staking longer.</Text>
            <RdButton
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleConnect}
            >
              Connect
            </RdButton>
          </VStack>
        )}
      </Box>
    </>
    
  )
}


// interface VaultGroupProps {
//   vaults: any;
//   onEditVault: (vault: FortuneStakingAccount, type: string) => void;
//   onWithdrawVault: (vault: FortuneStakingAccount) => void;
//   onTokenizeVault: (vault: FortuneStakingAccount) => void;
//   onClose: () => void;
// }
//
// const VaultGroup = ({vaults, onEditVault, onWithdrawVault, onTokenizeVault, onClose}: VaultGroupProps) => {
//   return (
//     <>
//       {!!vaults && vaults.length > 0 && (
//         <>
//           <Accordion defaultIndex={[0]} allowToggle>
//             {vaults.map((vault, index) => (
//               <Box key={vault.vaultId} mt={2}>
//                 <Vault
//                   vault={vault}
//                   index={index}
//                   onEditVault={(type: string) => onEditVault(vault, type)}
//                   onWithdrawVault={() => onWithdrawVault(vault)}
//                   onTokenizeVault={() => onTokenizeVault(vault)}
//                   onClosed={onClose}
//                 />
//               </Box>
//             ))}
//           </Accordion>
//         </>
//       )}
//     </>
//   )
// }

export default StakePage;

interface VaultProps {
  vault: FortuneStakingAccount;
  vaultType: VaultType;
  index: number;
  onEditVault: (type: string) => void;
  onWithdrawVault: () => void;
  onTokenizeVault: () => void;
  onClosed: () => void;
}

const Vault = ({vault, vaultType, index, onEditVault, onWithdrawVault, onTokenizeVault, onClosed}: VaultProps) => {
  const { config: rdConfig, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice()
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();

  const balance = Number(ethers.utils.formatEther(vault.balance));
  const daysToAdd = Number(vault.length / (86400));
  const numTerms = Math.floor(daysToAdd / rdConfig.bank.staking.fortune.termLength);
  const availableAprs = rdConfig.bank.staking.fortune.apr as any;
  const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
  const baseApr = (availableAprs[aprKey] ?? availableAprs[1]) * 100;
  const endDate = moment(vault.endTime * 1000).format("MMM D yyyy");

  const [isExecutingClose, setIsExecutingClose] = useState(false);
  const [canIncreaseDuration, setCanIncreaseDuration] = useState(true);

  const handleCloseVault = useCallback(async () => {
    try {
      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      setIsExecutingClose(true);
      // const bank = new Contract(config.contracts.bank, Bank, user.provider.signer);
      // const tx = await bank.closeVault(vault.index);
      // const receipt = await tx.wait();
      // toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

      const tx = await callWithGasPrice(bankContract, 'closeVault', [vault.index]);
      toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      onClosed();
    } catch (error: any) {
      console.log(error)
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecutingClose(false);
    }
  }, [vault.index, user.provider.signer]);

  const [totalApr, setTotalApr] = useState(baseApr);
  const [bonusApr, setBonusApr] = useState(0);
  useEffect(() => {
    const vaultDays = vault.length / 86400;
    const maxDays = rdConfig.bank.staking.fortune.maxTerms * rdConfig.bank.staking.fortune.termLength;
    setCanIncreaseDuration(vaultDays < maxDays);
    
    let totalApr = 0;
    let bonusApr = 0;
    if (rdUser) {
      totalApr = (baseApr + rdUser.bank.bonus.aApr) * (1 + rdUser.bank.bonus.mApr);
      bonusApr = totalApr - baseApr;
    }
    setBonusApr(bonusApr);
    setTotalApr(baseApr + bonusApr);
  }, [vault, rdConfig, rdUser, baseApr]);

  const [troops, setTroops] = useState(0);
  const [mitama, setMitama] = useState(0);
  useEffect(() => {
    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = Math.floor((balance * daysToAdd) / 1080);

    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && balance > 0) newTroops = 1;
    setTroops(newTroops);
    setMitama(mitama);
  }, [balance, daysToAdd, rdConfig]);

  const tokenIcon = useMemo(() => {
    return vaultType === VaultType.LP ? <>LP</> : <FortuneIcon boxSize={6} />
  }, [vaultType]);

  return (
    <AccordionItem bgColor='#292626' rounded='md'>
      <AccordionButton w='full' py={4}>
        <Flex direction='column' w='full' align='start'>
          <Flex w='full' align='center'>
            <Box flex='1' textAlign='left' my='auto'>
              <Text fontSize='xs' color="#aaa">Vault {Number(vault.index) + 1}</Text>
              <Box fontWeight='bold'>{daysToAdd} days</Box>
            </Box>
            <Box>
              <VStack align='end' spacing={2} fontSize='sm'>
                <HStack fontWeight='bold'>
                  {tokenIcon}
                  <Box>{commify(round(balance))}</Box>
                </HStack>
                <Flex>
                  <Tag variant='outline'>
                    {round(totalApr, 2)}%
                  </Tag>
                  <Tag ms={2} variant='outline'>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}
                           alt="troopsIcon" boxSize={4}/>
                    <Box ms={1}>
                      {commify(troops)}
                    </Box>
                  </Tag>
                </Flex>
              </VStack>
            </Box>
            <Box ms={4}>
              <AccordionIcon/>
            </Box>
          </Flex>
        </Flex>
      </AccordionButton>
      <AccordionPanel pb={0}>
        <SimpleGrid columns={2}>
          <Box>APR</Box>
          <Box textAlign='end'>
            <VStack align='end' spacing={0}>
              <Box fontWeight='bold'>{round(totalApr, 2)}%</Box>
              <Box fontSize='xs'>{baseApr}% Fortune stake + {round(bonusApr, 2)}% NFT stake</Box>
            </VStack>
          </Box>
          <Box>Troops</Box>
          <Box textAlign='end' fontWeight='bold'>{commify(troops)}</Box>
          <Box>Mitama</Box>
          <Box textAlign='end' fontWeight='bold'>{commify(mitama)}</Box>
          <Box>End Date</Box>
          <Box textAlign='end' fontWeight='bold'>{endDate}</Box>
        </SimpleGrid>
        {(Date.now() < vault.endTime * 1000) ? (
          <>
            <Center>
              <Stack direction={{base: 'column', sm: 'row'}} mt={4}>
                <Button onClick={() => onEditVault('amount')}>
                  + Add Fortune
                </Button>
                {canIncreaseDuration && (
                  <Button onClick={() => onEditVault('duration')}>
                    + Increase Duration
                  </Button>
                )}
                <Button
                  leftIcon={<Icon as={FontAwesomeIcon} icon={faGem} />}
                  onClick={onTokenizeVault}
                >
                  Tokenize Vault
                </Button>
              </Stack>
            </Center>
            <Center mt={4}>
              <Button
                variant='unstyled'
                size='sm'
                fontWeight='normal'
                onClick={onWithdrawVault}
              >
                Emergency Withdraw
              </Button>
            </Center>
          </>
        ) : (
          <VStack mb={2} mt={4}>
            <Text textAlign='center'>Vault staking term is complete! Close this vault to return the staked Fortune back to your account.</Text>
            <RdButton
              w='200px'
              hoverIcon={false}
              onClick={handleCloseVault}
              isLoading={isExecutingClose}
              isDisabled={isExecutingClose}
              loadingText='Closing'
            >
              Close Vault
            </RdButton>
          </VStack>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}