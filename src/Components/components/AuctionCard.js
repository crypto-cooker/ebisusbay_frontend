import React, { memo } from 'react';
// import styled from 'styled-components';
import Link from 'next/link';
import { ethers } from 'ethers';
import Clock from './Clock';
import { auctionState } from '../../core/api/enums';

// const Outer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-content: center;
//   align-items: center;
//   overflow: hidden;
//   border-radius: 8px;
// `;

const AuctionCard = ({ listing, imgClass = 'marketplace' }) => {
  return (
    <Link className="linkPointer" href={`/auctions/${listing.getAuctionId}`}>
      <div className="card eb-nft__card h-100 shadow">
        <img src={listing.nft.image} className={`card-img-top ${imgClass}`} alt={listing.nft.name} />
        <div className="eb-de_countdown text-center">
          {listing.state === auctionState.ACTIVE && <>Ends In:</>}
          {listing.state === auctionState.NOT_STARTED && <div className="fw-bold">Not Started</div>}
          {listing.state === auctionState.ACTIVE && <Clock deadline={listing.getEndAt} />}
          {listing.state === auctionState.CANCELLED && <div className="fw-bold">Cancelled</div>}
          {listing.state === auctionState.SOLD && <div className="fw-bold">Sold</div>}
        </div>
      </div>
    </Link>
  );
};

export default memo(AuctionCard);
