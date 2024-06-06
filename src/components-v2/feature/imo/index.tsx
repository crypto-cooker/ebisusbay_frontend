import {Box, Flex, Heading, Icon, IconButton, Image, Link, SimpleGrid, Spacer, VStack, Wrap} from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {faDiscord, faTelegram, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {StandardContainer} from "@src/components-v2/shared/containers";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function ImoPage() {
  return (
    <StandardContainer mt={4}>
      <Flex w='full' align='space-between' mb={4} direction={{base: 'column', md: 'row'}}>
        <VStack align='start'>
          <Image
            src='/img/imo/cornhub/logo.webp'
            alt='cornhub'
            objectFit='contain'
          />
          <Heading size='md' ps={2}>A-maize-ing Laughs, Corn-tinuously Popping!</Heading>
          <Wrap>
            <Link href='https://cornhub.video/' isExternal>
              <IconButton
                aria-label='Website'
                icon={<Icon as={FontAwesomeIcon} icon={faGlobe} />}
              />
            </Link>
            <Link href='https://x.com/Cornhubcro/' isExternal>
              <IconButton
                aria-label='X'
                icon={<Icon as={FontAwesomeIcon} icon={faXTwitter} />}
              />
            </Link>
            <Link href='https://discord.gg/VQEmnUzDKV' isExternal>
              <IconButton
                aria-label='Discord'
                icon={<Icon as={FontAwesomeIcon} icon={faDiscord} />}
              />
            </Link>
            <Link href='https://t.me/+tWDMIwqW0zthNTYx' isExternal>
              <IconButton
                aria-label='Telegram'
                icon={<Icon as={FontAwesomeIcon} icon={faTelegram} />}
              />
            </Link>
          </Wrap>
        </VStack>
        <Spacer />
        <Box position='relative'>
          <ReactPlayer
            controls
            url='https://www.youtube.com/watch?v=N3o1ILB6Br4'
            config={{
              file: {
                attributes: {
                  onContextMenu: (e: any) => e.preventDefault(),
                  controlsList: 'nodownload',
                },
              },
            }}
            muted={true}
            playing={true}
            loop={true}
            height='300px'
            width='420px'
          />
        </Box>
      </Flex>
      <Flex>
        <Box rounded='lg' overflow='hidden' border='1px solid #ccc'>
          <Flex direction={{base: 'column', md: 'row'}}>
            <Flex
              bg='#f90'
              w={{base: 'full', md: '400px'}}
              justify='end'
              direction='column'
              pt={2}
            >
              <Image
                src='/img/imo/cornhub/corn.webp'
                alt='cornhub'
                h={{base: '200px', md: 'auto'}}
                objectFit='contain'
              />
            </Flex>
            <Box w='full' p={4}>
              <Box>
                <Box fontSize='xs'>TOKEN NAME</Box>
                <Box fontWeight='bold'>CORNHUB</Box>
              </Box>
              <Box mt={2}>
                <Box fontSize='xs'>TOKEN TICKER</Box>
                <Box fontWeight='bold'>CORNHUB</Box>
              </Box>
              <Box mt={4}>
                <Box fontWeight='bold'>PRESALE INFORMATION</Box>
                <SimpleGrid columns={2}>
                  <Box className='text-muted'>Supply</Box>
                  <Box textAlign='end' fontWeight='bold'>2.1 Trillion CORNHUB</Box>
                  <Box className='text-muted'>Units offering</Box>
                  <Box textAlign='end' fontWeight='bold'>48% of Supply</Box>
                  <Box className='text-muted'>LP tokens to be burned</Box>
                  <Box textAlign='end' fontWeight='bold'>100%</Box>
                  <Box className='text-muted'>Deposit token</Box>
                  <Box textAlign='end' fontWeight='bold'>CRO</Box>
                </SimpleGrid>
                <Box fontWeight='bold' mt={2}>
                  <Box>66.666% paired with 35% LP, remainder to be used for Operations</Box>
                </Box>
              </Box>
              <Box mt={4}>
                <Box fontWeight='bold'>TOKEN DISTRIBUTION</Box>
                <SimpleGrid columns={2}>
                  <Box className='text-muted'>Presale</Box>
                  <Box textAlign='end' fontWeight='bold'>48%</Box>
                  <Box className='text-muted'>LP</Box>
                  <Box textAlign='end' fontWeight='bold'>35%</Box>
                  <Box className='text-muted'>Community airdrops</Box>
                  <Box textAlign='end' fontWeight='bold'>12%</Box>
                  <Box className='text-muted'>Operations/Giveaways/Burns</Box>
                  <Box textAlign='end' fontWeight='bold'>5%</Box>
                  <Box className='text-muted'>Team</Box>
                  <Box textAlign='end' fontWeight='bold'>0%</Box>
                </SimpleGrid>
              </Box>
              <Box fontWeight='bold' mt={2}>
                <Box>MINIMUM PARTICIPATION AMOUNT</Box>
                <Box fontSize='lg'>200 CRO</Box>
              </Box>
              <Box fontWeight='bold' mt={2}>
                <Box>MAXIMUM PARTICIPATION AMOUNT</Box>
                <Box fontSize='lg'>5000 CRO</Box>
              </Box>
              <Box mt={4}>
                <hr/>
              </Box>
              <SimpleGrid columns={2} mt={4}>
                <Box>Offering starts</Box>
                <Box textAlign='end' fontWeight='bold'>Friday, June 7, 2024 12:15:00 PM UTC</Box>
                <Box>Offering ends</Box>
                <Box textAlign='end' fontWeight='bold'>Monday, June 10, 2024 1:00:00 PM UTC</Box>
              </SimpleGrid>
              <VStack textAlign='center' fontSize='xs' mt={6}>
                <Box>
                  CRO sent after offering end or amount less then 200 CRO will be burnt.
                </Box>
                <Box>
                  Total CRO required for Pre-sale to end is undisclosed. Presale will end either at the end of offering
                  time or when the expected amount is raised.
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </StandardContainer>
  )
}