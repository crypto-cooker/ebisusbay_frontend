import React, {memo, useState} from 'react';
import {nftCardUrl} from "@src/helpers/image";
import {Box, Center, Flex, Heading, Spacer, VStack, useColorModeValue} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {BoosterSlot} from "@src/components-v2/feature/brand/tabs/staking/types";

type BoostSlotCardProps = {
  slot: BoosterSlot;
  onUnstake: (slot: BoosterSlot) => void;
  onSelect: (slot: BoosterSlot) => void;
  isSelected: boolean;
}

const BoostSlotCard = ({slot, onUnstake, onSelect, isSelected}: BoostSlotCardProps) => {
  const [executing, setExecuting] = useState(false);

  const handleUnstake = async () => {
    try {
      setExecuting(true);
      await onUnstake(slot);
    } finally {
      setExecuting(false);
    }
  }

  return (
    <Box
      className="card eb-nft__card h-100 shadow"
      borderColor={isSelected ? useColorModeValue('#595d69', '#ddd') : 'auto'}
    >
      <Box
          borderRadius={'15px'}
          transition="0.3s ease"
          height="100%"
          background={isSelected ? useColorModeValue('#FFFFFF', '#404040') : 'auto'}
      >
        {slot.nft ? (
          <Flex direction="column" height="100%">
            <div className="card-img-container position-relative">
              <AnyMedia image={nftCardUrl(slot.nft.address, slot.nft.image)}
                        title={slot.nft.name}
                        newTab={true}
                        className="card-img-top marketplace"
                        height={440}
                        width={440}
                        video={slot.nft.video ?? slot.nft.animation_url}
                        usePlaceholder={true}
              />
            </div>
            {slot.nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{slot.nft.rank}</div>}
            <div className="d-flex flex-column p-2 pb-1">
              <div className="mt-auto">
                {slot.nft.count && slot.nft.count > 0 ? (
                    <Heading as="h6" size="sm">
                      {slot.nft.name} (x{slot.nft.count})
                    </Heading>
                ) : (
                    <Heading as="h6" size="sm">{slot.nft.name}</Heading>
                )}
              </div>
            </div>
            <Spacer />
            <Box
                borderBottomRadius={15}
                p={2}
            >
              <Flex>
                <Button type="legacy"
                        onClick={handleUnstake}
                        isLoading={executing}
                        disabled={executing}
                        className="flex-fill"
                >
                  Remove
                </Button>
              </Flex>
            </Box>
          </Flex>
        ) : (
          <Flex direction='column' h='full' p={4}>
            <Spacer />
            <Center>
              <VStack>
                <Box>Empty</Box>
                <Button type="legacy"
                        onClick={() => onSelect(slot)}
                        disabled={isSelected}
                        className="flex-fill"
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </VStack>
            </Center>
            <Spacer />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default memo(BoostSlotCard);
