import React, {memo, useContext} from 'react';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';
import {faInfoCircle, faLink, faMinus, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MenuPopup} from '@src/Components/components/chakra-components';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {nftCardUrl} from "@src/helpers/image";
import {Box, Flex, Heading, Spacer, useClipboard} from "@chakra-ui/react";
import {appUrl} from "@market/helpers/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import WalletNft from "@src/core/models/wallet-nft";
import {
  TownHallStakeNftContext,
  TownHallStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/context";

interface StakingNftCardProps {
  nft: WalletNft;
  onAdd: () => void;
  onRemove: () => void;
}

const StakingNftCard = ({
   nft,
   onAdd,
   onRemove,
 }: StakingNftCardProps) => {
  const router = useRouter();
  const nftUrl = appUrl(`/collection/${nft.nftAddress}/${nft.nftId}`);
  const { onCopy } = useClipboard(nftUrl.toString());
  const townHallStakeNftContext = useContext(TownHallStakeNftContext) as TownHallStakeNftContextProps;
  const isSelected = townHallStakeNftContext.selectedNfts.find((selectedNft) => selectedNft.nftAddress === nft.nftAddress && selectedNft.nftId === nft.nftId);

  const handleCopyLinkButtonPressed = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const handleViewDetailsButtonPressed = () => {
    router.push(nftUrl)
  };

  const handleSelect = () => {
    if (isSelected) {
      onRemove();
    } else {
      onAdd();
    }
  };

  const getOptions = () => {
    const options = [];

    if (isSelected) {
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

  return (
    <Box
      className="card eb-nft__card h-100 shadow"
      data-group
      borderColor={isSelected ? '#F48F0C' : 'inherit'}
      borderWidth={isSelected ? '3px' : '1px'}
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
              {isSelected ? (
                <Box
                  top={0}
                  right={0}
                  position="absolute"
                  zIndex={2}
                  p={2}
                  cursor="pointer"
                  onClick={onRemove}
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
              onClick={handleSelect}
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
          <Flex p={2} pb={1}>
            <Box mt='auto'>
              <Box onClick={handleSelect} style={{ cursor: 'pointer' }} fontSize='sm' fontWeight='bold'>
                {nft.name}
              </Box>
            </Box>
          </Flex>
          <Spacer />
          <Box
            borderBottomRadius={15}
            p={2}
          >
            <div className="d-flex justify-content-between">
              <Spacer />
              <MenuPopup options={getOptions()} />
            </div>
          </Box>
        </Flex>
      </Box>
    </Box>

  );
};

export default memo(StakingNftCard);
