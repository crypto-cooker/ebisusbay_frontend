import {Card} from "@src/components-v2/foundation/card";
import {Box, Heading, HStack, IconButton} from "@chakra-ui/react";
import NextLink from "next/link";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React from "react";

export default function PoolFinder() {


  return (
    <Card>
      <Heading size='md' mb={2}>
        <HStack justify=''>
          <NextLink href='/dex/liquidity'>
            <IconButton
              aria-label='Back'
              icon={<ArrowBackIcon />}
              variant='unstyled'
            />
          </NextLink>
          <Box>Import V2 Pool</Box>
        </HStack>
      </Heading>
      <Box>
        Import pool here
      </Box>
    </Card>
  )
}
