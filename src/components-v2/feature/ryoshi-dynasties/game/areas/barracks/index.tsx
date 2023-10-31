import {AspectRatio, Box, Button, Flex, Image, Text, useDisclosure, VStack,} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft";
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import {useAppSelector} from "@src/Store/hooks";

import localFont from 'next/font/local';
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {useQuery} from "@tanstack/react-query";
import {getBattleRewards} from "@src/core/api/RyoshiDynastiesAPICalls";
import React, {useState} from 'react';
import {ArrowBackIcon} from "@chakra-ui/icons";
import {motion} from "framer-motion";
import ImageService from "@src/core/services/image";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const gothamBook = localFont({
  src: '../../../../../../fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface BarracksProps {
  onBack: () => void;
}

const Barracks = ({onBack}: BarracksProps) => {
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenClaimRewards, onOpen: onOpenClaimRewards, onClose: onCloseClaimRewards} = useDisclosure();
  const [handleAuthedNavigation] = useAuthedFunction();
  const user = useAppSelector((state) => state.user);
  const [battleRewardsClaimed, setBattleRewardsClaimed] = useState(false);
  const {requestSignature} = useEnforceSignature();

  const claimedRewards = () => {
    setBattleRewardsClaimed(true);
    onCloseClaimRewards();
    // console.log("claimedRewards")
  }
  const checkForBattleRewards = async () => {
    if (!user.address) return;

    const signature = await requestSignature();
    return await getBattleRewards(user.address.toLowerCase(), signature);
  }
  const { data: battleRewards } = useQuery({
    queryKey: ['BattleRewards', user.address],
    queryFn: checkForBattleRewards,
    enabled: !!user.address,
    refetchOnWindowFocus: false
  });

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
     }
  }
  return (
    <Box
    position='relative'
    h='calc(100vh - 74px)'
    overflow='hidden'
  >
   <motion.div
      variants={item}
      initial="hidden"
      animate="show"
    >
      <Box 
          position='absolute'
          top={0}
          left={0}
          zIndex={1}
          w='100%'
          h='100%'
          // bg={'#000000'}
          overflow='hidden'
        >
    <Flex
      flexDirection='column'
      textAlign='center'
      justifyContent='space-around'
      padding={4}
      minW={{base: '100%', xl: '450px' }}
      className={gothamBook.className}
    >
      <Flex justify='space-between'>
        <Box
          left={6}
          top={6}
          rounded='full'
          zIndex={1}
          _groupHover={{
            cursor: 'pointer'
          }}
          data-group
        >
          <Button
            bg='#C17109'
            rounded='full'
            border='8px solid #F48F0C'
            w={14}
            h={14}
            onClick={onBack}
            _groupHover={{
              bg: '#de8b08',
              borderColor: '#f9a50b',
            }}
          >
            <ArrowBackIcon boxSize={8} />
          </Button>
        </Box>
        <Box textAlign='end' ms={2}>
          <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} fontWeight='bold'>Barracks</Text>
          <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>
            Claim rewards from your battles
            </Text>
        </Box>
      </Flex>

      <Flex align={'center'} minH={'calc(100vh - 175px)'} justifyContent={'center'}>
        <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
        {!!battleRewards && ( <ClaimRewards isOpen={isOpenClaimRewards} onClose={claimedRewards} battleRewards={battleRewards}/> )}
        <VStack spacing={4} align='stretch'>
          <RdButton onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>Stake NFTs</RdButton>

          {(!!battleRewards && !battleRewardsClaimed) &&  (
            <RdButton fontSize='18' onClick={() => handleAuthedNavigation(onOpenClaimRewards)}>Claim Battle Rewards</RdButton>
          )}
        </VStack>
      </Flex>
    </Flex>
    </Box>

    <AspectRatio ratio={1920/1080} overflow='visible' >
          <Image
          position={'absolute'}
            opacity={0.2}
            zIndex={0}
            src={ImageService.translate('/img/ryoshi-dynasties/village/barracksBackground.png').convert()}
            minH='calc(100vh - 74px)'
          />
        </AspectRatio>

    </motion.div>
  </Box>
  )
};


export default Barracks;