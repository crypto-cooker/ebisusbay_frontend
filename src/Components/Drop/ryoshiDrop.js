import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {ethers} from 'ethers';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';
import { getAnalytics, logEvent } from '@firebase/analytics';
import { keyframes } from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import { useRouter } from 'next/router';
import {Form, ProgressBar, Spinner} from 'react-bootstrap';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import { connectAccount } from '@src/GlobalState/User';
import { fetchMemberInfo, fetchVipInfo } from '@src/GlobalState/Memberships';
import {
  createSuccessfulTransactionToastContent, isBossFrogzDrop,
  isCrosmocraftsPartsDrop,
  isFounderDrop,
  newlineText,
  percentage, round,
} from '@src/utils';
import { dropState as statuses } from '../../core/api/enums';
import {EbisuDropAbi, ERC1155} from '@src/Contracts/Abis';
import { getTheme } from '@src/Theme/theme';
import SocialsBar from '../Collection/SocialsBar';
import {parseUnits} from "ethers/lib/utils";
import {appConfig} from "@src/Config";
import {hostedImage, ImageKitService} from "@src/helpers/image";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {Box, Heading, ListItem, Text, UnorderedList, useColorModeValue} from "@chakra-ui/react";

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

const RyoshiDrop = ({drop}) => {
  const router = useRouter();
  const { slug } = router.query;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const dispatch = useDispatch();

  // const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState(statuses.UNSET);
  const [numToMint, setNumToMint] = useState(1);

  const [abi, setAbi] = useState(null);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [canMintQuantity, setCanMintQuantity] = useState(0);

  // useEffect(() => {
  //   logEvent(getAnalytics(), 'screen_view', {
  //     firebase_screen: 'drop',
  //     drop_id: slug,
  //   });
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    dispatch(fetchMemberInfo());
    if (process.env.NODE_ENV === 'development') {
      dispatch(fetchVipInfo());
    }
    // eslint-disable-next-line
  }, []);

  const user = useSelector((state) => {
    return state.user;
  });

  const collection = useSelector((state) => {
    return collections.find((n) => n.slug === slug);
  });

  const userTheme = useSelector((state) => {
    return state.user.theme;
  });

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

    const abiJson = require(`../../Assets/abis/ryoshi.json`);
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

  const setDropInfo = (drop, supply) => {
    setMaxSupply(drop.totalSupply);
    setTotalSupply(supply);
    setCanMintQuantity(drop.maxMintPerTx);
  };

  const setDropInfoFromContract = (infos, canMint) => {
    setMaxSupply(infos.maxSupply);
    setTotalSupply(infos.totalSupply);
    setCanMintQuantity(Math.min(canMint, infos.maxMintPerTx));
  };

  const calculateStatus = (drop, totalSupply, maxSupply) => {
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

  const mintNow = async () => {
    if (user.address) {
      setMinting(true);
      const ryoshiContract = await new ethers.Contract(drop.address, abi, user.provider.getSigner());
      try {
        const cost = await ryoshiContract.mintCost(user.address);
        let finalCost = cost.mul(numToMint);

        const isApprovedRyoshi = await ryoshiContract.isApprovedForAll(user.address, config.contracts.membership);
        if (!isApprovedRyoshi) {
          const tx = await ryoshiContract.setApprovalForAll(config.contracts.membership, true);
          await tx.wait();
        }

        const vipCollection = collections.find((c) => c.slug === 'vip-founding-member');
        const vipContract = await new ethers.Contract(vipCollection.address, ERC1155, user.provider.getSigner());
        const isApprovedVip = await vipContract.isApprovedForAll(user.address, drop.address);
        if (!isApprovedVip) {
          const tx = await vipContract.setApprovalForAll(drop.address, true);
          await tx.wait();
        }

        // const gasPrice = parseUnits('5000', 'gwei');
        // const gasEstimate = await contract.estimateGas.mintWithToken(numToMint);
        // const gasLimit = gasEstimate.mul(2);
        let extra = {
          value: finalCost,
        };

        const response = await ryoshiContract.mintWithToken(numToMint, extra);

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        {
          const dropObjectAnalytics = {
            address: drop.address,
            id: drop.id,
            title: drop.title,
            slug: drop.slug,
            author_name: drop.author.name,
            author_link: drop.author.link,
            maxMintPerTx: drop.maxMintPerTx,
            totalSupply: drop.totalSupply,
            cost: drop.cost,
            memberCost: drop.memberCost,
            foundersOnly: drop.foundersOnly,
          };

          const purchaseAnalyticParams = {
            currency: 'CRO',
            value: ethers.utils.formatEther(finalCost),
            transaction_id: receipt.transactionHash,
            quantity: numToMint,
            items: [dropObjectAnalytics],
          };

          logEvent(getAnalytics(), 'purchase', purchaseAnalyticParams);
        }

        await retrieveDropInfo();
      } catch (error) {
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
      }
    } else {
      dispatch(connectAccount());
    }
  };

  const convertTime = (time) => {
    let date = new Date(time);
    const fullDateString = date.toLocaleString('default', { timeZone: 'UTC' });
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    let dateString = `${fullDateString.split(', ')[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`;
    return dateString;
  };

  return (
    <div>
      <>
        <HeroSection
          className={`jumbotron h-vh tint`}
          style={{
            backgroundImage: `url(${ImageKitService.buildBannerUrl(drop.images.banner ?? hostedImage('/img/background/Ebisus-bg-1_L.webp'))})`
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
                                onContextMenu: (e) => e.preventDefault(),
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

                    {drop.slug === 'psycho-golden-lady' || drop.slug === 'smash-stunts' ? (
                      <>
                        {new Date() > 1651449600000 && new Date() < 1651464000000 && (
                          <div dangerouslySetInnerHTML={{ __html: drop.embed }} />
                        )}
                      </>
                    ) : (
                      <>{drop.embed && <div dangerouslySetInnerHTML={{ __html: drop.embed }} />}</>
                    )}
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
                        {drop.author.link ? (
                          <span className="profile_username">
                            <a href={drop.author.link} target="_blank" rel="noreferrer">
                              View Website
                            </a>
                          </span>
                        ) : (
                          <SocialsBar address={drop.address} socials={drop.author} />
                        )}
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

              <div className="item_info">

                {status === statuses.UNSET || status === statuses.NOT_STARTED || drop.complete ? (
                  <div>
                    <div className="fs-6 fw-bold mb-1">Supply: {ethers.utils.commify(maxSupply.toString())}</div>
                  </div>
                ) : (
                  <div>
                    <div className="fs-6 fw-bold mb-1 text-end">
                      {percentage(totalSupply.toString(), maxSupply.toString())}% minted (
                      {ethers.utils.commify(totalSupply.toString())} / {ethers.utils.commify(maxSupply.toString())})
                    </div>
                    <ProgressBar
                      now={percentage(totalSupply.toString(), maxSupply.toString())}
                      style={{ height: '4px' }}
                    />
                  </div>
                )}

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

                {isCrosmocraftsPartsDrop(drop.address) && (
                  <div className="mb-4">
                    <span>Once you have minted your parts, you can&nbsp;</span>
                    <div className="nft__item_action d-inline-block" style={{ fontSize: '16px' }}>
                      <span
                        onClick={() => typeof window !== 'undefined' && window.open('/build-ship', '_self')}
                        style={{ cursor: 'pointer' }}
                      >
                        build your Crosmocraft
                      </span>
                    </div>
                  </div>
                )}

                <div className="d-flex flex-row">
                  <div className="me-4">
                    <Heading as="h6" size="sm" className="mb-1">Mint Price</Heading>
                    <Heading as="h5" size="md">1 Ebisu's Bay VIP</Heading>
                  </div>
                </div>

                <p className="my-2" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                  * 1 Ebisu's Bay VIP will be swapped for 10 Ryoshi Tales VIP, 1 SeaShrine VIP, and 1 collectible Ebisu's Bay VIP
                </p>

                <div className="spacer-40"></div>

                {status === statuses.LIVE && drop.end && (
                  <div className="me-4">
                    <Heading as="h6" size="sm" className="mb-1">{status === statuses.EXPIRED ? <>Minting Ended</> : <>Minting Ends</>}</Heading>
                    <Heading as="h3" size="md">{convertTime(drop.end)}</Heading>
                  </div>
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
                {status === statuses.LIVE && !drop.complete && (
                  <>
                    {canMintQuantity > 1 && (
                      <div>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Range
                          value={numToMint}
                          min="1"
                          max={canMintQuantity}
                          onChange={(e) => setNumToMint(e.target.value)}
                        />
                      </div>
                    )}

                    {canMintQuantity > 0 && (
                      <div className="d-flex flex-row mt-5">
                        {!isBossFrogzDrop(drop.address) && (
                          <button className="btn-main lead mb-5 mr15" onClick={() => mintNow(false)} disabled={minting}>
                            {minting ? (
                              <>
                                Minting...
                                <Spinner animation="border" role="status" size="sm" className="ms-1">
                                  <span className="visually-hidden">Loading...</span>
                                </Spinner>
                              </>
                            ) : (
                              <>{drop.maxMintPerTx && drop.maxMintPerTx > 1 ? <>Mint {numToMint}</> : <>Mint</>}</>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    {canMintQuantity === 0 && !user.address && !drop.complete && (
                      <p className="mt-5">CONNECT WALLET TO MINT</p>
                    )}
                  </>
                )}
                {status === statuses.SOLD_OUT && <p className="mt-5">MINT HAS SOLD OUT</p>}
                {status === statuses.EXPIRED && <p className="mt-5">MINT HAS ENDED</p>}
              </div>
            </div>
          </div>
        </section>
      </>
      <Footer />
    </div>
  );
};
export default RyoshiDrop;
