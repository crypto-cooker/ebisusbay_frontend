import React, {ReactNode} from "react";
import {Box, Grid, GridItem, Tag, TagCloseButton, TagLabel, Wrap, WrapItem} from "@chakra-ui/react";
import {motion, Variants} from "framer-motion";
import {useAppSelector} from "@src/Store/hooks";

const MotionGrid = motion(Grid)

interface DesktopFilterContainerProps {
  visible: boolean;
  filters: ReactNode;
  filteredItems: FilteredItem[];
  children: ReactNode
  onRemoveFilters: (items: FilteredItem[]) => void;
}

export interface FilteredItem {
  key: string;
  label: string;
}

const DesktopFilterContainer = ({visible, filters, filteredItems, children, onRemoveFilters}: DesktopFilterContainerProps) => {
  const userTheme = useAppSelector((state) => state.user.theme);

  const variants: Variants = {
    expand: {
      gridTemplateColumns: '320px 1fr',
      // gridTemplateRows: 'auto 1fr'
    },
    collapse: {
      gridTemplateColumns: '0px 1fr',
      // gridTemplateRows: '0px 1fr'
    },
  }

  return (
    <MotionGrid
      animate={visible ? 'expand' : 'collapse'}
      variants={variants}
      templateRows='auto 1fr'
      templateColumns='0px 1fr'
    >
      <GridItem rowSpan={2} overflow='hidden'>
        <Box pe={2}>
          {filters}
        </Box>
      </GridItem>
      <GridItem overflow='hidden' py={filteredItems.length > 0 ? 4 : 0}>
        <Wrap>
          {filteredItems.map((item) => (
            <WrapItem>
              <Tag
                variant='solid'
                bgColor={userTheme === 'dark' ? 'gray.100' : 'gray.800'}
                color={userTheme === 'dark' ? 'gray.800' : 'gray.100'}
              >
                <TagLabel>{item.label}</TagLabel>
                <TagCloseButton onClick={() => onRemoveFilters([item])}/>
              </Tag>
            </WrapItem>
          ))}
          {filteredItems.length > 0 && (
            <Box fontWeight='bold' onClick={() => onRemoveFilters(filteredItems)} cursor='pointer'>
              Clear all
            </Box>
          )}
        </Wrap>
      </GridItem>
      <GridItem>
        <Box>
          {children}
        </Box>
      </GridItem>
    </MotionGrid>
  )
}

export default DesktopFilterContainer;