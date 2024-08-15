import {Button, ButtonProps, Flex, Wrap} from "@chakra-ui/react";
import React, {ReactNode} from "react";

interface RdTabButtonProps {
  children?: ReactNode;
}
const RdTabButton = ({children, ...props}: RdTabButtonProps | ButtonProps) => {
  return (
    <Button
      color='white'
      rounded='full'
      bg={(props as ButtonProps).isActive ? '#F48F0C' : 'none'}
      m={2}
      _active={{
        _after: {
          top: -2,
          right: -2,
          bottom: -2,
          left: -2,
          border: '4px solid #7C5D3B',
          content: "''",
          position: 'absolute',
          borderRadius: '9999px',
        }
      }}
      _hover={{
        bg: (props as ButtonProps).isActive ? '#F48F0C' : '#C17109'
      }}
      className={(props as ButtonProps).isActive ? 'rd-button' : 'none'}
      {...props}
    >
      {children}
    </Button>
  )
};

export default RdTabButton;

export const RdTabGroup = ({children}: { children: ReactNode }) => {
  return (
    <Flex justify="center" align="center">
      <Wrap justify="center" align="center">
        {children}
      </Wrap>
    </Flex>
  )
}