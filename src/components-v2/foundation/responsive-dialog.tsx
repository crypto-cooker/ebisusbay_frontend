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
  DialogHeader: ComponentType<BoxProps & { children: ReactNode }>;
  DialogBody: ComponentType<BoxProps & { children: ReactNode }>;
  DialogFooter: ComponentType<BoxProps & { children: ReactNode }>;
}

export const useResponsiveDialog = () => {
  const user = useUser();

  const shouldUseDrawer = useBreakpointValue({ base: true, sm: false }, { fallback: 'sm' });
  if (shouldUseDrawer) {
    return {
      DialogComponent: DrawerDialog,
      DialogHeader: DrawerHeader,
      DialogBody: DrawerBody,
      DialogFooter: DrawerFooter,
      DialogCloseButton: () => <DrawerCloseButton color={getTheme(user.theme).colors.textColor4} />
    };
  } else {
    return {
      DialogComponent: ModalDialog,
      DialogHeader: ModalHeader,
      DialogBody: ModalBody,
      DialogFooter: ModalFooter,
      DialogCloseButton: () => <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
    };
  }
};