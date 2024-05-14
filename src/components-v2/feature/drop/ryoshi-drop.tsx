import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import Countdown from 'react-countdown';
import {getAnalytics, logEvent} from '@firebase/analytics';
import {keyframes} from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import {useRouter} from 'next/router';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';
import {createSuccessfulTransactionToastContent, isFounderDrop, percentage,} from '@market/helpers/utils';
import {DropState as statuses} from '@src/core/api/enums';
import {ERC1155} from '@src/global/contracts/Abis';
import {getTheme} from '@src/global/theme/theme';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import {formatEther, parseUnits} from "ethers/lib/utils";
import {appConfig} from "@src/Config";
import {hostedImage} from "@src/helpers/image";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  ListItem,
  Progress,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
  useNumberInput
} from "@chakra-ui/react";
import Link from "next/link";
import {useAppSelector} from "@market/state/redux/store/hooks";
import {Drop} from "@src/core/models/drop";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@market/hooks/useAuthedFunction";

const config = appConfig();
const collections = config.collections;

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
`;

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

interface RyoshiDropProps {
  drop: Drop;
}

const RyoshiDrop = ({drop}: RyoshiDropProps) => {
  const router = useRouter();
  const { slug } = router.query;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const [runAuthedFunction] = useAuthedFunction();

  // const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState(statuses.UNSET);
  const [numToMint, setNumToMint] = useState(1);

  const [abi, setAbi] = useState<any>(null);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [canMintQuantity, setCanMintQuantity] = useState(0);
  const [mintingState, setMintingState] = useState<string | null>(null);

  // useEffect(() => {
  //   logEvent(getAnalytics(), 'screen_view', {
  //     firebase_screen: 'drop',
  //     drop_id: slug,
  //   });
  //   // eslint-disable-next-line
  // }, []);

  // useEffect(() => {
  //   dispatch(fetchMemberInfo());
  //   if (process.env.NODE_ENV === 'development') {
  //     dispatch(fetchVipInfo());
  //   }
  //   // eslint-disable-next-line
  // }, []);

  const user = useUser();

  const collection = useAppSelector((state) => {
    return collections.find((n: any) => n.slug === slug);
  });

  const userTheme = user.theme;

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

    const abiJson = require(`@market/assets/abis/ryoshi.json`);
    let abi = abiJson;
    setAbi(abiJson);

    try {
      let readContract = await new ethers.Contract(drop.address, abi, readProvider);
      const infos = await readContract.getInfo();
      const canMint = user.address ? await readContract.canMint(user.address) : 0;
      setDropInfoFromContract(infos, canMint);
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
  };

  const setDropInfoFromContract = (infos: any, canMint: number) => {
    setMaxSupply(infos.maxSupply);
    setTotalSupply(infos.totalSupply);
    setCanMintQuantity(Math.min(canMint, infos.maxMintPerTx));
  };

  const calculateStatus = (drop: any, totalSupply: number, maxSupply: number) => {
    const sTime = new Date(drop.start);
    const eTime = new Date(drop.end + (1000 * 60)); // pad an hour in case of potential local timezone issues
    const now = new Date();

    if (!drop.start || !drop.address || sTime > now) setStatus(statuses.NOT_STARTED);
    else if (parseInt(totalSupply.toString()) >= parseInt(maxSupply.toString()) && !isFounderDrop(drop.address))
      setStatus(statuses.SOLD_OUT);
    else if (!drop.end || eTime > now) setStatus(statuses.LIVE);
    else if (drop.end && eTime < now) setStatus(statuses.EXPIRED);
    else setStatus(statuses.NOT_STARTED);
  };

  const mintNow = async () => {
    runAuthedFunction(async() => {

      setMinting(true);
      setMintingState("Swapping...");
      const ryoshiContract = await new ethers.Contract(drop.address, abi, user.provider.getSigner());
      try {
        const cost = await ryoshiContract.mintCost(user.address);
        let finalCost = cost.mul(numToMint);

        const isApprovedRyoshi = await ryoshiContract.isApprovedForAll(user.address, config.contracts.membership);
        if (!isApprovedRyoshi) {
          setMintingState("Approving Ryoshi Contract...");
          const tx = await ryoshiContract.setApprovalForAll(config.contracts.membership, true);
          await tx.wait();
        }

        const vipCollection = collections.find((c: any) => c.slug === 'founding-member');
        const vipContract = await new ethers.Contract(vipCollection.address, ERC1155, user.provider.getSigner());
        const isApprovedVip = await vipContract.isApprovedForAll(user.address, drop.address);
        if (!isApprovedVip) {
          setMintingState("Approving VIP Contract...");
          const tx = await vipContract.setApprovalForAll(drop.address, true);
          await tx.wait();
        }
        setMintingState("Swapping...");

        const gasPrice = parseUnits('5000', 'gwei');
        const gasEstimate = await ryoshiContract.estimateGas.mintWithToken(numToMint);
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          value: finalCost,
          gasPrice,
          gasLimit
        };

        const response = await ryoshiContract.mintWithToken(numToMint, extra);

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        {
          const purchaseAnalyticParams = {
            value: Number(ethers.utils.formatEther(finalCost)),
            currency: 'CRO',
            transaction_id: receipt.transactionHash,
            drop_name: drop.title.toString(),
            drop_slug: drop.slug.toString(),
            drop_address: drop.address.toString(),
            items: [{
              item_id: drop.slug,
              item_name: drop.title,
              item_brand: drop.author.name,
              price: drop.cost,
              discount: Number(drop.cost) - Number(formatEther(extra.value)),
              quantity: numToMint
            }]
          };

          logEvent(getAnalytics(), 'purchase', purchaseAnalyticParams);
        }

        await retrieveDropInfo();
      } catch (error: any) {
        Sentry.captureException(error);
        if (error.data) {
          console.log(error);
          toast.error(error.data.message);
        } else if (error.message) {
          console.log(error);
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
      } finally {
        setMinting(false);
        setMintingState(null);
      }
    });
  };

  const convertTime = (time: any) => {
    let date = new Date(time);
    const fullDateString = date.toLocaleString('default', { timeZone: 'UTC' });
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    let dateString = `${fullDateString.split(', ')[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`;
    return dateString;
  };

  const connectWalletPressed = () => {
    user.connect();
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
                    <Heading as="h4" size="md" className="col-white">
                      Ends in:{' '}
                      <span className="text-uppercase color">
                        <Countdown date={drop.end} />
                      </span>
                    </Heading>
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
                  <div className="lead col-white mb-4">
                    <Text>Ryoshi Tales awaits all of our enthusiastic supporters.</Text>
                    <Text mt={2} fontWeight="bold">Get your hands on these exclusive Ryoshi Tales-themed VIP NFTs now!</Text>
                    <Text mt={2}>Coming with 8 different traits each with relevant attributes – body, background, tools, mouth, hair, miscellaneous, eyes, clothing... <u>every NFT is completely unique.</u></Text>
                    <Text mt={2}>Don’t miss out on the opportunity to participate in our project’s evolution.</Text>
                  </div>
                </Reveal>
                {drop.foundersOnly && (
                  <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                    <Heading as="h1" size="2xl" className="col-white">{drop.title}</Heading>
                    {drop.foundersOnly && <Heading as="h3" size="md" className="col-white">Founding Member Presale</Heading>}
                  </Reveal>
                )}
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
            <div className="col-md-6 text-center mt-4 md-md-0">
              <img src={hostedImage(drop.images.drop)} className="img-fluid img-rounded mb-sm-30" alt={drop.title} />
            </div>
            <div className="col-md-6 mt-4 mt-md-0">

              <div className="de-flex mt-4 mt-sm-0 mb-2">
                <div className="de-flex-col">
                  <div className="profile_avatar">
                    {drop.images.avatar && <img src={hostedImage(drop.images.avatar)} alt={drop.author.name} style={{height:'100%'}}/>}
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
                doxx={collection.verification?.doxx}
                kyc={collection.verification?.kyc}
                escrow={collection.verification?.escrow}
                creativeCommons={collection.verification?.creativeCommons}
              />

              <div className="item_info ps-0">

                <div className="card eb-nft__card h-100 shadow mt-2" style={{
                  borderColor:getTheme(userTheme).colors.borderColor3,
                  borderWidth:'2px',
                  backgroundColor:getTheme(userTheme).colors.bgColor5
                }}>
                  <div className="card-body d-flex flex-column">


                    <div className="d-flex flex-row">
                      <div className="me-4">
                        <Heading as="h6" size="sm" className="mb-1">Swap Price</Heading>
                        <Heading as="h5" size="md">1 Ebisu's Bay VIP</Heading>
                      </div>
                    </div>
                    {status === statuses.UNSET || status === statuses.NOT_STARTED || drop.complete ? (
                      <div className="mt-2">
                        <div className="fs-6 fw-bold mb-1">Supply: {ethers.utils.commify(maxSupply.toString())}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="fs-6 fw-bold mb-1 mt-3 text-start text-md-end">
                          {percentage(totalSupply.toString(), maxSupply.toString())}% swapped (
                          {ethers.utils.commify(totalSupply.toString())} / {ethers.utils.commify(maxSupply.toString())})
                        </div>
                        <Progress
                          size='xs'
                          value={percentage(totalSupply.toString(), maxSupply.toString())}
                          bg='white'
                        />
                      </div>
                    )}

                    <Text fontSize="sm" my={2}>
                      1 Ebisu's Bay VIP will be swapped for 10 Ryoshi Tales VIP, 1 SeaShrine VIP, and 1 collectible
                      Ebisu's Bay VIP. Make sure to <Link href="/staking">unstake</Link> before swapping
                    </Text>
                    {status === statuses.LIVE && !drop.complete && (
                      <Box mt={2}>
                        {canMintQuantity > 0 && (
                          <Stack direction={{base:'column', lg:'row'}} spacing={2}>
                            <HStack minW="150px">
                              <Button {...dec}>-</Button>
                              <Input {...input} />
                              <Button {...inc}>+</Button>
                            </HStack>
                            <button className="btn-main lead w-100" onClick={() => mintNow()} disabled={minting}>
                              {minting ? (
                                <>
                                  {mintingState ?? 'Swapping...'}
                                  <Spinner size='sm' ms={1} />
                                </>
                              ) : (
                                <>{drop.maxMintPerTx && drop.maxMintPerTx > 1 ? <>Swap {numToMint}</> : <>Swap</>}</>
                              )}
                              </button>
                          </Stack>
                        )}
                        {canMintQuantity === 0 && !user.address && !drop.complete && (
                          <button className="btn-main lead w-100" onClick={connectWalletPressed}>
                            Connect Wallet
                          </button>
                        )}
                      </Box>
                    )}
                    {status === statuses.SOLD_OUT && <p className="mt-5">SWAP HAS SOLD OUT</p>}
                    {status === statuses.EXPIRED && <p className="mt-5">SWAP HAS ENDED</p>}

                    {status === statuses.LIVE && drop.end && (
                      <Box me={4} mt={4}>
                        <Heading as="h6" size="sm" className="mb-1">Minting Ends</Heading>
                        <Heading as="h3" size="md">
                          {new Date(drop.end).toDateString()}, {new Date(drop.end).toTimeString()}
                        </Heading>
                        <Text mt={2} size='md'>After this time, the contract will be <strong>locked</strong> and no more VIPs will be able to be swapped. Any remaining VIPs will go towards a public Dutch Auction at a later date.</Text>
                      </Box>
                    )}
                    {status === statuses.NOT_STARTED && drop.start && (
                      <div className="me-4">
                        <Heading as="h6" size="sm" className="mb-1">Minting Starts</Heading>
                        <Heading as="h3" size="md">
                          {new Date(drop.start).toDateString()}, {new Date(drop.start).toTimeString()}
                        </Heading>
                      </div>
                    )}
                    {status === statuses.NOT_STARTED && !drop.start && (
                      <div className="me-4">
                        <Heading as="h6" size="sm" className="mb-1">Minting Starts</Heading>
                        <Heading as="h3" size="md">TBA</Heading>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 mb-4">
                  <Text fontWeight="bold" fontSize="2xl">It is time for a birthday rebranding!</Text>
                  <Text mt={2}>As Ebisu's Bay’s VIP Founding Member NFTs turn 1 year old, our marketplace enters into a new stage of its evolution. </Text>
                  <Text mt={2}>With these new Ryoshi Tales VIPs, you will be able to obtain the <strong>same benefits and functionalities compared to our legacy Ebisu’s Bay VIPs:</strong></Text>
                  <UnorderedList ms={6}>
                    <ListItem>reduced service fees</ListItem>
                    <ListItem>discounts on drops</ListItem>
                    <ListItem>early access to features</ListItem>
                    <ListItem>staking to earn CRO</ListItem>
                  </UnorderedList>
                  <Text mt={2} fontWeight="bold">AND!</Text>
                  <Text mt={2}>You will also get intrinsic rarity features, with <strong>additional staking functions</strong> within Ryoshi Tales once the game has been released.</Text>
                  <Text mt={2}>Moreover, with a switch from the ERC-1155 to the ERC-721 protocol, the token stands to gain better token gating opportunities. </Text>
                  <Text mt={2} fontWeight="bold" fontSize="2xl">Get yours now and help Ebisu populate his islands in his upcoming GameFi experience!
                  </Text>
                </div>

                {drop.disclaimer && (
                  <Box bg={useColorModeValue('gray.100','gray.700')} rounded={'lg'} my="4">
                    <Text fontWeight="bold" p="4" className="text-center">
                      {drop.disclaimer}
                    </Text>
                  </Box>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};
export default RyoshiDrop;
