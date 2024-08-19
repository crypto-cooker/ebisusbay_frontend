import React, {memo, useContext} from 'react';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';
import {faInfoCircle, faLink, faMinus, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MenuPopup} from '@src/Components/components/chakra-components';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {nftCardUrl} from "@src/helpers/image";
import {Box, Flex, Heading, Spacer, useClipboard, useColorModeValue} from "@chakra-ui/react";
import {appUrl, ciEquals} from "@market/helpers/utils";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context";
import WalletNft from "@src/core/models/wallet-nft";

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
  const nftUrl = appUrl(`/collection/${nft.chain}/${nft.nftAddress}/${nft.nftId}`);
  const { onCopy } = useClipboard(nftUrl.toString());
  const barracksStakeNftContext = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;


  const handleCopyLinkButtonPressed = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const handleViewDetailsButtonPressed = () => {
    router.push(nftUrl)
  };

  const handleSelect = () => {
    const count = cartCount();
    const newAdds = count - stakedCount();

    if (count > 0 && newAdds >= (nft.balance ?? 1)) {
      onRemove();
    } else {
      onAdd();
    }
  };

  const getOptions = () => {
    const options = [];
    const count = cartCount();

    if (count > 0 && count > (nft.balance ?? 1)) {
      options.push({
        icon: faMinus,
        label: 'Unstake',
        handleClick: onRemove,
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
    return barracksStakeNftContext.pendingNfts.filter((o) => o.nftId === nft.nftId && ciEquals(o.nftAddress, nft.nftAddress)).length;
  };

  const stakedCount = () => {
    return barracksStakeNftContext.stakedNfts.reduce((acc, o) => {
      if (o.tokenId === nft.nftId && ciEquals(o.contractAddress, nft.nftAddress)) {
        return acc + parseInt(o.amount);
      }
      return acc;
    }, 0);
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
                  {nft.balance && nft.multiToken && cartCount() + nft.balance > 0 ? (
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
          {nft.rank && typeof nft.rank === 'number' && (
            <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>
          )}
          <div className="d-flex flex-column p-2 pb-1">
            <div className="mt-auto">
              <span onClick={handleSelect} style={{ cursor: 'pointer' }}>
                {nft.balance && nft.balance > 1 ? (
                  <Heading as="h6" size="sm">
                    {nft.name} (x{nft.balance})
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
              <MenuPopup options={getOptions()} />
            </div>
          </Box>
        </Flex>
      </Box>
    </Box>

  );
};

export default memo(StakingNftCard);
