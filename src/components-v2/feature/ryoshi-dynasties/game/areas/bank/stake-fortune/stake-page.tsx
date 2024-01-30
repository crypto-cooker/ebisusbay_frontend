import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
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
import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, round} from '@src/utils';
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

const config = appConfig();

interface StakePageProps {
  onEditVault: (vault: FortuneStakingAccount, type: string) => void;
  onCreateVault: (vaultIndex: number) => void;
  onWithdrawVault: (vault: FortuneStakingAccount) => void;
  onTokenizeVault: (vault: FortuneStakingAccount) => void;
}

const StakePage = ({onEditVault, onCreateVault, onWithdrawVault, onTokenizeVault}: StakePageProps) => {
  const user = useUser();

  const { data: account, status, error, refetch } = useQuery({
    queryKey: ['UserStakeAccount', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getBankStakingAccount(user.address!),
    enabled: !!user.address,
  });

  const handleConnect = async () => {
    user.connect();
  }

  return (
    <>
      <Box mx={1} pb={6}>
        {!!user.address ? (
          <>
            <Text align='center' pt={2} px={2} fontSize='sm'>Stake & earn $Fortune and receive troops for battle. Stake more to receive more troops and higher APRs.</Text>
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
                  {!!account && account.vaults.length > 0 && (
                    <Accordion defaultIndex={[0]} allowToggle>
                      {account.vaults.map((vault, index) => (
                        <Box key={vault.vaultId} mt={2}>
                          <Vault
                            vault={vault}
                            index={index}
                            onEditVault={(type: string) => onEditVault(vault, type)}
                            onWithdrawVault={() => onWithdrawVault(vault)}
                            onTokenizeVault={() => onTokenizeVault(vault)}
                            onClosed={refetch}
                          />
                        </Box>
                      ))}
                    </Accordion>
                  )}
                </>
              )}
            </Box>
            <Flex alignContent={'center'} justifyContent={'center'} mt={8}>
              <Box ps='20px'>
                <RdButton
                  fontSize={{base: 'xl', sm: '2xl'}}
                  stickyIcon={true}
                  onClick={() => onCreateVault(!!account ? account.vaults.length : 0)}
                >
                  + New Vault
                </RdButton>
              </Box>
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

export default StakePage;

interface VaultProps {
  vault: FortuneStakingAccount;
  index: number;
  onEditVault: (type: string) => void;
  onWithdrawVault: () => void;
  onTokenizeVault: () => void;
  onClosed: () => void;
}

const Vault = ({vault, index, onEditVault, onWithdrawVault, onTokenizeVault, onClosed}: VaultProps) => {
  const { config: rdConfig, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();

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
      setIsExecutingClose(true);
      const bank = new Contract(config.contracts.bank, Bank, user.provider.signer);
      const tx = await bank.closeVault(vault.index);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
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

  return (
    <Box>
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
                      <FortuneIcon boxSize={6} />
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
    </Box>
  );
}