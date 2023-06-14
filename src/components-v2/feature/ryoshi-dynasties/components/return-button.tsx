import {Box, Button, Flex,} from "@chakra-ui/react";
import React, {useState} from "react";
import {ArrowBackIcon} from "@chakra-ui/icons";


interface ReturnToVillageButtonProps {
  onBack: () => void;
}

const ReturnToVillageButton = ({onBack}: ReturnToVillageButtonProps) => {
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} 
        // bg='#272523EE' 
        p={2} rounded='md' w={{base: '345px', sm: '200px'}}>
          <Button
            color='white'
            bg='#C17109'
            rounded='full'
            border='solid #F48F0C'
            borderWidth={{base: 6, sm: 8}}
            w={{base: 12, sm: 14}}
            h={{base: 12, sm: 14}}
            fontSize='28px'
            onClick={onBack}
            _hover={{
              bg: '#de8b08',
              borderColor: '#f9a50b',
            }}
            pointerEvents='auto'
          >
            <ArrowBackIcon />
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}

export default ReturnToVillageButton;