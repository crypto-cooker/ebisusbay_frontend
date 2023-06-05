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
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import Resources from "@src/Contracts/Resources.json";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {Contract} from "ethers";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";
import {useQuery} from "@tanstack/react-query";

const config = appConfig();

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
  battleRewards: any;
  refreshBattleRewards: () => void;
}

const ClaimRewards = ({isOpen, onClose, battleRewards, refreshBattleRewards}: StakeNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingLabel, setExecutingLabel] = useState('');
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);
  const [isLoading, getSigner] = useCreateSigner();

  const fetcher = async () => {
    // let signatureInStorage = getAuthSignerInStorage()?.signature;
    //
    // if (!signatureInStorage) {
    //   const { signature } = await getSigner();
    //   signatureInStorage = signature;
    // }
    // if (signatureInStorage) {
      return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
    // }

  }
  const {data} = useQuery(
    ['RyoshiDailyCheckin', user.address],
    fetcher,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false,
    }
  );
// const handleClaim = useCallback(async () => {
//     // if (pendingNfts.length === 0 && stakedNfts.length === 0) return;

//     let hasCompletedApproval = false;

//     try {
//       setIsExecutingClaim(true);
//       setExecutingLabel('Approving');

//       hasCompletedApproval = true;

//       setExecutingLabel('Staking');

//       toast.success('Staking successful!');
//     } catch (e: any) {
//       console.log(e);
//       if (!hasCompletedApproval) {
//         toast.error('Approval failed. Please try again.');
//       } else {
//         toast.error('Staking failed. Please try again.');
//       }
//     } finally {
//       setIsExecutingClaim(false);
//       setExecutingLabel('');
//     }

//   }, []);
  const claimBattleRewards = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        setIsExecutingClaim(true);
        // console.log('===claimBattleRewards', battleRewards);
        const mintRequest = [user.address.toLowerCase(), battleRewards.tokenIds, battleRewards.quantity, battleRewards.expiresAt, battleRewards.id];

        setExecutingLabel('Claiming...')
        // console.log('===contract', config.contracts.resources, Resources, user.provider.getSigner());
        const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
        console.log('===request', mintRequest, battleRewards.signature);
        const tx = await resourcesContract.mintWithSig(mintRequest, battleRewards.signature);

        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        setExecutingLabel('Done!')
        battleRewards = null;
        setIsExecutingClaim(false)
        onClose();
        // refreshBattleRewards();
      } catch (error) {
        console.log(error)
        setExecutingLabel('Claim')
        setIsExecutingClaim(false)
      }
    }
  }

  const handleClose = () => {
    onClose();
  }
  useEffect(() => {
        console.log("battleRewards: ", battleRewards); 
    }, [battleRewards])

  return (
    <>
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Claim Battle Rewards'
      size='5xl'
      isCentered={false}
    >
    { !battleRewards || battleRewards.length ===0 ?  (<>
        <Text fontSize='sm' color='gray.400'>No rewards to claim</Text>
    </>) :(
    <Flex direction={{base: 'column', md: 'row'}} my={6} px={4}>
    <Wrap>
      {[...Array(battleRewards?.tokenIds?.length).fill(0)].map((_, index) => {
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
                onClick={claimBattleRewards}
                isLoading={isExecutingClaim}
                disabled={isExecutingClaim}
                stickyIcon={true}
                >
                <>{isExecutingClaim ? executingLabel : 'Claim'}</>
            </RdButton>
          )}
    </Box>
    </Flex>
         ) }
    </RdModal>
    </>
  )
}

export default ClaimRewards;