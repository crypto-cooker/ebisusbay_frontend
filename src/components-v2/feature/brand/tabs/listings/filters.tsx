import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Link,
  Spacer,
  VStack
} from "@chakra-ui/react";
import React, {useState} from "react";
import {caseInsensitiveCompare} from "@market/helpers/utils";
import NextLink from 'next/link'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

interface FiltersProps {
  collections: any[];
  onChange: (filter: string[]) => void;
}

const Filters = ({collections, onChange}: FiltersProps) => {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const viewGetDefaultCheckValue = (address: string) => {
    if (!address) return false;

    return selectedCollections.includes(address.toLowerCase());
  };

  const handleCheck = (e: any) => {
    const address = e.target.value;
    if (!address) return;

    const exists = selectedCollections.includes(address.toLowerCase());
    let newList = [...selectedCollections];
    if (exists) {
      newList = newList.filter((a) => !caseInsensitiveCompare(a, address));
    } else {
      newList.push(address);
    }
    setSelectedCollections(newList);
    onChange(newList);
  }

  return (
    <Box>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Collections
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <CheckboxGroup defaultValue={selectedCollections}>
              <VStack align="start">
                {collections.filter((c) => !!c.address).map((collection, index) => (
                  <Box key={`cb-${collection.address ?? index}`} w="full" fontSize="sm">
                    <Flex align='center'>
                      <Checkbox
                        value={collection.address.toLowerCase()}
                        onChange={handleCheck}
                        me={2}
                      >
                        {collection.name}
                      </Checkbox>
                      <Spacer />
                      <Box
                        as={Button}
                        cursor="pointer"
                        size='sm'
                        variant='ghost'
                      >
                        <Link as={NextLink} href={`/collection/${collection.slug}`}>
                          <FontAwesomeIcon icon={faArrowRight}/>
                        </Link>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </CheckboxGroup>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default Filters;