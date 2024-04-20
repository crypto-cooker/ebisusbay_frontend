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
import {DrawerDialog, ModalDialog} from "@src/components-v2/foundation/modal";

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