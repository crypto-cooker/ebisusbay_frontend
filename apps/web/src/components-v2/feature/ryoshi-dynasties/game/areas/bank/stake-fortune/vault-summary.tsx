import {
  AccordionButton,
  AccordionIcon,
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
  Tag,
  Text,
  VStack,
  Wrap
} from '@chakra-ui/react';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useCallWithGasPrice } from '@eb-pancakeswap-web/hooks/useCallWithGasPrice';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { faGem, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSuccessfulTransactionToastContent, findNextLowestNumber, round, timeSince } from '@market/helpers/utils';
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import FortuneIcon from '@src/components-v2/shared/icons/fortune';
import { useUser } from '@src/components-v2/useUser';
import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';
import ImageService from '@src/core/services/image';
import { useBankContract } from '@src/global/hooks/contracts';
import { parseErrorMessage } from '@src/helpers/validator';
import { ethers } from 'ethers';
import { commify } from 'ethers/lib/utils';
import moment from 'moment/moment';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import RdButton from '../../../../components/rd-button';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import StyledAccordionItem
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/styled-accordion-item';
import { CheckIcon } from '@chakra-ui/icons';

interface VaultSummaryProps {
  vault: FortuneStakingAccount;
  vaultType: VaultType;
  index: number;
  onEditVault: (type: string) => void;
  onWithdrawVault: () => void;
  onTokenizeVault: () => void;
  onBoostVault: () => void;
  onClosed: () => void;
}

const BOOSTS_ENABLED = true;

const VaultSummary = (props: VaultSummaryProps) => {
  return props.vaultType === VaultType.LP ? <LpVaultSummary {...props} /> : <TokenVaultSummary {...props} />;
}


const TokenVaultSummary = ({ vault, onEditVault, onWithdrawVault, onTokenizeVault, onBoostVault, onClosed }: VaultSummaryProps) => {
  const { config: rdConfig, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { boost: activeBoost } = useUserVaultBoost(+vault.vaultId);

  const vaultBalance = Number(ethers.utils.formatEther(vault.balance));
  const daysToAdd = Number(vault.length / (86400));
  const numTerms = Math.floor(daysToAdd / rdConfig.bank.staking.fortune.termLength);
  const availableAprs = rdConfig.bank.staking.fortune.apr as any;
  const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
  const baseApr = (availableAprs[aprKey] ?? availableAprs[1]) * 100;
  const endDate = moment(vault.endTime * 1000).format("MMM D yyyy");

  const [totalApr, setTotalApr] = useState(baseApr);
  const [bonusApr, setBonusApr] = useState(0);
  const [troops, setTroops] = useState(0);
  const [mitama, setMitama] = useState(0);

  useEffect(() => {
    let totalApr = 0;
    let bonusApr = 0;
    if (rdUser) {
      totalApr = (baseApr + rdUser.bank.bonus.aApr) * (1 + rdUser.bank.bonus.mApr);
      bonusApr = totalApr - baseApr;
    }
    setBonusApr(bonusApr);
    setTotalApr(baseApr + bonusApr);
  }, [vault, rdConfig, rdUser, baseApr]);

  useEffect(() => {
    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = Math.floor((vaultBalance * daysToAdd) / 1080);

    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && vaultBalance > 0) newTroops = 1;
    setTroops(newTroops);
    setMitama(mitama);
  }, [vaultBalance, daysToAdd, rdConfig]);

  return (
    <StyledAccordionItem shouldUseAnimated={!!activeBoost}>
      <VaultHeading
        index={vault.index}
        tokenIcon={<FortuneIcon boxSize={6} />}
        duration={daysToAdd}
        balance={vaultBalance}
        apr={totalApr}
        troops={troops}
        type={VaultType.TOKEN}
      />
      <AccordionPanel pb={0}>
        <VaultBody
          totalApr={totalApr}
          baseApr={baseApr}
          bonusApr={bonusApr}
          troops={troops}
          mitama={mitama}
          endTime={vault.endTime}
          vaultId={+vault.vaultId}
          onClaim={onBoostVault}
        />
        <VaultActionButtons
          vault={vault}
          onEditVault={onEditVault}
          onWithdrawVault={onWithdrawVault}
          onTokenizeVault={onTokenizeVault}
          onBoostVault={onBoostVault}
          onVaultClosed={onClosed}
          canTokenize={true}
        />
      </AccordionPanel>
    </StyledAccordionItem>
  )
}

