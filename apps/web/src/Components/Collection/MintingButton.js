import {Button, HStack, Text, useColorModeValue} from "@chakra-ui/react";
import {SunIcon} from "@chakra-ui/icons";
import React from "react";

const MintingButton = ({onClick}) => {
  const pulseColorClass = useColorModeValue(
    'pulse-animation-light',
    'pulse-animation-dark'
  );

  return (
    <Button
      size="xs"
      ms={2}
      colorScheme="orange"
      onClick={onClick}
      animation={`${pulseColorClass} 1.5s infinite`}
    >
      <HStack spacing={2}>
        <SunIcon />
        <Text>Minting</Text>
      </HStack>
    </Button>
  )
}

export default MintingButton;