import {Box, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem} from "@chakra-ui/react"

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

const ClaimRewards = ({isOpen, onClose, battleRewards}: StakeNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [executingLabel, setExecutingLabel] = useState('');
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);
  const [isLoading, getSigner] = useCreateSigner();
  const [nftImages, setNftImages] = useState<any[]>([]);
  // const query = FullCollectionsQuery.createApiQuery({address: "0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5", token: ids});
    // const nftUrl = appUrl(`/collection/${nft.nftAddress}/${nft.nftId}`);
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
    //itterate through nftImages and find the one with the matching tokenId
    let nftImage = nftImages.find((nftImage) => Number(nftImage.id) === tokenId);
    return nftImage.image;
  }
  const GetTokenName= (tokenId: number) => {
    //itterate through nftImages and find the one with the matching tokenId
    let nftName = nftImages.find((nftImage) => Number(nftImage.id) === tokenId);
    console.log('===nftName', nftName.name);
    return nftName.name;
  }

  const GetNftImages = async () => {
    if(!nftImages) return;

    let data = await api.get("fullcollections?address="+config.contracts.resources);
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
        <Text fontSize='sm' color='gray.400'>No rewards to claim</Text>
    </>) :(<>
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
                    width={120}
                    height={175}
                      // onClick={(e) => {
                      // e.preventDefault();
                      // href=new URL(appUrl(`/collection/0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5/`+battleRewards.tokenIds[index]));
                      // }}
                  >
                      <Text fontSize='10'>{GetTokenName(battleRewards.tokenIds[index])} x{battleRewards.quantity[index]}</Text>
                        <Image
                          src={GetTokenImage(battleRewards.tokenIds[index])}
                        />
                  </Box>
                  <Flex fontSize='xs' justify='space-between' mt={4}>
                    <Flex marginLeft='auto'>
                      {/* <Icon as={FontAwesomeIcon} icon={faAward} /> */}
                      <Text as='b'></Text>
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