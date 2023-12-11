import React, {ReactNode} from "react";
import {Box, Grid, GridItem, Stack, Tag, TagCloseButton, TagLabel, Wrap, WrapItem} from "@chakra-ui/react";
import {motion, Variants} from "framer-motion";
import {commify} from "ethers/lib/utils";
import {useUser} from "@src/components-v2/useUser";

const MotionGrid = motion(Grid)

interface DesktopFilterContainerProps {
  visible: boolean;
  filters: ReactNode;
  filteredItems: FilteredItem[];
  children: ReactNode
  onRemoveFilters: (items: FilteredItem[]) => void;
  totalCount?: number;
}

export interface FilteredItem {
  key: string;
  label: string;
}

const DesktopFilterContainer = ({visible, filters, filteredItems, children, totalCount, onRemoveFilters}: DesktopFilterContainerProps) => {
  const {theme: userTheme} = useUser();

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
      <GridItem overflow='hidden' py={4}>
        <Stack direction='row' justify='space-between'>
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
          {!!totalCount && (
            <Box fontWeight='bold' pe={1}>{commify(totalCount)} Items</Box>
          )}
        </Stack>
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