import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ethers} from 'ethers';
import Countdown from 'react-countdown';
import {keyframes} from '@emotion/react';
import Reveal from 'react-awesome-reveal';
import {useRouter} from 'next/router';
import ReactPlayer from 'react-player';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import {fetchMemberInfo, fetchVipInfo} from '@src/GlobalState/Memberships';
import {
  isCarkayousCollection,
  isCyberCloneDrop,
  isFounderDrop,
  isFounderVipDrop,
  isMagBrewVikingsDrop,
  isSscCollection,
  newlineText,
} from '@src/utils';
import {dropState as statuses} from '../../core/api/enums';
import {EbisuDropAbi, ERC20} from '@src/Contracts/Abis';
import SocialsBar from '../Collection/SocialsBar';
import {appConfig} from "@src/Config";
import {hostedImage, ImageKitService} from "@src/helpers/image";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {Heading} from "@chakra-ui/react";
import {MintBox} from "@src/Components/Drop/MintBox";

import {useQuery} from "@tanstack/react-query";
import { getCollections } from "@src/core/api/next/collectioninfo";

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

const SingleDrop = ({drop}) => {
  const router = useRouter();
  const { slug } = router.query;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const dispatch = useDispatch();

  // const [loading, setLoading] = useState(true);
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

  // useEffect(() => {
  //   dispatch(fetchMemberInfo());
  //   if (process.env.NODE_ENV === 'development') {
  //     dispatch(fetchVipInfo());
  //   }
  //   // eslint-disable-next-line
  // }, []);

  const user = useSelector((state) => {
    return state.user;
  });


  const { isLoading : isLoadingCollection, error, data, status: statusCollection } = useQuery(['Collections', slug], () =>
    getCollections({slug}), true
  )

  const [collection, setCollection] = useState(null);

  useEffect(()=> {
    if(!isLoadingCollection && data) {
      setCollection(data.data.collections[0])
    }
  }, [isLoadingCollection, data])

  const membership = useSelector((state) => {
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
      // if (isFounderDrop(currentDrop.address)) {
      //   setDropInfo(currentDrop, membership.founders.count);
      //   calculateStatus(currentDrop, membership.founders.count, currentDrop.totalSupply);
      // } else if (isFounderVipDrop(currentDrop.address)) {
      //   setDropInfo(currentDrop, membership.vips.count);
      //   calculateStatus(currentDrop, membership.vips.count, currentDrop.totalSupply);
      // } else
      // if (isMagBrewVikingsDrop(currentDrop.address)) {
      //   let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
      //   const supply = await readContract.totalSupply();
      //   setDropInfo(currentDrop, supply.toString());
      //   const canMint = user.address ? await readContract.canMint(user.address) : 0;
      //   setCanMintQuantity(canMint);
      //   calculateStatus(currentDrop, supply, currentDrop.totalSupply);
      // } else if (isCyberCloneDrop(drop.address)) {
      //   let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
      //   const infos = await readContract.getInfo();
      //   const canMint = user.address ? await readContract.canMint(user.address) : 0;
      //   setDropInfoFromContract(infos, canMint);
      //   setMaxSupply(1000);
      //   calculateStatus(currentDrop, infos.totalSupply, currentDrop.totalSupply);
      // } else if (isCarkayousCollection(drop.address)) {
      //   let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
      //   const infos = await readContract.getInfo();
      //   const canMint = user.address ? await readContract.canMint(user.address) : 0;
      //   setDropInfoFromContract(infos, canMint);
      //   setMaxSupply(2222);
      //   calculateStatus(currentDrop, infos.totalSupply, currentDrop.totalSupply);
      // } else if (isSscCollection(drop.address)) {
      //   let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
      //   const infos = await readContract.getInfo();
      //   const canMint = user.address ? await readContract.canMint(user.address) : 0;
      //   setDropInfoFromContract(infos, canMint);
      //   setMemberCost(600);
      //   setWhitelistCost(600);
      //   setMaxSupply(1888);
      //   calculateStatus(currentDrop, infos.totalSupply, currentDrop.totalSupply);
      // } else {
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
      // }
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

  const isUsingAbiFile = (dropAbi) => {
    return typeof dropAbi === 'string' && dropAbi.length > 0;
  };

  const isUsingDefaultDropAbi = (dropAbi) => {
    return typeof dropAbi === 'undefined' || dropAbi.length === 0;
  };

  return (
    <div>
      {isLoadingCollection || !collection ? (
        <section className="container">
          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        </section>
      ) : (<>
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
                />


                <div className="mt-3 mb-4">{newlineText(drop.description)}</div>
              </div>
            </div>
          </div>
        </section>
      </>)}
      <Footer />
    </div>
  );
};
export default SingleDrop;
