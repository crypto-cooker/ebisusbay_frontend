import {Box, BoxProps, ButtonProps, Image} from "@chakra-ui/react";
import React from "react";

interface RdButtonProps extends ButtonProps {
  stickyIcon?: boolean;
}

const RdButton = (props: RdButtonProps) => {
  return (
    <Box
      as='button'
      borderColor='#D24547'
      color='#FFF'
      fontSize='2xl'
      borderRadius='2px'
      position='relative'
      borderWidth='6px 0px 6px 0px'
      data-group
      className='rd-button gotham_medium'
      px={1}
      {...props as BoxProps}
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
        visibility={props.stickyIcon ? 'visible' : 'hidden'}
      />
      <Box
        px={0}
        py={1}
        bg='linear-gradient(to left, #FDAB1A, #FD8800)'
        _groupHover={{ bg: 'linear-gradient(to left, #FFE818, #FFD001)' }}
        _groupActive={{borderColor: '#FFFFFF'}}
      >

        {props.children}
      </Box>
    </Box>
  )
}

export default RdButton;