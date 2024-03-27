import {Box, Container, Heading, Image, Stack, VStack} from "@chakra-ui/react";
import Countdown from "react-countdown";
import React from "react";

const RyoshiWithKnife = () => {
  return (
    <Container maxW='container.lg' mt={8}>
      <Stack direction={{base: 'column', sm: 'row'}}>
        <Box>
          <Image
            src="/img/ryoshi-with-knife.png"
            w={400}
          />
        </Box>
        <Box>
          <Heading>Ryoshi With Knife</Heading>
          <VStack align='start' mt={2}>
            <Box>
              Starts in: <Countdown date={1711742400000}/>
            </Box>
            <Box>
              {new Date(1711742400000).toDateString()}, {new Date(1711742400000).toTimeString()}
            </Box>
          </VStack>
        </Box>
      </Stack>
    </Container>
  )
}

export default RyoshiWithKnife;