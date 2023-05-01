import {Box, Button, Center, Flex, ListItem, Stack, Text, UnorderedList} from "@chakra-ui/react";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import React from "react";
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../fonts/Gotham-XLight.woff2' })

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
        className='rd-bank-modal-mask1'
      >
        <Box
          color='#FFF'
          textAlign='center'
          verticalAlign='middle'
          className='rd-bank-modal-mask2'
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
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} color='#c5c5c5'> ***As you approach the banker's counter, he looks up from his bag of Fortune tokens and greets you with a friendly smile.*** </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} > Hello there, traveler. I couldn't help but notice that NFT you're carrying in your wallet. That tells me you're quite the loyal explorer of the Lotus Galaxy.</Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} color='#c5c5c5'> ***The banker pauses for a moment, as he looks at you from your feet upwards.*** </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >You're in luck because we're currently holding a presale for Fortune tokens,
            only for the hardiest of the explorers in the Lotus Galaxy, like yourself. Just as Ebisu would want it… </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} > In this presale, the minimum purchase is 1000 tokens. Each token is priced at $0.03.</Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} color='#c5c5c5'> ***The banker leans in closer and whispers,***</Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >The tokens will be locked for three seasons and linearly released, but don't worry,
            you'll receive free registration for the season 1 of Ryoshi Dynasties and you will
            have access to your troops during the vesting period. On top of that, you’ll be able to get beta access to Ryoshi Dynasties and practice your war strategies with testnet tokens.</Text>
          <Center>
            <UnorderedList>
              <ListItem><Text className={gothamXLight.className} style={{ textAlign:"left", fontSize:"12px"}} color='#c5c5c5'>1000, 5000, 25000, 50000, 250000</Text></ListItem>
              {/* <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 5000</Text></ListItem>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 25000</Text></ListItem>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 50000</Text></ListItem>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 250000</Text></ListItem> */}
            </UnorderedList>
          </Center>

          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >Only up to 1% of the total supply of Fortune tokens will be sold during the presale. Anything left over after one week will go to community rewards.</Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} color='#c5c5c5'>***He leans back and gives you a reassuring smile.*** </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >"So, what do you say? Are you ready to purchase some tokens?</Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >”… I wish I were an adventurer like you… </Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} color='#c5c5c5'> ***he mumbles, silently, looking down.***</Text>
        </Stack>
      </Box>
    </>
  )
}


export default FortuneFaqPage;