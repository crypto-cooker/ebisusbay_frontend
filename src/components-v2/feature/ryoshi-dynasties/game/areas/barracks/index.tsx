import {Box, Button, Center, Container, Flex, Spacer, Text, useDisclosure, VStack,} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft";
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import {useAppSelector} from "@src/Store/hooks";

import localFont from 'next/font/local';
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {useQuery} from "@tanstack/react-query";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import {getBattleRewards} from "@src/core/api/RyoshiDynastiesAPICalls";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import React, {useState} from 'react';
import {ArrowBackIcon} from "@chakra-ui/icons";

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
  const [_, getSigner] = useCreateSigner();
  const [battleRewardsClaimed, setBattleRewardsClaimed] = useState(false);
  const claimedRewards = () => {
    setBattleRewardsClaimed(true);
    onCloseClaimRewards();
    console.log("claimedRewards")
  }
  const checkForBattleRewards = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      return await getBattleRewards(user.address.toLowerCase(), signatureInStorage);
    }

    return null;
  }

  const { data: battleRewards } = useQuery(
    ['BattleRewards', user.address],
    checkForBattleRewards,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false,
    }
  );
  //
  // console.log('BATTLE', battleRewards);

  return (
    <Flex
      border='1px solid #FFD700'
      backgroundColor='#292626'
      flexDirection='column'
      textAlign='center'
      borderRadius={'10px'}
      justifyContent='space-around'
      padding={4}
      minW={{base: '100%', xl: '450px' }}
      boxShadow='0px 0px 10px 0px #000000'
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
            {/* Stake Ryoshi NFTs to receive bonus troops */}
            Claim rewards from your battles
            </Text>
        </Box>
      </Flex>
      <Box>
      <VStack>
        <Spacer h='20'/>

          <div style={{ margin: '8px 24px' }}>
          <Center>
          <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
          {!!battleRewards && (
            <ClaimRewards isOpen={isOpenClaimRewards} onClose={claimedRewards} battleRewards={battleRewards}/>
          )}
        <Container>

        <VStack
          spacing={4}
          align='stretch'
        >
        <Spacer h='20'/>
           <RdButton onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>Stake NFTs</RdButton>
          {(!!battleRewards && !battleRewardsClaimed) &&  (
            <RdButton fontSize='18' onClick={() => handleAuthedNavigation(onOpenClaimRewards)}>Claim Battle Rewards</RdButton>
          )}
        </VStack>
        </Container>
          </Center>
          </div>
        <Spacer h='4'/>
      </VStack>
      </Box>
    </Flex>
  )
};


export default Barracks;