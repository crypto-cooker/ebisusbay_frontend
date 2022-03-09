import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';

import Button from 'src/Components/components/Button';
import Input from 'src/Components/components/common/Input';
import ProfilePreview from 'src/Components/components/ProfilePreview';
import { croSkullRedPotionImageHack } from 'src/hacks';
import { humanize, shortAddress } from 'src/utils';
import CloseIcon from 'src/Assets/images/close-icon-orange-grad.svg';

const DialogContainer = styled(Dialog)`
  .MuiDialogContent-root {
    padding: 15px 42px 28px !important;
    border-radius: 8px;
    width: 734px;
  }
`;

const DialogTitleContainer = styled(DialogTitle)`
  font-size: 32px !important;
  color: ${({ theme }) => theme.colors.textColor3};
  padding: 0px !important;
  margin-bottom: 24px !important;
  font-weight: bold !important;
  text-align: center;
`;

const DialogMainContent = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const ImageContainer = styled.div`
  width: 232px;
  height: 232px;
  margin-top: 6px;

  img {
    width: 100%;
    height: 100%;
  }
`;

const NftDetailContainer = styled.div`
  width: 50%;
`;

const NftTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textColor3};
`;

const NftDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textColor3};
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
`;

const Royalty = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textColor3};
`;

const OfferPrice = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textColor3};
`;

const OfferPriceInput = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textColor3};
`;

const CloseIconContainer = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;

  img {
    width: 28px;
  }
`;

export default function MakeOfferDialog({ isOpen, toggle, nftData, address, collectionMetadata }) {
  const [offerPrice, setOfferPrice] = useState(0);
  const onOfferValueChange = (inputEvent) => {
    setOfferPrice(inputEvent.target.value);
  };

  const handleMakeOffer = () => {};

  return (
    <DialogContainer onClose={toggle} open={isOpen} maxWidth="md">
      <DialogContent>
        <DialogTitleContainer>Make offer</DialogTitleContainer>
        <DialogMainContent>
          <ImageContainer>
            <img src={croSkullRedPotionImageHack(nftData.nftAddress, nftData.nft.image)} alt={nftData.nft.name} />
          </ImageContainer>
          <NftDetailContainer>
            <NftTitle>{nftData.nft.name}</NftTitle>
            <NftDescription>{nftData.nft.description}</NftDescription>
            <FlexRow className="row">
              <div className="item_info">
                <div className="row" style={{ gap: '2rem 0' }}>
                  <ProfilePreview
                    type="Collection"
                    title={address && shortAddress(address)}
                    avatar={collectionMetadata?.avatar}
                    address={address}
                    verified={collectionMetadata?.verified}
                    to={`/collection/${address}`}
                  />

                  {typeof nftData.nft.rank !== 'undefined' && nftData.nft.rank !== null && (
                    <ProfilePreview
                      type="Rarity Rank"
                      title={nftData.nft.rank}
                      avatar={collectionMetadata?.rarity === 'rarity_sniper' ? '/img/rarity-sniper.png' : null}
                      hover={
                        collectionMetadata?.rarity === 'rarity_sniper'
                          ? `Ranking provided by ${humanize(collectionMetadata.rarity)}`
                          : null
                      }
                    />
                  )}
                </div>
              </div>
            </FlexRow>
            <FlexRow>
              <Royalty>Royalty</Royalty>
              <Royalty>{nftData.royalty}</Royalty>
            </FlexRow>
            <FlexRow>
              <OfferPrice>Offer Price</OfferPrice>
              <OfferPriceInput>
                <Input
                  type="number"
                  className="mx-2"
                  onKeyDown={(e) => {
                    if (e.code === 'Period') {
                      e.preventDefault();
                    }
                  }}
                  onChange={onOfferValueChange}
                />
                CRO
              </OfferPriceInput>
            </FlexRow>
            <div>
              <Button onClick={handleMakeOffer}>Make Offer</Button>
            </div>
          </NftDetailContainer>
        </DialogMainContent>
        <CloseIconContainer onClick={toggle}>
          <img src={CloseIcon} alt="close" />
        </CloseIconContainer>
      </DialogContent>
    </DialogContainer>
  );
}
