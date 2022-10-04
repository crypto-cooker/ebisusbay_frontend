import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

import Button from './Button';
import MakeOfferDialog from '../Offer/Dialogs/MakeOfferDialog';
import { connectAccount, chainConnect } from '../../GlobalState/User';
import {isNftBlacklisted, round, siPrefixedNumber} from '../../utils';
import { AnyMedia } from './AnyMedia';
import { nftCardUrl } from '../../helpers/image';
import {Heading} from "@chakra-ui/react";
import Image from "next/image";

const Watermarked = styled.div`
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-image: url(${(props) => props.watermark});
    background-size: 60px 60px;
    background-position: 0px 0px;
    background-repeat: no-repeat;
    opacity: 0.3;
  }
`;

const MakeBuy = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MakeOffer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;

  .w-45 {
    width: 45%;
  }
`;

const NftCard = ({ listing, imgClass = 'marketplace', watermark, collection, canBuy = true }) => {
  const history = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);

  const handleMakeOffer = () => {
    const isBlacklisted = isNftBlacklisted(listing.address, listing.id);
    if (isBlacklisted) return;

    if (user.address) {
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const handleBuy = () => {
    // if (listing.market?.id) {
    //   history.push(`/listing/${listing.market?.id}`);
    // } else {
    history.push(`/collection/${listing.address}/${listing.id}`);
    // if (listing?.address && listing?.id) {
    //   history.push(`/collection/${getSlugFromAddress(listing.address)}/${listing.id}`);
    // }
    // }
  };

  const getIsNftListed = () => {
    if (listing.market?.price) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="card eb-nft__card h-100 shadow">
        <div className="card-img-container">
          {watermark ? (
            <Watermarked watermark={watermark}>
              <AnyMedia
                image={nftCardUrl(listing.address, listing.image)}
                className={`card-img-top ${imgClass}`}
                title={listing.name}
                url={`/collection/${collection.slug}/${listing.id}`}
                width={440}
                height={440}
                video={listing.video ?? listing.animation_url}
                usePlaceholder={true}
              />
            </Watermarked>
          ) : (
            <AnyMedia
              image={nftCardUrl(listing.address, listing.image)}
              className={`card-img-top ${imgClass}`}
              title={listing.name}
              url={`/collection/${collection.slug}/${listing.id}`}
              width={440}
              height={440}
              video={listing.video ?? listing.animation_url}
              usePlaceholder={true}
            />
          )}
        </div>
        {listing.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{listing.rank}</div>}
        <div className="card-body d-flex flex-column justify-content-between">
          <Link href={`/collection/${collection.slug}/${listing.id}`}>
            <a>
              <Heading as="h6" size="sm" className="card-title mt-auto">{listing.name}</Heading>
            </a>
          </Link>
          {getIsNftListed() && (
            <MakeBuy>
              {collection.multiToken && <div>Floor:</div>}
              <div className="d-flex">
                <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                <span className="ms-1">
                  {listing.market?.price > 6 ? siPrefixedNumber(listing.market?.price) : ethers.utils.commify(round(listing.market?.price))}
                </span>
              </div>
            </MakeBuy>
          )}
          <div className="d-flex flex-wrap">
            {getIsNftListed() && canBuy ? (
              <Button type="legacy" className="flex-fill m-1" onClick={handleBuy}>
                Buy
              </Button>
            ) : (
              <div></div>
            )}
            <Button type="legacy-outlined" className="flex-fill m-1" onClick={() => handleMakeOffer()}>
              Offer
            </Button>
          </div>
        </div>
      </div>
      {openMakeOfferDialog && (
        <MakeOfferDialog
          isOpen={openMakeOfferDialog}
          onClose={() => setOpenMakeOfferDialog(false)}
          nft={listing}
          collection={collection}
        />
      )}
    </>
  );
};

export default memo(NftCard);
