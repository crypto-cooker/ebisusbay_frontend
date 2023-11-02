import React from "react";
import {Center, Stack, Text,} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = () => {

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>

      <Center p={4}>
        <Text align='center'>
          FAQ Coming Soon!
        </Text>
      </Center>
    </Stack>
  );
}

export default FaqPage;