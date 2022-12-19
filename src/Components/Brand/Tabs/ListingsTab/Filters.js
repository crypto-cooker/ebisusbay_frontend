import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Link,
  Spacer,
  VStack
} from "@chakra-ui/react";
import React, {useState} from "react";
import {caseInsensitiveCompare} from "@src/utils";
import NextLink from 'next/link'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

const Filters = ({collections, onChange}) => {

  const [selectedCollections, setSelectedCollections] = useState([]);

  const viewGetDefaultCheckValue = (address) => {
    if (!address) return false;

    return selectedCollections.includes(address.toLowerCase());
  };

  const handleCheck = (e) => {
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
                      <Box cursor="pointer">
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