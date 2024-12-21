import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack
} from '@chakra-ui/react';
import ImageService from '@src/core/services/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import { CloseIcon } from '@chakra-ui/icons';
import ShrineIcon from '@src/components-v2/shared/icons/shrine';
import React, { useContext, useMemo } from 'react';
import { PendingNft } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types';
import {
  BankStakeNftContext,
  BankStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context';
import {
  useBankNftStakingHandlers
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/hooks';
import { ChainLogo } from '@dex/components/logo';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { toast } from 'react-toastify';
import useMitMatcher from '@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-mit-matcher';

enum ActiveStatus {
  ACTIVE,
  INACTIVE,
  INACTIVE_COLLECTION,
  INACTIVE_MIT_STAKED_INELIGIBLE,
  INACTIVE_MIT_UNSTAKED_INELIGIBLE
}

interface StakingSlotProps {
  pendingNft?: PendingNft;
  isUnlocked: boolean;
  onSelect: () => void;
  isInDialog: boolean;
}

const StakingSlot = ({pendingNft, isUnlocked, onSelect, isInDialog}: StakingSlotProps) => {
  const { selectedChainId, pendingItems } = useContext(BankStakeNftContext) as BankStakeNftContextProps;
  const { chainId: activeChainId} = useActiveChainId();
  const { removeNft } = useBankNftStakingHandlers();
  const { isMitDependency } = useMitMatcher();

  const isNftOnWrongChain = pendingNft && pendingNft.chainId !== selectedChainId;

  const handleClick = () => {
    if (activeChainId !== selectedChainId) {
      toast.error('Please switch network to unlock slot');
      return;
    }

    onSelect();
  };

  const activeStatus = useMemo(() => {
    if (!pendingNft) return ActiveStatus.INACTIVE;

    const { isActive } = pendingNft.stake;
    if (!isActive) return ActiveStatus.INACTIVE_COLLECTION;

    const mitStaked = !!pendingItems.mit;
    const _isMitDependency = isMitDependency(pendingNft.nft);
    if (mitStaked) {
      return _isMitDependency ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE_MIT_STAKED_INELIGIBLE;
    } else {
      return !_isMitDependency ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE_MIT_UNSTAKED_INELIGIBLE;
    }
  }, [pendingNft, pendingItems.mit]);

  const isEarning = useMemo(() => activeStatus < ActiveStatus.INACTIVE, [activeStatus]);

  return (
    <Box w='120px'>
      {!!pendingNft ? (
        <Popover>
          <PopoverTrigger>
            <Box position='relative'>
              <Box
                bg={isEarning ? '#376dcf' : '#716A67'}
                p={2}
                rounded='xl'
                border='2px dashed'
                borderColor={pendingNft.stake.isAlreadyStaked ? 'transparent' : '#ffa71c'}
                cursor={isEarning ? 'auto' : 'pointer'}
              >
                <Box
                  width={100}
                  height={100}
                  filter={isEarning ? 'auto' : 'grayscale(80%)'}
                  opacity={isEarning ? 'auto' : 0.8}
                >
                  <Image src={ImageService.translate(pendingNft.nft.image).fixedWidth(100, 100)} rounded='lg'/>
                </Box>
                <Flex fontSize='xs' justify='space-between' mt={1}>
                  {isEarning ? (
                    <VStack align='start' spacing={1}>
                      <ChainLogo chainId={pendingNft.chainId} width={15} height={15} />
                      {pendingNft.nft.rank && (
                        <HStack spacing={1}>
                          <Icon as={FontAwesomeIcon} icon={faAward} />
                          <Box as='span'>{pendingNft.nft.rank ?? ''}</Box>
                        </HStack>
                      )}
                    </VStack>
                  ): (
                    <>Inactive</>
                  )}
                  <VStack align='end' spacing={0} fontWeight='bold'>
                    {pendingNft.stake.multiplier && (
                      <Box>x {pendingNft.stake.multiplier}</Box>
                    )}
                    {pendingNft.stake.adder && (
                      <Box>+ {pendingNft.stake.adder}%</Box>
                    )}
                    {pendingNft.stake.troops && (
                      <HStack spacing={0}>
                        <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}alt="troopsIcon" boxSize={4}/>
                        <Box>+ {pendingNft.stake.troops}</Box>
                      </HStack>
                    )}
                  </VStack>
                </Flex>
              </Box>

              {!isNftOnWrongChain && (
                <Box
                  position='absolute'
                  top={0}
                  right={0}
                  pe='3px'
                >
                  <IconButton
                    icon={<CloseIcon boxSize={2} />}
                    aria-label='Remove'
                    bg='gray.800'
                    _hover={{ bg: 'gray.600' }}
                    size='xs'
                    rounded='full'
                    color='white'
                    onClick={(e) => {
                      e.stopPropagation(); // prevent popover
                      if (!isNftOnWrongChain) {
                        removeNft(pendingNft.nft.nftAddress, pendingNft.nft.nftId)
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </PopoverTrigger>

          {!isEarning && (
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody fontSize='sm'>
                {activeStatus === ActiveStatus.INACTIVE_COLLECTION ? (
                  <Text>
                    The Bank no longer supports this collection for staking. Benefits will not continue
                  </Text>
                ) : activeStatus === ActiveStatus.INACTIVE_MIT_UNSTAKED_INELIGIBLE ? (
                  <Text>
                    A Materialization Infusion Terminal (MIT) is required to be staked before this NFT can yield any benefits
                  </Text>
                ) : activeStatus === ActiveStatus.INACTIVE_MIT_STAKED_INELIGIBLE && (
                  <Text>
                    This NFT is not yielding any benefits while a A Materialization Infusion Terminal (MIT) is staked
                  </Text>
                )}
              </PopoverBody>
            </PopoverContent>
          )}
        </Popover>
      ) : (
        <Box position='relative' overflow='hidden'>
          <Box
            p={2}
            rounded='xl'
            cursor='pointer'
          >
            <Box
              width={100}
              height={100}
              bgColor='#716A67'
              rounded='xl'
              position='relative'
            >
              <ShrineIcon boxSize='100%' fill='#B1ADAC'/>
              {!isUnlocked && (
                <Flex
                  position='absolute'
                  top={0}
                  left={0}
                  w={100}
                  h={100}
                  fontSize='sm'
                  bg='#333333DD'
                  rounded='xl'
                  justify='center'
                  fontWeight='semibold'
                  textAlign='center'
                  onClick={handleClick}
                >
                  <Center>
                    {isInDialog ? (
                      <Image
                        src={ImageService.translate('/img/ryoshi-dynasties/icons/unlock.png').convert()}
                        alt="unlockIcon"
                        boxSize={12}
                      />
                    ) : (
                      <Image
                        src={ImageService.translate('/img/ryoshi-dynasties/icons/lock.png').convert()}
                        alt="lockIcon"
                        boxSize={12}
                      />
                    )}
                  </Center>
                </Flex>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default StakingSlot;