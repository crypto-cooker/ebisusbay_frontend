import {
  Avatar,
  Box,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { Card } from '@src/components-v2/foundation/card';
import useMirrorCollection from '@dex/swap/imported/pancakeswap/web/hooks/useMirrorCollection';
import Link from 'next/link';
import { useActiveChainId } from '@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId';
import Blockies from 'react-blockies';
import ImageService from '@src/core/services/image';
import { getTheme } from '@src/global/theme/theme';
import { useUser } from '@src/components-v2/useUser';
import { MapiCollectionBlacklist } from '@src/core/services/api-service/mapi/types';
import { WarningIcon } from '@chakra-ui/icons';
import { BlueCheckIcon } from '@src/components-v2/shared/icons/blue-check';
import { isCollectionListable, siPrefixedNumber } from '@market/helpers/utils';
import { commify } from 'ethers/lib/utils';
import { chainPaths } from '@src/components-v2/feature/info/state/constants';

interface MirrorNFTProps {
  currencyId: string | undefined;
}

const MirrorNFT: FC<MirrorNFTProps> = ({ currencyId }) => {
  const { mirrorCollection: collection, collectionStats } = useMirrorCollection(currencyId);
  const chainId = useActiveChainId();
  const chainPath = chainPaths[chainId.chainId];
  const user = useUser();

  if (collection) {
    return (
      <Box w="full" mt={2} justifyContent={'flex-end'} fontSize="sm">
        <Card>
          <Link href={`/collection/${chainPath}/${collection.address}`}>
            <Flex
              flexDirection={{ base: 'column', sm: 'row' }}
              gap={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack w={{ base: 100, sm: 90 }}>
                <Box position="relative">
                  {collection.metadata.avatar ? (
                    <Avatar
                      src={ImageService.translate(collection.metadata.avatar).fixedWidth(150, 150)}
                      rounded="full"
                      size={{ base: 'lg', sm: 'md' }}
                      border={`6px solid ${getTheme(user.theme).colors.bgColor1}`}
                      bg={getTheme(user.theme).colors.bgColor1}
                    />
                  ) : (
                    <Blockies seed={collection.address.toLowerCase()} scale={10} />
                  )}
                  {collection.blacklisted === MapiCollectionBlacklist.PENDING ? (
                    <Popover>
                      <PopoverTrigger>
                        <Box position="absolute" bottom='6%' right='10%' cursor="pointer">
                          <WarningIcon boxSize={6} />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>This collection is unverified. Trade at your own risk!</PopoverBody>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    collection.verification.verified && (
                      <Box position="absolute" bottom='6%' right='10%'>
                        <BlueCheckIcon boxSize={3} />
                      </Box>
                    )
                  )}
                </Box>
                <Box fontSize={{ base: 'sm', sm: 'xs' }} textAlign={'center'}>
                  {collection.name}
                </Box>
              </VStack>
              {/* <Box className="fs-4 mt-2">
                <SocialsBar address={collection.address} socials={collection.metadata} />
              </Box> */}
              <Flex>
                {collection &&
                  (collectionStats ? (
                    <Box className="mx-auto">
                      <Box className="nft_attr_1">
                        <Box className="collection_info_bar">
                          <Box minW={['50%', '100px', '72px']}>
                            <h5>Items</h5>
                            <h4>{collectionStats.totalSupply ? commify(collectionStats.totalSupply) : '-'}</h4>
                          </Box>
                          <Box minW={['50%', '100px', '72px']}>
                            <h5>Volume</h5>
                            <h4>
                              {collectionStats.totalVolume ? (
                                <>{siPrefixedNumber(Number(collectionStats.totalVolume).toFixed(0))} CRO</>
                              ) : (
                                <>-</>
                              )}
                            </h4>
                          </Box>
                          <Box minW={['50%', '100px', '72px']}>
                            <h5>Sales</h5>
                            <h4>
                              {collectionStats.numberOfSales ? (
                                <>{siPrefixedNumber(collectionStats.numberOfSales)}</>
                              ) : (
                                <>-</>
                              )}
                            </h4>
                          </Box>
                          <Box minW={['50%', '100px', '72px']}>
                            <h5>Avg. Sale</h5>
                            <h4>
                              {collectionStats.averageSalePrice ? (
                                <>{siPrefixedNumber(Number(collectionStats.averageSalePrice).toFixed(0))} CRO</>
                              ) : (
                                <>-</>
                              )}
                            </h4>
                          </Box>
                          <Box minW={['50%', '100px', '72px']}>
                            <h5>Active Listings</h5>
                            <h4>
                              {collectionStats.numberActive ? (
                                <>{siPrefixedNumber(collectionStats.numberActive)}</>
                              ) : (
                                <>-</>
                              )}
                            </h4>
                          </Box>
                          <Box minW={['50%', '100px', '72px']}>
                            <h5>Floor</h5>
                            <h4>
                              {!isCollectionListable(collection) &&
                              collectionStats.numberActive > 0 &&
                              collectionStats.floorPrice ? (
                                <>{siPrefixedNumber(Number(collectionStats.floorPrice).toFixed(0))} CRO</>
                              ) : (
                                <>-</>
                              )}
                            </h4>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Spinner />
                  ))}
              </Flex>
            </Flex>
          </Link>
        </Card>
      </Box>
    );
  } else {
    return null;
  }
};

export default MirrorNFT;
