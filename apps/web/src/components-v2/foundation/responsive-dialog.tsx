import {
  Box,
  BoxProps,
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useBreakpointValue
} from "@chakra-ui/react";
import React, {ComponentType, ReactNode, useMemo} from "react";
import {useUser, useUserTheme} from "@src/components-v2/useUser";
import {getTheme} from "@src/global/theme/theme";
import {DrawerDialog, ModalDialog} from "@src/components-v2/foundation/modal";

export type ResponsiveDialogComponents = {
  DialogHeader: ComponentType<BoxProps & { children: ReactNode }>;
  DialogBody: ComponentType<BoxProps & { children: ReactNode }>;
  DialogFooter: ComponentType<BoxProps & { children: ReactNode }>;
  DialogBasicHeader: ComponentType<BoxProps & { children: ReactNode }>;
}

export const useResponsiveDialog = () => {
  const theme = useUserTheme();

  const shouldUseDrawer = useBreakpointValue({ base: true, sm: false }, { fallback: 'sm' });

  return useMemo(() => {
    if (shouldUseDrawer) {
      const closeButton = <DrawerCloseButton color={theme.colors.textColor4} />;
      return {
        DialogComponent: DrawerDialog,
        DialogHeader: DrawerHeader,
        DialogBody: DrawerBody,
        DialogFooter: DrawerFooter,
        DialogCloseButton: () => closeButton,
        DialogBasicHeader: ({title}: {title: string}) => (
          <DrawerHeader>
            <Flex justify='space-between' w='full'>
              <Box>{title}</Box>
              {closeButton}
            </Flex>
          </DrawerHeader>
        )
      };
    } else {
      const closeButton = <ModalCloseButton color={theme.colors.textColor4} />;

      return {
        DialogComponent: ModalDialog,
        DialogHeader: ModalHeader,
        DialogBody: ({ children, ...rest }: BoxProps) => (
          <ModalBody pb={4} {...rest}>
            {children}
          </ModalBody>
        ),
        DialogFooter: ModalFooter,
        DialogCloseButton: () => closeButton,
        DialogBasicHeader: ({title}: {title: string}) => (
          <ModalHeader>
            <Flex justify='space-between' w='full'>
              <Box>{title}</Box>
              {closeButton}
            </Flex>
          </ModalHeader>
        )
      };
    }
  }, [shouldUseDrawer, theme]);
};