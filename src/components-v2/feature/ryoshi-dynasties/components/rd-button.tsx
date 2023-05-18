import {Box, BoxProps, ButtonProps, Image} from "@chakra-ui/react";
import React, {useState} from "react";
import localFont from "next/font/local";

const gothamMedium = localFont({ src: '../../../../fonts/GothamMedium.woff2' })

interface RdButtonProps extends ButtonProps {
  stickyIcon?: boolean;
  hideIcon?: boolean;
}

const RdButton = (props: RdButtonProps) => {
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <Box
      as='button'
      borderColor='#D24547'
      color='#FFF !important'
      fontSize='2xl'
      borderRadius='2px'
      position='relative'
      borderWidth='6px 0px 6px 0px'
      data-group
      className='rd-button'
      px={1}
      onMouseEnter={() => setIsSpinning(!!props.stickyIcon)}
      onMouseLeave={() => setIsSpinning(false)}
      _active={{
        borderColor: '#FFFFFF'
      }}
      bgColor='transparent !important'
      {...props as BoxProps}
    >
      {!props.hideIcon && (
        <Image
          src={isSpinning || props.isLoading ? '/img/ryoshi/fortune-token.gif' : '/img/ryoshi/fortune-token.png'}
          position='absolute'
          left='5px'
          top='50%'
          transform='translate(-50%, -50%)'
          w='70px'
          _groupFocus={{
            visibility: 'visible',
          }}
          _groupHover={{
            visibility: 'visible',
          }}
          visibility={props.stickyIcon ? 'visible' : 'hidden'}
        />
      )}
      <Box
        px={0}
        py={1}
        bg='linear-gradient(to left, #FDAB1A, #FD8800)'
        _groupHover={{ bg: 'linear-gradient(to left, #FFE818, #FFD001)' }}
        ps={props.stickyIcon ? '40px' : '0px'}
        pe={props.stickyIcon ? '6px' : '0px'}
        className={gothamMedium.className}
      >
        <Box px={3}>
          {props.children}
        </Box>
      </Box>
    </Box>
  )
}

export default RdButton;