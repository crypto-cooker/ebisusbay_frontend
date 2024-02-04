import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

const FaqPage = () => {
  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>
      <Box p={4}>
        <Text>Rio the Merchant is here to provide you with various resources important to many aspects of Ryoshi Dynasties. At the start of every game, he may appear freshly stocked with items to sell at a price that is best not to be ignored.</Text>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Available Items
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                There will be many items available in the future. Currently, <strong>Koban</strong> is available weekly at the start of every game. Flash sales may also be available periodically throughout the week.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Purchase Limits
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                The current purchase limit is one sale per user every 5 minutes.
              </Text>
              <Text mt={2}>
                Each resource will have their own maximum supply for their respective sales. Underneath the resource image, the current sale count and max supply will noted.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;