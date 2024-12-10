import { RdModal } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { Box, Text } from '@chakra-ui/react';

interface LootBoxProps {
  isOpen: boolean;
  onClose: () => void;
}
const LootBox = ({ isOpen, onClose }: LootBoxProps) => {
  return (
    <RdModal isOpen={isOpen} onClose={onClose} title="Loot Box">
      <Box mx={1} pb={4}>
        <Text align="center">Loot boxes are rewarded for a variety of reasons such as completing daily task list, weekly streaks, hero quests and outright purchase. </Text>
      </Box>
    </RdModal>
  );
};

export default LootBox;
