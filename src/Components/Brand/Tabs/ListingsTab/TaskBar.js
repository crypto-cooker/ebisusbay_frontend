import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
        <Button onClick={onOpenMobileFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </Button>
        <Button onClick={onOpenMobileSort}>
          <FontAwesomeIcon icon={faSort} />
        </Button>
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
        <Button onClick={onFilterToggle}>
          <FontAwesomeIcon icon={faFilter} />
        </Button>
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
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='blue' onClick={handleSaveFilter}>Save</Button>
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
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='blue' onClick={handleSaveFilter}>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

}