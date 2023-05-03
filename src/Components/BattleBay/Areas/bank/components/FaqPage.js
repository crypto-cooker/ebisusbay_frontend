import { useState, useRef, useEffect, useCallback} from "react";
import { useSelector } from "react-redux";
import {
  ModalHeader,
  ModalBody,
  Button,
  Flex,
  Box,
  Text,
  Stack,
  Spacer,


} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = ({ onBack, onClose}) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  return (
    <ModalBody>
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
      <Spacer h={4} />
    <Box
        bg='#564D4A'
        h='full'
        m={2}
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
            <>Fortune FAQ</>
          </Flex>
        </Box>
        <Stack spacing={3} p={2}>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
          In order to receive $Mitama a player must stake their tokens into a smart contract for AT LEAST the duration of 1 season (90 days).
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
          If user locks up longer than 1 season they will receive bonus spirit multiplier for each additional season locked.
          </Text>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
          - Additional token may be added to lock period at anytime.
- APR from staking goes into the seasonal release pool for user.
    - Linear Release for the rewards counting down to end of current season. Early withdraw burns tokens.
    - Users can spend out of their rewards pool early to buy “[power-ups] without penalty.
- Users may be tempted to “re-stake” at the end of their season to earn a “veteran bonus” similar to if they had locked up for two season to begin with.
- Staking Ryoshi Tales NFTs will give bonus APR multiplier. Max 5 staked.
          </Text>
        </Stack>
      </Box>

  </ModalBody>

  )
}
export default FaqPage;