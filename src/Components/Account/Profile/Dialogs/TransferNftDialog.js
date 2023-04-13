import React, {useState, useCallback, useEffect} from 'react';
import {Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Contract} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import * as Sentry from '@sentry/react';
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {specialImageTransform} from "@src/hacks";
import {ERC1155, ERC721} from "@src/Contracts/Abis";
import {getCnsAddress, isCnsName} from "@src/helpers/cns";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import {is1155} from "@src/helpers/chain";

export default function TransferNftDialog({ isOpen, nft, onClose }) {
  const [recipientAddress, setRecipientAddress] = useState(null);
  const [fieldError, setFieldError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [executingTransferNft, setExecutingTransferNft] = useState(false);
  const [executingCnsLookup, setExecutingCnsLookup] = useState(false);

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

      let targetAddress = recipientAddress;
      if (isCnsName(recipientAddress)) {
        setExecutingCnsLookup(true);
        const cnsAddress = await getCnsAddress(recipientAddress);
        if (cnsAddress) {
          targetAddress = cnsAddress;
          setExecutingCnsLookup(false);
        } else {
          setFieldError('No matching profiles for this CNS name');
          setExecutingCnsLookup(false);
          return;
        }
      }

      setExecutingTransferNft(true);
      Sentry.captureEvent({message: 'handleTransfer', extra: {address: nftAddress, targetAddress}});

      let tx;
      if (await is1155(nftAddress)) {
        const contract = new Contract(nftAddress, ERC1155, user.provider.getSigner());
        tx = await contract.safeTransferFrom(user.address, targetAddress, nftId, 1, []);
      } else {
        const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
        tx = await contract.safeTransferFrom(user.address, targetAddress, nftId);
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
      setExecutingCnsLookup(false);
    }
  };

  const validateInput = () => {
    if (!recipientAddress || (!recipientAddress.endsWith('.cro') && !recipientAddress.startsWith('0x'))) {
      setFieldError('Please enter a valid Cronos address or CNS name');
      return false;
    }

    setFieldError(null);
    return true;
  }

  if (!nft) return <></>;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center">
              Transfer {nft.name}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
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
                        Recipient Address or CNS Name
                      </Form.Label>
                      <Form.Control
                        className="input"
                        type="text"
                        placeholder="Address or CNS name"
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
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="w-100">
                {executingTransferNft && (
                  <div className="mb-2 text-center fst-italic">
                    <small>Please check your wallet for confirmation</small>
                  </div>
                )}
                <div className="d-flex">
                  <Button type="legacy"
                          onClick={handleTransfer}
                          isLoading={executingTransferNft || executingCnsLookup}
                          disabled={executingTransferNft || executingCnsLookup}
                          className="flex-fill">
                    Confirm Transfer
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        ) : (
          <EmptyData>
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </EmptyData>
        )}
      </ModalContent>
    </Modal>
  );
}
