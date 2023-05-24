import {Box, Flex} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import React from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";

interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
  const user = useAppSelector((state) => state.user);
  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'} p={2} rounded='md' w={{base: '345px', sm: '200px'}}>
          <ReturnToVillageButton onBack={onBack} />
        </Box>
      </Flex>
    </Box>
  )
}