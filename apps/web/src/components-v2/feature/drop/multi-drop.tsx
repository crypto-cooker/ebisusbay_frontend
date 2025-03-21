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

import {createSuccessfulTransactionToastContent, isCmbDrop, newlineText, percentage} from '@market/helpers/utils';
import {DropState as statuses} from '@src/core/api/enums';
import {EbisuDropAbi} from '@src/global/contracts/Abis';
import {appConfig} from "@src/config";
import {useAppSelector} from "@market/state/redux/store/hooks";
import {formatEther} from "ethers/lib/utils";
import {FormLabel, Progress, Spinner} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@market/hooks/useAuthedFunction";

const config = appConfig();
const drops = config.drops;

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
  height: 100vh;
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

const MultiDrop = () => {
  const router = useRouter();
  const { slug } = router.query;

  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  // const [loading, setLoading] = useState(true);
  // const [minting, setMinting] = useState(false);
  // const [referral, setReferral] = useState('');
  const [dropObject, setDropObject] = useState<any>(null);
  const [status, setStatus] = useState(statuses.UNSET);
  // const [numToMint, setNumToMint] = useState(1);

  const [abi, setAbi] = useState<any>(null);
  // const [maxMintPerAddress, setMaxMintPerAddress] = useState(0);
  // const [maxMintPerTx, setMaxMintPerTx] = useState(0);
  // const [maxSupply, setMaxSupply] = useState(0);
  const [memberCost, setMemberCost] = useState(0);
  const [regularCost, setRegularCost] = useState(0);
  const [whitelistCost, setWhitelistCost] = useState(0);
  // const [specialWhitelistCost, setSpecialWhitelistCost] = useState(0);
  // const [totalSupply, setTotalSupply] = useState(0);
  const [canMintQuantity, setCanMintQuantity] = useState<number[]>([0, 0, 0]);
  const [factionCurrentSupply, setFactionCurrentSupply] = useState<any>({});

  const user = useUser();

  const drop = useAppSelector((state) => {
    return drops.find((n: any) => n.slug === slug);
  });

  const membership = useAppSelector((state) => {
    return state.memberships;
  });
  const [runAuthedFunction] = useAuthedFunction();

  useEffect(() => {
    async function retrieveInfo() {
      await retrieveDropInfo();
    }
    retrieveInfo();
    // eslint-disable-next-line
  }, [user.wallet.isConnected, membership]);

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
      const abiJson = require(`@market/assets/abis/${currentDrop.abi}`);
      abi = abiJson.abi ?? abiJson;
    } else if (isUsingDefaultDropAbi(abi)) {
      abi = EbisuDropAbi;
    }
    setAbi(abi);

    if (user.wallet.isConnected) {
      try {
        let writeContract = await new ethers.Contract(currentDrop.address, abi, user.provider.getSigner());
        currentDrop = Object.assign({ writeContract: writeContract }, currentDrop);
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
      }
    }
    try {
      let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
      const infoTuple = await readContract.getInfo();
      const infos = infoTuple[0];
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'retrieved info',
          infoTuple,
          infoTuple[1].aquaSupplyRemaining.toString(),
          infoTuple[1].ignisSupplyRemaining.toString(),
          infoTuple[1].terraSupplyRemaining.toString()
        );
      }

      let canMint;
      if (isCmbDrop(currentDrop.address)) {
        canMint = [15, 15, 15];
      } else {
        canMint = user.address ? await readContract.canMint(user.address) : 0;
      }

      // setMaxMintPerAddress(infos.maxMintPerAddress);
      // setMaxMintPerTx(infos.maxMintPerTx);
      // setMaxSupply(infos.maxSupply);
      setMemberCost(Number(ethers.utils.formatEther(infos.memberCost)));
      setRegularCost(Number(ethers.utils.formatEther(infos.regularCost)));
      // setTotalSupply(infos.totalSupply);
      setWhitelistCost(Number(ethers.utils.formatEther(infos.whitelistCost)));
      setCanMintQuantity(canMint);
      setFactionCurrentSupply(infoTuple[1]);
      calculateStatus(currentDrop, infos.totalSupply, infos.maxSupply);
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
    // setLoading(false);
    setDropObject(currentDrop);
  };

  const setDropInfo = (drop: any, supply: number) => {
    // setMaxMintPerAddress(drop.maxMintPerAddress ?? 100);
    // setMaxMintPerTx(drop.maxMintPerTx);
    // setMaxSupply(drop.totalSupply);
    setMemberCost(drop.memberCost);
    setRegularCost(drop.cost);
    // setTotalSupply(supply);
    setWhitelistCost(drop.whitelistCost);
    // setSpecialWhitelistCost(drop.specialWhitelistCost);
    setCanMintQuantity(drop.maxMintPerTx);
  };

  const calculateStatus = (drop: any, totalSupply: number, maxSupply: number) => {
    const sTime = new Date(drop.start);
    const eTime = new Date(drop.end);
    const now = new Date();

    if (!drop.start || !drop.address || sTime > now) setStatus(statuses.NOT_STARTED);
    else if (drop.complete) setStatus(statuses.EXPIRED);
    else if (parseInt(totalSupply.toString()) >= parseInt(maxSupply.toString())) setStatus(statuses.SOLD_OUT);
    else if (!drop.end || eTime > now) setStatus(statuses.LIVE);
    else if (drop.end && eTime < now) setStatus(statuses.EXPIRED);
    else setStatus(statuses.NOT_STARTED);
  };

  const calculateCost = async (user: any) => {
    if (isUsingDefaultDropAbi(dropObject.abi) || isUsingAbiFile(dropObject.abi)) {
      let readContract = await new ethers.Contract(dropObject.address, abi, readProvider);
      if (abi.find((m: any) => m.name === 'cost')) {
        return await readContract.cost(user.address);
      }
      return await readContract.mintCost(user.address);
    }

    const memberCost = ethers.utils.parseEther(dropObject.memberCost);
    const regCost = ethers.utils.parseEther(dropObject.cost);
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

  const isUsingAbiFile = (dropAbi: any) => {
    return typeof dropAbi === 'string' && dropAbi.length > 0;
  };

  const isUsingDefaultDropAbi = (dropAbi: any) => {
    return typeof dropAbi === 'undefined' || dropAbi.length === 0;
  };

  const mintNow = async (quantity: number, faction: string) => {
    runAuthedFunction(async() => {
      if (!dropObject.writeContract) {
        return;
      }

      // setMinting(true);
      const contract = dropObject.writeContract;
      try {
        const cost = await calculateCost(user);
        let finalCost = cost.mul(quantity);
        let extra = {
          value: finalCost,
          gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('Minting...', faction, quantity, finalCost.toString());
        }

        const response = await contract.mint(quantity, ethers.utils.formatBytes32String(faction), extra);
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
          };

          const purchaseAnalyticParams = {
            value: Number(ethers.utils.formatEther(finalCost)),
            currency: 'CRO',
            transaction_id: receipt.transactionHash,
            drop_name: dropObject.title.toString(),
            drop_slug: dropObject.slug.toString(),
            drop_address: dropObject.address.toString(),
            items: [{
              item_id: dropObject.slug,
              item_name: dropObject.title,
              item_brand: dropObject.author.name,
              price: dropObject.cost,
              discount: Number(dropObject.cost) - Number(formatEther(extra.value)),
              quantity: quantity
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
        // setMinting(false);
      }
    });
  };

  // const convertTime = (time) => {
  //   let date = new Date(time);
  //   const fullDateString = date.toLocaleString('default', { timeZone: 'UTC' });
  //   const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
  //   let dateString = `${fullDateString.split(', ')[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`;
  //   return dateString;
  // };

  return (
    <div>
      <>
        <HeroSection
          className={`jumbotron h-vh tint`}
          style={{ backgroundImage: `url(${drop.images.banner ? drop.images.banner : '/img/background/banner-default.webp'})` }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className={`col-lg-6 ${drop.mediaPosition === 'left' ? 'order-1' : 'order-2'}`}>
                <Reveal className="onStep" keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                  <ReactPlayer
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
                    width="75%"
                    height="75%"
                  />
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
                    <h4 className="col-white">
                      Starts in:{' '}
                      <span className="text-uppercase color">
                        <Countdown date={drop.start} />
                      </span>
                    </h4>
                  </Reveal>
                )}
                <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                  <h1 className="col-white">{drop.title}</h1>
                </Reveal>
                <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                  <div className="lead col-white">{newlineText(drop.subtitle)}</div>
                </Reveal>
                {drop.foundersOnly && (
                  <Reveal className="onStep" keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                    <h1 className="col-white">{drop.title}</h1>
                    {drop.foundersOnly && <h3 className="col-white">Founding Member Presale</h3>}
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

        <section className="gl-legacy container no-bottom" id="drop_detail">
          <div className="row">
            <div className="col-md-12">
              <div className="d_profile de-flex">
                <div className="de-flex-col">
                  <div className="profile_avatar">
                    {drop.images.avatar && <img src={drop.images.avatar} alt={drop.author.name} />}
                    <div className="profile_name">
                      <h4>
                        {drop.author.name}
                        {drop.author.link && (
                          <span className="profile_username">
                            <a href={drop.author.link} target="_blank" rel="noreferrer">
                              View Website
                            </a>
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gl-legacy container no-top no-bottom mb-4" id="drop_detail">
          <div className="row">
            <div className="text-center">
              <h2>{drop.title}</h2>

              <div className="mt-3">{newlineText(drop.description)}</div>

              {drop.disclaimer && (
                <p className="fw-bold text-center my-4" style={{ color: 'black' }}>
                  {drop.disclaimer}
                </p>
              )}

              <div className="d-flex flex-row justify-content-center">
                <div className="me-4">
                  <h6 className="mb-1">Mint Price</h6>
                  <h5>{regularCost} CRO</h5>
                </div>
                {memberCost && (
                  <div className="me-4">
                    <h6 className="mb-1">Founding Member Price</h6>
                    <h5>{memberCost} CRO</h5>
                  </div>
                )}
                {whitelistCost > 0 && (
                  <div className="me-4">
                    <h6 className="mb-1">Whitelist Price</h6>
                    <h5>{whitelistCost} CRO</h5>
                  </div>
                )}
              </div>

              {/*<div className="mt-4">*/}
              {/*  <div>*/}
              {/*    <h6 className="mb-1">Presale Starts</h6>*/}
              {/*    <h3>*/}
              {/*      {new Date(drop.salePeriods.presale).toDateString()}, {new Date(drop.salePeriods.presale).toTimeString()}*/}
              {/*    </h3>*/}
              {/*  </div>*/}

              {/*  <div>*/}
              {/*    <h6 className="mb-1">Public Sale Starts</h6>*/}
              {/*    <h3>*/}
              {/*      {new Date(drop.salePeriods.public).toDateString()}, {new Date(drop.salePeriods.public).toTimeString()}*/}
              {/*    </h3>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </section>

        <section className="gl-legacy container no-top" id="drop_detail">
          <div className="card-group">
            <div className="d-item col-sm-4 mb-4 px-2">
              <MultiDropCard
                title={'Aqua Clan'}
                img={'https://cdn-prod.ebisusbay.com/files/drop-images/cronosmb/gorilla/aqua.png'}
                currentSupply={
                  factionCurrentSupply.aquaSupplyRemaining
                    ? 1700 - factionCurrentSupply.aquaSupplyRemaining.toNumber()
                    : 0
                }
                maxSupply={1700}
                canMintQuantity={canMintQuantity[0] ?? 0}
                dropStatus={status}
                mintNow={(quantity) => mintNow(quantity, 'AQUA')}
              />
            </div>
            <div className="d-item col-sm-4 mb-4 px-2">
              <MultiDropCard
                title={'Ignis Gang'}
                img={'https://cdn-prod.ebisusbay.com/files/drop-images/cronosmb/gorilla/fire.png'}
                currentSupply={
                  factionCurrentSupply.ignisSupplyRemaining
                    ? 1700 - factionCurrentSupply.ignisSupplyRemaining.toNumber()
                    : 0
                }
                maxSupply={1700}
                canMintQuantity={canMintQuantity[1] ?? 0}
                dropStatus={status}
                mintNow={(quantity) => mintNow(quantity, 'IGNIS')}
              />
            </div>
            <div className="d-item col-sm-4 mb-4 px-2">
              <MultiDropCard
                title={'Terra Crew'}
                img={'https://cdn-prod.ebisusbay.com/files/drop-images/cronosmb/gorilla/desert.png'}
                currentSupply={
                  factionCurrentSupply.terraSupplyRemaining
                    ? 1700 - factionCurrentSupply.terraSupplyRemaining.toNumber()
                    : 0
                }
                maxSupply={1700}
                canMintQuantity={canMintQuantity[2] ?? 0}
                dropStatus={status}
                mintNow={(quantity) => mintNow(quantity, 'TERRA')}
              />
            </div>
          </div>
        </section>
      </>
    </div>
  );
};
export default MultiDrop;

interface MultiDropCardProps {
  title: string;
  img: string;
  canMintQuantity: number;
  mintNow: (quantity: number) => void;
  currentSupply: number;
  maxSupply: number;
  dropStatus: number;
}

const MultiDropCard = ({ title, img, canMintQuantity, mintNow, currentSupply, maxSupply, dropStatus }: MultiDropCardProps) => {
  const user = useUser();

  const [minting, setMinting] = useState(false);
  const [numToMint, setNumToMint] = useState(1);
  const [status, setStatus] = useState(statuses.NOT_STARTED);

  useEffect(() => {
    calculateStatus(currentSupply, maxSupply);
    // eslint-disable-next-line
  }, [currentSupply, canMintQuantity, dropStatus]);

  const calculateStatus = (currentSupply: number, maxSupply: number) => {
    if (dropStatus === statuses.LIVE) {
      if (currentSupply >= maxSupply) setStatus(statuses.SOLD_OUT);
      else setStatus(statuses.LIVE);
    } else {
      setStatus(dropStatus);
    }
  };

  const beginMint = async () => {
    setMinting(true);
    await mintNow(numToMint);
    setMinting(false);
  };

  return (
    <div className="card eb-nft__card h-100 shadow">
      <img src={img} className={`card-img-top`} alt={title} />
      <div className="card-body d-flex flex-column">
        <h2 className="text-center">{title}</h2>

        {status === statuses.LIVE && (
          <>
            {user.address ? (
              <>
                <div>
                  <FormLabel>Quantity</FormLabel>
                  {/*<Form.Range*/}
                  {/*  value={numToMint}*/}
                  {/*  min="1"*/}
                  {/*  max={canMintQuantity}*/}
                  {/*  onChange={(e) => setNumToMint(Number(e.target.value))}*/}
                  {/*/>*/}
                </div>
                <div className="text-center">
                  <button
                    className="btn-main lead mb-5"
                    style={{ display: 'inline' }}
                    onClick={beginMint}
                    disabled={minting}
                  >
                    {minting ? (
                      <>
                        Minting...
                        <Spinner size='sm' ms={1} />
                      </>
                    ) : (
                      <>Mint {numToMint}</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <button
                    className="btn-main lead mb-5"
                    style={{ display: 'inline' }}
                    onClick={beginMint}
                    disabled={minting}
                  >
                    Connect
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {status === statuses.SOLD_OUT && <p className="mt-4 text-center">MINT HAS SOLD OUT</p>}
        {status === statuses.EXPIRED && <p className="mt-4 text-center">MINT HAS ENDED</p>}

        {currentSupply !== undefined && maxSupply !== undefined && (
          <>
            {status === statuses.LIVE ? (
              <div>
                <div className="fs-6 fw-bold mb-1 text-end">
                  {percentage(currentSupply, maxSupply)}% minted ({ethers.utils.commify(currentSupply)} /{' '}
                  {ethers.utils.commify(maxSupply)})
                </div>
                <Progress
                  size='xs'
                  value={percentage(currentSupply, maxSupply)}
                  bg='white'
                />
              </div>
            ) : (
              <div className="mt-auto">
                <div className="fs-6 fw-bold mb-1 text-end">Supply: {maxSupply}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
