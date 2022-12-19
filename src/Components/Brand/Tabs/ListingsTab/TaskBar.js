import {
  Button as ChakraButton,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay, Flex,
  Grid,
  GridItem,
  Radio,
  RadioGroup,
  useBreakpointValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faSort} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {SearchBar, SortDropdown} from "@src/Components/Brand/Tabs/ListingsTab/ListingsTab";
import Filters from "@src/Components/Brand/Tabs/ListingsTab/Filters";
import {sortOptions} from "@src/Components/components/constants/sort-options";
import Button from "@src/Components/components/Button";

const TaskBar = ({onFilterToggle, onSearch, onSort, collections, onFilter}) => {
  const useMobileViews = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  const { isOpen: isMobileFilterOpen, onOpen: onOpenMobileFilter, onClose: onCloseMobileFilter } = useDisclosure();
  const { isOpen: isMobileSortOpen, onOpen: onOpenMobileSort, onClose: onCloseMobileSort } = useDisclosure();

  return useMobileViews ? (
    <>
      <ButtonGroup>
        <ChakraButton onClick={onOpenMobileFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </ChakraButton>
        <ChakraButton onClick={onOpenMobileSort}>
          <FontAwesomeIcon icon={faSort} />
        </ChakraButton>
        <SearchBar onSearch={onSearch} />
      </ButtonGroup>
      <MobileFilter
        collections={collections}
        isOpen={isMobileFilterOpen}
        onClose={onCloseMobileFilter}
        onFilter={onFilter}
      />
      <MobileSort
        isOpen={isMobileSortOpen}
        onClose={onCloseMobileSort}
        onSort={onSort}
      />
    </>
  ) : (
    <Grid templateColumns="auto 1fr 180px" gap={2}>
      <GridItem>
        <ChakraButton onClick={onFilterToggle}>
          <FontAwesomeIcon icon={faFilter} />
        </ChakraButton>
      </GridItem>
      <GridItem>
        <SearchBar onSearch={onSearch} />
      </GridItem>
      <GridItem>
        <SortDropdown onSort={onSort} />
      </GridItem>
    </Grid>
  )

}

export default TaskBar;

const MobileFilter = ({collections, isOpen, onClose, onFilter}) => {
  const [filters, setFilters] = useState([]);

  const handleSaveFilter = () => {
    onFilter(filters);
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
          <Filters collections={collections} onChange={setFilters} />
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

const MobileSort = ({isOpen, onClose, onSort}) => {
  const [selectedOption, setSelectedOption] = useState();

  const handleChange = (value) => {
    setSelectedOption(sortOptions[value]);
  }

  const handleSaveFilter = () => {
    onSort(selectedOption);
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
        <DrawerHeader>Sort Listings</DrawerHeader>

        <DrawerBody>
          <RadioGroup onChange={handleChange} value={sortOptions.findIndex((o) => o.id === selectedOption?.id)}>
            <VStack align="start">
              {sortOptions.map((option, key) => (
                <Radio
                  key={`${option.key}-${option.direction}`}
                  value={key}
                >
                  {option.label}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
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