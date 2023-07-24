import React, {memo, useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import {faEllipsisH, faInfoCircle, faLink, faMinus, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MenuPopup} from '@src/Components/components/chakra-components';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {nftCardUrl} from "@src/helpers/image";
import {Badge, Box, Center, Flex, Heading, Spacer, Text, useClipboard} from "@chakra-ui/react";
import Image from "next/image";
import {appUrl, caseInsensitiveCompare, round} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {lightTheme} from "@src/Theme/theme";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {useAppSelector} from "@src/Store/hooks";
import {
  BankStakeNftContext,
  BankStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";

interface StakingNftCardProps {
  nft: any;
  canStake?: boolean;
  isStaked?: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

const StakingNftCard = ({
   nft,
   canStake = false,
   isStaked = false,
   onAdd,
   onRemove,
 }: StakingNftCardProps) => {
  const router = useRouter();
  const nftUrl = appUrl(`/collection/${nft.nftAddress}/${nft.nftId}`);
  const [isHovered, setIsHovered] = useState(false);
  const user = useAppSelector((state) => state.user);
  const ryoshiStakingCart = useAppSelector((state) => state.ryoshiStakingCart);
  const { onCopy } = useClipboard(nftUrl.toString());
  const bankStakeNftContext = useContext(BankStakeNftContext) as BankStakeNftContextProps[];


  const handleCopyLinkButtonPressed = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const handleViewDetailsButtonPressed = () => {
    router.push(nftUrl)
  };

  const navigateTo = (link: string) => {
    const count = cartCount();
    if (count > 0 && count >= (nft.balance ?? 1)) {
      onRemove();
    } else {
      onAdd();
    }
  };

  const getOptions = () => {
    const options = [];
    const count = cartCount();

    if (count > 0 && count >= (nft.balance ?? 1)) {
      options.push({
        icon: faMinus,
        label: 'Unstake',
        handleClick: onAdd,
      });
    } else {
      options.push({
        icon: faPlus,
        label: 'Stake',
        handleClick: onAdd,
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

  const cartCount = () => {
    return bankStakeNftContext.filter((o) => o.nftId === nft.nftId && caseInsensitiveCompare(o.nftAddress, nft.nftAddress)).length;
  };

  return (
    <Box
      className="card eb-nft__card h-100 shadow"
      data-group
      borderColor={cartCount() > 0 ? '#F48F0C' : 'inherit'}
      borderWidth={cartCount() > 0 ? '3px' : '1px'}
      _hover={{
        borderColor:'#F48F0C',
      }}
      borderRadius='19px'
    >
      <Box
        _groupHover={{
          background:useColorModeValue('#FFFFFF', '#404040'),
          transition:'0.3s ease'
        }}
        borderRadius='15px'
        transition="0.3s ease"
        height="100%"
      >
        <Flex direction="column" height="100%">
          <div className="card-img-container position-relative">
            <>
              {cartCount() > 0 ? (
                <Box
                  top={0}
                  right={0}
                  position="absolute"
                  zIndex={2}
                  p={2}
                  cursor="pointer"
                  onClick={onRemove}
                >
                  {nft.balance && nft.balance > 1 ? (
                    <Box
                      rounded='full'
                      bg='dodgerblue'
                      border='2px solid white'
                      w={6}
                      h={6}
                      textAlign='center'
                      fontWeight='bold'
                      fontSize='sm'
                    >
                      {cartCount()}
                    </Box>
                  ) : (
                    <FontAwesomeIcon icon={faCheckCircle} size="xl" style={{background:'dodgerblue', color:'white'}} className="rounded-circle"/>
                  )}
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
                  onClick={onAdd}
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
                        usePlaceholder={true}
              />
            </Box>
          </div>
          {nft.rank && typeof nft.rank === 'number' && (
            <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>
          )}
          <div className="d-flex flex-column p-2 pb-1">
            <div className="card-title mt-auto">
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
          </div>
          <Spacer />
          <Box
            borderBottomRadius={15}
            p={2}
          >
            <div className="d-flex justify-content-between">
              <Spacer />
              <MenuPopup options={getOptions()}>
                <FontAwesomeIcon icon={faEllipsisH} style={{ cursor: 'pointer' }} className="my-auto" />
              </MenuPopup>
            </div>
          </Box>
        </Flex>
      </Box>
    </Box>

  );
};

export default memo(StakingNftCard);
