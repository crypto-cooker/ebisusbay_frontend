import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  Center
} from "@chakra-ui/react";
import RdButton from "../../../components/rd-button";
import {useAppSelector} from "@src/Store/hooks";

interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
  const user = useAppSelector((state) => state.user);
  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'} p={2} rounded='md' w={{base: '345px', sm: '200px'}}>
          <Center>
            <RdButton
              pointerEvents='auto'
              fontSize='m'
              hideIcon={true}
              onClick={onBack}
            >
              Back to Village
            </RdButton>
          </Center>
        </Box>
      </Flex>
    </Box>
  )
}