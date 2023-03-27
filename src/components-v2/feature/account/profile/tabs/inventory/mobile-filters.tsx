import Button from "@src/Components/components/Button";
import React, {ReactNode} from "react";
import {getTheme} from "@src/Theme/theme";
import {useAppSelector} from "@src/Store/hooks";
import {Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay} from "@chakra-ui/react";

interface MobileFiltersProps {
  show: boolean;
  onHide: () => void;
  onClearAll: () => void;
  filters: ReactNode;
}

export const MobileFilters = ({show, onHide, onClearAll, filters}: MobileFiltersProps) => {
  const theme = useAppSelector((state) => state.user.theme);

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
          <div className="d-flex fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
            <div className="flex-fill">
              <Button type="legacy-outlined" className="w-100" style={{height: '100%'}} onClick={onClearAll}>
                <span className="ms-2">Clear all</span>
              </Button>
            </div>
            <div className="flex-fill ms-4">
              <Button type="legacy" className="w-100" style={{height: '100%'}} onClick={onHide}>
                <span className="ms-2">Done</span>
              </Button>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}