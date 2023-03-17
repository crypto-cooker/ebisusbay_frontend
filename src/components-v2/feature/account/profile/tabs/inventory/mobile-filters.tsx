import Button from "@src/Components/components/Button";
import React from "react";
import {CollectionFilter} from "./collection-filter";
import {getTheme} from "@src/Theme/theme";
import {useAppSelector} from "@src/Store/hooks";
import {Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay} from "@chakra-ui/react";

interface MobileFiltersProps {
  collections: any;
  currentFilter: any;
  show: boolean;
  onHide: () => void;
  onFilter: (collections: any) => void;
}

export const MobileFilters = ({collections, currentFilter, show, onHide, onFilter}: MobileFiltersProps) => {
  const theme = useAppSelector((state) => state.user.theme);

  const onClearAll = () => {
    for (const item of document.querySelectorAll('.collection-checkbox input[type=checkbox]')) {
      (item as any).checked = false;
    }

    onFilter([]);
  };

  return (
    <Drawer isOpen={show} placement="bottom" onClose={onHide}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerBody>
          <div className="pb-5 overflow-hidden">
            <CollectionFilter
              collections={collections}
              currentFilter={currentFilter}
              onFilter={onFilter}
              keyPrefix="mobile"
            />
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