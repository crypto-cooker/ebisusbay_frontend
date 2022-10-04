import React, { memo } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { faLink, faEllipsisH, faExchangeAlt, faTag, faTimes, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { MenuPopup } from '../components/chakra-components';
import AnyMedia from './AnyMedia';
import {appConfig} from "@src/Config";
import {nftCardUrl} from "@src/helpers/image";
import {Heading} from "@chakra-ui/react";
import Image from "next/image";
import {round} from "@src/utils";

const MyNftCard = ({
  nft,
  canTransfer = false,
  canSell = false,
  isStaked = false,
  canCancel = false,
  canUpdate = false,
  onTransferButtonPressed,
  onSellButtonPressed,
  onCancelButtonPressed,
  onUpdateButtonPressed,
  newTab = false,
  imgClass = 'marketplace',
}) => {
  const history = useRouter();

  const navigateTo = (link) => {
    if (newTab) {
      window.open(link, '_blank');
    } else {
      history.push(link);
    }
  };

  const nftUrl = () => {
    return `/collection/${nft.address}/${nft.id}`;
  };

  const onCopyLinkButtonPressed = (url) => () => {
    navigator.clipboard.writeText(url);
    toast.success('Copied!');
  };

  const getOptions = () => {
    const options = [];

    if (canSell) {
      options.push({
        icon: faTag,
        label: 'Sell',
        handleClick: onSellButtonPressed,
      });
    }
    if (canTransfer) {
      options.push({
        icon: faExchangeAlt,
        label: 'Transfer',
        handleClick: onTransferButtonPressed,
      });
    }
    if (canUpdate) {
      options.push({
        icon: faPen,
        label: 'Update',
        handleClick: onUpdateButtonPressed,
      });
    }
    if (canCancel) {
      options.push({
        icon: faTimes,
        label: 'Cancel',
        handleClick: onCancelButtonPressed,
      });
    }

    options.push({
      icon: faLink,
      label: 'Copy link',
      handleClick: onCopyLinkButtonPressed(new URL(nftUrl(), appConfig('urls.app'))),
    });

    return options;
  };

  return (
    <div className="card eb-nft__card h-100 shadow">
      <div className="card-img-container">
        <AnyMedia image={nftCardUrl(nft.address, nft.image)}
                  title={nft.name} url={nftUrl()}
                  newTab={true}
                  className="card-img-top marketplace"
                  height={440}
                  width={440}
                  video={nft.video ?? nft.animation_url}
                  usePlaceholder={true}
        />
      </div>
      {nft.rank && typeof nft.rank === 'number' && (
        <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>
      )}
      <div className="card-body d-flex flex-column">
        <div className="card-title mt-auto">
          <span onClick={() => navigateTo(nftUrl())} style={{ cursor: 'pointer' }}>
            {nft.count && nft.count > 0 ? (
              <Heading as="h6" size="sm">
                {nft.name} (x{nft.count})
              </Heading>
            ) : (
              <Heading as="h6" size="sm">{nft.name}</Heading>
            )}
          </span>
        </div>
        <p className="card-text">
          {nft.listed && nft.price ? (
            <div className="d-flex">
              <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
              <span className="ms-1">
                {ethers.utils.commify(round(nft.price, 2))}
              </span>
            </div>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </div>
      <div className="card-footer mynft-card-footer">
        <div>
          {isStaked && (
            <span className="mx-1">
              <strong>STAKED</strong>
            </span>
          )}
        </div>
        <MenuPopup options={getOptions()}>
          <FontAwesomeIcon icon={faEllipsisH} style={{ cursor: 'pointer' }} />
        </MenuPopup>
      </div>
    </div>
  );
};

export default memo(MyNftCard);
