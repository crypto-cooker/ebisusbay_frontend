import React, {useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import Blockies from 'react-blockies';
import {ethers} from 'ethers';
import {faCheck, faCircle, faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';

import Clock from '@src/Components/components/Clock';
import LayeredIcon from '@src/Components/components/LayeredIcon';
import {DropState} from '@src/core/api/enums';
import {appConfig} from "@src/Config";
import {hostedImage} from "@src/helpers/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {Box, Heading, HStack, Tag, Text} from "@chakra-ui/react";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Drop, mapDrop} from "@src/core/models/drop";
import ImageService from "@src/core/services/image";
import {useRouter} from "next/router";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import LocalDataService from "@src/core/services/local-data-service";
import {millisecondTimestamp} from "@src/utils";

const tokens = appConfig('tokens')
const drops: Drop[] = appConfig('drops').map((drop: any) => mapDrop(drop));

const GlobalStyles = createGlobalStyle`
  .nft-big .slick-prev::before{
    left: 0;
    line-height: 40px;
  }
  .nft-big .slick-next::before {
    right: 0;
    line-height: 40px;
  }
  .nft-big .slick-prev, .nft-big .slick-next{
    border: 1px solid #ccc;
    box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.2);
    width: 50px;
    height: 50px;
  }
  
  .nft__item_lg img {
    max-height: 700px;
  }
  @media only screen and (max-width: 1024px) {
    .nft__item_lg img{
      max-height: 450px;
    }
  }
`;

const VerifiedIcon = styled.span`
  font-size: 8px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
`;

const FeaturedDrops = () => {
  const router = useRouter();
  const [featuredDrops, setFeaturedDrops] = useState<Drop[]>([]);

  const navigateToDrop = (drop: Drop) => {
    if (typeof window === 'undefined') return;
    if (drop.redirect) {
      window.open(drop.redirect, '_blank');
    } else {
      router.push(`/drops/${drop.slug}`);
    }
  }

  const calculateStatus = (startDate: number, endDate?: number) => {
    const sTime = new Date(startDate);
    const eTime = !!endDate ? new Date(endDate) : 0;
    const now = new Date();

    if (sTime > now) return DropState.NOT_STARTED;
    else if (!endDate || eTime > now) return DropState.LIVE;
    else if (endDate && eTime < now) return DropState.EXPIRED;
    else return DropState.NOT_STARTED;
  }

  useEffect(() => {
    const timeToShowInHours = 3600000 * 12;     // Threshold to display upcoming drops
    const maxShowTimeInDays = 3600000 * 24 * 2; // Threshold to show live drops
    const maxFreshnessInHours = 3600000 * 8;    // Threshold to label live drops as "stale"
    const defaultMaxCount = 5;                  // Maximum drops on the carousel

    const ads = LocalDataService
      .getDropsAds()
      .map(ad => ({
        ...ad.details,
        id: 99999,
        slug: ad.name,
        title: ad.name,
        subtitle: '',
        description: '',
        author: {
          ...ad.details.socials,
          name: ad.details.author
        },
        address: '',
        maxMintPerTx: 0,
        maxMintPerAddress: 0,
        totalSupply: 0,
        start: millisecondTimestamp(ad.details.date),
        published: true,
        images: {
          ...ad.details.images,
          banner: ''
        },
        verification: {
          ...ad.details.verification,
          escrow: false
        },
        redirect: ad.details.link.url,
        erc20Only: false,
        memberMitama: 0
      } as Drop));

    const mappedDrops = drops.concat(ads);

    const topLevelDrops = mappedDrops.filter((d) => !d.complete && d.featured && d.published)
      .sort((a, b) => (a.start < b.start ? 1 : -1));
    const topLevelKeys = topLevelDrops.map((d) => d.slug);

    const upcomingDrops = mappedDrops
      .filter(
        (d) =>
          !d.complete &&
          d.published &&
          d.start &&
          d.start > Date.now() &&
          !!d.images.preview &&
          !topLevelKeys.includes(d.slug)
      )
      .sort((a, b) => (a.start > b.start ? 1 : -1));

    const imminentUpcomingDrops = upcomingDrops.filter((d) => d.start - Date.now() < timeToShowInHours);
    const distantUpcomingDrops = upcomingDrops.filter((d) => d.start - Date.now() >= timeToShowInHours);

    let liveDrops = mappedDrops
      .filter(
        (d) =>
          !d.complete &&
          d.published &&
          d.start &&
          d.start < Date.now() &&
          !!d.images.preview &&
          !topLevelKeys.includes(d.slug)
      )
      .sort((a, b) => (a.start < b.start ? 1 : -1));

    if (liveDrops.length > defaultMaxCount) {
      let c = 0;
      liveDrops = liveDrops
        .reverse()
        .filter((d) => {
          if (liveDrops.length - c <= defaultMaxCount) return true;

          if (Date.now() - d.start < maxShowTimeInDays || d.slug === 'founding-member') {
            return true;
          }

          c++;
          return false;
        })
        .reverse();
    }

    const liveFreshDrops = liveDrops.filter((d) => Date.now() - d.start <= maxFreshnessInHours);
    const liveStaleDrops = liveDrops.filter((d) => Date.now() - d.start > maxFreshnessInHours);

    setFeaturedDrops([
      ...imminentUpcomingDrops,
      ...liveFreshDrops,
      ...topLevelDrops,
      ...distantUpcomingDrops,
      ...liveStaleDrops
    ]);
  }, []);


  return (
    <div className="nft-big">
      <GlobalStyles />
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        navigation={true}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {featuredDrops &&
          featuredDrops.map((drop, index) => (
            <SwiperSlide key={index}>
              <Box className="itm">
                <div className="nft__item_lg">
                  <div className="row align-items-center">
                    <div className="col-lg-6 text-center">
                      <img src={hostedImage(drop.images.drop)} className="img-fluid mx-auto" alt={drop.title} />
                    </div>
                    <div className="col-lg-6">
                      <div className="d-desc">
                        <Heading>{drop.title}</Heading>
                        {drop.redirect && (
                          <Tag mb={2}>
                            {/*<FontAwesomeIcon icon={faExclamationCircle} />*/}
                            <span className="">Promoted</span>
                          </Tag>
                        )}
                        <CollectionVerificationRow
                          doxx={drop.verification?.doxx}
                          kyc={drop.verification?.kyc}
                          escrow={drop.verification?.escrow}
                          creativeCommons={null}
                        />
                        <div className="d-flex">
                        </div>
                        <div className="d-author">
                          <div className="author_list_pp">
                            {drop.images.avatar ? (
                              <img className="lazy" src={ImageService.translate(drop.images.avatar).avatar()} alt={drop.author.name} />
                            ) : (
                              <Blockies seed={drop.slug} size={10} scale={5} />
                            )}
                            {drop.verification.verified && (
                              <VerifiedIcon>
                                <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={7} />
                              </VerifiedIcon>
                            )}
                          </div>
                          <div className="author_list_info">
                            <div className="title">{drop.author.name}</div>
                            <div className="subtitle">
                              {!!drop.author.website && (
                                <span className="profile_username">
                                  <a href={drop.author.website} target="_blank" rel="noreferrer">
                                    View Website
                                  </a>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-attr">
                          <div className="col">
                            {drop.slug === 'izanamis-cradle-land-deeds' ? (
                              <>
                                <span className="d-title">Mint Price</span>
                                <Heading as="h3" size="md">
                                  <HStack>
                                    <FortuneIcon boxSize={10} />
                                    <Text as='span'>
                                      {drop.salePeriods.public < Date.now() ? (
                                        <>{ethers.utils.commify(drop.erc20Cost!)}</>
                                      ) : drop.salePeriods.allowlist2 < Date.now() ? (
                                        <>{drop.erc20MemberCost}</>
                                      ) : (
                                        <>{drop.erc20WhitelistCost}</>
                                      )}
                                    </Text>
                                    <Text as='span'>{tokens[drop.erc20Token!].symbol}</Text>
                                  </HStack>
                                </Heading>
                              </>
                            ) : (
                              <>
                              {drop.slug !== 'ryoshi-tales-vip-2' && <span className="d-title">Mint Price</span>}

                                {drop.freeMint ? (
                                  <Heading as="h3" size="md">Free Mint</Heading>
                                ) : (
                                  <>
                                    {!!drop.cost &&
                                      (Array.isArray(drop.cost) ? (
                                        <Heading as="h3" size="md">
                                          {ethers.utils.commify(Math.min(...drop.cost.map((c) => parseInt(c))))} -{' '}
                                          {ethers.utils.commify(Math.max(...drop.cost.map((c) => parseInt(c))))} CRO
                                        </Heading>
                                      ) : (
                                        <Heading as="h3" size="md">{ethers.utils.commify(drop.cost)} {drop.chain ? 'ETH' : 'CRO'}</Heading>
                                      ))}
                                    {!!drop.erc20Cost && !!drop.erc20Token && (
                                      <HStack mt={2} mb={4}>
                                        {drop.erc20Token === 'frtn' ? <FortuneIcon boxSize={10} /> : <Image src={hostedImage(`/img/tokens/${drop.erc20Token}.svg`)} width={40} height={40} alt='ERC20' />}
                                        <Text fontSize="4xl" fontWeight="bold" lineHeight={1}>
                                          {ethers.utils.commify(drop.erc20Cost)}
                                        </Text>
                                      </HStack>
                                    )}
                                    {!drop.cost && !drop.erc20Cost && drop.slug !== 'ryoshi-tales-vip' && (
                                      <Box>
                                        <span className="d-title">Start Price</span>
                                        <Heading as="h3" size="md">
                                          <HStack>
                                            <FortuneIcon boxSize={10}/>
                                            <Text as='span'>
                                              2,000
                                            </Text>
                                          </HStack>
                                        </Heading>

                                        <span className="d-title">End Price</span>
                                        <Heading as="h3" size="md">
                                          <HStack>
                                            <FortuneIcon boxSize={10}/>
                                            <Text as='span'>
                                              3,000
                                            </Text>
                                          </HStack>
                                        </Heading>
                                      </Box>
                                    )}
                                  </>
                                )}
                                {!!drop.memberCost &&
                                  (Array.isArray(drop.memberCost) ? (
                                    <Heading as="h5" size="sm">
                                      Members: {ethers.utils.commify(Math.min(...drop.memberCost.map((c) => parseInt(c))))}{' '}
                                      - {ethers.utils.commify(Math.max(...drop.memberCost.map((c) => parseInt(c))))} CRO
                                    </Heading>
                                  ) : (
                                    <Heading as="h5" size="sm">Members: {ethers.utils.commify(drop.memberCost)} {drop.chain ? 'ETH' : 'CRO'}</Heading>
                                  ))}
                                {!!drop.erc20MemberCost && !!drop.erc20Token && (
                                  <HStack mt={2}>
                                    <Text fontSize="md" fontWeight="bold" lineHeight={1} className="ms-0" >
                                      {drop.collection === 'ryoshi-playing-cards' ? 'Mitama Price' : 'Members'}: {ethers.utils.commify(drop.erc20MemberCost)} {tokens[drop.erc20Token].symbol}
                                    </Text>
                                  </HStack>
                                )}
                                {!!drop.whitelistCost &&
                                  (Array.isArray(drop.whitelistCost) ? (
                                    <Heading as="h5" size="sm">
                                      Whitelist:{' '}
                                      {ethers.utils.commify(Math.min(...(drop.whitelistCost as any[])?.map((c) => parseInt(c))))} -{' '}
                                      {ethers.utils.commify(Math.max(...(drop.whitelistCost as any[])?.map((c) => parseInt(c))))} CRO
                                    </Heading>
                                  ) : (
                                    <Heading as="h5" size="sm">Whitelist: {ethers.utils.commify(drop.whitelistCost)} {drop.chain ? 'ETH' : 'CRO'}</Heading>
                                  ))}
                                {drop.specialWhitelistCost && (
                                  <Heading as="h5" size="sm">
                                    {drop.specialWhitelistCost.name}:{' '}
                                    {ethers.utils.commify(drop.specialWhitelistCost.value)} CRO
                                  </Heading>
                                )}
                              </>
                            )}
                          </div>
                          <div className="line my-auto"></div>
                          {drop.slug === 'izanamis-cradle-land-deeds' ? (
                            <div className="col my-auto">
                              {calculateStatus(drop.salePeriods.public) > DropState.NOT_STARTED ? (
                                <>
                                  {calculateStatus(drop.salePeriods.public) === DropState.LIVE && (
                                    <Heading as="h3" size="lg">Drop is Live!</Heading>
                                  )}
                                  {calculateStatus(drop.salePeriods.public) === DropState.EXPIRED && (
                                    <Heading as="h3" size="lg">Drop Ended</Heading>
                                  )}
                                  {/*{calculateStatus(drop.salePeriods.public) === DropState.SOLD_OUT && (*/}
                                  {/*  <Heading as="h3" size="lg">Sold Out</Heading>*/}
                                  {/*)}*/}
                                </>
                              ) : calculateStatus(drop.salePeriods.allowlist2) > DropState.NOT_STARTED ? (
                                <>
                                  {calculateStatus(drop.salePeriods.allowlist2) === DropState.LIVE && (
                                    <Heading as="h3" size="lg">Allowlist 2 Live!</Heading>
                                  )}
                                  {calculateStatus(drop.salePeriods.public) < DropState.LIVE && (
                                    <>
                                      <span className="d-title">Public starts in</span>
                                      <div className="de_countdown fs-4">
                                        <Clock deadline={drop.salePeriods.public} />
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : calculateStatus(drop.salePeriods.allowlist1) > DropState.NOT_STARTED ? (
                                <>
                                  {calculateStatus(drop.salePeriods.allowlist1) === DropState.LIVE && (
                                    <Heading as="h3" size="lg">Allowlist 1 Live!</Heading>
                                  )}
                                  {calculateStatus(drop.salePeriods.allowlist2) < DropState.LIVE && (
                                    <>
                                      <span className="d-title">Allowlist 2 starts in</span>
                                      <div className="de_countdown fs-4">
                                        <Clock deadline={drop.salePeriods.allowlist2} />
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="d-title">Allowlist 1 starts in</span>
                                  <div className="de_countdown">
                                    <Clock deadline={drop.salePeriods.allowlist1} />
                                  </div>
                                </>
                              )}
                            </div>
                          ) : drop.salePeriods ? (
                            <div className="col my-auto">
                              {calculateStatus(drop.salePeriods.public) > DropState.NOT_STARTED ? (
                                <>
                                  {calculateStatus(drop.salePeriods.public) === DropState.LIVE && (
                                    <Heading as="h3" size="lg">Drop is Live!</Heading>
                                  )}
                                  {calculateStatus(drop.salePeriods.public) === DropState.EXPIRED && (
                                    <Heading as="h3" size="lg">Drop Ended</Heading>
                                  )}
                                  {/*{calculateStatus(drop.salePeriods.public) === DropState.SOLD_OUT && (*/}
                                  {/*  <Heading as="h3" size="lg">Sold Out</Heading>*/}
                                  {/*)}*/}
                                </>
                              ) : (
                                <>
                                  {calculateStatus(drop.salePeriods.presale) === DropState.NOT_STARTED && (
                                    <>
                                      <span className="d-title">Presale starts in</span>
                                      <div className="de_countdown">
                                        <Clock deadline={drop.salePeriods.presale} />
                                      </div>
                                    </>
                                  )}
                                  {calculateStatus(drop.salePeriods.presale) === DropState.LIVE && (
                                    <Heading as="h3" size="lg">Presale Live!</Heading>
                                  )}
                                  {calculateStatus(drop.salePeriods.public) === DropState.NOT_STARTED && (
                                    <>
                                      <span className="d-title">Public Sale starts in</span>
                                      <div className="de_countdown">
                                        <Clock deadline={drop.salePeriods.public} />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="col my-auto">
                              {calculateStatus(drop.start) === DropState.NOT_STARTED && (
                                <>
                                  <span className="d-title">Drop starts in</span>
                                  <div className="de_countdown">
                                    <Clock deadline={drop.start} />
                                  </div>
                                  <h5>
                                    {new Date(drop.start).toDateString()}, {new Date(drop.start).toTimeString()}
                                  </h5>
                                </>
                              )}
                              {calculateStatus(drop.start) === DropState.LIVE && <Heading as="h3" size="lg">Drop is Live!</Heading>}
                              {calculateStatus(drop.start) === DropState.EXPIRED && <Heading as="h3" size="lg">Drop Ended</Heading>}
                              {/*{calculateStatus(drop.start) === DropState.SOLD_OUT && <Heading as="h3" size="lg">Sold Out</Heading>}*/}
                            </div>
                          )}
                        </div>
                        <div className="spacer-10"></div>
                        <div className="d-buttons">
                          <span className="btn-main" onClick={() => navigateToDrop(drop)}>
                            View Drop
                            {drop.redirect && (
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2" />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default FeaturedDrops;