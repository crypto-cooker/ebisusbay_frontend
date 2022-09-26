import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Link from 'next/link';
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

import Button from './Button';
import MakeOfferDialog from '../Offer/Dialogs/MakeOfferDialog';
import { chainConnect, connectAccount } from '@src/GlobalState/User';
import { AnyMedia } from './AnyMedia';
import {nftCardUrl} from "@src/helpers/image";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare} from "@src/utils";
import {Heading} from "@chakra-ui/react";

const config = appConfig();

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

const ListingCardCollection = ({ listing, imgClass = 'marketplace', watermark, address, collectionMetadata }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [collection, setCollection] = useState(null);

  const handleMakeOffer = () => {
    if (user.address) {
      setCollection(config.collections.find((c) => caseInsensitiveCompare(listing.nftAddress, c.address)));
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

  const convertListingData = (listingData) => {
    const res = {
      address: listingData.nftAddress,
      id: listingData.nftId,
      image: listingData.nft.image,
      name: listingData.nft.name,
      description: listingData.nft.description,
      rank: listingData.rank,
      royalty: listingData.royalty,
    };
    return res;
  };

  return (
    <>
      <div className="card eb-nft__card h-100 shadow">
        <div className="card-img-container">
          {watermark ? (
            <Watermarked watermark={watermark}>
              <AnyMedia
                image={nftCardUrl(listing.nftAddress, listing.nft.image)}
                className={`card-img-top ${imgClass}`}
                title={listing.nft.name}
                url={`/collection/${listing.nftAddress}/${listing.nftId}`}
                width={440}
                height={440}
              />
            </Watermarked>
          ) : (
            <AnyMedia
              image={nftCardUrl(listing.nftAddress, listing.nft.image)}
              className={`card-img-top ${imgClass}`}
              title={listing.nft.name}
              url={`/collection/${listing.nftAddress}/${listing.nftId}`}
              width={440}
              height={440}
            />
          )}
        </div>
        {listing.nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{listing.nft.rank}</div>}
        <div className="card-body d-flex flex-column justify-content-between">
          <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
            <a>
              <Heading as="h6" size="sm" className="card-title mt-auto">{listing.nft.name}</Heading>
            </a>
          </Link>
          <MakeBuy>
            <div>{ethers.utils.commify(listing.price)} CRO</div>
          </MakeBuy>
          <MakeOffer>
            <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
              <a>
                <Button type="legacy">Buy</Button>
              </a>
            </Link>
            <div>
              <Button type="legacy-outlined" onClick={() => handleMakeOffer('Make')}>
                Offer
              </Button>
            </div>
          </MakeOffer>
        </div>
      </div>

      {openMakeOfferDialog && (
        <MakeOfferDialog
          isOpen={openMakeOfferDialog}
          onClose={() => setOpenMakeOfferDialog(false)}
          nftId={listing.nftId}
          collection={collection}
        />
      )}
    </>
  );
};

export default memo(ListingCardCollection);
