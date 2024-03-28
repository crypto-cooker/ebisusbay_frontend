import {Box, Container, Heading, Image, Link, Stack, VStack} from "@chakra-ui/react";
import Countdown from "react-countdown";
import React, {useEffect, useState} from "react";
import PageHead from "@src/components-v2/shared/layout/page-head";
import ImageService from "@src/core/services/image";
import {PrimaryButton} from "@src/components-v2/foundation/button";

const startTimestamp = 1711742400000;

const RyoshiWithKnife = () => {
  const [isClient, setIsClient] = useState(false)
  const startDate = `${new Date(startTimestamp).toDateString()}, ${new Date(startTimestamp).toTimeString()}`;

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <PageHead
        title='Ryoshi with knife'
        url='/ryoshi-with-knife'
        image={ImageService.translate('/img/ryoshi-with-knife/banner.webp').convert()}
      />
      <Container maxW='container.lg' mt={8}>
        <Box>
          <Image
            src={ImageService.translate('/img/ryoshi-with-knife/promo.webp').convert()}
            rounded='lg'
          />
        </Box>
        <Stack direction={{base: 'column', sm: 'row'}} mt={4} justify='space-between'>
          <Box>
            <Heading>Ryoshi with knife</Heading>
            <VStack align='start' mt={2}>
              <Box>
                Starts in: {isClient ? <Countdown date={1711742400000}/> : 'soon'}
              </Box>
              {isClient && (
                <Box>
                  {startDate}
                </Box>
              )}
              <Link href='https://blog.ebisusbay.com/ryoshi-with-knife-the-new-craze-hitting-cronos-400b743ff569'>
                <PrimaryButton>
                  More Info
                </PrimaryButton>
              </Link>
            </VStack>
          </Box>
          <Box>
            <Image
              src="/img/ryoshi-with-knife.png"
              w={400}
            />
          </Box>
        </Stack>
      </Container>
    </>
  )
}

export default RyoshiWithKnife;