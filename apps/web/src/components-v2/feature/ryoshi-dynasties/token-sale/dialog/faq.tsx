import {Box, Button, Center, Flex, ListItem, Stack, Text, UnorderedList} from "@chakra-ui/react";
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
            Hello there, traveler. I couldn't help but notice that NFT you're carrying in your wallet. That tells me you're quite the loyal explorer of the Lotus Galaxy.
          </Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>
            ***The banker pauses for a moment, as he looks at you from your feet upwards.***
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            You're in luck because we're currently holding a presale for Fortune tokens,
            only for the hardiest of the explorers in the Lotus Galaxy, like yourself. Just as Ebisu would want it...
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            In this presale, the minimum purchase is 1000 tokens. Each token is priced at $0.03.
          </Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>
            ***The banker leans in closer and whispers,***
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            The tokens will be locked for three seasons and linearly released, but don't worry,
            you'll receive free registration for the season 1 of Ryoshi Dynasties and you will
            have access to your troops during the vesting period. On top of that, you’ll be able to get beta access to Ryoshi Dynasties and practice your war strategies with testnet tokens.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            In addition, you will be granted a Proof-of-Attendance NFT to prove you were one of the first explorers to battle in Ryoshi Dynasties,
            with a rarity based on how many tokens you purchase.
            Thanks to this NFT, you will be served by a different Fortune teller for a personalized Fortune experience.
          </Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>
            ***The banker nods in delightful approval at his own words.***
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            Cedric ‘Ceddy’ Biscuitworth will serve you in case you own a Common NFT, which comes with the purchase of 1000 tokens.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            Sebastian Mortimer Tiddleton will be assisting you when you own an Uncommon NFT, given to you if you purchase 5000 tokens.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            For a purchase of 25000 tokens, you’ll be awarded a Rare NFT, and Reginald Archibald Worthington III will be at your service.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            Now, if you acquire 50000 tokens, an Epic NFT will await you. Cornelius Rufus Puffington will assist epic clients.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            Finally… should you be one of the few lucky ones to be able to purchase 250000 tokens, the Legendary NFT will be yours, and the most prestigious of all Fortune tellers will be your point of contact: Mr. Bertram Scuddlesworth Esq.
          </Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>
            ***He leans back and gives you a reassuring smile.***
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >Only up to 1% of the total supply of Fortune tokens will be sold during the presale. Anything left over after one week will go to community rewards.</Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >So, what do you say? Are you ready to purchase some tokens?</Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'>***At this point, the banker looks at you straight into your eyes, in anticipation.*** </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >...I wish I were an adventurer like you...</Text>
          <Text className={gothamXLight.className} fontSize={{ base: '12px', md: '12px' }} fontWeight='bold' color='#F48F0C'> ***He mumbles, silently, while looking down.***</Text>
        </Stack>
      </Box>
    </>
  )
}


export default FortuneFaqPage;