import { RdModal } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { Box, Text } from '@chakra-ui/react';
import { useLootBoxBalance, useLootBoxList } from '../hooks/use-lootbox';
import LootBoxBreakdown from '../../components/lootbox-breakdown';
import { RdModalBody, RdModalBox } from '../../components/rd-modal';

interface LootBoxProps {
  isOpen: boolean;
  onClose: () => void;
}
const LootBoxModal = ({ isOpen, onClose }: LootBoxProps) => {
  return (
    <RdModal isOpen={isOpen} onClose={onClose} title="Loot Box">
      <RdModalBody>
        <Box mx={1} pb={4}>
          <Text align="center">
            Loot boxes are rewarded for a variety of reasons such as completing daily task list, weekly streaks, hero
            quests and outright purchase.{' '}
          </Text>
        </Box>
        <RdModalBox maxH="500px" overflow='auto'>
          <LootBoxBreakdown />
        </RdModalBox>
      </RdModalBody>
    </RdModal>
  );
};

export default LootBoxModal;
