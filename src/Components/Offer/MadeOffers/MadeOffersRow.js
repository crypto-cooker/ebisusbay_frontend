import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import Blockies from 'react-blockies';
import {commify} from 'ethers/lib/utils';
import Link from 'next/link';

import Button from '../../../Components/components/Button';
import {findCollectionByAddress, shortString, timeSince} from '@src/utils';
import {getNftDetails} from '@src/GlobalState/nftSlice';
import MakeOfferDialog from '../Dialogs/MakeOfferDialog';
import {CancelOfferDialog} from "@src/Components/Offer/Dialogs/CancelOfferDialog";
import MakeCollectionOfferDialog from "@src/Components/Offer/Dialogs/MakeCollectionOfferDialog";
import Image from "next/image";

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
      {!!offerType && offerType === OFFER_TYPE.update && !!nftId && (
        <MakeOfferDialog
          isOpen={!!offerType}
          onClose={() => handleOffer(OFFER_TYPE.none)}
          nftId={nftId}
          nftAddress={nftAddress}
        />
      )}
      {!!offerType && offerType === OFFER_TYPE.update && !nftId && (
        <MakeCollectionOfferDialog
          isOpen={!!offerType}
          onClose={() => handleOffer(OFFER_TYPE.none)}
          collection={collectionData}
        />
      )}
      {!!offerType && offerType === OFFER_TYPE.cancel && (
        <CancelOfferDialog
          isOpen={!!offerType}
          onClose={() => handleOffer(OFFER_TYPE.none)}
          collection={collectionData}
          isCollectionOffer={!nftId}
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
        <div className="table-row-item">
          <div className="d-flex">
            <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
            <span className="ms-1">
              {commify(price)}
            </span>
          </div>
        </div>
        <div className="table-row-item">{getOfferDate(timeCreated)} ago</div>
        <div className="table-row-item">
          {getState(state) === 'Active' && (
            <Button
              type="legacy"
              onClick={() => handleOffer(OFFER_TYPE.update)}
            >
              Update
            </Button>
          )}
        </div>
        <div className="table-row-item">
          {getState(state) === 'Active' && (
            <Button
              type="legacy-outlined"
              onClick={() => handleOffer(OFFER_TYPE.cancel)}
            >
              Cancel
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
            {getState(state) === 'Active' && (
              <Button
                type="legacy"
                onClick={() => handleOffer(OFFER_TYPE.update)}
              >
                Update
              </Button>
            )}
          </div>
          <div className="table-row-button">
            {getState(state) === 'Active' && (
              <Button
                type="legacy-outlined"
                onClick={() => handleOffer(OFFER_TYPE.cancel)}
              >
                Cancel
              </Button>
            )}
          </div>
        </ItemRow>
      </TableRowContainerMobile>
    </>
  );
}
