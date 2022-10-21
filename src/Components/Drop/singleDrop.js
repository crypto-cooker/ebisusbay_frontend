import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { ethers, constants } from 'ethers';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';
import { getAnalytics, logEvent } from '@firebase/analytics';
import { keyframes } from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import { useRouter } from 'next/router';
import {Form, OverlayTrigger, ProgressBar, Spinner, Tooltip} from 'react-bootstrap';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import { connectAccount } from '../../GlobalState/User';
import { fetchMemberInfo, fetchVipInfo } from '../../GlobalState/Memberships';
import {
  createSuccessfulTransactionToastContent, isCarkayousCollection,
  isCreaturesDrop,
  isCrosmocraftsPartsDrop,
  isCyberCloneDrop,
  isFounderDrop,
  isFounderVipDrop,
  isMagBrewVikingsDrop, isSscCollection,
  newlineText,
  percentage, round,
} from '../../utils';
import { dropState as statuses } from '../../core/api/enums';
import {EbisuDropAbi, ERC20} from '../../Contracts/Abis';
import { getTheme } from '../../Theme/theme';
import SocialsBar from '../Collection/SocialsBar';
import {parseUnits} from "ethers/lib/utils";
import {appConfig} from "../../Config";
import {hostedImage, ImageKitService} from "../../helpers/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard, faLock, faUserShield} from "@fortawesome/free-solid-svg-icons";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {Box, Center, Heading, Text, useColorModeValue} from "@chakra-ui/react";
import {mode} from "@chakra-ui/theme-tools";

const config = appConfig();
const drops = config.drops;
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
// const inline = keyframes`
//   0% {
//     opacity: 0;
//   }
//   100% {
//     opacity: 1;
//   }
//   .d-inline{
//     display: inline-block;
//    }
// `;

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