const LpVaultSummary = ({ vault, onEditVault, onWithdrawVault, onTokenizeVault, onBoostVault, onClosed }: VaultSummaryProps) => {
  const { config: rdConfig, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { boost: activeBoost } = useUserVaultBoost(+vault.vaultId);

  const vaultBalance = Number(ethers.utils.formatEther(vault.balance));
  const daysToAdd = Number(vault.length / (86400));
  const numTerms = Math.floor(daysToAdd / rdConfig.bank.staking.fortune.termLength);
  const availableAprs = rdConfig.bank.staking.fortune.lpApr as any;
  const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
  const baseApr = (availableAprs[aprKey] ?? availableAprs[1]) * 100;

  const [totalApr, setTotalApr] = useState(baseApr);
  const [bonusApr, setBonusApr] = useState(0);
  const [troops, setTroops] = useState(0);
  const [mitama, setMitama] = useState(0);

  useEffect(() => {
    let totalApr = 0;
    let bonusApr = 0;
    if (rdUser) {
      totalApr = (baseApr + rdUser.bank.bonus.aApr) * (1 + rdUser.bank.bonus.mApr);
      bonusApr = totalApr - baseApr;
    }
    setBonusApr(bonusApr);
    setTotalApr(baseApr + bonusApr);
  }, [vault, rdConfig, rdUser, baseApr]);

  useEffect(() => {
    const derivedFrtnAmount = ethers.utils.formatEther(vault.frtnDeposit);
    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = (Number(derivedFrtnAmount) * daysToAdd) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(derivedFrtnAmount) > 0) newTroops = 1;
    setTroops(newTroops);
    setMitama(multipliedLpMitama);
  }, [daysToAdd, rdConfig]);

  return (
    <StyledAccordionItem shouldUseAnimated={!!activeBoost}>
      <VaultHeading
        index={vault.index}
        tokenIcon={<>LP</>}
        duration={daysToAdd}
        balance={vaultBalance}
        apr={totalApr}
        troops={troops}
        type={VaultType.LP}
      />
      <AccordionPanel pb={0}>
        <VaultBody
          totalApr={totalApr}
          baseApr={baseApr}
          bonusApr={bonusApr}
          troops={troops}
          mitama={mitama}
          endTime={vault.endTime}
          vaultId={+vault.vaultId}
          onClaim={onBoostVault}
        />
        <VaultActionButtons
          vault={vault}
          onEditVault={onEditVault}
          onWithdrawVault={onWithdrawVault}
          onTokenizeVault={onTokenizeVault}
          onBoostVault={onBoostVault}
          onVaultClosed={onClosed}
          canTokenize={false}
        />
      </AccordionPanel>
    </StyledAccordionItem>
  )
}

interface VaultHeadingProps {
  index:  number;
  tokenIcon: ReactNode;
  duration: number;
  balance: number;
  apr: number;
  troops: number;
  type: VaultType;
}

const VaultHeading = ({ index, tokenIcon, duration, balance, apr, troops, type}: VaultHeadingProps) => {
  return (
    <AccordionButton w='full' py={4}>
      <Flex direction='column' w='full' align='start'>
        <Flex w='full' align='center'>
          <Box flex='1' textAlign='left' my='auto'>
            <Text fontSize='xs' color="#aaa">Vault {Number(index) + 1}</Text>
            <Box fontWeight='bold'>{duration} days</Box>
          </Box>
          <Box>
            <VStack align='end' spacing={2} fontSize='sm'>
              <HStack fontWeight='bold'>
                {tokenIcon}
                {type === VaultType.LP && (
                  <Box>{commify(round(balance, 7))}</Box>
                )}
                {type === VaultType.TOKEN && (
                  <Box>{commify(round(balance))}</Box>
                )}
              </HStack>
              <Flex>
                <Tag variant='outline'>
                  {round(apr, 2)}%
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
  )
}

interface VaultBodyProps {
  totalApr: number;
  baseApr: number;
  bonusApr: number;
  troops: number;
  mitama: number;
  endTime: number;
  vaultId: number;
  onClaim: () => void;
}

