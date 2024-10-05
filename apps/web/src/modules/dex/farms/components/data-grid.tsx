import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  useColorModeValue,
  useDisclosure,
  VStack,
  Wrap
} from "@chakra-ui/react";
import React, {useMemo} from "react";
import {DerivedFarm, FarmState} from "@dex/farms/constants/types";
import {UserFarms, UserFarmState} from "@dex/farms/state/user";
import {commify} from "ethers/lib/utils";
import {ciEquals, millisecondTimestamp, round} from "@market/helpers/utils";
import {ethers} from "ethers";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {useEnableFarm, useHarvestRewards} from "@dex/farms/hooks/farm-actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt, faMinus, faPlus, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import StakeLpTokensDialog from "@dex/farms/components/stake-lp-tokens";
import UnstakeLpTokensDialog from "@dex/farms/components/unstake-lp-tokens-dialog";
import {userUserFarmBoost, useUserFarmsRefetch} from "@dex/farms/hooks/user-farms";
import {useUser} from "@src/components-v2/useUser";
import {getTheme} from "@src/global/theme/theme";
import {useExchangeRate} from "@market/hooks/useGlobalPrices";
import {useAppChainConfig} from "@src/config/hooks";
import {getBlockExplorerLink} from "@dex/utils";
import useMultichainCurrencyBroker from "@market/hooks/use-multichain-currency-broker";
import {DoubleCurrencyLayeredLogo} from "@dex/components/logo";
import {SpinnerIcon, StarIcon} from "@chakra-ui/icons";
import {toast} from "react-toastify";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import BoostFarmDialog from "@dex/farms/components/boost-farm-dialog";

export type DataGridProps = {
  data: DerivedFarm[];
  userData: UserFarms;
};


export default function DataGrid({ data, userData }: DataGridProps)  {
  return (
    <SimpleGrid columns={{base: 1, sm: 2, lg: 3}} spacing={4}>
      {!!data && data.length > 0 && data.map((farm) => (
        <GridItem key={farm.data.pid} farm={farm} userData={userData?.[farm.data.pair.id]} />
      ))}
    </SimpleGrid>
  );
}

