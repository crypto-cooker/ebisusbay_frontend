import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Blockies from 'react-blockies';
import { commify } from 'ethers/lib/utils';
import Link from 'next/link';

import Button from '../../../Components/components/Button';
import {findCollectionByAddress, shortString, timeSince} from '@src/utils';
import { getNftDetails } from '@src/GlobalState/nftSlice';
import MakeOfferDialog from '../Dialogs/MakeOfferDialog';
import AcceptOfferDialog from "@src/Components/Offer/Dialogs/AcceptOfferDialog";
import {CancelOfferDialog} from "@src/Components/Offer/Dialogs/CancelOfferDialog";
import {RejectOfferDialog} from "@src/Components/Offer/Dialogs/RejectOfferDialog";

const TableRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 26px 0;
  font-size: 14px;

  .table-row-item {
    width: 12%;

    &:first-child {
      display: flex;
      align-items: center;
      width: 13%;
    }

    &:nth-child(7) {
      width: 10%;
    }
  }

  .nft-title {
    color: ${({ theme }) => theme.colors.textColor4};
    font-weight: bold;
  }

  button {
    font-size: 14px;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    .table-row-item {
      .collection-name {
        display: none;
      }
      &:first-child {
        width: 10%;
      }
    }
    .nft-title {
      display: none;
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const TableRowContainerMobile = styled.div`
  display: none;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 11px;
    border: 1px solid ${({ theme }) => theme.colors.borderColor5};
    margin-top: 10px;
    font-size: 14px;

    .table-row-button {
      width: 40%;
    }

    .collection-logo {
      text-align: center;
    }
  }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;

  .nft-title {
    color: ${({ theme }) => theme.colors.textColor4};
  }
`;

export const OFFER_TYPE = {
  make: 'Make',
  update: 'Update',
  accept: 'Accept',
  reject: 'Reject',
  cancel: 'Cancel',
  none: '', // close modal
};

export default function TableRow({ data }) {
  const { state, timeCreated, seller, buyer, price, nftAddress, nftId } = data;

  let nft = useSelector((state) => {
    return { ...state.nft.nft, address: nftAddress };
  });

  const dispatch = useDispatch();

  const [offerType, setOfferType] = useState(OFFER_TYPE.none);
  const handleOffer = (type) => {
    dispatch(getNftDetails(nftAddress, nftId));
    setOfferType(type);
  };

  const collectionData = findCollectionByAddress(nftAddress, nftId);

  const getCollectionName = () => {
    return collectionData ? collectionData?.name : '';
  };

  const getCollectionAvatar = () => {
    return collectionData ? collectionData?.metadata?.avatar : '';
  };

  const getState = (offerState) => {
    if (offerState === '0') {
      return 'Active';
    } else if (offerState === '1') {
      return 'Accepted';
    } else if (offerState === '2') {
      return 'Rejected';
    } else if (offerState === '3') {
      return 'Cancelled';
    } else {
      return '';
    }
  };

  const getOfferDate = (timestamp) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <>
      {!!offerType && offerType === OFFER_TYPE.accept && (
        <AcceptOfferDialog
          isOpen={!!offerType}
          onClose={() => handleOffer(OFFER_TYPE.none)}
          collection={collectionData}
          nft={nft}
          isCollectionOffer={!data.nftId}
          offer={data}
        />
      )}
      {!!offerType && offerType === OFFER_TYPE.reject && (
        <RejectOfferDialog
          isOpen={!!offerType}
          onClose={() => handleOffer(OFFER_TYPE.none)}
          collection={collectionData}
          nft={nft}
          isCollectionOffer={!data.nftId}
          offer={data}
        />
      )}
      <TableRowContainer>
        <div className="table-row-item">
          <div className="coll_list_pp" style={{ cursor: 'pointer' }}>
            <Link href={`/collection/${collectionData?.slug}`}>
              <a>
                {getCollectionAvatar() ? (
                  <img
                    className="lazy"
                    src={getCollectionAvatar()}
                    alt={getCollectionName()}
                    width="50"
                    height="50"
                    style={{ marginRight: '10px', borderRadius: '100px' }}
                  />
                ) : (
                  <span style={{ marginRight: '10px', borderRadius: '100px' }}>
                    <Blockies seed={nftAddress} size={10} scale={5} />
                  </span>
                )}
              </a>
            </Link>
          </div>
          <a href={`/collection/${collectionData?.slug}/${nftId}`}>{shortString(nftId)}</a>
        </div>
        <div className="table-row-item">{commify(price)} CRO</div>
        <div className="table-row-item">{getOfferDate(timeCreated)} ago</div>
        <div className="table-row-item">
          <Button
            type="legacy"
            onClick={() => handleOffer(OFFER_TYPE.accept)}
            disabled={getState(state) !== 'Active'}
          >
            Accept
          </Button>
        </div>
        <div className="table-row-item">
          {!collectionData.multiToken && (
            <Button
              type="legacy-outlined"
              onClick={() => handleOffer(OFFER_TYPE.reject)}
              disabled={getState(state) !== 'Active'}
            >
              Reject
            </Button>
          )}
        </div>
      </TableRowContainer>
      <TableRowContainerMobile>
        <div className="collection-logo">
          <a href={`/collection/${collectionData?.slug}`}>
            <img
              className="lazy"
              src={getCollectionAvatar()}
              alt={getCollectionName()}
              width="50"
              height="50"
              style={{ marginRight: '10px', borderRadius: '100px' }}
            />
          </a>
        </div>
        <ItemRow>
          <div>Collection Name</div>
          <div>{getCollectionName()}</div>
        </ItemRow>
        <ItemRow>
          <div>NFT title</div>
          <div className="nft-title">
            <a href={`/collection/${collectionData?.slug}/${nftId}`}>{nftId}</a>
          </div>
        </ItemRow>
        <ItemRow>
          <div>Status</div>
          <div>{getState(state)}</div>
        </ItemRow>
        <ItemRow>
          <div>Date</div>
          <div>{getOfferDate(timeCreated)} ago</div>
        </ItemRow>
        <ItemRow>
          <div>Offer Price</div>
          <div>{price} CRO</div>
        </ItemRow>
        <ItemRow>
          <div className="table-row-button">
            <Button
              type="legacy"
              onClick={() => handleOffer(OFFER_TYPE.accept)}
              disabled={getState(state) !== 'Active'}
            >
              Accept
            </Button>
          </div>
          <div className="table-row-button">
            {!collectionData.multiToken && (
              <Button
                type="legacy-outlined"
                onClick={() => handleOffer(OFFER_TYPE.reject)}
                disabled={getState(state) !== 'Active'}
              >
                Reject
              </Button>
            )}
          </div>
        </ItemRow>
      </TableRowContainerMobile>
    </>
  );
}
