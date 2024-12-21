import { Box, Image } from '@chakra-ui/react';
import React, { useContext } from 'react';
import {
  BankStakeNftContext,
  BankStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context';

interface StakingSlotProps {
  onSelect: () => void;
}

const StakingSlotMit = ({onSelect}: StakingSlotProps) => {
  const { pendingItems } = useContext(BankStakeNftContext) as BankStakeNftContextProps;

  const handleClick = () => {
    onSelect();
  };

  return (
    <Box w='120px'>
      {!!pendingItems.mit ? (
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