import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import Countdown from 'react-countdown';
import {keyframes} from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import {useRouter} from 'next/router';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';
import {isFounderDrop, newlineText,} from '@src/utils';
import {dropState as statuses} from '@src/core/api/enums';
import {EbisuDropAbi, ERC20} from '@src/Contracts/Abis';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import {appConfig} from "@src/Config";
import {hostedImage} from "@src/helpers/image";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {Box, Button, Center, Flex, Heading, Image, SimpleGrid, Stack, Text} from "@chakra-ui/react";
import {MintBox} from "@src/components-v2/feature/drop/mint-box";
import {useAppSelector} from "@src/Store/hooks";
import {Drop, SpecialWhitelist} from "@src/core/models/drop";
import ImageService from "@src/core/services/image";
import { ArrowForwardIcon } from '@chakra-ui/icons';

const config = appConfig();

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`

const HeroSection = styled.section`
  border-radius: 0;
  margin: 0;
  padding: 0 0;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;

  .h-vh {
    height: 100vh;
    display: flex;
    align-items: center;
    background-position: center;
    background-size: cover;
  }
`;

const tabs = {
  description: 'description',
  shop: 'shop'
};

interface LandDropProps {
  drop: Drop;
}

const LandDrop = ({drop}: LandDropProps) => {
  const router = useRouter();
  const { slug } = router.query;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  // const [loading, setLoading] = useState(true);
  const [dropObject, setDropObject] = useState<Drop | null>(null);
  const [status, setStatus] = useState(statuses.UNSET);
  const [numToMint, setNumToMint] = useState(1);

  const [abi, setAbi] = useState<string | string[] | null>(null);
  // const [maxMintPerAddress, setMaxMintPerAddress] = useState(0);
  const [maxMintPerTx, setMaxMintPerTx] = useState(0);
  const [maxMintPerAddress, setMaxMintPerAddress] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [memberCost, setMemberCost] = useState(0);
  const [regularCost, setRegularCost] = useState(0);
  const [whitelistCost, setWhitelistCost] = useState(0);
  const [specialWhitelist, setSpecialWhitelist] = useState<SpecialWhitelist | null>(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [canMintQuantity, setCanMintQuantity] = useState(0);


  const [openMenu, setOpenMenu] = useState(tabs.description);
  const handleBtnClick = (key: string) => (element: any) => {
    setOpenMenu(key);
  };

  const user = useAppSelector((state) => {
    return state.user;
  });

  const membership = useAppSelector((state) => {
    return state.memberships;
  });

  useEffect(() => {
    async function fetchData() {
      await retrieveDropInfo();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, membership]);

  const retrieveDropInfo = async () => {
    setDropObject(drop);
    let currentDrop = drop;

    // Don't do any contract stuff if the drop does not have an address
    if (!drop.address || drop.complete) {
      setDropInfo(currentDrop, 0);
      calculateStatus(currentDrop, drop.complete ? currentDrop.totalSupply : 0, currentDrop.totalSupply);
      return;
    }

    // Use the new contract format if applicable
    let abi = currentDrop.abi;
    if (isUsingAbiFile(abi)) {
      const abiJson = require(`@src/Assets/abis/${currentDrop.abi}`);
      abi = abiJson.abi ?? abiJson;
    } else if (isUsingDefaultDropAbi(abi)) {
      abi = EbisuDropAbi;
    }
    setAbi(abi!);

    if (user.provider) {
      try {
        let writeContract = await new ethers.Contract(currentDrop.address, abi!, user.provider.getSigner());
        currentDrop = Object.assign({ writeContract: writeContract }, currentDrop);

        if (currentDrop.erc20Token) {
          const token = config.tokens[currentDrop.erc20Token];
          const erc20Contract = await new ethers.Contract(token.address, ERC20, user.provider.getSigner());
          const erc20ReadContract = await new ethers.Contract(token.address, ERC20, readProvider);
          currentDrop = {
            ...currentDrop,
            erc20Contract,
            erc20ReadContract,
          };
        }
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
      }
    }
    try {
      if (currentDrop.address && (isUsingDefaultDropAbi(currentDrop.abi) || isUsingAbiFile(currentDrop.abi))) {
        let readContract = await new ethers.Contract(currentDrop.address, abi!, readProvider);
        const infos = await readContract.getInfo();
        const canMint = user.address ? await readContract.canMint(user.address) : 0;
        setDropInfoFromContract(infos, canMint);
        calculateStatus(currentDrop, infos.totalSupply, infos.maxSupply);
      } else {
        let readContract = await new ethers.Contract(currentDrop.address, abi!, readProvider);
        const currentSupply = await readContract.totalSupply();
        setDropInfo(currentDrop, currentSupply);
        calculateStatus(currentDrop, currentSupply, currentDrop.totalSupply);
      }
      if (drop.specialWhitelistCost) {
        setSpecialWhitelist(drop.specialWhitelistCost);
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
    // setLoading(false);
    setDropObject(currentDrop);
  };

  const setDropInfo = (drop: any, supply: number) => {
    setMaxMintPerAddress(drop.maxMintPerAddress ?? 100);
    setMaxMintPerTx(drop.maxMintPerTx);
    setMaxSupply(drop.totalSupply);
    setMemberCost(drop.memberCost);
    setRegularCost(drop.cost);
    setTotalSupply(supply);
    setWhitelistCost(drop.whitelistCost);
    setSpecialWhitelist(drop.specialWhitelistCost);
    setCanMintQuantity(drop.maxMintPerTx);
  };

  const setDropInfoFromContract = (infos: any, canMint: number) => {
    setMaxMintPerAddress(Number(infos.maxMintPerAddress));
    setMaxMintPerTx(infos.maxMintPerTx);
    setMaxSupply(infos.maxSupply);
    setMemberCost(Number(ethers.utils.formatEther(infos.memberCost)));
    setRegularCost(Number(ethers.utils.formatEther(infos.regularCost)));
    setTotalSupply(infos.totalSupply);
    if (infos.whitelistCost) setWhitelistCost(Number(ethers.utils.formatEther(infos.whitelistCost)));
    setCanMintQuantity(Math.min(canMint, infos.maxMintPerTx));
  };

  const calculateStatus = (drop: any, totalSupply: number, maxSupply: number) => {
    const sTime = new Date(drop.start);
    const eTime = new Date(drop.end);
    const now = new Date();

    if (!drop.start || !drop.address || sTime > now) setStatus(statuses.NOT_STARTED);
    else if (parseInt(totalSupply.toString()) >= parseInt(maxSupply.toString()) && !isFounderDrop(drop.address))
      setStatus(statuses.SOLD_OUT);
    else if (!drop.end || eTime > now) setStatus(statuses.LIVE);
    else if (drop.end && eTime < now) setStatus(statuses.EXPIRED);
    else setStatus(statuses.NOT_STARTED);
  };

  const isUsingAbiFile = (dropAbi: any) => {
    return typeof dropAbi === 'string' && dropAbi.length > 0;
  };

  const isUsingDefaultDropAbi = (dropAbi: any) => {
    return typeof dropAbi === 'undefined' || dropAbi.length === 0;
  };

  return (
    <div>
      <HeroSection
        className={`jumbotron h-vh tint`}
        style={{
          backgroundImage: `url(${ImageService.translate(drop.images.banner ?? hostedImage('/img/background/banner-ryoshi-light.webp')).banner()})`
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className={`col-lg-6 mb-4 mb-sm-0 ${drop.mediaPosition === 'left' ? 'order-1' : 'order-2'}`}>
              <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                <>
                  {drop.video && (
                    <div className="player-wrapper">
                      <ReactPlayer
                        className="react-player"
                        controls
                        url={drop.video}
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
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}

                  <>{drop.embed && <div dangerouslySetInnerHTML={{ __html: drop.embed }} />}</>
                </>
              </Reveal>
            </div>
            <div className={`col-lg-6 ${drop.mediaPosition === 'left' ? 'order-2' : 'order-1'}`}>
              <div className="spacer-single"></div>
              <div className="spacer-double"></div>

              {status === statuses.LIVE && drop.end && (
                <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                  <p className="lead col-white">
                    Ends in: <Countdown date={drop.end} />
                  </p>
                </Reveal>
              )}
              {status === statuses.NOT_STARTED && drop.start && (
                <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                  <Heading as="h4" size="md" className="col-white">
                    Starts in:{' '}
                    <span className="text-uppercase color">
                      <Countdown date={drop.start} />
                    </span>
                  </Heading>
                </Reveal>
              )}
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <Heading as="h1" size="2xl" className="col-white mb-4">{drop.title}</Heading>
              </Reveal>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <div className="lead col-white mb-4">{newlineText(drop.subtitle)}</div>
              </Reveal>
              <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                <div>
                  <a href="#drop_detail" className="btn-main">
                    View Drop
                  </a>
                </div>
              </Reveal>
              <div className="spacer-10"></div>
            </div>
          </div>
        </div>
      </HeroSection>


        <div className="de_tab mt-2">
          <ul className="de_nav mb-2 text-center">
            <li className={`tab ${openMenu === tabs.description ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.description)}>About</span>
            </li>
            <li className={`tab ${openMenu === tabs.shop ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.shop)}>Mint</span>
            </li>
          </ul>
          <div className="de_tab_content">
            {openMenu === tabs.description && (
              <Box mt={3} mb={4}>
                <Center mb={8}>
                  <Box className="profile_avatar">
                    {drop.images.avatar && <img src={hostedImage(drop.images.avatar)} alt={drop.author.name} />}
                    <Box className="profile_name">
                      <Heading as="h4" size="md">
                        {drop.title}
                        <Box mt={2}>
                          <SocialsBar address={drop.address} socials={drop.author} />
                        </Box>
                      </Heading>
                    </Box>
                  </Box>
                </Center>
                <Box as='section' id="drop_detail" className="gl-legacy container no-top">
                  <Box textAlign='center'>
                    <Heading mb={4}>Unveil the Untamed Izanami's Cradle</Heading>
                    <Text>Welcome to the largest expansion of Ryoshi Dynasties yet, the grand Land Sale. We're thrilled to present an opportunity to own a unique piece of Izanami's Cradle. With only 2500 plots available and a cap of 10 per wallet, this is a once-in-a-lifetime chance to etch your name in the annals of our gaming universe.</Text>
                  </Box>
                </Box>
                <Box>
                  <Box as='section'  id="drop_detail" className="gl-legacy container no-top">
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                      <Flex justify='center'>
                        <Image src={ImageService.translate('/img/drops/izanamis-cradle-land-deeds/lands.webp').custom({width: 300})} w='300px' objectFit='contain' rounded='lg' />
                      </Flex>
                      <Box textAlign={{base: 'center', md: 'end'}}>
                        <Heading mb={4}>Unique & Rare Land Tiles</Heading>
                        <Text fontSize='lg'>Each piece of land carries its own story and value. With our exclusive tier system of rarities, owning a piece of land can mean possessing a common countryside plot or wielding the mighty epic castle plot. Each land tile is not just a plot but a token of uniqueness and diversity.</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Box>
                <Box>
                  <Box as='section'  id="drop_detail" className="gl-legacy container no-top">
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                      <Box textAlign={{base: 'center', md: 'start'}}>
                        <Heading mb={4}>Harvesting Resources</Heading>
                        <Text fontSize='lg'>Become a stalwart landowner and harvest an array of precious resources. From rare minerals to magical herbs, every land is teeming with resources ready for you to discover and utilize. Use these resources to develop your land, upgrade your buildings for more powerful bonuses and strengthen your faction.</Text>
                      </Box>
                      <Flex justify='center'>
                        <Image src={ImageService.translate('/img/drops/izanamis-cradle-land-deeds/land-resources.webp').custom({width: 400})} w='400px' objectFit='contain' />
                      </Flex>
                    </SimpleGrid>
                  </Box>
                </Box>
                <Box>
                  <Box as='section'  id="drop_detail" className="gl-legacy container no-top">
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                      <Flex justify='center'>
                        <Image src={ImageService.translate('/img/drops/izanamis-cradle-land-deeds/land-boss.webp').custom({width: 400})} w='400px' objectFit='contain' />
                      </Flex>
                      <Box textAlign={{base: 'center', md: 'end'}}>
                        <Heading mb={4}>Powerful Raid Bosses & Quests</Heading>
                        <Text fontSize='lg'>Unleash the adventurer in you! Izanami's Cradle is home to fearsome raid bosses. Assemble your bravest NFTs and embark on thrilling quests to challenge these formidable foes. Only the most valiant warriors will reap the coveted rewards!</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Box>
                <Box>
                  <Box as='section'  id="drop_detail" className="gl-legacy container no-top">
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                      <Box textAlign={{base: 'center', md: 'start'}}>
                        <Heading mb={4}>Discover Mighty Artifacts & Weapons</Heading>
                        <Text fontSize='lg'>The land of Izanami's Cradle is littered with ancient relics and artifacts, buried weapons of unimaginable power. Invest time in exploration and unearthing these artifacts to augment your prowess and secure your position in Ryoshi Dynasties.</Text>
                      </Box>
                      <Stack justify='center' direction={{base: 'column', lg: 'row'}} spacing={8} alignItems='center'>
                        <Image src={ImageService.translate('/img/drops/izanamis-cradle-land-deeds/land-weapons.webp').custom({width: 300})} w='300px' objectFit='contain' />
                        <Image src={ImageService.translate('/img/drops/izanamis-cradle-land-deeds/land-artifacts.webp').custom({width: 300})} w='300px' objectFit='contain' />
                      </Stack>
                    </SimpleGrid>
                  </Box>
                </Box>
                <Center>
                  <Button variant='primary' rightIcon={<ArrowForwardIcon />} onClick={() => setOpenMenu(tabs.shop)}>
                    View Mint
                  </Button>
                </Center>
              </Box>
            )}
            {openMenu === tabs.shop && (
              <section id="drop_detail" className="gl-legacy container no-top">
                <div className="row mt-md-5 pt-md-4">
                  <div className="col-md-6 text-center mt-4 md-md-0">
                    <img src={hostedImage(drop.images.drop)} className="img-fluid img-rounded mb-sm-30" alt={drop.title} />
                  </div>
                  <div className="col-md-6 mt-4 mt-md-0">

                    <div className="de-flex mt-4 mt-sm-0 mb-2">
                      <div className="de-flex-col">
                        <div className="profile_avatar">
                          {drop.images.avatar && <img src={hostedImage(drop.images.avatar)} alt={drop.author.name} />}
                          <div className="profile_name">
                            <Heading as="h4" size="md">
                              {drop.title}
                              <Box mt={2}>
                                <SocialsBar address={drop.address} socials={drop.author} />
                              </Box>
                            </Heading>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CollectionVerificationRow
                      doxx={drop.verification.doxx}
                      kyc={drop.verification.kyc}
                      escrow={drop.verification.escrow}
                      creativeCommons={drop.verification.creativeCommons}
                    />

                    <div className="item_info">

                      {!!dropObject && (
                        <MintBox
                          drop={dropObject}
                          abi={abi}
                          status={status}
                          totalSupply={totalSupply}
                          maxSupply={maxSupply}
                          priceDescription={drop.priceDescription}
                          onMintSuccess={async () => {
                            await retrieveDropInfo()
                          }}
                          canMintQuantity={canMintQuantity}
                          regularCost={regularCost}
                          memberCost={memberCost}
                          whitelistCost={whitelistCost}
                          specialWhitelist={specialWhitelist}
                          maxMintPerTx={maxMintPerTx}
                          maxMintPerAddress={maxMintPerAddress}
                        />
                      )}



                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

    </div>
  );
};
export default LandDrop;
