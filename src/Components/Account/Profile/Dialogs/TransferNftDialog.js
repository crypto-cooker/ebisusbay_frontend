import React, {useState, useCallback, useEffect} from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {Badge, Col, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Contract, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {txExtras} from "@src/core/constants";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {appConfig} from "@src/Config";
import Offer from "@src/Contracts/Offer.json";
import Market from "@src/Contracts/Marketplace.json";
import {useWindowSize} from "@src/hooks/useWindowSize";
import * as Sentry from '@sentry/react';
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {getMyCollectionOffers} from "@src/core/subgraph";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {specialImageTransform} from "@src/hacks";
import {ERC1155, ERC721} from "@src/Contracts/Abis";

const DialogContainer = styled(Dialog)`
  .MuiPaper-root {
    border-radius: 8px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.bgColor1};
  }

  .MuiDialogContent-root {
    width: 700px;
    padding: 15px 42px 28px !important;
    border-radius: 8px;
    max-width: 734px;
    background-color: ${({ theme }) => theme.colors.bgColor1};
    color: ${({ theme }) => theme.colors.textColor3};

    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
      width: 100%;
    }
  }
`;

const DialogTitleContainer = styled(DialogTitle)`
  font-size: 26px !important;
  color: ${({ theme }) => theme.colors.textColor3};
  padding: 0px !important;
  margin-bottom: 18px !important;
  font-weight: bold !important;
  text-align: center;<
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

export default function TransferNftDialog({ isOpen, nft, onClose }) {
  const [recipientAddress, setRecipientAddress] = useState(null);
  const [fieldError, setFieldError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [executingTransferNft, setExecutingTransferNft] = useState(false);

  const user = useSelector((state) => state.user);

  const onChangeAddress = useCallback((e) => {
    const newSalePrice = e.target.value.toString();
    setRecipientAddress(newSalePrice)
  }, [setRecipientAddress, recipientAddress]);

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (nft && user.provider) {
      asyncFunc();
    }
  }, [nft, user.provider]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setFieldError(null);

      setIsLoading(false);
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;

      setExecutingTransferNft(true);
      Sentry.captureEvent({message: 'handleTransfer', extra: {address: nftAddress, recipientAddress}});

      let tx;
      if (nft.multiToken) {
        const contract = new Contract(nftAddress, ERC1155, user.provider.getSigner());
        tx = await contract.safeTransferFrom(user.address, recipientAddress, nftId, 1, []);
      } else {
        const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
        tx = await contract.safeTransferFrom(user.address, recipientAddress, nftId);
      }

      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingTransferNft(false);
      onClose();
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingTransferNft(false);
    }
  };

  const validateInput = () => {
    if (!recipientAddress) {
      setFieldError('Please enter a receipient address');
      return false;
    }

    setFieldError(null);
    return true;
  }

  if (!nft) return <></>;

  return (
    <DialogContainer onClose={onClose} open={isOpen} maxWidth="md">
      <DialogContent>
        {!isLoading ? (
          <>
            <DialogTitleContainer className="fs-5 fs-md-3">
              Transfer {nft.name}
            </DialogTitleContainer>
            <div className="nftSaleForm row gx-3">
              <div className="col-12 col-sm-4 mb-sm-3">
                <AnyMedia
                  image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                  video={nft.video ?? nft.animation_url}
                  videoProps={{ height: 'auto', autoPlay: true }}
                  title={nft.name}
                  usePlaceholder={false}
                  className="img-fluid img-rounded"
                />
              </div>
              <div className="col-12 col-sm-8 my-auto">
                <div className="mt-4 mt-sm-0 mb-3 mb-sm-0">
                  <Form.Group className="form-field">
                    <Form.Label className="formLabel w-100">
                      Recipient Address
                    </Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      placeholder="Enter Address"
                      value={recipientAddress}
                      onChange={onChangeAddress}
                      disabled={executingTransferNft}
                    />
                    <Form.Text className="field-description textError">
                      {fieldError}
                    </Form.Text>
                  </Form.Group>
                </div>
                {nft.multiToken && (
                  <div className="text-center my-3 text-muted" style={{fontSize: '14px'}}>
                    This is a CRC-1155 token. Tokens of this type are limited to a quantity of one per transaction at this time
                  </div>
                )}
              </div>

              <div className="mt-3 mx-auto">
                {executingTransferNft && (
                  <div className="mb-2 text-center fst-italic">
                    <small>Please check your wallet for confirmation</small>
                  </div>
                )}
                <div className="d-flex">
                  <Button type="legacy"
                          onClick={handleTransfer}
                          isLoading={executingTransferNft}
                          disabled={executingTransferNft}
                          className="flex-fill">
                    Confirm Transfer
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyData>
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </EmptyData>
        )}
        <CloseIconContainer onClick={onClose}>
          <img src="/img/icons/close-icon-blue.svg" alt="close" width="40" height="40" />
        </CloseIconContainer>
      </DialogContent>
    </DialogContainer>
  );
}
