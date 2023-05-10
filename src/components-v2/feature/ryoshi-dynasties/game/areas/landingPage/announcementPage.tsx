import {useState} from "react";
import {
  Stack,
  Text,
  Button,
  Grid,
  GridItem,
  Box,
  Flex,
  Center,

} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

const gothamBook = localFont({ src: '../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../fonts/Gotham-XLight.woff2' })

interface Props {
  showLeaderboard: () => void;
}

const AnnouncementPage = ({showLeaderboard}: Props) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const[dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

  const claimReward = async () => {
    console.log('claim reward');
  }

  return (
    <Stack spacing={3} p={4}>
      <Grid
        templateAreas={`"nav header"
                        "nav main"
                        `}
        gridTemplateRows={'50px 1fr 30px'}
        gridTemplateColumns={'150px 1fr'}
        h='200px'
        gap='1'
        color='whiteAlpha.800'
      >
        <GridItem pl='2'  area={'header'}>
          <Center>
          <RdButton
            w='250px'
            fontSize={{base: 'm', sm: 'm'}}
            hideIcon={true}
            onClick={claimReward}
          >
            {dailyRewardClaimed ? 'Return Tomorrow!' : 'Claim Daily Reward!'}
          </RdButton>
          </Center>
        </GridItem>
        
        <GridItem pl='2'bg='#272523' area={'nav'} onClick={showLeaderboard}>
          View Leaderboard
        </GridItem>
        <GridItem pl='2' bg='#272523' area={'main'}>
          <Text className={gothamBook.className} fontSize={{ base: '12px', md: '16px' }} >
            <Box>
              Announcements:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          "
        </Box>    
          </Text>
        </GridItem>
      </Grid>

    </Stack>
  );
}

export default AnnouncementPage;