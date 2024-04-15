import {
  Box,
  BoxProps,
  Button,
  Center,
  Flex,
  Image,
  Portal,
  useBreakpointValue,
  useEventListener,
  useMediaQuery
} from "@chakra-ui/react";
import {ReactNode, useContext, useEffect, useState} from "react";
import localFont from "next/font/local";
import {
  InlineModalContext,
  InlineModalContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/inline-modal-context";
import ImageService from "@src/core/services/image";

const gothamBook = localFont({
  src: '../../../../global/assets/fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})


interface RdInlineModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  isFAQ?: boolean;
  title?: string;
  utilBtnTitle?: ReactNode;
  onUtilBtnClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'| '4xl'| '5xl' | 'full';
  isCentered?: boolean;
}

const RdAnnouncementModal = ({isOpen, onClose, title, isFAQ, utilBtnTitle, onUtilBtnClick, size, isCentered, children}: RdInlineModalProps) => {
  const [hasUtilBtn, setHasUtilBtn] = useState(false);
  const [maskOuterClass, setMaskOuterClass] = useState('');
  const [maskInnerClass, setMaskInnerClass] = useState('');
  const {ref: globalRef, setRef: setGlobalRef} = useContext(InlineModalContext) as InlineModalContextProps;
  const [isMobile] = useMediaQuery("(max-width: 750px)");
  const snowTheme = true ? '_snow' : ''

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  });

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
  const getBGimage = (isFAQ?:boolean) => {
    return isFAQ  ?'/img/ryoshi-dynasties/announcements/base/modal_back_button_HOVER_1200.png' :
                      '/img/ryoshi-dynasties/announcements/base/modal_question_mark_button_HOVER_1200.png'
  }
  const src = useBreakpointValue<string>(
    {
    base:'/img/ryoshi-dynasties/announcements/base/ryoshi_logo_for_modal_small.png', 
    md:'/img/ryoshi-dynasties/announcements/base/ryoshi_logo_for_modal_1200.png',
    });

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
        >
        <Flex >
        <Box 
          // borderWidth='1px'
          // borderStyle='solid'
          // borderLeftColor='#45433C'
          // borderRightColor='#684918'
          // borderTopColor='#625C4D'
          // borderBottomColor='#181514'
          rounded='3xl'
          bg='linear-gradient(#1f1818, #332727, #1f1818)'
          // bgImage='/img/ryoshi-dynasties/announcements/base/modal_background.png'
          // backgroundImage={isMobile ? '' : '/img/ryoshi-dynasties/announcements/base/modal_background.png'}
          // backgroundRepeat='repeat-y'
          paddingLeft={isMobile ?'10px' :'0'}
          paddingRight={isMobile ?'10px' :'0'}
          className={gothamBook.className}
          maxW={isMobile ?'' :'800px'}
          maxH='calc(100vh - 74px)'
          overflowY={isMobile ?'auto' :'visible'}
          onClick={e => e.stopPropagation()}
        >
          <Center>
          <Image 
            position='relative' 
            minW={isMobile ?'105%' :'105%'}
            mt={[0, "0rem !important"]}
            src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/large_frame_top_1200${snowTheme}.png`).convert()}
            minH={isMobile ? '20px' : '100%'}
          />
          </Center>
          <Box >
            <Box  position='relative'>
              {hasUtilBtn && (
                <Box
                  position='absolute'
                  
                    bgImage={ isFAQ  ? 
                      '/img/ryoshi-dynasties/announcements/base/modal_back_button_1200.png' :
                    '/img/ryoshi-dynasties/announcements/base/modal_question_mark_button_1200.png'}
                    left={isMobile ? 0 : 8}
                    top={0}
                    // rounded='full'
                    zIndex={3}
                  data-group
                >
                  <Button
                    // bg='#C17109' ale autotag
                    // rounded='full'
                    // border='8px solid #F48F0C'
                    w={isMobile ? 20 : 20}
                    h={isMobile ? 24 : 24}
                    fontSize='28px'
                    onClick={onUtilBtnClick}
                    bg={'transparent'}
                    _groupHover={{
                      cursor: 'pointer',
                      bg: 'transparent',
                      bgImage: getBGimage(isFAQ),
                    }}
                  >
                    {/* {utilBtnTitle} */}
                  </Button>
                </Box>
              )}
              {!!onClose && (
                <Box
                  position='absolute'
                  bgImage={'/img/ryoshi-dynasties/announcements/base/modal_close_button_1200.png'}
                  right={isMobile ? 0 : 8}
                  top={0}
                  rounded='full'
                  zIndex={3}
                  data-group
                >
                  <Button
                    bg={'transparent'}
                    w={20}
                    h={24}
                    fontSize='28px'
                    onClick={handleClose}
                    _groupHover={{
                      cursor: 'pointer',
                      bg: 'transparent',
                      bgImage:'/img/ryoshi-dynasties/announcements/base/modal_close_button_HOVER_1200.png',
                    }}
                  >
                  </Button>
                </Box>
              )}
                <Box  rounded='md' pt={55} pb={6} fontSize='sm' >
                    <Flex justifyItems={'center'} justifyContent={'center'} alignItems={'center'} >
                    <Image 
                      minW={isMobile ? '105%' : '110%'}
                      position='absolute' 
                      zIndex={1} 
                      src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/message_board_top_wood_1200${snowTheme}.png`).convert()}
                    />
                    <Image 
                      position='absolute' 
                      zIndex={2} 
                      w={{base:'180px',sm:'271px', md:'461.4px', lg:'576.75px'}}
                      h={{base:'109px', sm:'120px',md:'126px', lg:'157.5px'}}
                      // h={isMobile ? '109px' : '142px'}
                      src={src}
                    />
                    </Flex>
                  </Box>
                {children}
              <Center>
                <Image 
                  position='relative' 
                  minW='105%'
                  mt={isMobile ? '310px' : ''}
                  src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/bottom_wood${snowTheme}.png`).convert()}
                  minH={isMobile ? '100%' : '100%'}
                  />
              </Center>
            </Box>
          </Box>
        </Box>
        </Flex>
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

export default RdAnnouncementModal;