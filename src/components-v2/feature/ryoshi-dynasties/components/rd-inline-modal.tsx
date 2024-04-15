import {Box, BoxProps, Button, Flex, Portal} from "@chakra-ui/react";
import {ReactNode, useContext, useEffect, useState} from "react";
import localFont from "next/font/local";
import {CloseIcon} from "@chakra-ui/icons";
import {
  InlineModalContext,
  InlineModalContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/inline-modal-context";

const gothamBook = localFont({
  src: '../../../../global/assets/fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})


interface RdInlineModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  title: string;
  utilBtnTitle?: ReactNode;
  onUtilBtnClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'| '4xl'| '5xl' | 'full';
  isCentered?: boolean;
}

const RdInlineModal = ({isOpen, onClose, title, utilBtnTitle, onUtilBtnClick, size, isCentered, children}: RdInlineModalProps) => {
  const [hasUtilBtn, setHasUtilBtn] = useState(false);
  const [maskOuterClass, setMaskOuterClass] = useState('');
  const [maskInnerClass, setMaskInnerClass] = useState('');
  const {ref: globalRef, setRef: setGlobalRef} = useContext(InlineModalContext) as InlineModalContextProps;

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

  const handleClose = () => {
    if (onClose) onClose();
  }

  return (
    <Portal containerRef={isOpen ? globalRef! : undefined}>
      <Box
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg='rgba(0, 0, 0, 0.5)'
        display={isOpen ? 'flex' : 'none'}
        justifyContent='center'
        alignItems='center'
        onClick={handleClose}
        py='100px'
      >
        <Box
          borderWidth='1px'
          borderStyle='solid'
          borderLeftColor='#45433C'
          borderRightColor='#684918'
          borderTopColor='#625C4D'
          borderBottomColor='#181514'
          rounded='3xl'
          bg='linear-gradient(#1C1917, #272624, #000000)'
          className={gothamBook.className}
          maxW='672px'
          maxH='calc(100vh - 74px)'
          overflowY='auto'
          onClick={e => e.stopPropagation()}
        >
          <Box color='white' py={2} px={6}>
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
                    onClick={handleClose}
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
          </Box>
        </Box>
      </Box>
    </Portal>
  )
}

export const RdModalBody = ({children}: {children: ReactNode}) => {
  return (
    <Box p={2}>
      {children}
    </Box>
  )
}

export const RdModalFooter = ({children}: {children: ReactNode}) => {
  return (
    <Box p={4}>
      {children}
    </Box>
  )
}

export const RdModalBox = (props: BoxProps) => {
  return (
    <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' {...props}>
      {props.children}
    </Box>
  )
}

export const RdModalAlert = (props: BoxProps) => {
  return (
    <Box p={4} textAlign='center'>
      {props.children}
    </Box>
  )
}

export default RdInlineModal;