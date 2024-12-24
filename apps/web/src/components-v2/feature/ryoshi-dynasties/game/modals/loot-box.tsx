import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { RdButton, RdModal } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { atom, useAtom } from 'jotai';
import LootBoxBreakdown from '../../components/lootbox-breakdown';
import { RdModalBody, RdModalBox } from '../../components/rd-modal';

export const openedLootboxAtom = atom<any>();

interface LootBoxProps {
  isOpen: boolean;
  onClose: () => void;
}
const LootBoxModal = ({ isOpen, onClose }: LootBoxProps) => {
  const [openedLootbox, setOpenedLootbox] = useAtom(openedLootboxAtom);

  const handleClose = () => {
    setOpenedLootbox(undefined);
    onClose();
  }

  return (
    <RdModal isOpen={isOpen} onClose={handleClose} title="Loot Box">
      <RdModalBody>
        <Box mx={1} pb={4}>
          <Text align="center">
            Loot boxes are rewarded for a variety of reasons such as completing daily task list, weekly streaks, hero
            quests and outright purchase.{' '}
          </Text>
        </Box>
        {openedLootbox ? (
          <VStack>
            <RdModalBox>
              <VStack align='stretch' justify='center'>
                <Box fontWeight='bold'>You have received</Box>
                <HStack padding={2} h='full'>
                  <Box w={10} h={10} justifyItems={'center'} alignItems={"center"}>
                    {openedLootbox.reward.loot.image ? <Image src={openedLootbox.reward.loot.image} /> : <Image src="/img/xp_coin.png" />}
                  </Box>
                  <Box>
                    <Text textAlign='center'>{openedLootbox.reward.loot.name}</Text>
                  </Box>
                </HStack>
              </VStack>
            </RdModalBox>
            <RdButton
              onClick={() => setOpenedLootbox(undefined)}
            >
              Back to Lootboxes
            </RdButton>
          </VStack>
        ) : (
          <LootBoxBreakdown />
        )}
      </RdModalBody>
    </RdModal>
  );
};

export default LootBoxModal;
