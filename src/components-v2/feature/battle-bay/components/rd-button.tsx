import {Box, Button, ButtonProps, Image, Text} from "@chakra-ui/react";
import React from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";

const RdButton = (props: ButtonProps) => {
  return (
    <Button
      as='button'
      bg='#D59728'
      borderColor='#EC7F00'
      color='#FFF6A9'
      fontSize='2xl'
      fontWeight='extrabold'
      px={0}
      py={1}
      borderRadius='2px'
      position='relative'
      borderWidth='4px 0px 4px 0px'
      data-group
      _hover={{ bg: '#FFB01D' }}
      _active={{borderColor: '#FFFFFF',}}
      className='rd-button'
      {...props}
    >
      <Image
        src='/img/ryoshi/fortune-token.png'
        position='absolute'
        left='5px'
        top='50%'
        transform='translate(-50%, -50%)'
        w='70px'
        _groupHover={{
          visibility: 'visible',
        }}
        visibility='hidden'
      />
      {props.children}
    </Button>
  )
}

export default RdButton;