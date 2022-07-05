import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Contract, ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Blockies from 'react-blockies';
import { faCrow, faExternalLinkAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Sentry from '@sentry/react';
import ReactPlayer from 'react-player';

import ProfilePreview from '../../src/Components/components/ProfilePreview';
import LayeredIcon from '../../src/Components/components/LayeredIcon';
import Footer from '../../src/Components/components/Footer';
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
  isNftBlacklisted,
} from '@src/utils';
import {specialImageTransform} from '@src/hacks';
import NFTTabOffers from '../../src/Components/Offer/NFTTabOffers';
import {appConfig} from "@src/Config";
import {hostedImage} from "@src/helpers/image";
import PageHead from "../../src/Components/Head/PageHead";

const config = appConfig();

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

  const [openMenu, setOpenMenu] = React.useState(0);
  const handleBtnClick = (index) => (element) => {
    if (typeof window === 'undefined') {
      return;
    }
    var elements = document.querySelectorAll('.tab');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
    element.target.parentElement.classList.add('active');

    setOpenMenu(index);
  };

  const showBuy = () => async () => {
    if (user.address) {
      // setBuying(true);
      try {
        let price = listing.price;
        if (typeof price === 'string') {
          price = ethers.utils.parseEther(price);
        }

        const tx = await user.marketContract.makePurchase(listing.listingId, {
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
        <section className="container">
          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        </section>
      ) : (
        <section className="container">
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
                    <ProfilePreview type="Seller" address={listing.seller} to={`/seller/${listing.seller}`} />
                    <ProfilePreview
                      type="Collection"
                      title={collection.name}
                      avatar={hostedImage(collection.metadata.avatar, true)}
                      address={listing.nftAddress}
                      verified={collection.metadata.verified}
                      to={`/collection/${collection.slug}`}
                    />
                    {typeof listing.nft.rank !== 'undefined' && listing.nft.rank !== null && (
                      <ProfilePreview
                        type="Rarity Rank"
                        title={listing.nft.rank}
                        avatar={hostedImage(
                          collection.metadata.rarity === 'rarity_sniper'
                            ? '/img/logos/rarity-sniper.png'
                            : '/img/logos/ebisu-technicolor.svg',
                          true
                        )}
                        hover={
                          collection.metadata.rarity === 'rarity_sniper'
                            ? `Ranking provided by ${humanize(collection.metadata.rarity)}`
                            : null
                        }
                        to={
                          collection.metadata.rarity === 'rarity_sniper'
                            ? `https://raritysniper.com/${collection.metadata.raritySniperSlug}/${listing.nft.id}`
                            : null
                        }
                        pop={true}
                      />
                    )}
                  </div>

                  <div className="spacer-40"></div>

                  <div className="de_tab">
                    <ul className="de_nav">
                      <li id="Mainbtn0" className="tab active">
                        <span onClick={handleBtnClick(0)}>Details</span>
                      </li>
                      {powertraits && powertraits.length > 0 && (
                        <li id="Mainbtn1" className="tab">
                          <span onClick={handleBtnClick(1)}>In-Game Attributes</span>
                        </li>
                      )}
                      <li id="Mainbtn2" className="tab">
                        <span onClick={handleBtnClick(2)}>History</span>
                      </li>
                      <li id="Mainbtn3" className="tab">
                        <span onClick={handleBtnClick(3)}>Offers</span>
                      </li>
                      {babyWeirdApeBreed && (
                        <li id="Mainbtn9" className="tab">
                          <span onClick={handleBtnClick(9)}>Breed Info</span>
                        </li>
                      )}
                    </ul>

                    <div className="de_tab_content">
                      {openMenu === 0 && (
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
                      {openMenu === 1 && (
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
                      {openMenu === 2 && (
                        <div className="tab-3 onStep fadeIn">
                          {history && history.length > 0 ? (
                            <>
                              {history.map((item, index) => (
                                <div className="p_list" key={index}>
                                  <Link href={`/seller/${item.purchaser}`}>
                                    <a>
                                      <div className="p_list_pp">
                                        <span>
                                          <span>
                                            <Blockies seed={item.purchaser} size={10} scale={5} />
                                          </span>
                                        </span>
                                      </div>
                                    </a>
                                  </Link>
                                  <div className="p_list_info">
                                    <span>{timeSince(item.saleTime + '000')} ago</span>
                                    Bought by{' '}
                                    <b>
                                      <Link href={`/seller/${item.purchaser}`}>
                                        <a>{shortAddress(item.purchaser)}</a>
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
                      {openMenu === 3 && <NFTTabOffers nftAddress={listing.nftAddress} nftId={listing.nftId} />}
                      {openMenu === 9 && babyWeirdApeBreed && (
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

      <Footer />
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

export default memo(Listing);
