import React, {memo, useState} from 'react';
import {useRouter} from 'next/router';
import {ethers} from 'ethers';
import {nftCardUrl} from "@src/helpers/image";
import {Badge, Box, Center, Flex, Heading, Spacer} from "@chakra-ui/react";
import Image from "next/image";
import {appUrl, round} from "@market/helpers/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import Button from "@src/Components/components/Button";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";

type StakingNftCardProps = {
  nft: any;
  isStaked?: boolean;
  newTab?: boolean
  onStake: (nftId: string) => void;
  onUnstake: (nftId: string) => void;
}

const StakingNftCard = ({
  nft,
  isStaked = false,
  newTab = false,
  onStake,
  onUnstake
}: StakingNftCardProps) => {
  const history = useRouter();
  const nftUrl = appUrl(`/collection/${nft.nftAddress}/${nft.nftId}`);
  const [executing, setExecuting] = useState(false);

  const navigateTo = (link: URL | string) => {
    if (newTab) {
      window.open(link, '_blank');
    } else {
      history.push(link);
    }
  };

  const handleStake = async () => {
    try {
      setExecuting(true);
      await onStake(nft.nftId);
    } finally {
      setExecuting(false);
    }
  }

  const handleUnstake = async () => {
    try {
      setExecuting(true);
      await onUnstake(nft.nftId);
    } finally {
      setExecuting(false);
    }
  }

  return (
    <Box
      className="card eb-nft__card h-100 shadow"
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
            <Box
              _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
              transition="0.3s ease"
              transform="scale(1.0)"
              onClick={() => navigateTo(nftUrl)}
              cursor="pointer"
            >
              <AnyMedia image={nftCardUrl(nft.address, nft.image)}
                        title={nft.name}
                        newTab={true}
                        className="card-img-top marketplace"
                        height={440}
                        width={440}
                        video={nft.video ?? nft.animation_url}
                        usePlaceholder={true}
              />
            </Box>
          </div>
          {nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>}
          <div className="d-flex flex-column p-2 pb-1">
            <div className="card-title mt-auto">
              <span onClick={() => navigateTo(nftUrl)} style={{ cursor: 'pointer' }}>
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
            p={2}
          >
            <Flex>
              {isStaked ? (
                <Button type="legacy"
                        onClick={handleUnstake}
                        isLoading={executing}
                        disabled={executing}
                        className="flex-fill"
                >
                  Unstake
                </Button>
              ) : (
                <Button type="legacy"
                  onClick={handleStake}
                  isLoading={executing}
                  disabled={executing}
                  className="flex-fill"
                >
                  Stake
                </Button>
              )}
              </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>

  );
};

export default memo(StakingNftCard);
