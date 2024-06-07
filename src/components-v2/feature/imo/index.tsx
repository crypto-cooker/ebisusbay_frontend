import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  useClipboard,
  VStack,
  Wrap
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {faDiscord, faTelegram, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {StandardContainer} from "@src/components-v2/shared/containers";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useUser} from "@src/components-v2/useUser";
import {getTheme} from "@src/global/theme/theme";
import Countdown, {zeroPad} from "react-countdown";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
enum ImoStatus {
  UPCOMING,
  LIVE,
  ENDED
}

const startDate = 1717762500000;
const endDate = 1718024400000;
const contractAddress = '0x14597d4bc5e4d9b8ce40086bb054121cb992d4b8';

const getStatus = (): ImoStatus => {
  const now = Date.now();
  if (now < startDate) {
    return ImoStatus.UPCOMING;
  } else if (now >= startDate && now <= endDate) {
    return ImoStatus.LIVE;
  } else {
    return ImoStatus.ENDED;
  }
};

export default function ImoPage() {
  const user = useUser();
  const [status, setStatus] = useState<ImoStatus>(ImoStatus.UPCOMING);
  const { onCopy, hasCopied } = useClipboard(contractAddress);

  const renderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    if (completed) {
      return (
        <Box>Complete...</Box>
      );
    } else {
      let timeStr = `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
      if (days > 0) timeStr = `${zeroPad(days)}:${timeStr}`;
      return <Box fontSize='xs' textAlign='center'>Ends in: {timeStr}</Box>;
    }
  };

  const handleTimerComplete = () => {
    setStatus(ImoStatus.LIVE);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
            url='https://youtu.be/B2qlE5zwjdo'
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
              <Box mt={4}>
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
                  <Box>76.66% paired with 35% LP, remainder to be used for Operations</Box>
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

              {status === ImoStatus.LIVE ? (
                <Box
                  p={4}
                  mx={-4}
                  mt={2}
                  bg={getTheme(user.theme).colors.bgColor5}
                >
                  <Flex
                    justify='space-between'
                    direction={{base: 'column', md: 'row'}}
                  >
                    <Box>
                      <Box fontSize='xs'>SEND FUNDS TO</Box>
                      <Box fontWeight='bold'>{contractAddress}</Box>
                    </Box>
                    <PrimaryButton onClick={onCopy} alignSelf='end'>
                      {hasCopied ? 'Copied!' : 'Copy'}
                    </PrimaryButton>
                  </Flex>
                  <Box mt={2}>
                    <Countdown
                      date={endDate}
                      renderer={renderer}
                      onComplete={handleTimerComplete}
                    />
                  </Box>
                </Box>
              ) : status === ImoStatus.ENDED ? (
                <Box
                  p={4}
                  mx={-4}
                  mt={2}
                  bg={getTheme(user.theme).colors.bgColor5}
                >
                  <Flex
                    justify='space-between'
                    direction={{base: 'column', md: 'row'}}
                    align='center'
                  >
                    <Box>
                      <Box fontSize='xs'>PRESALE ADDRESS</Box>
                      <Box fontWeight='bold'>{contractAddress}</Box>
                      <Box fontSize='xs'>DO NOT SEND ANYMORE FUNDS TO THE ABOVE ADDRESS</Box>
                    </Box>
                    <Box textAlign='center' fontWeight='bold'>ENDED</Box>
                  </Flex>
                </Box>
              ) : (
                <Box
                  p={4}
                  mx={-4}
                  mt={2}
                  bg={getTheme(user.theme).colors.bgColor5}
                  textAlign='center'
                >
                  <Box fontSize='xs'>STARTS IN</Box>
                  <Countdown
                    date={startDate}
                    renderer={renderer}
                    onComplete={handleTimerComplete}
                  />
                </Box>
              )}
              <Box mt={4}>
                <hr/>
              </Box>
              <SimpleGrid columns={2} mt={4}>
                <Box>Offering starts</Box>
                <Box textAlign='end' fontWeight='bold'>{formatDate(startDate)}</Box>
                <Box>Offering ends</Box>
                <Box textAlign='end' fontWeight='bold'>{formatDate(endDate)}</Box>
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

const formatDate = (timestamp: number): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'UTC',
    timeZoneName: 'short',
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp)).replace('GMT', 'UTC');
};