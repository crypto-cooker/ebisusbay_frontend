import React, {ReactNode, useEffect, useState} from 'react';
import {constants, Contract, ethers} from 'ethers';
import Countdown from 'react-countdown';
import {keyframes} from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import {useRouter} from 'next/router';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';
import {
  createSuccessfulTransactionToastContent,
  isFounderDrop,
  newlineText,
  percentage
} from '@market/helpers/utils';
import {useInterval} from "@market/hooks/use-interval";
import {DropState, DropState as statuses} from '@src/core/api/enums';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import {appConfig} from "@src/config";
import {hostedImage} from "@src/helpers/image";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  useNumberInput
} from "@chakra-ui/react";
import {Drop} from "@src/core/models/drop";
import ImageService from "@src/core/services/image";
import {ArrowForwardIcon} from '@chakra-ui/icons';
import {getTheme} from "@src/global/theme/theme";
import {commify} from "ethers/lib/utils";
import {toast} from "react-toastify";
import {getAnalytics, logEvent} from "@firebase/analytics";
import Fortune from "@src/global/contracts/Fortune.json";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import Link from "next/link";
import {parseErrorMessage} from "@src/helpers/validator";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@market/hooks/useAuthedFunction";

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
  const user = useUser();
  const [runAuthedFunction] = useAuthedFunction();

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  // const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState(statuses.UNSET);
  const [numToMint, setNumToMint] = useState(1);

  const [abi, setAbi] = useState<any>(null);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [canMintQuantity, setCanMintQuantity] = useState(0);
  const [mintingState, setMintingState] = useState<string | null>(null);
  const [allowlist1Cost, setAllowlist1Cost] = useState(0);
  const [allowlist2Cost, setAllowlist2Cost] = useState(0);
  const [publicCost, setPublicCost] = useState(0);
  const [allowlist1Start, setAllowlist1Start] = useState(0);
  const [allowlist2Start, setAllowlist2Start] = useState(0);
  const [publicStart, setPublicStart] = useState(0);

  const [openMenu, setOpenMenu] = useState(tabs.description);
  const handleBtnClick = (key: string) => (element: any) => {
    setOpenMenu(key);
  };

  useEffect(() => {
    async function fetchData() {
      await retrieveDropInfo();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.address]);

  const retrieveDropInfo = async () => {
    // Don't do any contract stuff if the drop does not have an address
    if (!drop.address || drop.complete) {
      setDropInfo(drop, 0);
      calculateStatus(drop, drop.complete ? drop.totalSupply : 0, drop.totalSupply);
      return;
    }

    const abiJson = require(`@market/assets/abis/izanami.json`);
    let abi = abiJson;
    setAbi(abiJson);

    try {
      let readContract = await new ethers.Contract(drop.address, abi, readProvider);
      const infos = await readContract.getInfo();
      const presaleTime = await readContract.presaleTime();
      const presaleDuration = await readContract.saleStarted();
      const canMint = user.address ? await readContract.canMint(user.address) : 0;

      setDropInfoFromContract(infos, canMint, Number(presaleTime));
      calculateStatus(drop, infos.totalSupply, infos.maxSupply);
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  };

  const setDropInfo = (drop: any, supply: number) => {
    setMaxSupply(drop.totalSupply);
    setTotalSupply(supply);
    setCanMintQuantity(drop.maxMintPerTx);
    setAllowlist1Cost(drop.erc20WhitelistCost);
    setAllowlist2Cost(drop.erc20MemberCost);
    setPublicCost(drop.erc20Cost);
    setAllowlist1Start(drop.salePeriods.allowlist1);
    setAllowlist2Start(drop.salePeriods.allowlist2);
    setPublicStart(drop.salePeriods.public);
  };

  const setDropInfoFromContract = (infos: any, canMint: number, presaleStart: number) => {
    setMaxSupply(infos.maxSupply);
    setTotalSupply(infos.totalSupply);
    setCanMintQuantity(Math.min(canMint, infos.maxMintPerTx));
    setAllowlist1Cost(Number(ethers.utils.formatEther(infos.whitelistCost)));
    setAllowlist2Cost(Number(ethers.utils.formatEther(infos.memberCost)));
    setPublicCost(Number(ethers.utils.formatEther(infos.regularCost)));
    setAllowlist1Start(presaleStart * 1000);
    setAllowlist2Start((presaleStart * 1000) + (60 * 60 * 1000));
    setPublicStart((presaleStart * 1000) + (60 * 60 * 2 * 1000));
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

  const mintNow = async (numToMint: number) => {
    runAuthedFunction(async() => {
      setMinting(true);
      setMintingState("Minting...");
      const mintContract = await new ethers.Contract(drop.address, abi, user.provider.getSigner());
      try {
        const cost = await mintContract.mintCost(user.address);
        let finalCost = cost.mul(numToMint);

        const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
        const allowance = await fortuneContract.allowance(user.address, drop.address);
        if (allowance.sub(finalCost) <= 0) {
          const approvalTx = await fortuneContract.approve(drop.address, constants.MaxUint256);
          await approvalTx.wait();
        }

        const response = await mintContract.mintWithToken(numToMint);

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        {
          const purchaseAnalyticParams = {
            value: Number(ethers.utils.formatEther(finalCost)),
            currency: 'FRTN',
            transaction_id: receipt.transactionHash,
            drop_name: drop.title.toString(),
            drop_slug: drop.slug.toString(),
            drop_address: drop.address.toString(),
            items: [{
              item_id: drop.slug,
              item_name: drop.title,
              item_brand: drop.author.name,
              price: drop.cost,
              discount: Number(drop.cost),
              quantity: numToMint
            }]
          };

          logEvent(getAnalytics(), 'purchase', purchaseAnalyticParams);
        }

        await retrieveDropInfo();
      } catch (error: any) {
        console.log(error);
        Sentry.captureException(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setMinting(false);
        setMintingState(null);
      }
    });
  };

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: numToMint,
      min: 1,
      max: canMintQuantity,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setNumToMint(valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <div>
      <HeroSection
        className={`jumbotron h-vh tint`}
        style={{
          backgroundImage: `url(${ImageService.translate(drop.images.banner ?? hostedImage('/img/background/banner-default.webp')).banner()})`
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className={`col-lg-6 mb-4 mb-sm-0 ${drop.mediaPosition === 'left' ? 'order-1' : 'order-2'}`}>
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
                  <Stack direction={{base: 'column', md: 'row'}} className="profile_avatar" alignItems='center'>
                    <Image src={hostedImage(drop.images.avatar)} alt={drop.author.name} />
                    <Box className="profile_name" textAlign={{base: 'center', md: 'start'}}>
                      <Heading as="h4" size="md">
                        <Box ms={2}>{drop.title}</Box>
                        <Box mt={2}>
                          <SocialsBar address={drop.address} socials={drop.author} />
                        </Box>
                      </Heading>
                    </Box>
                  </Stack>
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
                        <Image src={ImageService.translate('https://cdn-prod.ebisusbay.com/files/drop-images/izanamis-cradle-land-deeds/land-beach.webp').custom({width: 400})} w='400px' objectFit='contain' />
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
                        <Image src={ImageService.translate('https://cdn-prod.ebisusbay.com/files/drop-images/izanamis-cradle-land-deeds/land-resources.webp').custom({width: 400})} w='400px' objectFit='contain' />
                      </Flex>
                    </SimpleGrid>
                  </Box>
                </Box>
                <Box>
                  <Box as='section'  id="drop_detail" className="gl-legacy container no-top">
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                      <Flex justify='center'>
                        <Image src={ImageService.translate('https://cdn-prod.ebisusbay.com/files/drop-images/izanamis-cradle-land-deeds/land-boss.webp').custom({width: 400})} w='400px' objectFit='contain' />
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
                        <Image src={ImageService.translate('https://cdn-prod.ebisusbay.com/files/drop-images/izanamis-cradle-land-deeds/land-weapons.webp').custom({width: 300})} w='300px' objectFit='contain' />
                        <Image src={ImageService.translate('https://cdn-prod.ebisusbay.com/files/drop-images/izanamis-cradle-land-deeds/land-artifacts.webp').custom({width: 300})} w='300px' objectFit='contain' />
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
                    <Box position='relative' pt='125%'>
                      <ReactPlayer
                        className="react-player"
                        url={ImageService.translate(drop.video!).convert()}
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
                    </Box>
                  </div>
                  <div className="col-md-6 mt-4 mt-md-0">

                    <Flex justify={{base: 'center', md: 'start'}} mb={4}>
                      <Stack direction={{base: 'column', md: 'row'}} className="profile_avatar" alignItems='center'>
                        <Image src={hostedImage(drop.images.avatar)} alt={drop.author.name} />
                        <Box className="profile_name" textAlign={{base: 'center', md: 'start'}}>
                          <Heading as="h4" size="md">
                            <Box ms={2}>{drop.title}</Box>
                            <Box mt={2}>
                              <SocialsBar address={drop.address} socials={drop.author} />
                            </Box>
                          </Heading>
                        </Box>
                      </Stack>
                    </Flex>

                    <Flex justify={{base: 'center', md: 'start'}}>
                      <CollectionVerificationRow
                        doxx={drop.verification.doxx}
                        kyc={drop.verification.kyc}
                        escrow={drop.verification.escrow}
                        creativeCommons={drop.verification.creativeCommons}
                      />
                    </Flex>


                    {(status === statuses.UNSET || status === statuses.NOT_STARTED || drop.complete) && (
                      <Text align="center" fontSize="sm" fontWeight="semibold" mt={4}>
                        Supply: {ethers.utils.commify(maxSupply.toString())}
                      </Text>
                    )}
                    {status >= statuses.LIVE && !drop.complete && (
                      <Box>
                        <Flex justify='space-between' mt={3} mb={1}>
                          <Box fontWeight='bold'>{percentage(totalSupply.toString(), maxSupply.toString())}% minted</Box>
                          <Box>{ethers.utils.commify(totalSupply.toString())} / {ethers.utils.commify(maxSupply.toString())}</Box>
                        </Flex>
                        <Progress
                          size='xs'
                          value={percentage(totalSupply.toString(), maxSupply.toString())}
                          bg='white'
                        />
                      </Box>
                    )}

                    <MintPhase
                      title='Allowlist 1'
                      description={
                        <>For Fortune presale participants</>
                      }
                      price={allowlist1Cost}
                      startTime={allowlist1Start}
                      endTime={allowlist2Start}
                      onMint={(quantity: number) => mintNow(quantity)}
                      maxMintQuantity={canMintQuantity}
                      isMinting={minting}
                      isDropComplete={drop.complete || status > DropState.LIVE}
                      dropStatus={status}
                      currentSupply={Number(totalSupply)}
                      maxSupply={Number(maxSupply)}
                      onRefreshDropStatus={() => calculateStatus(drop, totalSupply, maxSupply)}
                    />
                    <MintPhase
                      title='Allowlist 2'
                      description={
                        <>
                          For users with 1000+ Mitama. Earn Mitama by staking Fortune in <Link href='/ryoshi' className='color fw-bold'>Ryoshi Dynasties</Link>
                        </>
                      }
                      price={allowlist2Cost}
                      startTime={allowlist2Start}
                      endTime={publicStart}
                      onMint={(quantity: number) => mintNow(quantity)}
                      maxMintQuantity={canMintQuantity}
                      isMinting={minting}
                      isDropComplete={drop.complete || status > DropState.LIVE}
                      dropStatus={status}
                      currentSupply={Number(totalSupply)}
                      maxSupply={Number(maxSupply)}
                      onRefreshDropStatus={() => calculateStatus(drop, totalSupply, maxSupply)}
                    />
                    <MintPhase
                      title='Public'
                      price={publicCost}
                      startTime={publicStart}
                      onMint={(quantity: number) => mintNow(quantity)}
                      maxMintQuantity={canMintQuantity}
                      isMinting={minting}
                      isDropComplete={drop.complete || status > DropState.LIVE}
                      dropStatus={status}
                      currentSupply={Number(totalSupply)}
                      maxSupply={Number(maxSupply)}
                      onRefreshDropStatus={() => calculateStatus(drop, totalSupply, maxSupply)}
                    />
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


interface MintPhaseProps {
  title: string;
  description?: ReactNode;
  price: number;
  startTime: number;
  endTime?: number;
  onMint: (numToMint: number) => void;
  maxMintQuantity: number;
  isMinting: boolean;
  isDropComplete: boolean;
  dropStatus: number;
  currentSupply: number;
  maxSupply: number;
  onRefreshDropStatus: () => void;
}

const MintPhase = ({ title, description, price, startTime, endTime, onMint, maxMintQuantity, isMinting, isDropComplete, dropStatus, currentSupply, maxSupply, onRefreshDropStatus }: MintPhaseProps) => {
  const user = useUser();
  const [numToMint, setNumToMint] = useState(1);
  const [phaseStatus, setPhaseStatus] = useState(DropState.UNSET);
  const [countdownFinished, setCountdownFinished] = useState(false);

  async function syncStatus() {
    if (dropStatus < DropState.LIVE) {
      setPhaseStatus(statuses.NOT_STARTED);
    } else if (dropStatus > DropState.LIVE || isDropComplete) {
      setPhaseStatus(statuses.EXPIRED);
    } else {
      const now = Date.now();

      if (startTime > now) setPhaseStatus(statuses.NOT_STARTED);
      else if (currentSupply >= maxSupply) setPhaseStatus(statuses.SOLD_OUT);
      else if (!endTime || endTime > now) setPhaseStatus(statuses.LIVE);
      else if (endTime && endTime < now) setPhaseStatus(statuses.EXPIRED);
      else setPhaseStatus(statuses.NOT_STARTED);
    }
  }

  useEffect(() => {
    syncStatus();
  }, [startTime]);

  useInterval(() => {
    async function func() {
      syncStatus();
    }
    func();
  }, 1000);

  const renderer = ({ days, hours, minutes, seconds, completed }: { days:number, hours:number, minutes:number, seconds: number, completed:boolean}) => {
    if (completed) {
      return <>Live!</>;
    } else {
      // Render a countdown
      return <span>Starts in: {days}:{hours}:{minutes}:{seconds}</span>;
    }
  };

  const handleTimerComplete = () => {
    if (!countdownFinished) {
      onRefreshDropStatus();
      setCountdownFinished(true);
    }
  }

  const connectWalletPressed = () => {
    user.connect();
  };

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: numToMint,
      min: 1,
      max: maxMintQuantity,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setNumToMint(valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <Box
      className="card shadow"
      mt={2}
      borderColor={phaseStatus === statuses.LIVE ? getTheme(user.theme).colors.borderColor3 : getTheme(user.theme).colors.borderColor2}
      borderWidth={phaseStatus === statuses.LIVE ? 2 : 1}
      bgColor={getTheme(user.theme).colors.bgColor5}
      p={4}
      rounded='2xl'
    >
      <Flex justify='space-between'>
        <Box fontSize="xl" fontWeight='bold' className="mb-1">{title}</Box>
        <Box className='text-muted' textAlign='end' fontSize='sm'>
          {phaseStatus === statuses.LIVE ? (
            <>Live!</>
          ) : phaseStatus > statuses.LIVE ? (
            <>Ended</>
          ) : (
            <Countdown
              date={startTime}
              renderer={renderer}
              onComplete={handleTimerComplete}
            />
          )}
        </Box>
      </Flex>
      <HStack>
        <FortuneIcon boxSize={8} />
        <span className="ms-2">{price ? commify(price) : 'TBA'}</span>
      </HStack>

      {phaseStatus === statuses.LIVE ? (
        <Box mt={2}>
          {maxMintQuantity > 0 && (
            <Stack direction={{base:'column', lg:'row'}} spacing={2}>
              <HStack minW="150px">
                <Button {...dec}>-</Button>
                <Input {...input} />
                <Button {...inc}>+</Button>
              </HStack>
              <PrimaryButton
                w='full'
                onClick={() => onMint(numToMint)}
                disabled={isMinting}
                isLoading={isMinting}
                loadingText='Minting...'
              >
                Mint
              </PrimaryButton>
            </Stack>
          )}
          {maxMintQuantity === 0 && !user.address && (
            <PrimaryButton onClick={connectWalletPressed}>
              Connect Wallet
            </PrimaryButton>
          )}
          <Box textAlign='center' fontSize='sm' mt={4}>{description}</Box>
        </Box>
      ) : phaseStatus === statuses.SOLD_OUT ? (
        <Box textAlign='center' mt={4} className='text-muted'>SOLD OUT</Box>
      ) : phaseStatus === statuses.EXPIRED ? (
        <Box textAlign='center' mt={4}>ENDED</Box>
      ) : (
        <Box textAlign='center' fontSize='sm' mt={4}>{description}</Box>
      )}
    </Box>
  )
}