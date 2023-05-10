import {useState} from "react";
import {Stack, Text,} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = () => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);

  return (
    <Stack spacing={3} p={4}>
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
  );
}

export default FaqPage;