const VaultBody = ({ totalApr, baseApr, bonusApr, troops, mitama, endTime, vaultId, onClaim}: VaultBodyProps) => {
  const endDate = moment(endTime * 1000).format("MMM D yyyy");
  const { boost: existingBoost, claimable: isBoostClaimable, timeRemaining } = useUserVaultBoost(vaultId);

  return (
    <>
      <SimpleGrid columns={2}>
        <Box>APR</Box>
        <Box textAlign='end'>
          <VStack align='end' spacing={0}>
            <Box fontWeight='bold'>{round(totalApr, 2)}%</Box>
            <Box fontSize='xs'>{round(baseApr, 2)}% Fortune stake + {round(bonusApr, 2)}% NFT stake</Box>
          </VStack>
        </Box>
        <Box>Troops</Box>
        <Box textAlign='end' fontWeight='bold'>{commify(troops)}</Box>
        <Box>Mitama</Box>
        <Box textAlign='end' fontWeight='bold'>{commify(mitama)}</Box>
        <Box>End Date</Box>
        <Box textAlign='end' fontWeight='bold'>{endDate}</Box>
      </SimpleGrid>
      {existingBoost && BOOSTS_ENABLED && (
        <Flex justify='space-between' my={2}>
          <Box my='auto'>Boost</Box>
          <Box textAlign='end' fontWeight='bold'>
            <PrimaryButton
              isDisabled={!isBoostClaimable}
              size='sm'
              leftIcon={!isBoostClaimable ? <Spinner boxSize={4} /> : <CheckIcon />}
              onClick={onClaim}
            >
              {!isBoostClaimable ? `Claim in ${timeRemaining}` : 'Claim'}
            </PrimaryButton>
          </Box>
        </Flex>
      )}
    </>
  )
}

interface VaultActionButtonsProps {
  vault: FortuneStakingAccount;
  onEditVault: (type: string) => void;
  onWithdrawVault: () => void;
  onTokenizeVault: () => void;
  onBoostVault: () => void;
  onVaultClosed: () => void;
  canTokenize: boolean;
}

const VaultActionButtons = ({ vault, onEditVault, onWithdrawVault, onTokenizeVault, onBoostVault, onVaultClosed, canTokenize }: VaultActionButtonsProps) => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const { chainId: bankChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { boost: activeBoost } = useUserVaultBoost(+vault.vaultId);
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice()
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();

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
      onVaultClosed();
    } catch (error: any) {
      console.log(error)
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecutingClose(false);
    }
  }, [vault.index, user.provider.signer]);

  useEffect(() => {
    const vaultDays = vault.length / 86400;
    const maxDays = rdConfig.bank.staking.fortune.maxTerms * rdConfig.bank.staking.fortune.termLength;
    setCanIncreaseDuration(vaultDays < maxDays);
  }, [vault, rdConfig]);

  return (
    <>
      {(Date.now() < vault.endTime * 1000) ? (
        <>
          <Center mb={4}>
            <Wrap direction={{base: 'column', sm: 'row'}} justify='center' mt={4}>
              <Button onClick={() => onEditVault('amount')}>
                + Add {vaultType === VaultType.LP ? 'LP' : 'FRTN'}
              </Button>
              {canIncreaseDuration && (
                <Button onClick={() => onEditVault('duration')}>
                  + Increase Duration
                </Button>
              )}
              {canTokenize && !activeBoost && (
                <Button
                  leftIcon={<Icon as={FontAwesomeIcon} icon={faGem} />}
                  onClick={onTokenizeVault}
                >
                  Tokenize Vault
                </Button>
              )}
              {!activeBoost && BOOSTS_ENABLED && (
                <Button
                  leftIcon={<Icon as={FontAwesomeIcon} icon={faStar} />}
                  onClick={onBoostVault}
                >
                  Boost Vault
                </Button>
              )}
            </Wrap>
          </Center>
          <Center>
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
    </>
  )
}

export default VaultSummary;

export const useUserVaultBoost = (vaultId: number) => {
  const { userVaultBoosts, chainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;

  return useMemo(() => {
    const existingBoost = userVaultBoosts?.find((boost: any) => boost.vaultId === vaultId && boost.chainId === chainId);

    if (!existingBoost) {
      return {
        claimable: false
      }
    }

    const isBoostClaimable = new Date(existingBoost.claimAt) < new Date();
    const timeRemaining = timeSince(new Date(existingBoost.claimAt));
    let timeRemainingMilliseconds = isBoostClaimable ? 0 : new Date(existingBoost.claimAt).getTime() - Date.now();
    if (timeRemainingMilliseconds < 0) timeRemainingMilliseconds = 0;

    return {
      boost: existingBoost,
      claimable: isBoostClaimable,
      timeRemaining,
      timeRemainingMilliseconds
    }
  }, [vaultId, userVaultBoosts, chainId]);
}