import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Contract, ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { toast } from 'react-toastify';
import Blockies from 'react-blockies';
import { faCrow, faExternalLinkAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Sentry from '@sentry/react';
import ReactPlayer from 'react-player';

import ProfilePreview from '../../src/Components/components/ProfilePreview';
import LayeredIcon from '../../src/Components/components/LayeredIcon';
import { getListingDetails, listingUpdated } from '@src/GlobalState/listingSlice';
import { connectAccount, chainConnect } from '@src/GlobalState/User';
import {
  findCollectionByAddress,
  createSuccessfulTransactionToastContent,
  humanize,
  isCroCrowCollection,
  isCrosmocraftsPartsDrop,
  relativePrecision,
  shortAddress,
  timeSince,
  isCrognomidesCollection,
  isBabyWeirdApesCollection,
  isUserBlacklisted,
  isNftBlacklisted, rankingsLogoForCollection, rankingsTitleForCollection, rankingsLinkForCollection,
} from '@src/utils';
import {specialImageTransform} from '@src/hacks';
import {appConfig} from "@src/Config";
import {hostedImage} from "@src/helpers/image";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {getListing} from "@src/core/api";
import OffersTab from "@src/components-v2/feature/nft/tabs/offers";
import {OfferType} from "@src/core/services/api-service/types";
import ImageService from "@src/core/services/image";
import {Center, Spinner} from "@chakra-ui/react";

const config = appConfig();
const tabs = {
  details: 'details',
  powertraits: 'powertraits',
  history: 'history',
  offers: 'offers',
  breeding: 'breeding',
};

const Listing = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const listing = useSelector((state) => state.listing.listing);
  const history = useSelector((state) =>
    state.listing.history.filter((i) => i.state === 1).sort((a, b) => (a.saleTime < b.saleTime ? 1 : -1))
  );
  const powertraits = useSelector((state) => state.listing.powertraits);
  const isLoading = useSelector((state) => state.listing.loading);
  const user = useSelector((state) => state.user);

  const collection = useSelector((state) => {
    if (listing) {
      return findCollectionByAddress(listing.nftAddress, listing.is1155 ? listing.nftId : null);
    }
  });

  const [openCheckout, setOpenCheckout] = React.useState(false);
  // const [buying, setBuying] = useState(false);

  const [croCrowBreed, setCroCrowBreed] = useState(null);
  const [crognomideBreed, setCrognomideBreed] = useState(null);
  const [babyWeirdApeBreed, setBabyWeirdApeBreed] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      dispatch(getListingDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    async function asyncFunc() {
      if (listing && isCroCrowCollection(listing.nftAddress) && croCrowBreed === null) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const contract = new Contract(
          '0x0f1439a290e86a38157831fe27a3dcd302904055',
          [
            'function availableCrows(address _owner) public view returns (uint256[] memory, bool[] memory)',
            'function isCrowUsed(uint256 tokenId) public view returns (bool)',
          ],
          readProvider
        );
        try {
          if (listing.nftId < 3500) {
            const used = await contract.isCrowUsed(listing.nftId);
            setCroCrowBreed(used);
          } else {
            const crows = await contract.availableCrows(listing.seller);
            for (const [i, o] of crows[0].entries()) {
              if (o.toNumber() === listing.nftId) {
                setCroCrowBreed(crows[1][i]);
                return;
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setCroCrowBreed(null);
      }
    }
    asyncFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing]);

  useEffect(() => {
    async function asyncFunc() {
      if (listing && isCrognomidesCollection(listing.nftAddress) && crognomideBreed === null) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const contract = new Contract(
          '0xE57742748f98ab8e08b565160D3A9A32BFEF7352',
          ['function crognomidUsed(uint256) public view returns (bool)'],
          readProvider
        );
        try {
          const used = await contract.crognomidUsed(listing.nftId);
          setCrognomideBreed(used);
        } catch (error) {
          console.log(error);
        }
      } else {
        setCrognomideBreed(null);
      }
    }
    asyncFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing]);

  useEffect(() => {
    async function asyncFunc() {
      if (listing && isBabyWeirdApesCollection(listing.nftAddress)) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const abiFile = require(`../../src/Assets/abis/baby-weird-apes.json`);
        const contract = new Contract(listing.nftAddress, abiFile.abi, readProvider);
        try {
          const apeInfo = await contract.apeInfo(listing.nftId);
          setBabyWeirdApeBreed(apeInfo);
        } catch (error) {
          console.log(error);
        }
      } else {
        setBabyWeirdApeBreed(null);
      }
    }
    asyncFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing]);

  const fullImage = () => {
    if (listing.nft.original_image.startsWith('ipfs://')) {
      const link = listing.nft.original_image.split('://')[1];
      return `https://ipfs.io/ipfs/${link}`;
    }

    if (listing.nft.original_image.startsWith('https://gateway.ebisusbay.com')) {
      const link = listing.nft.original_image.replace('gateway.ebisusbay.com', 'ipfs.io');
      return link;
    }
  
    return listing.nft.original_image;
  };

  const [currentTab, setCurrentTab] = React.useState(0);
  const handleTabChange = useCallback((tab) => {
    setCurrentTab(tab);
  }, []);

  const showBuy = () => async () => {
    if (user.address) {
      // setBuying(true);
      try {
        let price = listing.price;
        if (typeof price === 'string') {
          price = ethers.utils.parseEther(price);
        }

        const tx = await user.contractService.market.makePurchase(listing.listingId, {
          value: price,
        });
        const receipt = await tx.wait();
        dispatch(
          listingUpdated({
            listing: {
              ...listing,
              state: 1,
              purchaser: user.address,
            },
          })
        );
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error) {
        Sentry.captureException(error);
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
      } finally {
        // setBuying(false);
      }
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

  return (
    <div>
      <PageHead
        title={listing?.nft?.name || 'Listing'}
        description={`${listing?.nft?.name || 'Listing'}`}
        url={`/listing/${id}`}
        image={listing?.nft?.image}
      />
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <section className="gl-legacy container">
          <div className="row mt-md-5 pt-md-4">
            <div className="col-md-6 text-center">
              {listing ? (
                listing.useIframe ? (
                  <iframe width="100%" height="636" src={listing.iframeSource} title="listing" />
                ) : (
                  <>
                    {listing.nft.video ? (
                      <ReactPlayer
                        controls={true}
                        url={listing.nft.video}
                        config={{
                          file: {
                            attributes: {
                              onContextMenu: (e) => e.preventDefault(),
                              controlsList: 'nodownload',
                            },
                          },
                        }}
                        muted={true}
                        playing={true}
                        loop={true}
                        width="100%"
                        height="auto"
                      />
                    ) : (
                      <img
                        src={specialImageTransform(listing.nftAddress, listing.nft.image)}
                        className="img-fluid img-rounded mb-sm-30"
                        alt={listing.nft.name}
                      />
                    )}
                  </>
                )
              ) : (
                <></>
              )}
              {listing && listing.nft.original_image && (
                <div className="nft__item_action mt-2" style={{ cursor: 'pointer' }}>
                  <span
                    onClick={() =>
                      typeof window !== 'undefined' &&
                      window.open(specialImageTransform(listing.nftAddress, fullImage()), '_blank')
                    }
                  >
                    <span className="p-2">View Full Image</span>
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </span>
                </div>
              )}
            </div>
            <div className="col-md-6">
              {listing && (
                <div className="item_info">
                  <h2>{listing.nft.name}</h2>
                  <h3>{ethers.utils.commify(listing.price)} CRO</h3>
                  <p>{listing.nft.description}</p>
                  {isCroCrowCollection(listing.nftAddress) && croCrowBreed && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faCrow}
                        bgColor={'#ed7a11'}
                        color={'#000'}
                        inverse={false}
                        title="This crow has been bred to create a CrowPunk!"
                      />
                      <span className="fw-bold">This CRO Crow has been bred for a CrowPunk</span>
                    </div>
                  )}
                  {isCrognomidesCollection(listing.nftAddress) && crognomideBreed && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faHeart}
                        bgColor={'#fff'}
                        color={'#dc143c'}
                        inverse={false}
                        title="This Crognomide has been bred for a Croby!"
                      />
                      <span className="fw-bold">This Crognomide has been bred for a Croby</span>
                    </div>
                  )}
                  <div className="row" style={{ gap: '2rem 0' }}>
                    <ProfilePreview type="Seller" address={listing.seller} to={`/account/${listing.seller}`} />
                    <ProfilePreview
                      type="Collection"
                      title={collection.name}
                      avatar={ImageService.translate(collection.metadata.avatar).avatar()}
                      address={listing.nftAddress}
                      verified={collection.verification.verified}
                      to={`/collection/${collection.slug}`}
                    />
                    {typeof listing.nft.rank !== 'undefined' && listing.nft.rank !== null && (
                      <ProfilePreview
                        type="Rarity Rank"
                        title={listing.nft.rank}
                        avatar={rankingsLogoForCollection(collection)}
                        hover={rankingsTitleForCollection(collection)}
                        to={rankingsLinkForCollection(collection)}
                        pop={true}
                      />
                    )}
                  </div>

                  <div className="spacer-40"></div>

                  <div className="de_tab">
                    <ul className="de_nav">
                      <li className={`tab ${currentTab === tabs.details ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.details)}>Details</span>
                      </li>
                      {powertraits && powertraits.length > 0 && (
                        <li className={`tab ${currentTab === tabs.powertraits ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.powertraits)}>In-Game Attributes</span>
                        </li>
                      )}
                      <li className={`tab ${currentTab === tabs.history ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.history)}>History</span>
                      </li>
                      <li className={`tab ${currentTab === tabs.offers ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.offers)}>Offers</span>
                      </li>
                      {babyWeirdApeBreed && (
                        <li className={`tab ${currentTab === tabs.breeding ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.breeding)}>Breed Info</span>
                        </li>
                      )}
                    </ul>

                    <div className="de_tab_content">
                      {currentTab === 0 && (
                        <div className="tab-1 onStep fadeIn">
                          {(listing.nft.attributes &&
                            Array.isArray(listing.nft.attributes) &&
                            listing.nft.attributes.length > 0) ||
                          (listing.nft.properties &&
                            Array.isArray(listing.nft.properties) &&
                            listing.nft.properties.length > 0) ? (
                            <>
                              <div className="d-block mb-3">
                                <div className="row mt-5 gx-3 gy-2">
                                  {listing.nft.attributes &&
                                    Array.isArray(listing.nft.attributes) &&
                                    listing.nft.attributes
                                      .filter((data) => data.value !== 'None')
                                      .map((data, i) => {
                                        return (
                                          <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                            <div className="nft_attr">
                                              <h5>{humanize(data.trait_type)}</h5>
                                              <h4>
                                                {data.value !== undefined ? (
                                                  <>
                                                    {data?.display_type === 'date' ? (
                                                      <>{(new Date(data.value * 1000)).toDateString()}</>
                                                    ) : (
                                                      <>{humanize(data.value)}</>
                                                    )}
                                                  </>
                                                ) : (
                                                  <>N/A</>
                                                )}
                                              </h4>
                                              {data.occurrence ? (
                                                <span>{relativePrecision(data.occurrence)}% have this trait</span>
                                              ) : (
                                                data.percent && <span>{data.percent}% have this trait</span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  {listing.nft.properties &&
                                    Array.isArray(listing.nft.properties) &&
                                    listing.nft.properties.map((data, i) => {
                                      return (
                                        <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                          <div className="nft_attr">
                                            <h5>{humanize(data.trait_type)}</h5>
                                            <h4>
                                              {humanize(
                                                isCrosmocraftsPartsDrop(collection.address) ? data.Value : data.value
                                              )}
                                            </h4>
                                            <h4>
                                              {data.value !== undefined ? (
                                                <>
                                                  {data?.display_type === 'date' ? (
                                                    <>{(new Date(data.value * 1000)).toDateString()}</>
                                                  ) : (
                                                    <>
                                                      {humanize(
                                                      isCrosmocraftsPartsDrop(collection.address) ? data.Value : data.value
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <>N/A</>
                                              )}
                                            </h4>
                                            {data.occurrence ? (
                                              <span>{relativePrecision(data.occurrence)}% have this trait</span>
                                            ) : (
                                              data.percent && <span>{data.percent}% have this trait</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <span>No traits found for this item</span>
                            </>
                          )}
                        </div>
                      )}
                      {currentTab === 1 && (
                        <div className="tab-2 onStep fadeIn">
                          {powertraits && powertraits.length > 0 ? (
                            <>
                              <div className="d-block mb-3">
                                <div className="row mt-5 gx-3 gy-2">
                                  {powertraits.map((data, i) => {
                                    return (
                                      <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="nft_attr">
                                          <h5>{data.trait_type}</h5>
                                          <h4>{data.value > 0 ? <>+ {data.value}</> : <>{data.value}</>}</h4>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <span>No in-game attributes found for this item</span>
                            </>
                          )}
                        </div>
                      )}
                      {currentTab === 2 && (
                        <div className="tab-3 onStep fadeIn">
                          {history && history.length > 0 ? (
                            <>
                              {history.map((item, index) => (
                                <div className="p_list" key={index}>
                                  <Link href={`/account/${item.purchaser}`}>
                                    <div className="p_list_pp">
                                      <span>
                                        <span>
                                          <Blockies seed={item.purchaser} size={10} scale={5} />
                                        </span>
                                      </span>
                                    </div>
                                  </Link>
                                  <div className="p_list_info">
                                    <span>{timeSince(item.saleTime)} ago</span>
                                    Bought by{' '}
                                    <b>
                                      <Link href={`/account/${item.purchaser}`}>
                                        {shortAddress(item.purchaser)}
                                      </Link>
                                    </b>{' '}
                                    for <b>{ethers.utils.commify(item.price)} CRO</b>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              <span>No history found for this item</span>
                            </>
                          )}
                        </div>
                      )}
                      {currentTab === 3 && (
                        <OffersTab
                          nftAddress={listing.nftAddress}
                          nftId={listing.nftId}
                          type={OfferType.DIRECT}
                        />
                      )}
                      {currentTab === 9 && babyWeirdApeBreed && (
                        <div className="tab-2 onStep fadeIn">
                          <div className="d-block mb-3">
                            <div className="row mt-5 gx-3 gy-2">
                              {babyWeirdApeBreed.breedStatus ? (
                                <div key={0} className="col-lg-4 col-md-6 col-sm-6">
                                  <div className="nft_attr">
                                    <h5>Birthdate</h5>
                                    {babyWeirdApeBreed.birthdate.gt(0) ? (
                                      <h4>
                                        {new Date(babyWeirdApeBreed.birthdate.toNumber() * 1000).toLocaleDateString()}
                                      </h4>
                                    ) : (
                                      <h4>Unknown</h4>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div key={0} className="col-lg-4 col-md-6 col-sm-6">
                                  <div className="nft_attr">
                                    <h5>Incubator ID</h5>
                                    <h4>{listing.nftId}</h4>
                                  </div>
                                </div>
                              )}
                              <div key={1} className="col-lg-4 col-md-6 col-sm-6">
                                <div className="nft_attr">
                                  <h5>Mother ID</h5>
                                  <h4>{babyWeirdApeBreed.mother.toNumber()}</h4>
                                </div>
                              </div>
                              <div key={2} className="col-lg-4 col-md-6 col-sm-6">
                                <div className="nft_attr">
                                  <h5>Father ID</h5>
                                  <h4>
                                    <a href={`/collection/weird-apes-club-v2/${babyWeirdApeBreed.father.toNumber()}`}>
                                      {babyWeirdApeBreed.father.toNumber()}
                                    </a>
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* button for checkout */}
                      {!isUserBlacklisted(listing.seller) && !isNftBlacklisted(listing.nftAddress, listing.nftId) && (
                        <>
                          {listing.state === 0 ? (
                            <div className="d-flex flex-row mt-5">
                              <button className="btn-main lead mb-5 mr15" onClick={showBuy()}>
                                Buy Now
                              </button>
                            </div>
                          ) : (
                            <div className="mt-5">LISTING HAS BEEN {listing.state === 1 ? 'SOLD' : 'CANCELLED'}</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {openCheckout && user && (
        <div className="checkout">
          <div className="maincheckout">
            <button className="btn-close" onClick={() => setOpenCheckout(false)}>
              x
            </button>
            <div className="heading">
              <h3>Checkout</h3>
            </div>
            <p>
              You are about to purchase a <span className="bold">{listing.nft.name}</span>
            </p>
            <div className="heading mt-3">
              <p>Your balance</p>
              <div className="subtotal">{ethers.utils.formatEther(user.balance)} CRO</div>
            </div>
            <div className="heading">
              <p>Service fee 2.5%</p>
              <div className="subtotal">0.00325 ETH</div>
            </div>
            <div className="heading">
              <p>You will pay</p>
              <div className="subtotal">0.013325 ETH</div>
            </div>
            <button className="btn-main lead mb-5">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};


export const getServerSideProps = async ({ params, query }) => {

  if (!query.id) {
    return {
      notFound: true
    }
  }
  let listing = await getListing(query.id);

  if (!listing) {
    return {
      notFound: true
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: `/collection/${listing.nftAddress}/${listing.nftId}`
    }
  }
}
export default memo(Listing);