function GridItem({farm, userData}: {farm: DerivedFarm, userData: UserFarmState}) {
  const user = useUser();
  const {config: appChainConfig} = useAppChainConfig();

  const {getByAddress} = useMultichainCurrencyBroker(appChainConfig.chain.id);
  const [enableFarm, enablingFarm] = useEnableFarm();
  const { refetchBalances, refetchBoosts } = useUserFarmsRefetch();
  const borderColor = useColorModeValue('#bbb', '#ffffff33');
  const [harvestRewards, harvestingRewards] = useHarvestRewards();
  const text2Color = useColorModeValue('#1A202C', 'whiteAlpha.600');
  const {requestSignature} = useEnforceSignature();
  const { boost, claimable } = userUserFarmBoost(farm.data.pid);

  const { isOpen: isOpenUnstake, onOpen: onOpenUnstake, onClose:  onCloseUnstake } = useDisclosure();
  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose:  onCloseStake } = useDisclosure();
  const { isOpen: isOpenBoost, onOpen: onOpenBoost, onClose:  onCloseBoost } = useDisclosure();

  const hasClaimableAmount = boost && Number(boost.claimAmount) > 0;

  const handleStakeSuccess = async () => {
    onCloseStake();
    onCloseUnstake();
    await new Promise(r => setTimeout(r, 2000));
    refetchBalances();
  }

  const handleBoostSuccess = async () => {
    onCloseBoost();
    await new Promise(r => setTimeout(r, 2000));
    refetchBoosts();
  }

  const handleOpenBoost = async () => {
    const signature = await requestSignature();
    if (signature) {
      onOpenBoost();
    }  else {
      toast.error('Unable to retrieve signature');
    }
  }

  const stakedDollarValue = useMemo(() => {
    if (!farm.data.pair || !userData?.stakedBalance) {
      return 0;
    }

    return commify((Number(farm.data.pair.derivedUSD) * Number(ethers.utils.formatEther(userData.stakedBalance))).toFixed(2));
  }, [farm, userData]);

  // const earnedDollarValue = useMemo(() => {
  //   if (!farm.data.frtnPerMonth || !farm.data.frtnPerMonthInUSD || !userData?.earnings) {
  //     return 0;
  //   }
  //
  //   const usdRate = farm.data.frtnPerMonthInUSD / parseFloat(ethers.utils.formatEther(farm.data.frtnPerMonth));
  //
  //   const earnings = userData.earnings[0]?.amount ?? 0;
  //
  //   return commify((usdRate * Number(ethers.utils.formatEther(earnings))).toFixed(2));
  // }, [farm, userData]);

  const totalEarned = userData?.earnings.reduce((acc, earning) =>  acc + earning.amount, 0n) ?? 0n;

  return (
    <Box h='full' data-group>
      <Box
        border='1px solid'
        borderColor={borderColor}
        rounded='xl'
        boxShadow='5px 5px 20px black'
        backgroundColor={getTheme(user.theme).colors.bgColor5}
        overflow='hidden'
        h='full'

      >
        <Box p={4}>
          <Flex justify='space-between'>
            <Box>
              <DoubleCurrencyLayeredLogo
                address1={farm.data.pair.token0.id}
                address2={farm.data.pair.token1.id}
                chainId={farm.derived.chainId}
                size1={24}
                size2={24}
                variant='horizontal'
              />
            </Box>
            <Box textAlign='end' fontSize='xl' fontWeight='bold'>
              {farm.data.pair.name}
            </Box>
          </Flex>
          <SimpleGrid columns={2}>
            <Box fontWeight='bold'>APR</Box>
            {farm.derived.state === FarmState.ACTIVE && farm.derived.hasActiveBoost ? (
              <Box fontWeight='bold' textAlign='end'>{farm.derived.apr} (max {parseFloat(farm.derived.apr.slice(0, -1)) + 300}%)</Box>
            ) : (
              <Box fontWeight='bold' textAlign='end'>{farm.derived.apr}</Box>
            )}
            <Box fontWeight='bold'>Rewards / Day</Box>
            <Wrap spacing={2} justify='end'>
              {farm.derived.dailyRewards.map((reward, i) => (
                <React.Fragment key={i}>
                  <HStack spacing={0} justify='end'>
                    <Box fontWeight='bold'>{reward.amount}</Box>
                    {!reward.rewarder.isMain && !!reward.rewarder.rewardEnd && (
                      <Popover>
                        <PopoverTrigger>
                          <IconButton aria-label='Reward End Date' icon={<Icon as={FontAwesomeIcon} icon={faStopwatch} />} variant='unstyled' h='24px' minW='24px'/>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverBody>Approximately ends at {new Date(millisecondTimestamp(reward.rewarder.rewardEnd)).toLocaleString()}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    )}
                  </HStack>
                  <Box textAlign='end' fontWeight='bold'>
                    {reward.token.symbol}
                  </Box>
                </React.Fragment>
              ))}
            </Wrap>
          </SimpleGrid>
          <Box mt={4}>
            <Box fontSize='sm' fontWeight='bold'>EARNED REWARDS</Box>
            <Wrap justify='space-between' align='center'>
              {userData?.earnings.map((earning, i) => {
                const token = getByAddress(earning.address);
                const rewarder = farm.data.rewarders.find(r => ciEquals(r.token, earning.address));
                const isMultiYield = rewarder && farm.data.rewarders.length > 1;
                const isActiveNativeYield = rewarder && rewarder.isMain && rewarder.allocPoint > 0;

                return (!!token && !!rewarder && (earning.amount > 0 || !isMultiYield || isActiveNativeYield || rewarder.allocPoint > 0)) ? (
                  <Stack key={i}>
                    <Box>
                      <Box fontSize='xl' fontWeight='bold'>
                        {token.symbol} {commify(round(ethers.utils.formatUnits(earning.amount ?? 0, token.decimals), 2))}
                      </Box>
                      {/*{!!earnedDollarValue && token.symbol !== 'USDC' && (*/}
                        <Box fontSize='xs' color={text2Color}>
                          ~ ${round(Number(rewarder.price) * Number(ethers.utils.formatUnits(earning.amount ?? 0, token.decimals)), 2)}
                        </Box>
                      {/*)}*/}
                    </Box>
                  </Stack>
                ) : <></>
              })}
              {((farm.derived.state === FarmState.ACTIVE && farm.derived.hasActiveBoost) || hasClaimableAmount) && (
                <PrimaryButton
                  isDisabled={harvestingRewards || !user.address}
                  isLoading={harvestingRewards}
                  onClick={handleOpenBoost}
                  leftIcon={boost && claimable ? <StarIcon /> : !!boost ? <SpinnerIcon /> : undefined}
                >
                  {boost && claimable ? <>Claim Boost</> : !!boost ? <>Boosting</> : <>Boost</>}
                </PrimaryButton>
              )}
              <PrimaryButton
                isDisabled={harvestingRewards || totalEarned === 0n || !userData?.approved || !user.address}
                isLoading={harvestingRewards}
                onClick={() => harvestRewards(farm.data.pid)}
              >
                Harvest
              </PrimaryButton>
            </Wrap>
            <Box mt={4}>
              <Box fontSize='sm' fontWeight='bold' mb={2}>{farm.derived.name} STAKED</Box>
              {userData?.approved ? (
                <Wrap justify='space-between' align='center'>
                  <Box>
                    <Box fontSize='xl' fontWeight='bold'>
                      {round(ethers.utils.formatEther(userData.stakedBalance), 8)}
                    </Box>
                    <Box fontSize='xs' color={text2Color}>
                      ~ ${stakedDollarValue}
                    </Box>
                  </Box>
                  {(farm.derived.state !== FarmState.FINISHED || round(ethers.utils.formatEther(userData.stakedBalance), 8) > 0) && (
                    <HStack w='104px'>
                      <SecondaryButton onClick={onOpenUnstake}>
                        <Icon as={FontAwesomeIcon} icon={faMinus} />
                      </SecondaryButton>
                      {farm.derived.state !== FarmState.FINISHED && (
                        <SecondaryButton onClick={onOpenStake}>
                          <Icon as={FontAwesomeIcon} icon={faPlus} />
                        </SecondaryButton>
                      )}
                    </HStack>
                  )}
                </Wrap>
              ) : (
                <PrimaryButton
                  w='full'
                  isDisabled={enablingFarm}
                  isLoading={enablingFarm}
                  onClick={() => enableFarm(farm.data.pair.id)}
                >
                  Enable Contract
                </PrimaryButton>
              )}
            </Box>
          </Box>
        </Box>
        <hr />
        <Box p={4}>
          <Accordion allowToggle>
            <AccordionItem border='none'>
              <AccordionButton _hover={{bg: 'none'}}>
                <HStack justify='center' w='full'>
                  <Box fontWeight='bold' fontSize='lg'>
                    Details
                  </Box>
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4} px={0}>
                <VStack w='full' align='start' spacing={1} justify='stretch'>
                  <Flex justify='space-between' w='full'>
                    <Box fontWeight='bold'>Liquidity</Box>
                    <Box fontWeight='bold'>{farm.derived.stakedLiquidity}</Box>
                  </Flex>
                  <Link fontWeight='bold' href={`/dex/add/v2/${farm.data.pair.token0.id}/${farm.data.pair.token1.id}`} color='#218cff' isExternal>
                    <HStack>
                      <>Get {farm.derived.name} LP</>
                      <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />
                    </HStack>
                  </Link>
                  <Link fontWeight='bold' href={getBlockExplorerLink(farm.data.pair.id, 'address', appChainConfig.chain.id)} color='#218cff' isExternal>
                    <HStack>
                      <>View Contract</>
                      <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />
                    </HStack>
                  </Link>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
      {!!userData && (
        <>
          <StakeLpTokensDialog
            isOpen={isOpenStake}
            onClose={onCloseStake}
            farm={farm}
            userData={userData}
            onSuccess={handleStakeSuccess}
          />
          <UnstakeLpTokensDialog
            isOpen={isOpenUnstake}
            onClose={onCloseUnstake}
            farm={farm}
            userData={userData}
            onSuccess={handleStakeSuccess}
          />
          <BoostFarmDialog
            isOpen={isOpenBoost}
            onClose={onCloseBoost}
            farm={farm}
            onSuccess={handleBoostSuccess}
          />
        </>
      )}
    </Box>
  )
}