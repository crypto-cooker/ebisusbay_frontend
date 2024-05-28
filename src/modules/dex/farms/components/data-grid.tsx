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
  Link,
  SimpleGrid,
  useDisclosure,
  VStack,
  Wrap
} from "@chakra-ui/react";
import React from "react";
import {DerivedFarm, FarmState} from "@dex/farms/constants/types";
import {UserFarms, UserFarmState} from "@dex/farms/state/user";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {commify} from "ethers/lib/utils";
import {round} from "@market/helpers/utils";
import {ethers} from "ethers";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {useEnableFarm, useHarvestRewards} from "@dex/farms/hooks/farm-actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import StakeLpTokensDialog from "@dex/farms/components/stake-lp-tokens";
import UnstakeLpTokensDialog from "@dex/farms/components/unstake-lp-tokens-dialog";
import {useUserFarmsRefetch} from "@dex/farms/hooks/user-farms";
import {appConfig} from "@src/Config";

const config =  appConfig();

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
  const [enableFarm, enablingFarm] = useEnableFarm();
  const { refetchBalances } = useUserFarmsRefetch();

  const bgColor = useColorModeValue('#FFF', '#404040')
  const hoverBgColor = useColorModeValue('#FFFFFF', '#404040');
  const borderColor = useColorModeValue('#bbb', '#ffffff33');
  const hoverBorderColor = useColorModeValue('#595d69', '#ddd');
  const [harvestRewards, harvestingRewards] = useHarvestRewards();useColorModeValue('#FFFFFF', '#404040')

  const { isOpen: isOpenUnstake, onOpen: onOpenUnstake, onClose:  onCloseUnstake } = useDisclosure();
  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose:  onCloseStake } = useDisclosure();

  const handleStakeSuccess = async () => {
    onCloseStake();
    onCloseUnstake();
    await new Promise(r => setTimeout(r, 2000));
    refetchBalances();
  }

  return (
    <Box h='full' data-group>
      <Box
        border='1px solid'
        borderColor={borderColor}
        rounded='xl'
        boxShadow='5px 5px 20px black'
        backgroundColor={bgColor}
        overflow='hidden'
        h='full'

      >
        <Box p={4}>
          <Flex justify='space-between'>
            <Box>
              <Box position='relative' w='40px' h='24px'>
                <Avatar
                  src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${farm.data.pair.token0.symbol.toLowerCase()}.webp`}
                  rounded='full'
                  size='xs'
                />
                <Avatar
                  src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${farm.data.pair.token1.symbol.toLowerCase()}.webp`}
                  rounded='full'
                  size='xs'
                  position='absolute'
                  top={0}
                  right={0}
                />
              </Box>
            </Box>
            <Box textAlign='end' fontSize='xl' fontWeight='bold'>
              {farm.data.pair.name}
            </Box>
          </Flex>
          <SimpleGrid columns={2}>
            <Box fontWeight='bold'>APR</Box>
            <Box fontWeight='bold' textAlign='end'>{farm.derived.apr}</Box>
            <Box fontWeight='bold'>Rewards / Day</Box>
            <Box fontWeight='bold' textAlign='end'>{farm.derived.dailyRewards}</Box>
          </SimpleGrid>
          <Box mt={4}>
            <Box fontSize='sm' fontWeight='bold'>EARNED REWARDS</Box>
            <Wrap justify='space-between' align='center'>
              <Box
                fontSize='xl'
                fontWeight='bold'
              >
                FRTN {commify(round(ethers.utils.formatEther(userData?.earnings ?? 0), 2))}
              </Box>
              <PrimaryButton
                isDisabled={harvestingRewards || userData?.earnings === 0n || !userData?.approved}
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
                  <Box
                    fontSize='xl'
                    fontWeight='bold'
                  >
                    {round(ethers.utils.formatEther(userData.stakedBalance), 8)}
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
                  <Link fontWeight='bold' href={`https://swap.ebisusbay.com/#/add/${farm.data.pair.token0.id}/${farm.data.pair.token1.id}`} color='#218cff'>
                    <HStack>
                      <>Get {farm.derived.name} LP</>
                      <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />
                    </HStack>
                  </Link>
                  <Link fontWeight='bold' href={`${config.urls.explorer}address/${farm.data.pair.id}`} color='#218cff'>
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
        </>
      )}
    </Box>
  )
}