import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Blockies from 'react-blockies';
import { ethers } from 'ethers';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

import Clock from './Clock';
import LayeredIcon from './LayeredIcon';
import { dropState } from '../../core/api/enums';
import {appConfig} from "../../Config";
import {hostedImage} from "../../helpers/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper";
const drops = appConfig('drops');

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

class CustomSlide extends Component {
  render() {
    const { ...props } = this.props;
    return <div {...props}></div>;
  }
}

export default class Responsive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.featuredDrops = drops;
    this.arrangeCollections();
  }

  // @todo refactor out
  isFounderDrop(drop) {
    return drop.slug === 'founding-member';
  }

  calculateStatus(startDate, endDate) {
    const sTime = new Date(startDate);
    const eTime = new Date(endDate);
    const now = new Date();

    if (sTime > now) return dropState.NOT_STARTED;
    else if (!endDate || eTime > now) return dropState.LIVE;
    else if (endDate && eTime < now) return dropState.EXPIRED;
    else return dropState.NOT_STARTED;
  }

  arrangeCollections() {
    const timeToShowInHours = 3600000 * 12;
    const maxShowTimeInDays = 3600000 * 24 * 2;
    const defaultMaxCount = 5;

    const topLevelDrops = drops.filter((d) => !d.complete && d.featured);
    const topLevelKeys = topLevelDrops.map((d) => d.slug);

    const upcomingDrops = drops
      .filter(
        (d) =>
          !d.complete &&
          d.published &&
          d.start &&
          d.start > Date.now() &&
          d.start - Date.now() < timeToShowInHours &&
          !!d.imgPreview &&
          !topLevelKeys.includes(d.slug)
      )
      .sort((a, b) => (a.start > b.start ? 1 : -1));
    let liveDrops = drops
      .filter(
        (d) =>
          !d.complete &&
          d.published &&
          d.start &&
          d.start < Date.now() &&
          !!d.imgPreview &&
          !topLevelKeys.includes(d.slug)
      )
      .sort((a, b) => (a.start < b.start ? 1 : -1));

    if (liveDrops.length > defaultMaxCount) {
      let c = 0;
      liveDrops = liveDrops
        .reverse()
        .filter((d) => {
          if (liveDrops.length - c <= defaultMaxCount) return true;

          if (Date.now() - d.start < maxShowTimeInDays || this.isFounderDrop(d)) {
            return true;
          }

          c++;
          return false;
        })
        .reverse();
    }
    this.featuredDrops = [...topLevelDrops, ...upcomingDrops, ...liveDrops];
  }

  navigateToDrop(drop) {
    if (typeof window === 'undefined') return;
    if (drop.redirect) {
      window.open(drop.redirect, '_blank');
    } else {
      window.open(`/drops/${drop.slug}`, '_self');
    }
  }

  render() {
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
          {this.featuredDrops &&
            this.featuredDrops.map((drop, index) => (
              <SwiperSlide key={index}>
                <CustomSlide className="itm">
                  <div className="nft__item_lg">
                    <div className="row align-items-center">
                      <div className="col-lg-6 text-center">
                        <img src={hostedImage(drop.imgPreview)} className="img-fluid mx-auto" alt={drop.title} />
                      </div>
                      <div className="col-lg-6">
                        <div className="d-desc">
                          <h2>{drop.title}</h2>
                          <div className="d-author">
                            <div className="author_list_pp">
                              {drop.imgAvatar ? (
                                <img className="lazy" src={hostedImage(drop.imgAvatar, true)} alt={drop.author.name} />
                              ) : (
                                <Blockies seed={drop.slug} size={10} scale={5} />
                              )}
                              <VerifiedIcon>
                                <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={7} />
                              </VerifiedIcon>
                            </div>
                            <div className="author_list_info">
                              <div className="title">{drop.author.name}</div>
                              <div className="subtitle">
                                {drop.author.link || drop.author.website && (
                                  <span className="profile_username">
                                  <a href={drop.author.link ?? drop.author.website} target="_blank" rel="noreferrer">
                                    View Website
                                  </a>
                                </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="d-attr">
                            <div className="col">
                              <span className="d-title">Mint Price</span>
                              {Array.isArray(drop.cost) ? (
                                <h3>
                                  {ethers.utils.commify(Math.min(...drop.cost.map((c) => parseInt(c))))} -{' '}
                                  {ethers.utils.commify(Math.max(...drop.cost.map((c) => parseInt(c))))} CRO
                                </h3>
                              ) : (
                                <h3>{ethers.utils.commify(drop.cost)} CRO</h3>
                              )}
                              {drop.erc20Cost && drop.erc20Unit && (
                                <h3>
                                  {ethers.utils.commify(drop.erc20Cost)} {drop.erc20Unit}
                                </h3>
                              )}
                              {drop.memberCost &&
                                (Array.isArray(drop.memberCost) ? (
                                  <h5>
                                    Members: {ethers.utils.commify(Math.min(...drop.memberCost.map((c) => parseInt(c))))}{' '}
                                    - {ethers.utils.commify(Math.max(...drop.memberCost.map((c) => parseInt(c))))} CRO
                                  </h5>
                                ) : (
                                  <h5>Members: {ethers.utils.commify(drop.memberCost)} CRO</h5>
                                ))}
                              {drop.erc20MemberCost && drop.erc20Unit && (
                                <h5>
                                  Members: {ethers.utils.commify(drop.erc20MemberCost)} {drop.erc20Unit}
                                </h5>
                              )}
                              {drop.whitelistCost &&
                                (Array.isArray(drop.whitelistCost) ? (
                                  <h5>
                                    Whitelist:{' '}
                                    {ethers.utils.commify(Math.min(...drop.memberCost.map((c) => parseInt(c))))} -{' '}
                                    {ethers.utils.commify(Math.max(...drop.memberCost.map((c) => parseInt(c))))} CRO
                                  </h5>
                                ) : (
                                  <h5>Whitelist: {ethers.utils.commify(drop.whitelistCost)} CRO</h5>
                                ))}
                              {drop.specialWhitelistCost && (
                                <h5>
                                  {drop.specialWhitelistCost.name}:{' '}
                                  {ethers.utils.commify(drop.specialWhitelistCost.value)} CRO
                                </h5>
                              )}
                            </div>
                            <div className="line my-auto"></div>
                            {drop.salePeriods ? (
                              <div className="col my-auto">
                                {this.calculateStatus(drop.salePeriods.public) > dropState.NOT_STARTED ? (
                                  <>
                                    {this.calculateStatus(drop.salePeriods.public) === dropState.LIVE && (
                                      <h3>Drop is Live!</h3>
                                    )}
                                    {this.calculateStatus(drop.salePeriods.public) === dropState.EXPIRED && (
                                      <h3>Drop Ended</h3>
                                    )}
                                    {this.calculateStatus(drop.salePeriods.public) === dropState.SOLD_OUT && (
                                      <h3>Sold Out</h3>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {this.calculateStatus(drop.salePeriods.presale) === dropState.NOT_STARTED && (
                                      <>
                                        <span className="d-title">Presale starts in</span>
                                        <div className="de_countdown">
                                          <Clock deadline={drop.salePeriods.presale} />
                                        </div>
                                      </>
                                    )}
                                    {this.calculateStatus(drop.salePeriods.presale) === dropState.LIVE && (
                                      <h3>Presale Live!</h3>
                                    )}
                                    {this.calculateStatus(drop.salePeriods.public) === dropState.NOT_STARTED && (
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
                                {this.calculateStatus(drop.start) === dropState.NOT_STARTED && (
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
                                {this.calculateStatus(drop.start) === dropState.LIVE && <h3>Drop is Live!</h3>}
                                {this.calculateStatus(drop.start) === dropState.EXPIRED && <h3>Drop Ended</h3>}
                                {this.calculateStatus(drop.start) === dropState.SOLD_OUT && <h3>Sold Out</h3>}
                              </div>
                            )}
                          </div>
                          <div className="spacer-10"></div>
                          <div className="d-buttons">
                          <span className="btn-main" onClick={() => this.navigateToDrop(drop)}>
                            View Drop
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CustomSlide>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    );
  }
}
