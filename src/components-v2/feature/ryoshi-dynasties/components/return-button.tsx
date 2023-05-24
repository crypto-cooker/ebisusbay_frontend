import {
  Box,
  Flex,
  Center,
} from "@chakra-ui/react";
import React, {useState} from "react";

import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button.tsx";


interface ReturnToVillageButtonProps {
  onBack: () => void;
}

const ReturnToVillageButton = ({onBack}: ReturnToVillageButtonProps) => {
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} bg='#272523EE' p={2} rounded='md' w={{base: '345px', sm: '200px'}}>
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

export default ReturnToVillageButton;