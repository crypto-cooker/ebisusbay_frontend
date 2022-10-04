import React, { memo } from 'react';
import { Card } from 'react-bootstrap';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {appConfig} from "../../Config";
import Image from "next/image";


const MyListingCard = ({
  nft,
  canCancel = false,
  canUpdate = false,
  onCancelButtonPressed,
  onUpdateButtonPressed,
}) => {

  const nftUrl = () => {
    return `/collection/${nft.address}/${nft.id}`;
  };

  const onCopyLinkButtonPressed = (url) => () => {
    navigator.clipboard.writeText(url);
    toast.success('Copied!');
  };

  return (
    <>
      <Card style={nft.valid ? {} : { backgroundColor: '#ffadad' }} className="h-100 my-listing-card">
        <Card.Body className="d-flex flex-column">
          <div className="row">
            <div className="col-md-4 my-auto text-center">
              <img src={nft.image} className="img-fluid rounded-start" alt="" />
            </div>
            <div className="col-md-8">
              <h5 className="card-title mx-auto">{nft.name}</h5>
              <p className="card-text">
                Listing ID: {nft.listingId}
                <br />
                <div className="d-flex">
                  <span className="me-1">Price:</span>
                  <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                  <span className="ms-1">
                    {ethers.utils.commify(nft.price)}
                  </span>
                </div>
                {nft.rank && (
                  <>
                    Rank: {nft.rank} <br />
                  </>
                )}
                Listing Time: {nft.listingTime} UTC
                <br />
                {!nft.valid ? (
                  <>
                    Valid: {nft.valid.toString().charAt(0).toUpperCase() + nft.valid.toString().slice(1)}
                    <span>
                      {' '}
                      <FontAwesomeIcon color="var(--bs-danger)" icon={faExclamationCircle} size={'1x'} />{' '}
                    </span>
                    <br />
                  </>
                ) : (
                  <>
                    Valid: {nft.valid.toString().charAt(0).toUpperCase() + nft.valid.toString().slice(1)}
                    <br />
                  </>
                )}
              </p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex flex-wrap justify-content-center justify-content-md-end">
          {canUpdate && (
            <button
              className="btn-main mx-1 mt-2"
              onClick={onUpdateButtonPressed}
              style={{ cursor: 'pointer', color: 'black' }}
            >
              Update
            </button>
          )}
          {canCancel && (
            <button
              className="btn-main mx-1 mt-2"
              onClick={onCancelButtonPressed}
              style={{ cursor: 'pointer', color: 'black' }}
            >
              Cancel
            </button>
          )}
          <button
            className="btn-main mx-1 mt-2"
            onClick={onCopyLinkButtonPressed(new URL(nftUrl(), appConfig('urls.app')))}
            style={{ cursor: 'pointer', color: 'black' }}
          >
            <FontAwesomeIcon icon={faLink} />
          </button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default memo(MyListingCard);
