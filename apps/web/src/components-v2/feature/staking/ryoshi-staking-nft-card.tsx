import React, {memo, useState} from 'react';
import {useRouter} from 'next/router';
import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import {faInfoCircle, faLink, faMinus, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MenuPopup} from '@src/Components/components/chakra-components';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {nftCardUrl} from "@src/helpers/image";
import {Badge, Box, Center, Flex, Heading, Spacer, Text, useClipboard, useColorModeValue} from "@chakra-ui/react";
import {appUrl, ciEquals, round} from "@market/helpers/utils";
import {darkTheme, lightTheme} from "@src/global/theme/theme";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {useAppSelector} from "@market/state/redux/store/hooks";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";

interface RyoshiStakingNftCardProps {
  nft: any;
  canStake?: boolean;
  isStaked?: boolean;
  onAddToCartButtonPressed: () => void;
  onRemoveFromCartButtonPressed: () => void;
}

const RyoshiStakingNftCard = ({
   nft,
   canStake = false,
   isStaked = false,
   onAddToCartButtonPressed,
   onRemoveFromCartButtonPressed,
 }: RyoshiStakingNftCardProps) => {
  const router = useRouter();
  const nftUrl = appUrl(`/collection/${nft.chain}/${nft.nftAddress}/${nft.nftId}`);
  const [isHovered, setIsHovered] = useState(false);
  const ryoshiStakingCart = useAppSelector((state) => state.ryoshiStakingCart);
  const { onCopy } = useClipboard(nftUrl.toString());

  const handleCopyLinkButtonPressed = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const handleViewDetailsButtonPressed = () => {
    router.push(nftUrl)
  };

  const navigateTo = (link: string) => {
    if (ryoshiStakingCart.isDrawerOpen) {
      if (isInCart()) {
        onRemoveFromCartButtonPressed();
      } else {
        onAddToCartButtonPressed();
      }
    } else {
      window.open(link, '_blank');
    }
  };

  const getOptions = () => {
    const options = [];

    if (isStaked) {
      options.push({
        icon: faMinus,
        label: 'Unstake',
        handleClick: onAddToCartButtonPressed,
      });
    } else if (canStake) {
      options.push({
        icon: faPlus,
        label: 'Stake',
        handleClick: onAddToCartButtonPressed,
      });
    }

    options.push({
      icon: faInfoCircle,
      label: 'View Details',
      handleClick: handleViewDetailsButtonPressed,
    });

    options.push({
      icon: faLink,
      label: 'Copy link',
      handleClick: handleCopyLinkButtonPressed,
    });

    return options;
  };

  const isInCart = () => {
    return ryoshiStakingCart.nfts.some((o) => o.nft.nftId === nft.nftId && ciEquals(o.nft.nftAddress, nft.nftAddress));
  };

  return (
    <Box
      className="card eb-nft__card h-100 shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-group
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
          <div className="card-img-container position-relative">
            <>
              {isInCart() ? (
                <Box
                  top={0}
                  right={0}
                  position="absolute"
                  zIndex={2}
                  p={2}
                  cursor="pointer"
                  onClick={onRemoveFromCartButtonPressed}
                >
                  <FontAwesomeIcon icon={faCheckCircle} size="xl" style={{background:'dodgerblue', color:'white'}} className="rounded-circle"/>
                </Box>
              ) : (
                <Box
                  _groupHover={{display:'inline', transition:'0.3s ease', opacity: 1}}
                  transition="0.3s ease"
                  display="inline"
                  opacity={0}
                  top={0}
                  right={0}
                  position="absolute"
                  zIndex={2}
                  p={2}
                  cursor="pointer"
                  onClick={onAddToCartButtonPressed}
                >
                  <FontAwesomeIcon icon={faPlusCircle} size="xl" style={{background:'white', color:'grey'}} className="rounded-circle" />
                </Box>
              )}
            </>
            <Box
              _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
              transition="0.3s ease"
              transform="scale(1.0)"
              cursor="pointer"
              onClick={() => navigateTo(nftUrl.toString())}
            >
              <AnyMedia image={nftCardUrl(nft.nftAddress, nft.image)}
                        title={nft.name}
                        newTab={true}
                        className="card-img-top marketplace"
                        height={440}
                        width={440}
                        video={ryoshiStakingCart.nfts.length > 0 ? undefined : (nft.video ?? nft.animation_url)}
                        usePlaceholder={true}
              />
            </Box>
          </div>
          {nft.rank && typeof nft.rank === 'number' && (
            <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>
          )}
          <div className="d-flex flex-column p-2 pb-1">
            <div className="mt-auto">
              <span onClick={() => navigateTo(nftUrl.toString())} style={{ cursor: 'pointer' }}>
                {nft.count && nft.count > 0 ? (
                  <Heading as="h6" size="sm">
                    {nft.name} (x{nft.count})
                  </Heading>
                ) : (
                  <Heading as="h6" size="sm">{nft.name}</Heading>
                )}
              </span>
            </div>
            <span className="card-text">
              {nft.listed && nft.price ? (
                <Flex alignItems='center'>
                  <CronosIconBlue boxSize={4} />
                  <span className="ms-1">
                    {ethers.utils.commify(round(nft.price, 2))}
                  </span>
                </Flex>
              ) : (
                <>&nbsp;</>
              )}
            </span>

            {isStaked && (
              <Badge variant='outline' colorScheme='orange'>
                <Center>
                  STAKED
                </Center>
              </Badge>
            )}
          </div>
          <Spacer />
          <Box
            borderBottomRadius={15}
            _groupHover={{background: useColorModeValue(lightTheme.textColor4, darkTheme.textColor4), color:lightTheme.textColor1}}
            px={4}
            py={1}
          >
            <div className="d-flex justify-content-between">
              <Box
                _groupHover={{visibility:'visible', color:lightTheme.textColor1}}
                visibility="hidden"
              >
                {isStaked ? (
                  <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={onRemoveFromCartButtonPressed}>Unstake</Text>
                ) : canStake && (
                  <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={onAddToCartButtonPressed}>Stake</Text>
                )}
              </Box>
              <MenuPopup options={getOptions()} />
            </div>
          </Box>
        </Flex>
      </Box>
    </Box>

  );
};

export default memo(RyoshiStakingNftCard);
