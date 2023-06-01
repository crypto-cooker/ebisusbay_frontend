import {Box, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Text, Wrap, WrapItem} from "@chakra-ui/react"

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {CloseIcon} from "@chakra-ui/icons";

const config = appConfig();

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
  battleRewards: any;
}

const ClaimRewards = ({isOpen, onClose, battleRewards}: StakeNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingLabel, setExecutingLabel] = useState('');
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);

const handleClaim = useCallback(async () => {
    // if (pendingNfts.length === 0 && stakedNfts.length === 0) return;

    let hasCompletedApproval = false;

    try {
      setIsExecutingClaim(true);
      setExecutingLabel('Approving');
    //   const approvedCollections: string[] = [];
    //   for (let nft of pendingNfts) {
    //     if (approvedCollections.includes(nft.nftAddress)) continue;

    //     const nftContract = new Contract(nft.nftAddress, ERC721, user.provider.getSigner());
    //     const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), config.contracts.barracks);

    //     if (!isApproved) {
    //       let tx = await nftContract.setApprovalForAll(config.contracts.barracks, true);
    //       await tx.wait();
    //       approvedCollections.push(nft.nftAddress);
    //     }
    //   }
      hasCompletedApproval = true;

      setExecutingLabel('Staking');
    //   await stakeNfts(
    //     pendingNfts.map((nft) => ({...nft, amount: 1})),
    //     stakedNfts
    //   );
    //   onStaked();
      toast.success('Staking successful!');
    } catch (e: any) {
      console.log(e);
      if (!hasCompletedApproval) {
        toast.error('Approval failed. Please try again.');
      } else {
        toast.error('Staking failed. Please try again.');
      }
    } finally {
      setIsExecutingClaim(false);
      setExecutingLabel('');
    }

  }, []);

  const handleClose = () => {
    onClose();
  }
  useEffect(() => {
    console.log("battleRewards: ", battleRewards);
    console.log("battleRewards.tokenIds: ", battleRewards.tokenIds);
  }, [battleRewards])

  return (
    <>
    {!battleRewards.tokenIds ?  (<></>) :(

    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Claim Battle Rewards'
      size='5xl'
      isCentered={false}
    >
    <Flex direction={{base: 'column', md: 'row'}} my={6} px={4}>
    <Wrap>
      {[...Array(battleRewards.tokenIds.length).fill(0)].map((_, index) => {
        return (
          <WrapItem key={index}>
            {!!battleRewards.tokenIds[index] ? (
              <Box position='relative'>
                <Box
                  bg='#376dcf'
                  p={2}
                  rounded='xl'
                //   border={pendingNfts[index].isAlreadyStaked ? 'none' : '2px dashed #ffa71c'}
                >
                  <Box
                    width={100}
                    height={100}

                  >
                      <Text>Token id: {battleRewards.tokenIds[index]}</Text>

                    {/* <Image src={ImageService.translate(pendingNfts[index].image).fixedWidth(100, 100)} rounded='lg'/> */}
                  </Box>
                  <Flex fontSize='xs' justify='space-between' mt={1}>
                    <Flex marginLeft='auto'>
                      {/* <Icon as={FontAwesomeIcon} icon={faAward} /> */}
                      <Text>x{battleRewards.quantity[index]}</Text>
                      {/* <Box as='span'>{pendingNfts[index].rank ?? ''}</Box> */}
                    </Flex>
                    {/* <Box as='span' fontWeight='bold'>+ {collections.find(c => caseInsensitiveCompare(c.address, pendingNfts[index].nftAddress))?.multipliers[0].value}</Box> */}
                  </Flex>
                </Box>

                <Box
                  position='absolute'
                  top={0}
                  right={0}
                  pe='3px'
                >
                  {/* <IconButton
                    icon={<CloseIcon boxSize={2} />}
                    aria-label='Remove'
                    bg='gray.800'
                    _hover={{ bg: 'gray.600' }}
                    size='xs'
                    rounded='full'
                    // onClick={() => onRemove(pendingNfts[index].nftAddress, pendingNfts[index].nftId)}
                  /> */}
                </Box>
              </Box>
            ) : (
              <Box position='relative'>
                <Box
                  p={2}
                  rounded='xl'
                >
                  <Box
                    width={100}
                    height={100}
                    bgColor='#716A67'
                    rounded='xl'
                  >
                    <ShrineIcon boxSize='100%' fill='#B1ADAC'/>
                  </Box>
                </Box>
              </Box>
            )}
          </WrapItem>
        )
      })}
    </Wrap>
    <Box ms={8} my={{base: 4, md: 'auto'}} textAlign='center'>
        {battleRewards.tokenIds.length === 0 ? (
            <Text fontSize='sm' color='gray.400'>No rewards to claim</Text>
        ) : (
            <RdButton
                minW='150px'
                onClick={handleClaim}
                isLoading={isExecutingClaim}
                disabled={isExecutingClaim}
                stickyIcon={true}
                >
                <>{isExecutingClaim ? executingLabel : 'Claim'}</>
            </RdButton>
          )}
    </Box>
  </Flex>
    </RdModal>
         ) }
         </>
  )
}

export default ClaimRewards;