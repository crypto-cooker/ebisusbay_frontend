import {Box, Button, Center, Flex, Link, ListItem, Stack, Text, UnorderedList} from "@chakra-ui/react";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import React from "react";
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../global/assets/fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../global/assets/fonts/Gotham-XLight.woff2' })

interface FortuneFaqPageProps {
  onBack: () => void;
  onClose: () => void;
}

const FortuneFaqPage = ({onBack, onClose}: FortuneFaqPageProps) => {
  return (
    <>
      <Box
        position='absolute'
        left={2}
        top={2}
        rounded='full'
        zIndex={1}
        _groupHover={{
          cursor: 'pointer'
        }}
        data-group
      >
        <Button
          bg='#C17109'
          rounded='full'
          border='8px solid #F48F0C'
          w={14}
          h={14}
          fontSize='28px'
          onClick={onBack}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          <ArrowBackIcon />
        </Button>
      </Box>
      <Box
        position='absolute'
        right={2}
        top={2}
        rounded='full'
        zIndex={1}
        _groupHover={{
          cursor: 'pointer'
        }}
        data-group
      >
        <Button
          bg='#C17109'
          rounded='full'
          border='8px solid #F48F0C'
          w={14}
          h={14}
          onClick={onClose}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          <CloseIcon />
        </Button>
      </Box>
      <Box
        bg='#564D4A'
        h='full'
        m={6}
        roundedBottom='3xl'
        className='rd-bank-modal-masktop-outer'
      >
        <Box
          color='#FFF'
          textAlign='center'
          verticalAlign='middle'
          className='rd-bank-modal-masktop-inner'
          p={1}
        >
          <Flex
            bg='#272523'
            h='55px'
            px={12}
            fontSize={{base: 'lg', sm: '2xl', md: '3xl'}}
            my='auto'
            justify='center'
            direction='column'
          >
            <>Presale FAQ</>
          </Flex>
        </Box>
        <Stack spacing={3} p={2}>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>
            ***As you approach the banker's counter, he looks up from his bag of Fortune tokens and greets you with a friendly smile.***
          </Text>

          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            In this sale, the minimum contribution is 5000 CRO.
          </Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>
            
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            Each $CRO contributed will award 6 $FRTN tokens on the Cronos zkEVM network. Bonus FRTN will be awarded to your rewards vault (withdrawable on either chain) if you exceed the contribution levels of 25k, 50k or 100k $CRO.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            25k $CRO will award an extra 1000 $FRTN
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
          50k $CRO will award an extra 5000 $FRTN
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
          100k $CRO will award an extra 30000 $FRTN
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            In addition, you will be granted a Proof-of-Attendance NFT to prove you were one of the first explorers in Cronos zkEVM,
            with a rarity based on how many tokens you purchase.
            Thanks to this NFT, you will be served by a different Moggy Money Broker for a personalized Fortune experience.
          </Text>

          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>***At this point, the banker looks at you straight into your eyes, in anticipation.*** </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >...I wish I were an adventurer like you...</Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'> ***He mumbles, silently, while looking down.***</Text>
          <Link href='https://www.ebisusbay.com/blog/bootstrapping-liquidity-on-cronos-zkevm' isExternal>Full Blog Post</Link>
        </Stack>
      </Box>
    </>
  )
}


export default FortuneFaqPage;