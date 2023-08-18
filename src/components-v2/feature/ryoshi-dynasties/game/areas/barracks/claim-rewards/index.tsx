import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem, Heading} from "@chakra-ui/react"

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
import {getBattleRewards} from "@src/core/api/RyoshiDynastiesAPICalls";
import ImageService from "@src/core/services/image";
import {nftCardUrl} from "@src/helpers/image";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {appUrl, caseInsensitiveCompare, round} from "@src/utils";
import {FullCollectionsQuery} from "@src/core/api/queries/fullcollections";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {darkTheme, lightTheme} from "@src/Theme/theme";
const config = appConfig();

import axios from "axios";
import { set } from "lodash";
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
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingLabel, setExecutingLabel] = useState('');
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);
  const [isLoading, getSigner] = useCreateSigner();
  const [nftImages, setNftImages] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const fetcher = async () => {
    // let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
    //
    // if (!signatureInStorage) {
    //   const { signature } = await getSigner();
    //   signatureInStorage = signature;
    // }
    // if (signatureInStorage) {
      return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
    // }

  }

  const handleClose = () => {
    onClose();
  }
  const {data} = useQuery(
    ['RyoshiDailyCheckin', user.address],
    fetcher,
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false,
    }
  );
  const checkForBattleRewards = async () => {
    if (!user.address) return;

    let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      return await getBattleRewards(user.address.toLowerCase(), signatureInStorage);
    }

    return null;
  }
  const claimBattleRewards = async () => {
    if (!user.address) return;

    let signatureInStorage: string | null | undefined = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
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
      {[...Array(battleRewards?.tokenIds?.length).fill(0)].map((_, index) => {
        return (
          <WrapItem key={index}>
            {!!battleRewards.tokenIds[index] ? (
              <Box position='relative'>
                <Box
                  className="card eb-nft__card h-100 shadow"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  _hover={{
                    borderColor:useColorModeValue('#595d69', '#ddd'),
                  }}
                >
                  <Box
          _groupHover={{
            background:useColorModeValue('#FFFFFF', '#404040'),
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
              _groupHover={{background: useColorModeValue(lightTheme.textColor4, darkTheme.textColor4), color:lightTheme.textColor1}}
              px={4}
              py={1}
            >
              <div className="d-flex justify-content-between">
                <Box
                  // _groupHover={{visibility:'visible', color:lightTheme.textColor1}}
                  // visibility="hidden"
                  justifyContent='space-between'
                >
                  <Heading  as="h6" size="sm" className="card-title mt-auto mb-1">{GetTokenName(battleRewards.tokenIds[index])}</Heading>
                  <Heading  as="h6" size="sm" className="card-title mt-auto mb-1">x{battleRewards.quantity[index]}</Heading>
                </Box>
                
              </div>
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
        )
      })}
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