import {
  Button as ChakraButton,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Radio,
  RadioGroup,
  useBreakpointValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {sortOptions} from "@src/Components/components/constants/sort-options";
import Button from "@src/Components/components/Button";
import {Staker, StakingStatusFilters} from "@src/components-v2/feature/brand/tabs/staking/types";
import {caseInsensitiveCompare} from "@market/helpers/utils";
import Filters from "@src/components-v2/feature/brand/tabs/staking/filters";

type TaskbarProps = {
  staker: Staker;
  collections: any;
  onCollectionFilter: (address: string) => void;
  onStatusFilter: (address: StakingStatusFilters) => void;
}
const Taskbar = ({staker, collections, onCollectionFilter, onStatusFilter}: TaskbarProps) => {
  const useMobileViews = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  const { isOpen: isMobileFilterOpen, onOpen: onOpenMobileFilter, onClose: onCloseMobileFilter } = useDisclosure();

  return useMobileViews ? (
    <>
      <ButtonGroup>
        <ChakraButton onClick={onOpenMobileFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </ChakraButton>
      </ButtonGroup>
      <MobileFilter
        staker={staker}
        collections={collections}
        isOpen={isMobileFilterOpen}
        onClose={onCloseMobileFilter}
        onCollectionFilter={onCollectionFilter}
        onStatusFilter={onStatusFilter}
      />
    </>
  ) : <></>

}

export default Taskbar;

type MobileFilterProps = {
  staker: Staker;
  collections: any;
  isOpen: boolean;
  onClose: () => void;
  onCollectionFilter: (address: string) => void;
  onStatusFilter: (address: StakingStatusFilters) => void;
}

const MobileFilter = ({staker, collections, isOpen, onClose, onCollectionFilter, onStatusFilter}: MobileFilterProps) => {
  const handleSaveFilter = () => {
    onClose();
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='bottom'
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filter Listings</DrawerHeader>

        <DrawerBody>
          <Filters
              collections={collections.filter((c: any) => staker?.collections.some((sc: string) => caseInsensitiveCompare(sc, c.address)))}
              boosterCollections={!!staker?.booster ? collections.filter((c: any) => staker.booster!.collections.some((sc: string) => caseInsensitiveCompare(sc, c.address))) : []}
              initialCollection={staker.collections[0]}
              initialStatus={StakingStatusFilters.ALL}
              onChangeCollection={onCollectionFilter}
              onChangeStatus={onStatusFilter}
          />
        </DrawerBody>

        <DrawerFooter>
          <Flex w="full">
            <Button type="legacy-outlined" className="w-100" onClick={onClose}>
              Cancel
            </Button>
            <Button type="legacy" className="w-100 ms-4" onClick={handleSaveFilter}>
              Save
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

}