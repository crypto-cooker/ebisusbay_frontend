import {
  BoxProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, ModalProps,
  useBreakpointValue
} from "@chakra-ui/react";
import React, {ComponentType, ReactNode} from "react";
import {useUser} from "@src/components-v2/useUser";
import {getTheme} from "@src/global/theme/theme";
import {ResponsiveValue} from "@chakra-ui/system";

export type ResponsiveDialogComponents = {
  DialogBody: ComponentType<BoxProps & { children: ReactNode }>;
  DialogFooter: ComponentType<BoxProps & { children: ReactNode }>;
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
}

export const useResponsiveDialog = () => {
  const shouldUseDrawer = useBreakpointValue({ base: true, sm: false }, { fallback: 'sm' });
  if (shouldUseDrawer) {
    return {
      DialogComponent: DrawerDialog,
      DialogHeader: DrawerHeader,
      DialogBody: DrawerBody,
      DialogFooter: DrawerFooter,
    };
  } else {
    return {
      DialogComponent: ModalDialog,
      DialogHeader: ModalHeader,
      DialogBody: ModalBody,
      DialogFooter: ModalFooter,
    };
  }
};

const ModalDialog = ({isOpen, onClose, title, modalProps, children}: DialogProps & {children: ReactNode}) => {
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

const DrawerDialog = ({isOpen, onClose, title, children}: DialogProps & {children: ReactNode}) => {
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