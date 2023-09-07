import {Form} from "react-bootstrap";
import React from "react";
import {getTheme} from "@src/Theme/theme";
import {useAppSelector} from "@src/Store/hooks";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex
} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";

export type SortOption = {
  key: string;
  direction: string;
  label: string;
}

interface MobileSortProps {
  show: boolean;
  onHide: () => void;
  sortOptions: SortOption[];
  currentSort?: SortOption;
  onSort: (sort: string, direction: string) => void;
}

export const MobileSort = ({show, onHide, sortOptions, currentSort, onSort}: MobileSortProps) => {
  const theme = useAppSelector((state) => state.user.theme);

  return (
    <Drawer isOpen={show} placement="bottom" onClose={onHide}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Sort By</DrawerHeader>
        <DrawerBody>
          <Box className="pb-5 overflow-hidden">
            {sortOptions.map((option, key) => (
              <div key={key} className="my-2">
                <Form.Check
                  type="radio"
                  id={`${option.key}-${option.direction}`}
                >
                  <Form.Check.Input type={'radio'}
                                    value={`${option.key}-${option.direction}`}
                                    onChange={() => onSort(option.key, option.direction)}
                                    checked={!!currentSort && currentSort.key === option.key && currentSort.direction === option.direction}
                  />
                  <Form.Check.Label className="w-100">
                    <div className="d-flex justify-content-between cursor-pointer w-100">
                      <div>{option.label}</div>
                    </div>
                  </Form.Check.Label>
                </Form.Check>
              </div>
            ))}
          </Box>
          <Flex className="fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
            <PrimaryButton w='full' onClick={onHide}>
              <span>Done</span>
            </PrimaryButton>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}