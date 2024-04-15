import {Box, BoxProps, ButtonProps, Flex, Image, ResponsiveValue, useBreakpointValue} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import localFont from "next/font/local";

const gothamMedium = localFont({ src: '../../../../global/assets/fonts/GothamMedium.woff2' })

type Size = 'sm' | 'md' | 'lg';

interface RdButtonProps extends ButtonProps {
  size?: ResponsiveValue<Size>;
  stickyIcon?: boolean;
  hoverIcon?: boolean;
  loadingSpinner?: boolean;
}

const RdButton = ({size = 'lg', stickyIcon, hoverIcon, loadingSpinner = true, ...props}: RdButtonProps) => {
  const [isSpinning, setIsSpinning] = useState(props.isLoading);

  const sizeMappings = {
    sm: {
      fontSize: 'md',
      iconWidth: '55px',
      ps: '25px'
    },
    md: {
      fontSize: 'xl',
      iconWidth: '65px',
      ps: '30px'
    },
    lg: {
      fontSize: '2xl',
      iconWidth: '70px',
      ps: '35px'
    }
  }

  const resolvedSize = useBreakpointValue(size ? typeof size === 'string' ? { base: size } : size : { base: 'lg' });
  const sizes: any = resolvedSize ? sizeMappings[resolvedSize] : {};

  useEffect(() => {
    setIsSpinning(props.isLoading);
  }, [props.isLoading]);

  const [canShowIcon, setCanShowIcon] = useState(false);
  useEffect(() => {
    setCanShowIcon(!!stickyIcon || (!!isSpinning && !!loadingSpinner))
  }, [isSpinning]);

  return (
    <Box
      as='button'
      borderColor='#D24547'
      color='#FFF !important'
      fontSize={sizes.fontSize}
      borderRadius='2px'
      position='relative'
      borderWidth='6px 0px 6px 0px'
      data-group
      className='rd-button'
      px={1}
      _active={{
        borderColor: '#FFFFFF'
      }}
      bgColor='transparent !important'
      {...props as BoxProps}
    >
      {(hoverIcon || stickyIcon || loadingSpinner) && (
        <Image
          src={isSpinning || props.isLoading ? '/img/ryoshi/fortune-token.gif' : '/img/ryoshi/fortune-token.png'}
          position='absolute'
          left='5px'
          top='50%'
          transform='translate(-50%, -50%)'
          w={sizes.iconWidth}
          _groupHover={{
            visibility: hoverIcon || canShowIcon ? 'visible' : 'hidden',
          }}
          visibility={canShowIcon ? 'visible' : 'hidden'}
        />
      )}
      <Flex
        direction='column'
        justify='center'
        px={0}
        py={1}
        bg='linear-gradient(to left, #FDAB1A, #FD8800)'
        _groupHover={{
          bg: 'linear-gradient(to left, #FFE818, #FFD001)' ,
          ps: hoverIcon || canShowIcon ? sizes.ps : '0px',
        }}
        ps={canShowIcon ? sizes.ps : '0px'}
        h='full'
        className={gothamMedium.className}
      >
        <Box px={3}>
          {props.isLoading && !!props.loadingText ? (
            <>{props.loadingText}</>
          ) : (
            <>{props.children}</>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default RdButton;