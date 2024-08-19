import {Button, ButtonProps, useColorModeValue} from "@chakra-ui/react";

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button
      variant='primary'
      fontSize={props.fontSize ?? props.size ?? 'sm'}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export const SecondaryButton = (props: ButtonProps) => {
  const borderColor = useColorModeValue('gray.300', 'white');

  return (
    <Button
      variant='outline'
      fontSize={props.fontSize ?? props.size ?? 'sm'}
      borderColor={borderColor}
      {...props}
    >
      {props.children}
    </Button>
  )
}