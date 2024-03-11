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
  ModalOverlay,
  useBreakpointValue
} from "@chakra-ui/react";
import React, {ComponentType, ReactNode} from "react";
import {useUser} from "@src/components-v2/useUser";
import {getTheme} from "@src/Theme/theme";

export type ResponsiveDialogComponents = {
  DialogBody: ComponentType<BoxProps & { children: ReactNode }>;
  DialogFooter: ComponentType<BoxProps & { children: ReactNode }>;
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
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

const ModalDialog = ({isOpen, onClose, title, children}: DialogProps & {children: ReactNode}) => {
  const user = useUser();

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
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