import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {specialImageTransform} from "@src/hacks";
import {Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Contract, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {ERC721} from "@src/Contracts/Abis";
import {createSuccessfulTransactionToastContent, isNftBlacklisted} from "@src/utils";
import {appConfig} from "@src/Config";
import Market from "@src/Contracts/Marketplace.json";
import * as Sentry from '@sentry/react';
import {txExtras} from "@src/core/constants";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import Select from "react-select";
import {getTheme} from "@src/Theme/theme";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import Image from "next/image";
import {commify} from "ethers/lib/utils";
import {getAllCollectionOffers} from "@src/core/subgraph";
import {getCollectionMetadata} from "@src/core/api";

const config = appConfig();
const floorThreshold = 5;

export default function InstantSellDialog({ onClose, isOpen, collection}) {

  const [error, setError] = useState(null);
  const [offer, setOffer] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const [floorPrice, setFloorPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isTransferApproved, setIsTransferApproved] = useState(false);
  const [executingApproval, setExecutingApproval] = useState(false);
  const [executingAcceptOffer, setExecutingAcceptOffer] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // Collection Offer state
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [chosenCollectionNft, setChosenCollectionNft] = useState(null);

  const user = useSelector((state) => state.user);
  const {marketContract, offerContract} = user;

  const isBelowFloorPrice = (price) => {
    return (floorPrice !== 0 && ((floorPrice - Number(price)) / floorPrice) * 100 > floorThreshold);
  };

  const getYouReceiveViewValue = () => {
    const youReceive = salePrice - (fee / 100) * salePrice - (royalty / 100) * salePrice;
    try {
      return ethers.utils.commify(youReceive.toFixed(2));
    } catch (e) {
      return youReceive
    }
  };

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (user.provider) {
      asyncFunc();
    }
  }, [user.provider]);

  const wrappedMarketContract = () => {
    return marketContract ?? new Contract(config.contracts.market, Market.abi, user.provider.getSigner());
  };

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      const marketContractAddress = config.contracts.market;
      const marketContract = wrappedMarketContract();

      const walletNfts = await getQuickWallet(user.address, {pageSize: 1000, collection:collection.address});
      setCollectionNfts(walletNfts.data.filter((nft) => !isNftBlacklisted(nft.address ?? nft.nftAddress, nft.id ?? nft.nftId)));

      const offers = await getAllCollectionOffers([collection.address], '0', 0);

      if (offers.data.length < 1) {
        setError('No offers were found on this collection');
        return;
      }
      if (walletNfts.data.length < 1) {
        setError('You do not have any NFTs from this collection');
        return;
      }

      const floorPrice = await getCollectionMetadata(collection.address);
      if (floorPrice.collections.length > 0) {
        setFloorPrice(floorPrice.collections[0].floorPrice ?? 0);
      }

      const highestOffer = offers.data.sort((a, b) => parseInt(a.price) < parseInt(b.price) ? 1 : -1)[0];
      setOffer(highestOffer);
      setSalePrice(Math.round(highestOffer.price))
      await chooseCollectionNft(walletNfts.data[0])

      const fees = await marketContract.fee(user.address);
      setFee((fees / 10000) * 100);

      const contract = new Contract(collection.address, ERC721, user.provider.getSigner());
      const transferEnabled = await contract.isApprovedForAll(user.address, marketContractAddress);

      if (transferEnabled) {
        setIsTransferApproved(true);
      } else {
        setIsTransferApproved(false);
      }
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (e) => {
    e.preventDefault();
    try {
      const marketContractAddress = marketContract.address;
      const contract = new Contract(collection.address, ERC721, user.provider.getSigner());
      setExecutingApproval(true);
      const tx = await contract.setApprovalForAll(marketContractAddress, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setIsTransferApproved(true);

    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    } finally {
      setExecutingApproval(false);
    }
  };

  const handleAcceptOffer = async (e) => {
    e.preventDefault();

    try {
      const price = ethers.utils.parseEther(salePrice.toString());

      setExecutingAcceptOffer(true);
      Sentry.captureEvent({message: 'handleInstantSell', extra: {nftAddress: collection.address, price}});
      const tx = await offerContract.acceptCollectionOffer(offer.nftAddress, offer.offerIndex, chosenCollectionNft.nftId, txExtras);

      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingAcceptOffer(false);
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
      setExecutingAcceptOffer(false);
    }
  };

  const processAcceptOfferRequest = async (e) => {
    if (isBelowFloorPrice(salePrice)) {
      setShowConfirmButton(true);
    } else {
      await handleAcceptOffer(e)
    }
  }

  const chooseCollectionNft = async (nft) => {
    setChosenCollectionNft(nft);
    const royalties = await collectionRoyaltyPercent(nft.address ?? nft.nftAddress, nft.id ?? nft.nftId);
    setRoyalty(royalties);
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Sell Instantly
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        {!isLoading ? (
          <>
            {error ? (
              <div className="text-center mb-2" style={{fontSize: '14px'}}>
                {error}
              </div>
            ) : (
              <>
                <ModalBody>
                  <div className="text-center mb-2" style={{fontSize: '14px'}}>
                    Instantly sell any of your {collection.name} NFTs at the highest offer price.
                  </div>
                  <div className="nftSaleForm row gx-3">
                    <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                      <NftPicker
                        nfts={collectionNfts}
                        initialNft={chosenCollectionNft}
                        onSelect={(n) => chooseCollectionNft(n)}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2 mt-sm-0">
                      <div className="mb-4 text-center">
                        <div className="fs-6">Offer Price</div>
                        <div className="fs-2 fw-bold">
                          <div className="d-flex justify-content-center">
                            <Image src="/img/logos/cdc_icon.svg" width={32} height={32} />
                            <span className="ms-1">
                          {commify(offer.price)}
                        </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="feeTitle">Fees</h3>
                        <hr />
                        <div className="fee">
                          <span>Service Fee: </span>
                          <span>{fee} %</span>
                        </div>
                        <div className="fee">
                          <span>Royalty Fee: </span>
                          <span>{royalty} %</span>
                        </div>
                        <div className="fee">
                          <span className='label'>You receive: </span>
                          <span>{getYouReceiveViewValue()} CRO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="border-0">
                  <div className="w-100">
                    {isTransferApproved ? (
                      <>
                        {showConfirmButton ? (
                          <>
                            <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                              This offer is {(100 - (salePrice * 100 / floorPrice)).toFixed(1)}% below the current floor price of {floorPrice} CRO. Are you sure?
                            </div>
                            {executingAcceptOffer && (
                              <div className="mb-2 text-center fst-italic">Please check your wallet for confirmation</div>
                            )}
                            <div className="d-flex">
                              <Button type="legacy"
                                      onClick={() => setShowConfirmButton(false)}
                                      className="me-2 flex-fill">
                                Go Back
                              </Button>
                              <Button type="legacy-outlined"
                                      onClick={handleAcceptOffer}
                                      isLoading={executingAcceptOffer}
                                      disabled={executingAcceptOffer}
                                      className="flex-fill">
                                I understand, continue
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            {executingAcceptOffer && (
                              <div className="mb-2 text-center fst-italic">
                                <small>Please check your wallet for confirmation</small>
                              </div>
                            )}
                            <div className="d-flex">
                              <Button type="legacy"
                                      onClick={processAcceptOfferRequest}
                                      isLoading={executingAcceptOffer}
                                      disabled={!chosenCollectionNft || executingAcceptOffer}
                                      className="flex-fill">
                                Accept Offer
                              </Button>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mb-2 text-center fst-italic">
                          <small>Ebisu's Bay needs approval to transfer this NFT on your behalf upon accepting</small>
                        </div>
                        <div className="d-flex justify-content-end">
                          <Button type="legacy"
                                  onClick={handleApproval}
                                  isLoading={executingApproval}
                                  disabled={executingApproval}
                                  className="flex-fill">
                            Approve
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </ModalFooter>
              </>
            )}
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




const ImageContainer = styled.div`
  width: 232px;
  height: auto;
  margin-top: 6px;
  text-align: center;

  img {
    width: 100%;
    border-radius: 6px;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: auto;
    margin-bottom: 10px;
  }
`;
const NftPicker = ({collectionAddress, nfts, onSelect, initialNft}) => {
  const userTheme = useSelector((state) => state.user.theme);
  const [chosenNft, setChosenNft] = useState(initialNft);

  const handleNftChange = useCallback((chosenNft) => {
    setChosenNft(chosenNft);
    onSelect(chosenNft);
  }, [chosenNft]);

  const customStyles = {
    option: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
    input: (base, state) => ({
      ...base,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
    noOptionsMessage: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
    })
  };

  return (
    <>
      <ImageContainer className="mx-auto">
        <img src={specialImageTransform(collectionAddress, chosenNft.image)} alt={chosenNft.name} />
      </ImageContainer>
      <h3 className="feeTitle mt-2">Choose NFT</h3>
      <Select
        menuPlacement="top"
        maxMenuHeight="200px"
        styles={customStyles}
        placeholder="Choose NFT"
        options={nfts.sort((a, b) => (a.name ?? a.nftId) > (b.name ?? b.nftId) ? 1 : -1)}
        getOptionLabel={(option) => option.name ?? option.nftId}
        getOptionValue={(option) => option}
        value={chosenNft}
        defaultValue={nfts[0]}
        onChange={handleNftChange}
      />
    </>
  );

}