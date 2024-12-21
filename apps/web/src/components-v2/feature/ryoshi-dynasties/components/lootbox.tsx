import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useLootBoxInfo } from '../game/hooks/use-lootbox';
import { LootboxItem, LootboxItemMini } from './lootbox-item';
import RdButton from './rd-button';
import { useCallback, useState } from 'react';
import { ApiService } from '@src/core/services/api-service';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { useUser } from '@src/components-v2/useUser';
import styled from 'styled-components';

export enum BOX_TYPE {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

const BalanceBadge = styled(Badge)`
  position: absolute;
  padding: 1px;
  top: 0;
  right: 0;
  transform: translate(30%, -50%);
  background-color: green;
  border-radius: 50%;
`;

export const getBoxType = (boxType: string) => {
  switch (boxType) {
    case 'common':
      return BOX_TYPE.COMMON;
    case 'rare':
      return BOX_TYPE.RARE;
    case 'epic':
      return BOX_TYPE.EPIC;
    case 'legendary':
      return BOX_TYPE.LEGENDARY;
    default:
      return undefined;
  }
};

export const LootBox = ({ item, onChange }: { item: any; onChange: () => void }) => {
  const { lootboxId } = item;
  const { data: boxInfo, isLoading } = useLootBoxInfo(lootboxId);
  const lootboxItems = boxInfo?.lootboxItems;
  const { requestSignature } = useEnforceSignature();
  const user = useUser();
  const [isOpened, setIsOpend] = useState(false);
  const [rewardData, setRewardData] = useState<any>();
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const openBoxImage = async () => {
    setIsOpend(true);
    setTimeout(() => {
      setIsOpend(false);
    }, 5000);
  };

  const handleOpen = useCallback(async () => {
    const signature = await requestSignature();
    setIsOpening(true);
    const res = ApiService.withoutKey()
      .ryoshiDynasties.openLootBox(lootboxId, user.address as string, signature)
      .then((res) => {
        console.log(res.data, 'HHHHHHHHHHHHHHHHHHHHH');
        openBoxImage();
        onOpen();
        onChange();
        setRewardData(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsOpening(false);
      });
  }, [lootboxId, user]);

  const boxType = item.lootbox.name.split(' ')[0].toLowerCase();

  return (
    <AccordionItem bgColor="#564D4A" rounded="md" my={1} w="full">
      <AccordionButton w="full">
        <Flex justify="space-between" w="full">
          {/* Item Details */}
          <VStack w="50%" display={{ base: 'none', sm: 'flex' }} justify="space-around">
            <Flex alignItems="center">{item.lootbox.name}</Flex>
            <Flex alignItems="center" fontSize={12}>
              {item.lootbox.description}
            </Flex>
          </VStack>

          {/* Lootbox Image */}
          <HStack justify="space-around" w={{ base: 'full', sm: 'unset' }}>
            <Box w={100}>
              {isOpened ? (
                // <Image src={`img/lootbox/${boxType}_chest_no_loop_open.png`} alt="Lootbox Open" />
                <Image src={`img/lootbox/xmas_gift_no_loop.png`} alt="Lootbox Open" />
              ) : (
                <Image src={`img/lootbox/xmas_gift_no_loop_close.png`} alt="Lootbox Closed" />
              )}
            </Box>
            <AccordionIcon ms={4} my="auto" />
          </HStack>
        </Flex>
      </AccordionButton>

      {/* Accordion Panel */}
      <AccordionPanel>
        <Flex justify="space-around" gap={1} flexWrap="wrap">
          {lootboxItems
            ? lootboxItems.map((lootboxItem: any, index: number) => <LootboxItem item={lootboxItem} key={index} />)
            : null}
        </Flex>

        {lootboxItems?.length > 0 && (
          <Flex justify="center" mt={2}>
            <RdButton onClick={handleOpen} position="relative" width="120px">
              {isOpening ? <Spinner /> : 'Open'}
              {item.balance > 1 && <BalanceBadge>{item.balance}</BalanceBadge>}
            </RdButton>
          </Flex>
        )}
      </AccordionPanel>
      {isOpened && (
        <Alert status="success" justifyContent={{base:'center', sm:'space-between'}} alignItems='center' flexDirection={{base: 'column', sm:"row"}}>
          <HStack>
            <AlertIcon />
            <AlertTitle>You received</AlertTitle>
          </HStack>
          <AlertDescription>
            <HStack>
              <LootboxItemMini item={rewardData.reward} />
              <>{`${Number(rewardData.lootboxLog.probability) * 100} %`}</>
            </HStack>
          </AlertDescription>
        </Alert>
      )}
    </AccordionItem>
  );
};
