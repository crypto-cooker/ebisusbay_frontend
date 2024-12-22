import { Box, Image } from '@chakra-ui/react';
import React, { useContext } from 'react';
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context';
import useMitMatcher from '@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-mit-matcher';
import { WarningIcon } from '@chakra-ui/icons';

interface StakingSlotProps {
  onSelect: () => void;
}

const StakingSlotMit = ({onSelect}: StakingSlotProps) => {
  const { pendingItems } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;
  const { isMitRequirementEnabled } = useMitMatcher();

  const _isMitRequirementEnabled = isMitRequirementEnabled('barracks');

  const handleClick = () => {
    onSelect();
  };

  return (
    <Box w='120px'>
      {!!pendingItems.mit ? (
        <Box>
          <Box p={2} cursor='pointer' position='relative'>
            <Box
              width={100}
              height={100}
              onClick={handleClick}
              filter={_isMitRequirementEnabled ? 'auto' : 'grayscale(80%)'}
              opacity={_isMitRequirementEnabled ? 'auto' : 0.8}
            >
              <Image
                src={'/img/ryoshi-dynasties/icons/mit-active.gif'}
                // src={ImageService.translate('/img/ryoshi-dynasties/icons/mit-active.gif').convert()}
                alt="Materialization Infusion Terminal"
                boxSize='100%'
              />
            </Box>
            {!_isMitRequirementEnabled && (
              <WarningIcon
                boxSize={6}
                color='#F48F0C'
                position='absolute'
                top='50%'
                left='50%'
                transform='translate(-50%, -50%)'
              />
            )}
          </Box>
        </Box>
      ) : (
        <Box overflow='hidden'>
          <Box p={2} cursor='pointer'>
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