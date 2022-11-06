import {Button, Text} from "@chakra-ui/react";
import {SunIcon} from "@chakra-ui/icons";
import React from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";

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
      <SunIcon />
      <Text ms={2} my="auto">Minting</Text>
    </Button>
  )
}

export default MintingButton;