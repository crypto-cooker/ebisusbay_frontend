import React, {ReactNode} from "react";
import {useUser} from "@src/components-v2/useUser";
import {
  Drawer, DrawerCloseButton, DrawerContent, DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps
} from "@chakra-ui/react";
import {getTheme} from "@src/global/theme/theme";

type ModalDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
}


export const ModalDialog = ({isOpen, onClose, title, modalProps, children}: ModalDialogProps & {children: ReactNode}) => {
  const user = useUser();

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          {title}
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        {children}
      </ModalContent>
    </Modal>
  )
}

export const DrawerDialog = ({isOpen, onClose, title, children}: ModalDialogProps & {children: ReactNode}) => {
  const user = useUser();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      placement='bottom'
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          {title}
        </DrawerHeader>
        <DrawerCloseButton color={getTheme(user.theme).colors.textColor4} />
        {children}
      </DrawerContent>
    </Drawer>
  )
}