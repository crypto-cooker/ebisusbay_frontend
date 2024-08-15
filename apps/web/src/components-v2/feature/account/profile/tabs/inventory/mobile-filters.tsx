import React, {ReactNode} from "react";
import {getTheme} from "@src/global/theme/theme";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack
} from "@chakra-ui/react";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {useUser} from "@src/components-v2/useUser";

interface MobileFiltersProps {
  show: boolean;
  onHide: () => void;
  onClearAll: () => void;
  filters: ReactNode;
}

export const MobileFilters = ({show, onHide, onClearAll, filters}: MobileFiltersProps) => {
  const { theme } = useUser();

  return (
    <Drawer isOpen={show} placement="bottom" onClose={onHide}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerBody>
          <div className="pb-5 overflow-hidden">
            {filters}
          </div>
          <HStack className="fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
            <SecondaryButton flex='1' onClick={onClearAll}>
              <span className="ms-2">Clear all</span>
            </SecondaryButton>
            <PrimaryButton flex='1' onClick={onHide}>
              <span className="ms-2">Done</span>
            </PrimaryButton>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}