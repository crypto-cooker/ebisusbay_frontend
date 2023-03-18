import {Form} from "react-bootstrap";
import Button from "@src/Components/components/Button";
import React from "react";
import {getTheme} from "@src/Theme/theme";
import {sortOptions} from "./sort-options";
import {useAppSelector} from "@src/Store/hooks";
import {SortOption} from "@src/components-v2/feature/account/profile/tabs/inventory/sort-options";
import {Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay} from "@chakra-ui/react";

interface MobileSortProps {
  show: boolean;
  onHide: () => void;
  currentSort: SortOption;
  onSort: (sortOption: SortOption) => void;
}

export const MobileSort = ({show, onHide, currentSort, onSort}: MobileSortProps) => {
  const theme = useAppSelector((state) => state.user.theme);

  return (
    <Drawer isOpen={show} placement="bottom" onClose={onHide}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Sort By</DrawerHeader>
        <DrawerBody>
          <div className="pb-5 overflow-hidden">
            {sortOptions.map((option, key) => (
              <div key={key} className="my-2">
                <Form.Check
                  type="radio"
                  id={`${option.key}-${option.direction}`}
                >
                  <Form.Check.Input type={'radio'}
                                    value={`${option.key}-${option.direction}`}
                                    onChange={() => onSort(option)}
                                    checked={currentSort.key === option.key && currentSort.direction === option.direction}
                  />
                  <Form.Check.Label className="w-100">
                    <div className="d-flex justify-content-between cursor-pointer w-100">
                      <div>{option.label}</div>
                    </div>
                  </Form.Check.Label>
                </Form.Check>
              </div>
            ))}
          </div>
          <div className="d-flex fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
            <div className="flex-fill">
              <Button type="legacy" className="w-100" style={{height: '100%'}} onClick={onHide}>
                <span>Done</span>
              </Button>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}