const SingleDrop = () => {
  const router = useRouter();
  const { slug } = router.query;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const dispatch = useDispatch();

  // const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [mintingERC20, setMintingERC20] = useState(false);
  const [referral, setReferral] = useState('');
  const [dropObject, setDropObject] = useState(null);
  const [status, setStatus] = useState(statuses.UNSET);
  const [numToMint, setNumToMint] = useState(1);

  const [abi, setAbi] = useState(null);
  // const [maxMintPerAddress, setMaxMintPerAddress] = useState(0);
  const [maxMintPerTx, setMaxMintPerTx] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [memberCost, setMemberCost] = useState(0);
  const [regularCost, setRegularCost] = useState(0);
  const [whitelistCost, setWhitelistCost] = useState(0);
  const [specialWhitelist, setSpecialWhitelist] = useState(null);
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

  const drop = useSelector((state) => {
    return drops.find((n) => n.slug === slug);
  });
  const collection = useSelector((state) => {
    return collections.find((n) => n.slug === slug);
  });

  const membership = useSelector((state) => {
    return state.memberships;
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
      const abiJson = require(`../../Assets/abis/${currentDrop.abi}`);
      abi = abiJson.abi ?? abiJson;
    } else if (isUsingDefaultDropAbi(abi)) {
      abi = EbisuDropAbi;
    }
    setAbi(abi);

    if (user.provider) {
      try {
        let writeContract = await new ethers.Contract(currentDrop.address, abi, user.provider.getSigner());
        currentDrop = Object.assign({ writeContract: writeContract }, currentDrop);

        if (currentDrop.erc20Token) {
          const token = config.tokens[dropObject.erc20Token];
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
      if (isFounderDrop(currentDrop.address)) {
        setDropInfo(currentDrop, membership.founders.count);
        calculateStatus(currentDrop, membership.founders.count, currentDrop.totalSupply);
      } else if (isFounderVipDrop(currentDrop.address)) {
        setDropInfo(currentDrop, membership.vips.count);
        calculateStatus(currentDrop, membership.vips.count, currentDrop.totalSupply);
      } else if (isMagBrewVikingsDrop(currentDrop.address)) {
        let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
        const supply = await readContract.totalSupply();
        setDropInfo(currentDrop, supply.toString());
        const canMint = user.address ? await readContract.canMint(user.address) : 0;
        setCanMintQuantity(canMint);
        calculateStatus(currentDrop, supply, currentDrop.totalSupply);
      } else if (isCyberCloneDrop(drop.address)) {
        let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
        const infos = await readContract.getInfo();
        const canMint = user.address ? await readContract.canMint(user.address) : 0;
        setDropInfoFromContract(infos, canMint);
        setMaxSupply(1000);
        calculateStatus(currentDrop, infos.totalSupply, currentDrop.totalSupply);
      } else if (isCarkayousCollection(drop.address)) {
        let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
        const infos = await readContract.getInfo();
        const canMint = user.address ? await readContract.canMint(user.address) : 0;
        setDropInfoFromContract(infos, canMint);
        setMaxSupply(2222);
        calculateStatus(currentDrop, infos.totalSupply, currentDrop.totalSupply);
      } else if (isSscCollection(drop.address)) {
        let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
        const infos = await readContract.getInfo();
        const canMint = user.address ? await readContract.canMint(user.address) : 0;
        setDropInfoFromContract(infos, canMint);
        setMemberCost(600);
        setWhitelistCost(600);
        setMaxSupply(1888);
        calculateStatus(currentDrop, infos.totalSupply, currentDrop.totalSupply);
      } else {
        if (currentDrop.address && (isUsingDefaultDropAbi(currentDrop.abi) || isUsingAbiFile(currentDrop.abi))) {
          let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
          const infos = await readContract.getInfo();
          const canMint = user.address ? await readContract.canMint(user.address) : 0;
          setDropInfoFromContract(infos, canMint);
          calculateStatus(currentDrop, infos.totalSupply, infos.maxSupply);
        } else {
          let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
          const currentSupply = await readContract.totalSupply();
          setDropInfo(currentDrop, currentSupply);
          calculateStatus(currentDrop, currentSupply, currentDrop.totalSupply);
        }
        if (drop.specialWhitelistCost) {
          setSpecialWhitelist(drop.specialWhitelistCost);
        }
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
    // setLoading(false);
    setDropObject(currentDrop);
  };

  const setDropInfo = (drop, supply) => {
    // setMaxMintPerAddress(drop.maxMintPerAddress ?? 100);
    setMaxMintPerTx(drop.maxMintPerTx);
    setMaxSupply(drop.totalSupply);
    setMemberCost(drop.memberCost);
    setRegularCost(drop.cost);
    setTotalSupply(supply);
    setWhitelistCost(drop.whitelistCost);
    setSpecialWhitelist(drop.specialWhitelistCost);
    setCanMintQuantity(drop.maxMintPerTx);
  };

  const setDropInfoFromContract = (infos, canMint) => {
    // setMaxMintPerAddress(infos.maxMintPerAddress);
    setMaxMintPerTx(infos.maxMintPerTx);
    setMaxSupply(infos.maxSupply);
    setMemberCost(ethers.utils.formatEther(infos.memberCost));
    setRegularCost(ethers.utils.formatEther(infos.regularCost));
    setTotalSupply(infos.totalSupply);
    if (infos.whitelistCost) setWhitelistCost(ethers.utils.formatEther(infos.whitelistCost));
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

  const handleChangeReferralCode = (event) => {
    const { value } = event.target;
    setReferral(value);
  };

  const calculateCost = async (user, isErc20) => {
    if (isCreaturesDrop(drop.address)) {
      return ethers.utils.parseEther('333');
    }

    if (isUsingDefaultDropAbi(dropObject.abi) || isUsingAbiFile(dropObject.abi)) {
      let readContract = await new ethers.Contract(dropObject.address, abi, readProvider);
      if (abi.find((m) => m.name === 'cost')) {
        return await readContract.cost(user.address);
      }
      return await readContract.mintCost(user.address);
    }

    const memberCost = ethers.utils.parseEther(isErc20 === true ? dropObject.erc20MemberCost : dropObject.memberCost);
    const regCost = ethers.utils.parseEther(isErc20 === true ? dropObject.erc20Cost : dropObject.cost);
    let cost;
    if (dropObject.abi.join().includes('isReducedTime()')) {
      const readContract = await new ethers.Contract(dropObject.address, dropObject.abi, readProvider);
      const isReduced = await readContract.isReducedTime();
      cost = isReduced ? memberCost : regCost;
    } else if (user.isMember) {
      cost = memberCost;
    } else {
      cost = regCost;
    }
    return cost;
  };

  const isUsingAbiFile = (dropAbi) => {
    return typeof dropAbi === 'string' && dropAbi.length > 0;
  };

  const isUsingDefaultDropAbi = (dropAbi) => {
    return typeof dropAbi === 'undefined' || dropAbi.length === 0;
  };

  const mintNow = async (isErc20 = false) => {
    if (user.address) {
      if (!dropObject.writeContract) {
        return;
      }
      if (isErc20 === true) {
        setMintingERC20(true);
      } else {
        setMinting(true);
      }
      const contract = dropObject.writeContract;
      try {
        const cost = await calculateCost(user, isErc20);
        let finalCost = cost.mul(numToMint);
        if (isCreaturesDrop(drop.address)) {
          finalCost = finalCost.sub(cost.mul(Math.floor(numToMint / 4)));
        }

        if (isErc20 === true) {
          const allowance = await dropObject.erc20ReadContract.allowance(user.address, dropObject.address);
          if (allowance.sub(finalCost) < 0) {
            await dropObject.erc20Contract.approve(dropObject.address, constants.MaxUint256);
          }
        }

        const gasPrice = parseUnits('5000', 'gwei');
        const gasEstimate = await contract.estimateGas.mint(numToMint, {value: finalCost});
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          value: finalCost,
          gasPrice,
          gasLimit
        };

        var response;
        if (dropObject.is1155) {
          if (dropObject.title === 'Founding Member') {
            if (referral) {
              finalCost = finalCost.sub(ethers.utils.parseEther(dropObject.discount).mul(numToMint));
              extra = {
                value: finalCost,
                gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
              };
            }
            const ref32 = ethers.utils.formatBytes32String(referral);
            response = await contract.mint(1, numToMint, ref32, extra);
          } else if (isFounderVipDrop(dropObject.address)) {
            const ref32 = ethers.utils.formatBytes32String(referral);
            response = await contract.mint(2, numToMint, ref32, extra);
          } else {
            response = await contract.mint(numToMint, extra);
          }
        } else {
          if (isUsingDefaultDropAbi(dropObject.abi) || isUsingAbiFile(dropObject.abi)) {
            if (isErc20) {
              delete extra['value']
              response = await contract.mintWithToken(numToMint, extra);
            } else {
              response = await contract.mint(numToMint, extra);
            }
          } else {
            let method;
            for (const abiMethod of dropObject.abi) {
              if (abiMethod.includes('mint') && !abiMethod.includes('view')) method = abiMethod;
            }



            if (method.includes('address') && method.includes('uint256')) {
              if (isErc20 === true) {
                response = await contract.mintWithLoot(user.address, numToMint);
              } else {
                response = await contract.mint(user.address, numToMint, extra);
              }
            } else {
              console.log(`contract ${contract}  num: ${numToMint}   extra ${extra}`);
              if (isErc20 === true) {
                response = await contract.mintWithLoot(numToMint);
              } else {
                response = await contract.mint(numToMint, extra);
              }
            }
          }
        }
        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        {
          const dropObjectAnalytics = {
            address: dropObject.address,
            id: dropObject.id,
            title: dropObject.title,
            slug: dropObject.slug,
            author_name: dropObject.author.name,
            author_link: dropObject.author.link,
            maxMintPerTx: dropObject.maxMintPerTx,
            totalSupply: dropObject.totalSupply,
            cost: dropObject.cost,
            memberCost: dropObject.memberCost,
            foundersOnly: dropObject.foundersOnly,
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
        if (isErc20 === true) {
          setMintingERC20(false);
        } else {
          setMinting(false);
        }
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
            backgroundImage: `url(${ImageKitService.buildBannerUrl(drop.imgBanner ?? hostedImage('/img/background/Ebisus-bg-1_L.webp'))})`
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
                  <div className="lead col-white mb-4">{newlineText(drop.subtitle)}</div>
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
            <div className="col-md-6 text-center">
              <img src={hostedImage(drop.imgNft)} className="img-fluid img-rounded mb-sm-30" alt={drop.title} />
            </div>
            <div className="col-md-6 mt-4 mt-md-0">

              <div className="de-flex mt-4 mt-sm-0 mb-2">
                <div className="de-flex-col">
                  <div className="profile_avatar">
                    {drop.imgAvatar && <img src={hostedImage(drop.imgAvatar)} alt={drop.author.name} />}
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

                <div className="mt-3 mb-4">{newlineText(drop.description)}</div>

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
                    {regularCost && (
                      <Heading as="h5" size="md">{ethers.utils.commify(round(regularCost))} CRO</Heading>
                    )}
                    {dropObject?.erc20Cost && dropObject?.erc20Token && (
                      <Heading as="h5" size="md">{`${ethers.utils.commify(round(dropObject?.erc20Cost))} ${config.tokens[dropObject.erc20Token].symbol}`}</Heading>
                    )}
                  </div>
                  {(memberCost || (dropObject?.erc20MemberCost && dropObject?.erc20Cost !== dropObject?.erc20MemberCost)) && (
                    <div className="me-4">
                      <Heading as="h6" size="sm" className="mb-1">Founding Member Price</Heading>
                      {memberCost && (
                        <Heading as="h5" size="md">{ethers.utils.commify(round(memberCost))} CRO</Heading>
                      )}
                      {dropObject?.erc20MemberCost && dropObject?.erc20Cost !== dropObject?.erc20MemberCost && (
                        <Heading as="h5" size="md">{`${ethers.utils.commify(round(dropObject?.erc20MemberCost))} ${config.tokens[dropObject.erc20Token].symbol}`}</Heading>
                      )}
                    </div>
                  )}
                  {whitelistCost > 0 && (
                    <div className="me-4">
                      <Heading as="h6" size="sm" className="mb-1">Whitelist Price</Heading>
                      <Heading as="h5" size="md">{ethers.utils.commify(round(whitelistCost))} CRO</Heading>
                    </div>
                  )}
                  {specialWhitelist && (
                    <div className="me-4">
                      <Heading as="h6" size="sm" className="mb-1">{specialWhitelist.name}</Heading>
                      <Heading as="h5" size="md">{specialWhitelist.value} CRO</Heading>
                    </div>
                  )}
                </div>

                {drop.priceDescription && (
                  <p className="my-2" style={{ color: getTheme(userTheme).colors.textColor3 }}>
                    *{drop.priceDescription}
                  </p>
                )}

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
                    {dropObject?.referral && (
                      <Form.Group className="mb-3" controlId="formReferralCode">
                        <Form.Label>Referral Code</Form.Label>
                        <Form.Control
                          onChange={handleChangeReferralCode}
                          type="text"
                          placeholder="Enter Referral Code"
                        />
                        <Form.Text className="text-muted" />
                      </Form.Group>
                    )}

                    {canMintQuantity > 0 && (
                      <div className="d-flex flex-row mt-5">
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
                        {drop.erc20Token && (
                          <button
                            className="btn-main lead mb-5 mr15 mx-1"
                            onClick={() => mintNow(true)}
                            disabled={mintingERC20}
                          >
                            {mintingERC20 ? (
                              <>
                                Minting...
                                <Spinner animation="border" role="status" size="sm" className="ms-1">
                                  <span className="visually-hidden">Loading...</span>
                                </Spinner>
                              </>
                            ) : (
                              <>
                                {drop.maxMintPerTx && drop.maxMintPerTx > 1 ? (
                                  <>
                                    Mint {numToMint} with {config.tokens[drop.erc20Token].symbol}
                                  </>
                                ) : (
                                  <>{maxMintPerTx > 1 ? <>Mint {numToMint}</> : <>Mint</>}</>
                                )}
                              </>
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
export default SingleDrop;
