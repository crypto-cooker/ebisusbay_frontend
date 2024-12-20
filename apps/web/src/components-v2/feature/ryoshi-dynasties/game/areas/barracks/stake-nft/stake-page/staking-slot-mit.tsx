import { Box, Flex, HStack, Icon, IconButton, Image, VStack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React, { useContext } from 'react';
import { MitNft } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types';
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@src/core/services/api-service';
import { useAppChainConfig, useAppConfig } from '@src/config/hooks';
import { useUser } from '@src/components-v2/useUser';
import ImageService from '@src/core/services/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import { ChainLogo } from '@dex/components/logo';

interface StakingSlotProps {
  onSelect: () => void;
}

const StakingSlotMit = ({onSelect}: StakingSlotProps) => {
  const { stakedMit } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;

  const handleClick = () => {
    onSelect();
  };

  return (
    <Box w='120px'>
      {!!stakedMit ? (
        <Box position='relative'>
          <Box
            p={2}
            cursor='pointer'
          >
            <Box
              width={100}
              height={100}
              onClick={handleClick}
            >
              <Image
                src={'/img/ryoshi-dynasties/icons/mit-active.gif'}
                // src={ImageService.translate('/img/ryoshi-dynasties/icons/mit-active.gif').convert()}
                alt="Materialization Infusion Terminal"
                boxSize='100%'
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box position='relative' overflow='hidden'>
          <Box
            p={2}
            cursor='pointer'
          >
            <Box
              width={100}
              height={100}
              onClick={handleClick}
            >
              <Image
                src={'/img/ryoshi-dynasties/icons/mit-inactive.png'}
                // src={ImageService.translate('/img/ryoshi-dynasties/icons/mit-inactive.png').convert()}
                alt="Materialization Infusion Terminal"
                boxSize='100%'
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default StakingSlotMit;