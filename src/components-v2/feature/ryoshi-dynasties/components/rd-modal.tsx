import {Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
import {ReactNode, useEffect, useState} from "react";
import localFont from "next/font/local";
import {CloseIcon} from "@chakra-ui/icons";

const gothamBook = localFont({ src: '../../../../fonts/Gotham-Book.woff2' })


interface PurchaseDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  title: string;
  utilBtnTitle?: ReactNode;
  onUtilBtnClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'| '4xl'| '5xl' | 'full';
  isCentered?: boolean;
}

const RdModal = ({isOpen, onClose, title, utilBtnTitle, onUtilBtnClick, size, isCentered, children}: PurchaseDialogProps) => {
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

  useEffect(() => {

  }, [onClose, onUtilBtnClick]);

  return (
    <>
      <Modal
        onClose={() => {}}
        isOpen={isOpen}
        size={size ?? '2xl'}
        scrollBehavior={size === 'full' ? 'outside' : 'inside'}
        isCentered={isCentered ?? true}
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
                    {title}
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


export default RdModal;