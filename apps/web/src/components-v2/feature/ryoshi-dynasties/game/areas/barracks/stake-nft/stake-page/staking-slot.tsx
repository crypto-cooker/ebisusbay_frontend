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
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {CloseIcon} from "@chakra-ui/icons";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import React, {useContext} from "react";
import {PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types";
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context";
import {
  useBarracksNftStakingHandlers
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/hooks";
import {ChainLogo} from "@dex/components/logo";
import {toast} from "react-toastify";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";

interface StakingSlotProps {
  pendingNft?: PendingNft;
  isUnlocked: boolean;
  onSelect: () => void;
  isInDialog: boolean;
}

const StakingSlot = ({pendingNft, isUnlocked, onSelect, isInDialog}: StakingSlotProps) => {
  const {selectedChainId} = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;
  const { chainId: activeChainId} = useActiveChainId();
  const {removeNft} = useBarracksNftStakingHandlers();

  const isNftOnWrongChain = pendingNft && pendingNft.chainId !== selectedChainId;

  const handleClick = () => {
    if (activeChainId !== selectedChainId) {
      toast.error('Please switch network to unlock slot');
      return;
    }

    onSelect();
  };

  return (
    <Box w='120px'>
      {!!pendingNft ? (
        <Popover>
          <PopoverTrigger>
            <Box position='relative'>
              <Box
                bg={pendingNft.stake.isActive ? '#376dcf' : '#716A67'}
                p={2}
                rounded='xl'
                border='2px dashed'
                borderColor={pendingNft.stake.isAlreadyStaked ? 'transparent' : '#ffa71c'}
                cursor={pendingNft.stake.isActive ? 'auto' : 'pointer'}
              >
                <Box
                  width={100}
                  height={100}
                  filter={pendingNft.stake.isActive ? 'auto' : 'grayscale(80%)'}
                  opacity={pendingNft.stake.isActive ? 'auto' : 0.8}
                >
                  <Image src={ImageService.translate(pendingNft.nft.image).fixedWidth(100, 100)} rounded='lg'/>
                </Box>
                <Flex fontSize='xs' justify='space-between' mt={1}>
                  {pendingNft.stake.isActive ? (
                    <>
                      <Box verticalAlign='top'>
                        {pendingNft.nft.rank && (
                          <HStack spacing={1}>
                            <Icon as={FontAwesomeIcon} icon={faAward} />
                            <Box as='span'>{pendingNft.nft.rank}</Box>
                          </HStack>
                        )}
                        <ChainLogo chainId={pendingNft.chainId} width={15} height={15} />
                      </Box>
                    </>
                  ): (
                    <>Inactive</>
                  )}
                  <VStack align='end' spacing={0} fontWeight='bold'>
                    {pendingNft.stake.multiplier && (
                      <Box>+ {pendingNft.stake.multiplier}</Box>
                    )}
                    {pendingNft.stake.bonusTroops && (
                      <Box>+ {pendingNft.stake.bonusTroops}</Box>
                    )}
                  </VStack>
                </Flex>
              </Box>

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
            </Box>
          </PopoverTrigger>

          {!pendingNft.stake.isActive && (
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>The Barracks no longer supports this collection for staking. Any benefits will be removed next game</PopoverBody>
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