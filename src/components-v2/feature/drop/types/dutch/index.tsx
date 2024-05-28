import {Drop} from "@src/core/models/drop";
import {useAppSelector} from "@market/state/redux/store/hooks";
import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {dutchAuctionDataAtom} from "@src/components-v2/feature/drop/types/dutch/atom";
import {Contract, ethers} from "ethers";
import * as Sentry from "@sentry/react";
import {DropState as statuses} from "@src/core/api/enums";
import {appConfig} from "@src/Config";
import AuctionBox from "@src/components-v2/feature/drop/types/dutch/auction-box";
import ImageService from "@src/core/services/image";
import {hostedImage} from "@src/helpers/image";
import Reveal from "react-awesome-reveal";
import Countdown from "react-countdown";
import {Box, Flex, Heading, Image, Stack} from "@chakra-ui/react";
import {ciEquals, newlineText} from "@market/helpers/utils";
import {keyframes} from "@emotion/react";
import styled from "styled-components";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import Fortune from "@src/global/contracts/Fortune.json";
import Markdown from "react-markdown";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
let abi = require(`@market/assets/abis/ryoshi-tales-heroes.json`);
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

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

interface DutchAuctionProps {
  drop: Drop;
}

const DutchAuction = ({drop}: DutchAuctionProps) => {
  const user = useUser();
  const [auctionData, setAuctionData] = useAtom(dutchAuctionDataAtom);

  const calculateStatus = (drop: any, availableTokenCount: number) => {
    const sTime = new Date(drop.start);
    const eTime = new Date(drop.end);
    const now = new Date();

    if (!drop.start || !drop.address || sTime > now) return statuses.NOT_STARTED;
    else if (availableTokenCount < 1) return statuses.SOLD_OUT;
    else if (!drop.end || eTime > now) return statuses.LIVE;
    else if (drop.end && eTime < now) return statuses.EXPIRED;
    else return statuses.NOT_STARTED;
  };

  const calculateStatusFromContract = (startTime: number, endTime: number, availableTokenCount: number) => {
    const sTime = new Date(startTime);
    const eTime = new Date(endTime);
    const now = new Date();

    if (!startTime || !drop.address || sTime > now) return statuses.NOT_STARTED;
    else if (availableTokenCount < 1) return statuses.SOLD_OUT;
    else if (!endTime || eTime > now) return statuses.LIVE;
    else if (endTime && eTime < now) return statuses.EXPIRED;
    else return statuses.NOT_STARTED;
  };

  const retrieveDropInfo = async () => {
    // Don't do any contract stuff if the drop does not have an address
    if (!drop.address || !drop.start) {
      const cost = !!drop.erc20Cost ? Number(drop.erc20Cost) : 0;
      setAuctionData((prev) => ({
        ...prev,
        drop: drop,
        address: drop.address,
        startPrice: cost,
        currentRound: 0,
        currentPrice: cost,
        isUsingContract: false,
        status: calculateStatus(drop, drop.complete ? drop.totalSupply : 0),
        maxSupply: drop.totalSupply,
        nextRoundTime: drop.start,
        availableTokenCount: drop.totalSupply,
        currentSupply: 0,
        canMint: drop.maxMintPerTx,
      }));
      return;
    }

    try {
      const readContract = auctionData.readContract ?? new ethers.Contract(drop.address, abi, readProvider);
      // const writeContract = !!user.address ? new ethers.Contract(drop.address, abi, user.provider) : undefined;

      const kitchenSink = await readContract.getKitchSink(user.address ?? ethers.constants.AddressZero);

      let currentRound = Math.ceil(((Date.now() / 1000) - (parseInt(kitchenSink.publicStartTime))) / kitchenSink.decreaseInterval);

      if (currentRound < 0) currentRound = 0;
      const hackMaxSupply = 330;

      const priceDrop = kitchenSink.priceDecreaseAmount.mul(currentRound > 0 ? currentRound - 1 : 0);
      let currentPrice = Math.floor(parseFloat(ethers.utils.formatEther(kitchenSink.startPrice.sub(priceDrop))));
      if (kitchenSink.availableTokenCount.lt(1)) currentPrice = parseInt(ethers.utils.formatEther(kitchenSink.lowestMintPrice))
      if ((Date.now() / 1000) > parseInt(kitchenSink.publicEndTime)) currentPrice = parseInt(ethers.utils.formatEther(kitchenSink.endPrice));

      setAuctionData((prev) => ({
        ...prev,
        drop: drop,
        address: drop.address,
        startPrice: parseInt(ethers.utils.formatEther(kitchenSink.startPrice)),
        currentRound,
        nextRoundTime: (parseInt(kitchenSink.publicStartTime) + (parseInt(kitchenSink.decreaseInterval) * currentRound)) * 1000,
        currentPrice,
        isUsingContract: true,
        status: calculateStatusFromContract(
          parseInt(kitchenSink.publicStartTime) * 1000,
          (parseInt(kitchenSink.publicStartTime) + parseInt(kitchenSink.duration)) * 1000,
          kitchenSink.availableTokenCount
        ),
        readContract,
        refundDue: parseInt(ethers.utils.formatEther(kitchenSink.refundDue)),
        maxSupply: hackMaxSupply,
        availableTokenCount: kitchenSink.availableTokenCount,
        currentSupply: hackMaxSupply - kitchenSink.availableTokenCount,
        canMint: parseInt(kitchenSink.canMint),
        refreshContract: () => {
          retrieveDropInfo();
        }
      }));

      if (!!user.address) {
        const writeContract = new ethers.Contract(drop.address, abi, user.provider.getSigner());
        const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
        const userBalance = await fortuneContract.balanceOf(user.address);
        setAuctionData((prev) => ({
          ...prev,
          writeContract,
          userBalance: parseInt(ethers.utils.formatEther(userBalance))
        }));
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  };

  // Passing user address because for some reason user.address not defined sometimes
  const refreshUserBalance = async (address: string) => {
    try {
      const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
      const userBalance = await fortuneContract.balanceOf(address);
      setAuctionData((prev) => ({
        ...prev,
        userBalance: parseInt(ethers.utils.formatEther(userBalance))
      }));
    } catch (e) {
      console.log('Error refreshing user balance', e);
    }
  }

  useEffect(() => {
    setAuctionData((prev) => ({
      ...prev,
      refreshContract: () => {
        retrieveDropInfo();
      },
      onUserMinted: (address: string) => {
        refreshUserBalance(address)
      }
    }));
  }, []);

  useEffect(() => {
    retrieveDropInfo();
  }, [user.address]);

  useEffect(() => {
    if (!!auctionData.readContract) {
      const onMinted = (to: string, ids: number[], tokensLeft: number) => {
        setAuctionData((prev) => ({
          ...prev,
          currentSupply: prev.maxSupply - tokensLeft,
          canMint: ciEquals(to, user.address) ? prev.canMint - ids.length : prev.canMint,
          status: tokensLeft < 1 ? statuses.SOLD_OUT : prev.status
        }));
      };

      auctionData.readContract.on('AuctionMint', onMinted);
      return () => {
        auctionData.readContract?.off('AuctionMint', onMinted);
      };
    }
  }, [auctionData.readContract]);

  return (
    <>
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

              {auctionData.status === statuses.LIVE && drop.end && (
                <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                  <p className="lead col-white">
                    Ends in: <Countdown date={drop.end} />
                  </p>
                </Reveal>
              )}
              {auctionData.status === statuses.NOT_STARTED && drop.start && (
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
                <Box className="lead col-white mb-4" fontWeight='bold'>{newlineText(drop.subtitle)}</Box>
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

      <section id="drop_detail" className="gl-legacy container no-top">
        <div className="row mt-md-5 pt-md-4">
          <div className="col-md-4 col-lg-6 text-center mt-4 md-md-0">
            {!!drop.images.drop && (
              <img src={hostedImage(drop.images.drop)} className="img-fluid img-rounded mb-sm-30" alt={drop.title} />
            )}
          </div>
          <div className="col-md-8 col-lg-6 mt-4 mt-md-0">

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

            <AuctionBox />
            <Container>
              <Markdown>
                {drop.description}
              </Markdown>
            </Container>
          </div>
        </div>
      </section>
    </>
  )
}

export default DutchAuction;

const Container = styled.div`
  p {
      margin-top: 10px;
  }
  
  li {
    margin-left: 18px;
  }
  
  a {
    font-weight: bold;
    color: #218cff;
  }
`;