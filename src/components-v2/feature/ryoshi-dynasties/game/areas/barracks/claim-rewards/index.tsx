import {Box, Center, Flex, Heading, Image, Spacer, Text, Wrap, WrapItem} from "@chakra-ui/react"

import React, {useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import Resources from "@src/Contracts/Resources.json";
import {Contract} from "ethers";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";
import {useQuery} from "@tanstack/react-query";
import {getBattleRewards} from "@src/core/api/RyoshiDynastiesAPICalls";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {darkTheme, lightTheme} from "@src/Theme/theme";
import axios from "axios";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

// const ryoshiCollectionAddress = appConfig('collections').find((c: any) => c.slug === 'koban').address;
const api = axios.create({
  baseURL: config.urls.api,
});

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
  battleRewards: any;
}
// interface NftImage {
//   id: number;
//   name: string;
//   image: string;
// }

const ClaimRewards = ({isOpen, onClose, battleRewards}: StakeNftsProps) => {
  const user = useUser();
  const [executingLabel, setExecutingLabel] = useState('');
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);
  const [nftImages, setNftImages] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const {requestSignature} = useEnforceSignature();
  const cardBg = useColorModeValue('#FFFFFF', '#404040');
  const bg = useColorModeValue(lightTheme.textColor4, darkTheme.textColor4);

  const handleClose = () => {
    onClose();
  }

  const checkForBattleRewards = async () => {
    if (!user.address) return;

    const signature = await requestSignature();
    return await getBattleRewards(user.address.toLowerCase(), signature);
  }

  const claimBattleRewards = async () => {
    if (!user.address) return;

    try {
      setIsExecutingClaim(true);
      // console.log('===claimBattleRewards', battleRewards);
      // const mintRequest = {
      //   address: user.address.toLowerCase(),
      //   ids: battleRewards.tokenIds,
      //   amounts: battleRewards.quantity,
      //   expire: battleRewards.expiresAt,
      //   nonce: battleRewards.id};
      const battleRewards3 = await checkForBattleRewards();
      const mintRequest = [user.address.toLowerCase(), battleRewards3.tokenIds, battleRewards3.quantity, battleRewards3.expiresAt, battleRewards3.nonce];
      setExecutingLabel('Claiming...')
      // console.log('===contract', config.contracts.resources, Resources, user.provider.getSigner());
      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(mintRequest, battleRewards3.signature);

      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingLabel('Done!')
      battleRewards = null;
      setIsExecutingClaim(false)
      onClose();
    } catch (error) {
      console.log(error)
      setExecutingLabel('Claim')
      setIsExecutingClaim(false)
    }
  }
  const GetTokenImage = (tokenId: number) => {
    let nftImage = nftImages.find((nftImage) => nftImage.id.toString() === tokenId.toString());
    if(!nftImage) return ('');
    return nftImage.image;
  }
  const GetTokenName= (tokenId: number) => {
    //itterate through nftImages and find the one with the matching tokenId
    let nftName = nftImages.find((nftImage) => Number(nftImage.id) === tokenId);
    // console.log('===nftName', nftName);
    if(!nftName) return ('');

    return nftName.name;
  }

  const GetNftImages = async () => {
    // if(!nftImages) return;

    let data = await api.get("fullcollections?address="+config.contracts.resources);
    // console.log('===data', data.data.nfts);
    setNftImages(data.data.nfts);
  }

  useEffect(() => {
    if(!battleRewards) return;

    GetNftImages();
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
    { !battleRewards || battleRewards.length ===0 || nftImages.length ===0 ? (<>
        <Box minH={'200px'}>
          <Center>
            <Text
              fontSize='sm' 
              color='gray.400'
                margin='100'
              > No rewards to claim </Text>
          </Center>
        </Box>
    </>) :(<>
    <Flex direction={{base: 'column', md: 'row'}} my={6} px={4}>
      <Wrap>
        {[...Array(battleRewards?.tokenIds?.length).fill(0)].map((_, index) => (
          <WrapItem key={index}>
            {!!battleRewards.tokenIds[index] ? (
              <Box position='relative'>
                <Box
                  className="card eb-nft__card h-100 shadow"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  _hover={{
                    borderColor:'#F48F0C',
                  }}
                >
                  <Box
                    _groupHover={{
                      background:cardBg,
                      transition:'0.3s ease'
                    }}
                    borderRadius={'15px'}
                    transition="0.3s ease"
                    height="100%"
                  >
                    <Flex direction="column" height="100%">
                      <div className="card-img-container">
                        <Box
                          _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
                          transition="0.3s ease"
                          transform="scale(1.0)"
                          width={180}
                          height={225}
                        >
                          <Image
                            src = {GetTokenImage(battleRewards.tokenIds[index])}
                            // image={nftCardUrl(listing.nftAddress, listing.nft.image)}
                            // className={`card-img-top ${imgClass}`}
                            // title={listing.nft.name}
                            // url={`/collection/${listing.nftAddress}/${listing.nftId}`}
                            // width={440}
                            // height={440}
                            // video={listing.nft.video ?? listing.nft.animationUrl ?? listing.nft.animation_url}
                            // thumbnail={!!listing.nft.video || !!listing.nft.animationUrl || !!listing.nft.animation_url ? ImageService.translate(listing.nft.video ?? listing.nft.animationUrl ?? listing.nft.animation_url).thumbnail() : undefined}
                            // usePlaceholder={true}
                          />
                        </Box>
                      </div>

                      {/* {listing.nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{listing.nft.rank}</div>} */}

                      <Spacer />
                      <Box
                        borderBottomRadius={15}
                        _groupHover={{background: bg, color:lightTheme.textColor1}}
                        px={4}
                        py={1}
                      >
                        <Box
                          maxW={'100%'}
                          justifyContent='space-between'
                        >
                          <Heading isTruncated width={140} as="h6" size="sm" className="card-title mt-auto mb-1">{GetTokenName(battleRewards.tokenIds[index])}</Heading>
                          <Heading  as="h6" size="sm" className="card-title mt-auto mb-1">x{battleRewards.quantity[index]}</Heading>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                  <Flex fontSize='xs' justify='space-between' mt={4}>
                    <Flex marginLeft='auto'>
                      <Text as='b'></Text>
                    </Flex>
                  </Flex>
                </Box>

                <Box
                  position='absolute'
                  top={0}
                  right={0}
                  pe='3px'
                >
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
        ))}
      </Wrap>
    </Flex>
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
          loadingText={executingLabel}
        >
          Claim
        </RdButton>
      )}
    </Box>
    <Spacer h='12px' />
    </> ) }
    </RdModal>
    </>
  )
}

export default ClaimRewards;