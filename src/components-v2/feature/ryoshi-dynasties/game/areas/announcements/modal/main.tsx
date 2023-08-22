import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {Box, Center, Flex, Grid, GridItem, Image, Link, Text, useMediaQuery, VStack} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useRouter} from "next/router";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import ImageService from "@src/core/services/image";
import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import LocalDataService from "@src/core/services/local-data-service";
import {useQuery} from "@tanstack/react-query";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from "swiper";
import NextLink from "next/link";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  handleShowLeaderboard: () => void;
  onOpenDailyCheckin: () => void;
  handleShowPatchNotes: (changeDate:string, patchNumer:string, notes:string[]) => void;
}

const MainPage = ({handleShowLeaderboard, onOpenDailyCheckin, handleShowPatchNotes}: Props) => {
  const router = useRouter();
  const { user: rdUserContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [isMobile] = useMediaQuery("(max-width: 750px)");
  
  const user = useAppSelector((state) => state.user);

  const { data: ads } = useQuery({
    queryKey: ['RdBoardAds'],
    queryFn: () => LocalDataService.getRdBoardAds(),
    refetchOnWindowFocus: false,
    initialData: []
  });

  //timer
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [canClaim, setCanClaim] = useState(false);

  //timer functions
  const getTimeRemaining = (e:any) => {
    const total = Date.parse(e) - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, days, hours, minutes, seconds
    };
  }
  const startTimer = (e:any) => {
      let { total, hours, days, minutes, seconds } = getTimeRemaining(e);
      if (total >= 0) {
          setTimer(
              ((days) > 0 ? (days + ' days ') : (
              (hours > 9 ? hours : '0' + hours) + ':' +
              (minutes > 9 ? minutes : '0' + minutes) + ':' +
              (seconds > 9 ? seconds : '0' + seconds)))
          )
      }
  }
  // const clearTimer = (e:any) => {
  //   startTimer(e);
  //   if (Ref.current) clearInterval(Ref.current);
  //   const id = setInterval(() => { startTimer(e); }, 1000)
  //   Ref.current = id;
  // }

  useEffect(() => {
      if (!user.address || !rdUserContext) {
        setCanClaim(false);
        return;
      }

      const claimData = rdUserContext.dailyRewards;
      if(!claimData.nextClaim) {
        setCanClaim(true);
      } else if(Date.parse(claimData.nextClaim) <= Date.now()) {
        setCanClaim(true);
      } else {
        setCanClaim(false);
        // clearTimer(claimData.nextClaim);
      }
  }, [user.address, rdUserContext])

  //src='/img/ryoshi-dynasties/announcements/base/large_frame_top_1200.png'
  const adSpot = useMemo(() => {
    return (
      <Box>
        {isMobile ? (
          <Swiper
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            style={{maxWidth:'356px', height:'100%'}}
          >
            {ads.map((ad) => (
              <SwiperSlide>
                <Center>
                  <Image
                    alt={ad.name}
                    src={ImageService.translate(ad.details.imageSm).convert()}
                    maxH='300px'
                  />
                </Center>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <MapFrame
            gridHeight={'15px 1fr 15px'}
            gridWidth={'18px 1fr 18px'}
            w='626px'
            topFrame='/img/ryoshi-dynasties/announcements/base/large_frame_top_1200.png'
            rightFrame='/img/ryoshi-dynasties/announcements/base/small_frame_right.png'
            bottomFrame='/img/ryoshi-dynasties/announcements/base/large_frame_top_1200.png'
            leftFrame='/img/ryoshi-dynasties/announcements/base/small_frame_left.png'
            mb={10}
          >
            <Swiper
              loop={true}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              style={{width:'590px', height:'100%'}}
            >
              {ads.map((ad) => (
                <SwiperSlide>
                  <Box
                    rounded='md'
                    minWidth='100%'
                    minHeight='100%'
                    position='relative'
                  >
                    <Box
                      cursor='pointer'
                      onClick={() => {
                        // router.push('/drops/ballies-cheerleaders');
                      }}
                    >
                      <Link as={NextLink} href={ad.details.link.url} isExternal={ad.details.link.external}>
                        <Image
                          alt={ad.name}
                          src={ImageService.translate(ad.details.imageLg).convert()}
                        />
                      </Link>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </MapFrame>
        )}
      </Box>
    )
  }, [ads, isMobile]);

  return (
    <VStack marginBottom={20} >
      <Box rounded='md' p={isMobile?'0':'4'} fontSize='sm' textAlign='left' marginTop={12} >
        <Text textColor={'#fefaee'} >
          Welcome to <b>Ryoshi Dynasties!</b> A captivating gamified DAO experience, combining NFT marketplace, battles, and strategic gameplay. Build your dynasty, collect rare NFTs, and earn rewards.
        </Text>
        <Text mt={4} textColor={'#fefaee'} >
          Users wishing to visit the <b>Ebisu's Bay</b> marketplace experience can still do so by <b>using the links at the top of the page.</b>
        </Text>
      </Box>

      {adSpot}
      {/*<Flex h={isMobile ? "300px" :"200px"}>*/}

      {/*</Flex>*/}

      {/*<Flex h={isMobile ? "300px" :"200px"} >*/}
      {/*  <Swiper*/}
      {/*    spaceBetween={10}*/}
      {/*    slidesPerView={1}*/}
      {/*    navigation={true}*/}
      {/*    loop={true}*/}
      {/*    modules={[Navigation, Pagination]}*/}
      {/*    className="mySwiper"*/}
      {/*  >*/}
      {/*  {ads.map((ad) => (*/}
      {/*    <SwiperSlide>*/}
      {/*      <Link as={NextLink} href={ad.details.link.url} isExternal={ad.details.link.external}>*/}
      {/*        {isMobile ? (*/}
      {/*          <Image*/}
      {/*            alt={ad.name}*/}
      {/*            src={ImageService.translate(ad.details.imageSm).convert()}*/}
      {/*            maxH='300px'*/}
      {/*          />*/}
      {/*        ) : (*/}
      {/*          // <Image*/}
      {/*          //   alt="Buy FRTN on VVS"*/}
      {/*          //   src={ImageService.translate('/img/ryoshi-dynasties/announcements/time-machines.webp').convert()}*/}
      {/*          // />*/}
      {/*          <MapFrame*/}
      {/*            gridHeight={'15px 1fr 15px'}*/}
      {/*            gridWidth={'18px 1fr 18px'}*/}
      {/*            h='75px'*/}
      {/*            w='590px'*/}
      {/*            topFrame='/img/ryoshi-dynasties/announcements/base/large_frame_top_1200.png'*/}
      {/*            rightFrame='/img/ryoshi-dynasties/announcements/base/small_frame_right.png'*/}
      {/*            bottomFrame='/img/ryoshi-dynasties/announcements/base/large_frame_top_1200.png'*/}
      {/*            leftFrame='/img/ryoshi-dynasties/announcements/base/small_frame_left.png'*/}
      {/*          >*/}
      {/*            <Box*/}
      {/*              rounded='md'*/}
      {/*              minWidth='100%'*/}
      {/*              minHeight='100%'*/}
      {/*              position='relative'*/}
      {/*              mt={[0, "0rem !important"]}*/}
      {/*            >*/}
      {/*              <Box*/}
      {/*                cursor='pointer'*/}
      {/*                onClick={() => {*/}
      {/*                  // router.push('/drops/ballies-cheerleaders');*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                <Link as={NextLink} href={ad.details.link.url} isExternal={ad.details.link.external}>*/}
      {/*                  <Image*/}
      {/*                    alt={ad.name}*/}
      {/*                    src={ImageService.translate(ad.details.imageLg).convert()}*/}
      {/*                  />*/}
      {/*                </Link>*/}
      {/*              </Box>*/}
      {/*            </Box>*/}
      {/*          </MapFrame>*/}
      {/*        )}*/}
      {/*      </Link>*/}
      {/*    </SwiperSlide>*/}
      {/*  ))}*/}
      {/*  </Swiper>*/}
      {/*</Flex>*/}


      <Grid
        h='100px'
        templateRows='repeat(1, 1fr)'
        templateColumns={isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)'}
        gap={0}
        w='full'
        rowGap={6}
        >
        <GridItem 
          colSpan={2} 
          textAlign='center' 
          rounded='md'
          minH='150px'
          minW={ isMobile ? '100%' : '100%' }
          >
          <Flex justifyContent={'center'} >
            <Image
              position={'absolute'}
              pointerEvents={'none'}
              w='250px'
              fontSize={{base: '12px', sm: 'md'}}
              zIndex={1}
              src='/img/ryoshi-dynasties/announcements/base/small_header.png'
              >
            </Image>
          </Flex>


      <VStack spacing={0} >

        <Text w='100%' mt={'2'} zIndex={9} as='b' fontSize={'24px'} mb='12px' textColor={'#fefaee'}>
          Information
        </Text>


          <Box
            as="button"
            bg=""
            px={4}
            rounded="md"
            className={gothamBook.className}
            textColor={'#fefaee'}
            _hover={{ bg: "yellow.900" }}
            _focus={{ boxShadow: "outline" }}
            onClick={() => {
              window.open('https://ebisusbay.notion.site/ebisusbay/Ryoshi-Dynasties-8cb0bb21ad194af092cf1e1f8a8846c6','_blank');
            }}
          >
            Whitepaper
          </Box>
          <Box
            as="button"
            bg=""
            px={4}
            rounded="md"
            className={gothamBook.className}
            textColor={'#fefaee'}
            _hover={{ bg: "yellow.900" }}
            _focus={{ boxShadow: "outline" }}
            onClick={() => {
              router.push('/marketplace');
            }}
          >
            Marketplace
          </Box>
          <Box
            as="button"
            bg=""
            px={4}
            rounded="md"
            className={gothamBook.className}
            textColor={'#fefaee'}
            _hover={{ bg: "yellow.900" }}
            _focus={{ boxShadow: "outline" }}
            onClick={() => {
              window.open('https://vvs.finance/swap?outputCurrency=0xaF02D78F39C0002D14b95A3bE272DA02379AfF21&inputCurrency=0xc21223249CA28397B4B6541dfFaEcC539BfF0c59','_blank');              }}
          >
            Buy FRTN
          </Box>
        </VStack>
      </GridItem>
        
      <GridItem 
          colSpan={2} 
          textAlign='center' 
          rounded='md'
          minH='150px'
          minW={ isMobile ? '100%' : '100%' }>
        <Flex justifyContent='center' w={'100%'} >
          <MapFrame
              gridHeight={'16px 1fr 16px'}
              gridWidth={'16px 1fr 16px'}
              h='75px'
              w='250px'
              topFrame='/img/ryoshi-dynasties/announcements/base/small_frame_top.png'
              rightFrame='/img/ryoshi-dynasties/announcements/base/small_frame_right.png'
              bottomFrame='/img/ryoshi-dynasties/announcements/base/small_frame_bottom.png'
              leftFrame='/img/ryoshi-dynasties/announcements/base/small_frame_left.png'
            >
              <Flex justifyContent={'center'} >
                <Image
                src={'/img/ryoshi-dynasties/announcements/base/graphic_claim_koban_clean.png'}
                zIndex={0}
                >
                </Image>
                <RdButton
                  position={'absolute'}
                  bottom={'10px'}
                  fontSize={{base: 'lg', sm: 'lg'}}
                  onClick={onOpenDailyCheckin}
                  >
                  {canClaim ? 'Claim Now!' : 'Claim in ' + timer}
                </RdButton>
              </Flex>
            </MapFrame>
          </Flex>
        </GridItem>

        <GridItem 
          colSpan={2} 
          textAlign='center' 
          rounded='md'
          minH='150px'
          minW={isMobile ? '100%' : '100%' }
          >
        <Flex justifyContent='center' w={'100%'} >
          <MapFrame
              gridHeight={'16px 1fr 16px'}
              gridWidth={'16px 1fr 16px'}
              h='75px'
              w='250px'
              topFrame='/img/ryoshi-dynasties/announcements/base/small_frame_top.png'
              rightFrame='/img/ryoshi-dynasties/announcements/base/small_frame_right.png'
              bottomFrame='/img/ryoshi-dynasties/announcements/base/small_frame_bottom.png'
              leftFrame='/img/ryoshi-dynasties/announcements/base/small_frame_left.png'
            >
              <Flex justifyContent={'center'} >
                <Image
                  src={'/img/ryoshi-dynasties/announcements/base/graphic_leaderboard_clean.png'}
                  zIndex={0}
                  >
                </Image>
                <RdButton
                  position={'absolute'}
                  bottom={'10px'}
                  fontSize={{base: 'lg', sm: 'lg'}}
                  onClick={handleShowLeaderboard}
                  >
                  View Leaderboards
                </RdButton>
              </Flex>
            </MapFrame>
          </Flex>
        </GridItem>
      </Grid>
    </VStack>
  );
}

export default MainPage;
//patchnotes
        {/* <GridItem rowSpan={2} colSpan={2} 
        // bg='#272523' 
        p={4} textAlign='center' rounded='md' >
          <Text fontSize={{ base: 'sm', md: 'xl' }} fontWeight='bold'></Text>
          <RdButton
          pointerEvents={'none'}
            w='full'
            maxW='200px'
            fontSize={{base: '12px', sm: 'md'}}
          >
            Patch Notes
          </RdButton>
          <VStack mt={4}>
            <Box as="button" bg="" px={4} rounded="md" className={gothamBook.className} color="white" _hover={{ bg: "yellow.900" }} _focus={{ boxShadow: "outline" }}
              onClick={() => {handleShowPatchNotes(patchNotes[0].changeDate, patchNotes[0].patchNumber, patchNotes[0].notes)}}
            >
              <UnorderedList>
                <ListItem>{patchNotes[0].changeDate} {patchNotes[0].patchNumber}</ListItem>
              </UnorderedList>
            </Box>
            <Box as="button" bg="" px={4} rounded="md" className={gothamBook.className} color="white" _hover={{ bg: "yellow.900" }} _focus={{ boxShadow: "outline" }}
              onClick={() => {handleShowPatchNotes(patchNotes[1].changeDate, patchNotes[1].patchNumber, patchNotes[1].notes)}}
            >
              <UnorderedList>
                <ListItem>{patchNotes[1].changeDate} {patchNotes[1].patchNumber}</ListItem>
              </UnorderedList>
            </Box>
            <Box as="button" bg="" px={4} rounded="md" className={gothamBook.className} color="white" _hover={{ bg: "yellow.900" }} _focus={{ boxShadow: "outline" }}
              onClick={() => {handleShowPatchNotes(patchNotes[2].changeDate, patchNotes[2].patchNumber, patchNotes[2].notes)}}
            >
              <UnorderedList>
                <ListItem>{patchNotes[2].changeDate} {patchNotes[2].patchNumber}</ListItem>
              </UnorderedList>
            </Box>
            
          </VStack>
        </GridItem> */}