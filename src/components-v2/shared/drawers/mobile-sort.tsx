import React, {useCallback} from "react";
import {getTheme} from "@src/Theme/theme";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Radio,
  RadioGroup
} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useUser} from "@src/components-v2/useUser";

export type SortOption = {
  id: string;
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
  const { theme } = useUser();

  const handleSort = useCallback((id: string) => {
    const option = sortOptions.find(i => i.id === id);
    if (!option) return;

    onSort(option.key, option.direction);
  },[onSort]);

  return (
    <Drawer isOpen={show} placement="bottom" onClose={onHide}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Sort By</DrawerHeader>
        <DrawerBody>
          <Box className="pb-5 overflow-hidden">
            <RadioGroup
              colorScheme='blue'
              value={sortOptions.find(i => i.id === currentSort?.id)?.id}
              onChange={handleSort}
            >
              {sortOptions.map((option, key) => (
                <Box key={key} my={2}>
                  <Radio value={option.id}>
                    {option.label}
                  </Radio>
                </Box>
              ))}
            </RadioGroup>
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