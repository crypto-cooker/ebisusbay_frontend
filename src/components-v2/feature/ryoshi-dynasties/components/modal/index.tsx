import {Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
import {ReactNode} from "react";
import localFont from "next/font/local";
import {CloseIcon} from "@chakra-ui/icons";

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })


interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  title: string;
  utilBtnTitle?: ReactNode;
  onUtilBtnClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const RdModal = ({isOpen, onClose, title, utilBtnTitle, onUtilBtnClick, size, children}: PurchaseDialogProps) => {

  return (
    <>
      <Modal
        onClose={() => {}}
        isOpen={isOpen}
        size={size ?? '2xl'}
        scrollBehavior='inside'
        isCentered
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
          m={6}
        >
          <ModalBody p={2} color='white'>
            <Box
              position='absolute'
              left={2}
              top={2}
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
            <Box
              position='absolute'
              right={2}
              top={2}
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
            <Box
              bg='#564D4A'
              h='full'
              m={6}
              roundedBottom='3xl'
              className='rd-bank-modal-mask1'
            >
              <Box
                color='#FFF'
                textAlign='center'
                verticalAlign='middle'
                className='rd-bank-modal-mask2'
                p={1}
              >
                <Flex
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}


export default RdModal;