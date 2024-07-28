import {Box, BoxProps, Button, Flex, HStack, Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
import React, {ReactNode, useEffect, useState} from "react";
import localFont from "next/font/local";
import {CloseIcon} from "@chakra-ui/icons";

const gothamBook = localFont({
  src: '../../../../global/assets/fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})


interface RdModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  title: string;
  utilBtnTitle?: ReactNode;
  onUtilBtnClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'| '4xl'| '5xl' | 'full';
  isCentered?: boolean;
  titleIcon?: ReactNode;
}

const RdModal = ({isOpen, onClose, title, utilBtnTitle, onUtilBtnClick, size, isCentered, titleIcon, children}: RdModalProps) => {
  const [hasUtilBtn, setHasUtilBtn] = useState(false);
  const [maskOuterClass, setMaskOuterClass] = useState('');
  const [maskInnerClass, setMaskInnerClass] = useState('');

  useEffect(() => {
    const _hasUtilBtn = !!utilBtnTitle && !!onUtilBtnClick;
    setHasUtilBtn(_hasUtilBtn);

    let _maskInnerClass = '';
    let _maskOuterClass = '';
    if (_hasUtilBtn && !!onClose) {
      _maskInnerClass = 'rd-bank-modal-masktop-inner';
      _maskOuterClass = 'rd-bank-modal-masktop-outer';
    } else if (_hasUtilBtn && !onClose) {
      _maskInnerClass = 'rd-bank-modal-maskleft-inner';
      _maskOuterClass = 'rd-bank-modal-maskleft-outer';
    } else if (!_hasUtilBtn && !!onClose) {
      _maskInnerClass = 'rd-bank-modal-maskright-inner';
      _maskOuterClass = 'rd-bank-modal-maskright-outer';
    }
    setMaskInnerClass(_maskInnerClass);
    setMaskOuterClass(_maskOuterClass);

  }, [utilBtnTitle, onUtilBtnClick, onClose]);

  return (
    <>
      <Modal
        onClose={onClose ?? (() => {})}
        closeOnEsc={true}
        isOpen={isOpen}
        size={size ?? '2xl'}
        scrollBehavior={size === 'full' ? 'outside' : 'inside'}
        isCentered={isCentered ?? true}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent
          borderWidth='1px'
          borderStyle='solid'
          borderLeftColor='#45433C'
          borderRightColor='#684918'
          borderTopColor='#625C4D'
          borderBottomColor='#181514'
          rounded='3xl'
          bg='linear-gradient(#1C1917, #272624, #000000)'
          className={gothamBook.className}
        >
          <ModalBody color='white'>
            <Box p={2}  position='relative'>
              {hasUtilBtn && (
                <Box
                  position='absolute'
                  left={-4}
                  top={0}
                  rounded='full'
                  zIndex={1}
                  _groupHover={{
                    cursor: 'pointer'
                  }}
                  data-group
                >
                  <Button
                    bg='#C17109'
                    rounded='full'
                    border='8px solid #F48F0C'
                    w={14}
                    h={14}
                    fontSize='28px'
                    color='white'
                    onClick={onUtilBtnClick}
                    _groupHover={{
                      bg: '#de8b08',
                      borderColor: '#f9a50b',
                    }}
                  >
                    {utilBtnTitle}
                  </Button>
                </Box>
              )}
              {!!onClose && (
                <Box
                  position='absolute'
                  right={-4}
                  top={0}
                  rounded='full'
                  zIndex={1}
                  _groupHover={{
                    cursor: 'pointer'
                  }}
                  data-group
                >
                  <Button
                    bg='#C17109'
                    rounded='full'
                    border='8px solid #F48F0C'
                    w={14}
                    h={14}
                    color='white'
                    onClick={onClose}
                    _groupHover={{
                      bg: '#de8b08',
                      borderColor: '#f9a50b',
                    }}
                  >
                    <CloseIcon />
                  </Button>
                </Box>
              )}
              <Box
                bg='#564D4A'
                h='full'
                my={4}
                roundedBottom='2xl'
                roundedTopLeft={hasUtilBtn ? 'none' : '2xl'}
                roundedTopRight={!!onClose ? 'none' : '2xl'}
                className={maskOuterClass}
              >
                <Box
                  color='#FFF'
                  textAlign='center'
                  verticalAlign='middle'
                  className={maskInnerClass}
                  p={1}
                >
                  <Flex
                    roundedTopLeft={hasUtilBtn ? 'none' : '2xl'}
                    roundedTopRight={!!onClose ? 'none' : '2xl'}
                    bg='#272523'
                    h='55px'
                    px={12}
                    fontSize={{base: 'lg', sm: '2xl', md: '3xl'}}
                    my='auto'
                    justify='center'
                    direction='column'
                  >
                    <HStack justify='center'>
                      {titleIcon}
                      <Box>{title}</Box>
                    </HStack>
                  </Flex>
                </Box>
                {children}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export const RdModalBody = ({ children, ...props }: BoxProps & { children?: ReactNode }) => {
  return (
    <Box px={2} pb={2} pt={1} {...props}>
      {children}
    </Box>
  )
}

export const RdModalFooter = ({ children, ...props }: BoxProps & { children?: ReactNode }) => {
  return (
    <Box p={4} {...props}>
      {children}
    </Box>
  )
}

export const RdModalBox = ({ isFooter, children, ...props }: {isFooter?: boolean} & BoxProps & { children?: ReactNode }) => {
  return (
    <Box bgColor='#292626' rounded='md' roundedBottom={isFooter ? 'lg' : 'md'} p={4} fontSize='sm' {...props}>
      {children}
    </Box>
  )
}

export const RdModalBoxHeader = ({ children, ...props }: BoxProps & { children?: ReactNode }) => {
  return (
    <Box textAlign='start' fontWeight='bold' fontSize='lg' {...props}>
      {children}
    </Box>
  )
}
export const RdModalAlert = ({ children, ...props }: BoxProps & { children?: ReactNode }) => {
  return (
    <Box p={4} textAlign='center' {...props}>
      {children}
    </Box>
  )
}

export default RdModal;