import {Button, ButtonProps} from "@chakra-ui/react";
import {ReactNode} from "react";

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