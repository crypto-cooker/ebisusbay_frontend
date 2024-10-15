import {
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
  Stack,
  Tag,
  Text,
  VStack
} from "@chakra-ui/react";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {faGem} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, round} from "@market/helpers/utils";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import useStakingPair from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/use-staking-pair";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {useUser} from "@src/components-v2/useUser";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import ImageService from "@src/core/services/image";
import {useBankContract} from "@src/global/hooks/contracts";
import {parseErrorMessage} from "@src/helpers/validator";
import {ethers} from "ethers";
import {commify} from "ethers/lib/utils";
import moment from "moment/moment";
import {ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {parseEther} from "viem";
import RdButton from "../../../../components/rd-button";

interface VaultSummaryProps {
  vault: FortuneStakingAccount;
  vaultType: VaultType;
  index: number;
  onEditVault: (type: string) => void;
  onWithdrawVault: () => void;
  onTokenizeVault: () => void;
  onClosed: () => void;
}

const VaultSummary = (props: VaultSummaryProps) => {
  return props.vaultType === VaultType.LP ? <LpVaultSummary {...props} /> : <TokenVaultSummary {...props} />;
}


const TokenVaultSummary = ({ vault, onEditVault, onWithdrawVault, onTokenizeVault, onClosed }: VaultSummaryProps) => {
  const { config: rdConfig, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

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
    <AccordionItem bgColor='#292626' rounded='md'>
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
        />
        <VaultActionButtons
          vault={vault}
          onEditVault={onEditVault}
          onWithdrawVault={onWithdrawVault}
          onTokenizeVault={onTokenizeVault}
          onVaultClosed={onClosed}
          canTokenize={true}
        />
      </AccordionPanel>
    </AccordionItem>
  )
}

const LpVaultSummary = ({ vault, onEditVault, onWithdrawVault, onTokenizeVault, onClosed }: VaultSummaryProps) => {
  const { config: rdConfig, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;

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

  const stakingPair = useStakingPair({pairAddress: vault.pool, chainId: bankChainId});

  const derivedFrtnAmount = useMemo(() => {
    if (!stakingPair || !stakingPair.totalSupply || stakingPair.totalSupply.equalTo(0)) {
      return '0'
    }

    return stakingPair.frtnReserve?.multiply(parseEther(`${vaultBalance}`)).divide(stakingPair.totalSupply ?? 0).toExact() ?? '0';
  }, [stakingPair, vaultBalance]);

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
    const mitama = (Number(derivedFrtnAmount) * daysToAdd) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(derivedFrtnAmount) > 0) newTroops = 1;
    setTroops(newTroops);
    setMitama(multipliedLpMitama);
  }, [derivedFrtnAmount, daysToAdd, rdConfig]);

  return (
    <AccordionItem bgColor='#292626' rounded='md'>
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
          isEstimate
        />
        <VaultActionButtons
          vault={vault}
          onEditVault={onEditVault}
          onWithdrawVault={onWithdrawVault}
          onTokenizeVault={onTokenizeVault}
          onVaultClosed={onClosed}
          canTokenize={false}
        />
      </AccordionPanel>
    </AccordionItem>
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
  isEstimate?: boolean;
}

const VaultBody = ({ totalApr, baseApr, bonusApr, troops, mitama, endTime, isEstimate}: VaultBodyProps) => {
  const endDate = moment(endTime * 1000).format("MMM D yyyy");

  return (
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
  )
}

interface VaultActionButtonsProps {
  vault: FortuneStakingAccount;
  onEditVault: (type: string) => void;
  onWithdrawVault: () => void;
  onTokenizeVault: () => void;
  onVaultClosed: () => void;
  canTokenize: boolean;
}

const VaultActionButtons = ({ vault, onEditVault, onWithdrawVault, onTokenizeVault, onVaultClosed, canTokenize }: VaultActionButtonsProps) => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const { chainId: bankChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
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
            <Stack direction={{base: 'column', sm: 'row'}} mt={4}>
              <Button onClick={() => onEditVault('amount')}>
                + Add {vaultType === VaultType.LP ? 'LP' : 'FRTN'}
              </Button>
              {canIncreaseDuration && (
                <Button onClick={() => onEditVault('duration')}>
                  + Increase Duration
                </Button>
              )}
              {canTokenize && (
                <Button
                  leftIcon={<Icon as={FontAwesomeIcon} icon={faGem} />}
                  onClick={onTokenizeVault}
                >
                  Tokenize Vault
                </Button>
              )}
            </Stack>
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