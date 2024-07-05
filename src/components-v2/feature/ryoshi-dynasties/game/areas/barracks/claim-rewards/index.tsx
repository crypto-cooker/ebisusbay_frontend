import {Box, Center, Flex, Heading, Image, SimpleGrid, Spacer, Spinner, Text} from "@chakra-ui/react"

import React, {useState} from 'react';
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Resources from "@src/global/contracts/Resources.json";
import {Contract} from "ethers";
import {createSuccessfulTransactionToastContent} from "@market/helpers/utils";
import {ApiService} from "@src/core/services/api-service";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {darkTheme, lightTheme} from "@src/global/theme/theme";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {useQuery} from "@tanstack/react-query";
import {RdModalBody} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";

const config = appConfig();

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClaimRewards = ({isOpen, onClose}: StakeNftsProps) => {
  const user = useUser();
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {signature} = useEnforceSignature();
  const cardBg = useColorModeValue('#FFFFFF', '#404040');
  const bg = useColorModeValue(lightTheme.textColor4, darkTheme.textColor4);

  const handleClose = () => {
    onClose();
  }

  const { data, status, error } = useQuery({
    queryKey: ['BarracksBattleCards', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getBattleCardsByWallet(user.address!.toLowerCase(), signature),
    refetchOnWindowFocus: false,
    enabled: !!user.address && !!signature
  });

  const { data: resourceNfts } = useQuery({
    queryKey: ['BarracksBattleCardsNftInfo', user.address],
    queryFn: () => ApiService.withoutKey().getCollectionItems({
      address: config.contracts.resources,
      pageSize: 1000
    }),
    refetchOnWindowFocus: false,
    enabled: !!data
  });

  const claimBattleRewards = async () => {
    if (!user.address) return;

    try {
      setIsExecutingClaim(true);

      const request = await ApiService.withoutKey().ryoshiDynasties.requestBattleCardsWithdrawalAuthorization(user.address.toLowerCase(), signature);

      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(request.approval, request.signature);

      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      onClose();
    } catch (error) {
      console.log(error)
      setIsExecutingClaim(false)
    }
  }

  const GetTokenImage = (tokenId: number) => {
    if (!resourceNfts) return;

    let nftImage = resourceNfts.data.find((nftImage) => nftImage.id.toString() === tokenId.toString());
    if(!nftImage) return ('');

    return nftImage.image;
  }

  const GetTokenName = (tokenId: number) => {
    if (!resourceNfts) return;

    let nftName = resourceNfts.data.find((nftImage) => Number(nftImage.id) === tokenId);
    if(!nftName) return ('');

    return nftName.name;
  }

  return (
    <>
      <RdModal
        isOpen={isOpen}
        onClose={handleClose}
        title='Claim Battle Rewards'
        size='5xl'
        isCentered={false}
      >
        <RdModalBody>
          <Box textAlign='center' mt={4}>
            <Text>Compete against factions on the battle map for a chance to earn battle cards. Battle cards can be traded in at the Town Hall in exchange for additional Ryoshi.</Text>
          </Box>
          {status === 'pending' ? (
            <Center>
              <Spinner />
            </Center>
          ) : status === "error" ? (
            <p>Error: {(error as any).message}</p>
          ) : !!data && data.length > 0 ? (
            <>
              <SimpleGrid
                columns={{base: 2, sm: 3, md: 5}}
                gap={3}
              >
                {data.map((battleReward) => (
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
                                src = {GetTokenImage(battleReward.tokenId)}
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
                              <Heading isTruncated width={140} as="h6" size="sm" className="mt-auto mb-1">{GetTokenName(battleReward.tokenId)}</Heading>
                              <Heading  as="h6" size="sm" className="mt-auto mb-1">x{battleReward.amount}</Heading>
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
                ))}
              </SimpleGrid>
              <Flex justify='center' my={4}>
                <RdButton
                  minW='150px'
                  onClick={claimBattleRewards}
                  isLoading={isExecutingClaim}
                  disabled={isExecutingClaim}
                  stickyIcon={true}
                  loadingText='Claiming'
                >
                  Claim
                </RdButton>
              </Flex>
            </>
          ) : (
            <Box textAlign='center' mt={8}>
              <Text>No rewards to claim. Initiate battles against factions on the battle map to earn more.</Text>
            </Box>
          )}
        </RdModalBody>
      </RdModal>
    </>
  )
}

export default ClaimRewards;