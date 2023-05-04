import React, {useState, useCallback, useEffect, memo} from 'react';
import {
  faCheck,
  faCircle,
  faCircleQuestion,
  faDollarSign,
  faStairs, faStar
} from "@fortawesome/free-solid-svg-icons";
import {Accordion, Badge, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {
  createSuccessfulTransactionToastContent, isBundle, isNftBlacklisted,
  isNumeric,
  mapAttributeString,
  round,
  shortString,
  stripSpaces
} from "@src/utils";
import * as Sentry from '@sentry/react';
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import DotIcon from "@src/Components/components/DotIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ListingsQuery} from "@src/core/api/queries/listings";
import {commify, parseUnits} from "ethers/lib/utils";
import useBreakpoint from "use-breakpoint";
import {getListings} from "@src/core/api/endpoints/listings";
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Lazy, Navigation} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Tooltip
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import useBuyGaslessListings from "@src/hooks/useBuyGaslessListings";
import ImageService from "@src/core/services/image";

const numberRegexValidation = /[^0-9]/g;
const sweepType = {
  quantity: 'quantity',
  budget: 'budget',
  custom: 'custom'
};
const BREAKPOINTS = { xs: 0, sm: 576, m: 768, l: 1199, xl: 1200 };
const maxSweepCount = 40;

export default function SweepFloorDialog({ isOpen, collection, onClose, activeFilters, fullscreen = false }) {
  const [sweepError, setSweepError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [tab, setTab] = useState(activeFilters.isEmpty() ? sweepType.quantity : sweepType.custom);
  const [adjustLayout, setAdjustLayout] = useState(false);

  // Workflow
  const [isLoading, setIsLoading] = useState(true);
  const [executingSweepFloor, setExecutingSweepFloor] = useState(false);
  const [executingSearch, setExecutingSearch] = useState(false);

  // Form Fields
  const [budget, setBudget] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [maxPricePerItem, setMaxPricePerItem] = useState(null);
  const [autoSwapItems, setAutoSwapItems] = useState(true);

  // Confirmation States
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [confirmationCost, setConfirmationCost] = useState(0);
  const [confirmationItems, setConfirmationItems] = useState([]);

  const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS);
  const user = useSelector((state) => state.user);
  const [buyGaslessListings, response] = useBuyGaslessListings();

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (collection && user.provider) {
      asyncFunc();
    }
  }, [collection, user.provider]);

  useEffect(() => {
    const isMobileSize = minWidth < BREAKPOINTS.sm;
    setAdjustLayout(isMobileSize);
  }, [breakpoint]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setSweepError(null);
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

  const retrieveEligibleListings = async () => {
    let query;
    let limit = maxSweepCount;
    if (tab === sweepType.custom) {
      query = ListingsQuery.fromCollectionFilter(activeFilters.toQuery());
      limit = quantity <= maxSweepCount ? quantity : maxSweepCount;
    } else if (tab === sweepType.quantity) {
      query = new ListingsQuery();
      limit = quantity <= maxSweepCount ? quantity : maxSweepCount;
    } else if (tab === sweepType.budget) {
      query = new ListingsQuery();
      limit = maxSweepCount;
    }
    query.page = 1;
    query.pageSize = limit;
    query.sortBy = 'price';
    query.direction = 'asc';
    query.collection = collection.address;

    const listingsResults = await getListings(query);
    const listings = listingsResults.data.listings;

    let filteredListings = listings.filter((listing) => !isNftBlacklisted(listing.nftAddress, listing.nftId));

    //
    if ([sweepType.quantity, sweepType.budget].includes(tab) && parseInt(maxPricePerItem) > 0) {
      filteredListings = listings.filter((listing) => parseInt(listing.price) <= maxPricePerItem);
    }

    let listingIds = [];
    if ([sweepType.budget, sweepType.custom].includes(tab) && parseInt(budget) > 0) {
      filteredListings.reduce((prev, curr) => {
        const price = parseInt(curr.price);
        if (prev + price <= parseInt(budget)) {
          listingIds.push(curr.listingId);
          return prev + price;
        }
      }, 0);
      filteredListings = filteredListings.filter((listing) => listingIds.includes(listing.listingId));
    }

    return filteredListings;
  }

  const handleSweepFloor = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const collectionAddress = collection.address;

      setExecutingSweepFloor(true);
      Sentry.captureEvent({message: 'handleSweepFloor', extra: {address: collectionAddress}});

      let filteredListings = confirmationItems;
      if (autoSwapItems) {
        filteredListings = await retrieveEligibleListings();
      }

      const listingIds = filteredListings.map((listing) => listing.listingId);
      const totalCost = filteredListings.reduce((p, n) => p + parseInt(n.price), 0);

      await buyGaslessListings(listingIds, totalCost)

      setExecutingSweepFloor(false);
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
      setExecutingSweepFloor(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSweepError(null);
      setExecutingSearch(true);
      const eligibleListings = await retrieveEligibleListings();
      setConfirmationItems(eligibleListings);
      if (eligibleListings.length > 0) {
        setConfirmationCost(eligibleListings.reduce((p, n) => p + parseInt(n.price), 0));
        setShowConfirmButton(true);
      } else {
        setSweepError('There are no eligible items to sweep')
      }
    } catch (e) {
      setShowConfirmButton(false);
      setSweepError('Error while retrieving items to sweep')
    } finally {
      setExecutingSearch(false);
    }
  }

  const validateForm = () => {
    let errors = {};
    if (tab === sweepType.quantity && !quantity) {
      errors.quantity = 'Quantity is required';
    }
    if (tab === sweepType.budget && !budget) {
      errors.budget = 'Budget is required';
    }
    setFormErrors(errors);
    return !Object.keys(errors).length > 0;
  }

  const changeTab = (newTab) => {
    if (showConfirmButton) return;
    setFormErrors({});
    setTab(newTab);
  };

  if (!collection) return <></>;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size={fullscreen ? 'full' : '2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center">
              Sweep {collection.name}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <div className="text-center mb-2" style={{fontSize: '14px'}}>
                 Quickly sweep NFTs off the floor
              </div>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                  <div className="profile_avatar d-flex justify-content-center">
                    <div className="dialog_avatar position-relative">
                      {collection.metadata.avatar ? (
                        <img src={hostedImage(collection.metadata.avatar)} alt={collection.name} style={{background:'white'}}/>
                      ) : (
                        <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
                      )}
                      {collection.verification.verified && (
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                      )}
                    </div>
                  </div>
                  {tab === sweepType.custom && !adjustLayout && (
                    <ActiveFiltersField activeFilters={activeFilters} collection={collection} />
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <div className="d-flex">
                    <div className={`card flex-fill form_icon_button shadow ${tab === sweepType.quantity ? 'active' : ''}`} onClick={() => changeTab(sweepType.quantity)}>
                      {tab === sweepType.quantity && <DotIcon icon={faCheck} />}
                      <FontAwesomeIcon className='icon' icon={faStairs} />
                      <p>Quantity</p>
                    </div>
                    <div className={`card flex-fill form_icon_button shadow ms-2 ${tab === sweepType.budget ? 'active' : ''}`} onClick={() => changeTab(sweepType.budget)}>
                      {tab === sweepType.budget && <DotIcon icon={faCheck} />}
                      <FontAwesomeIcon className='icon' icon={faDollarSign} />
                      <p>Budget</p>
                    </div>
                    <div className={`card flex-fill form_icon_button shadow ms-2 ${tab === sweepType.custom ? 'active' : ''}`} onClick={() => changeTab(sweepType.custom)}>
                      {tab === sweepType.custom && <DotIcon icon={faCheck} />}
                      <FontAwesomeIcon className='icon' icon={faStar} />
                      <p>Custom</p>
                    </div>
                  </div>
                  {tab === sweepType.quantity && <div className="mb-2">Sweep up to a specific quantity</div>}
                  {tab === sweepType.budget && <div className="mb-2">Sweep up to a specific budget</div>}
                  {tab === sweepType.custom && <div className="mb-2">Use collection filters for sweeping</div>}
                  {[sweepType.quantity, sweepType.custom].includes(tab) && (
                    <div className="mt-2">
                      <QuantitySweeperField
                        onChange={(value) => setQuantity(value)}
                        disabled={showConfirmButton || executingSweepFloor}
                        error={formErrors.quantity}
                      />
                    </div>
                  )}
                  {[sweepType.budget, sweepType.custom].includes(tab) && (
                    <div className="mt-2">
                      <BudgetSweeperField
                        balance={0}
                        onChange={(value) => setBudget(value)}
                        disabled={showConfirmButton || executingSweepFloor}
                        error={formErrors.budget}
                      />
                    </div>
                  )}
                  {(tab === sweepType.budget || tab === sweepType.quantity) && (
                    <div className="mt-2">
                      <MaxPricePerItemField
                        onChange={(value) => setMaxPricePerItem(value)}
                        disabled={showConfirmButton || executingSweepFloor}
                      />
                    </div>
                  )}
                  {tab === sweepType.custom && adjustLayout && (
                    <ActiveFiltersField activeFilters={activeFilters} collection={collection} />
                  )}
                  <div className="mt-2">
                    <AutoSwapItemsField
                      onChange={(value) => setAutoSwapItems(value)}
                      disabled={showConfirmButton || executingSweepFloor}
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="w-100">
                {sweepError && (
                  <div className="alert alert-primary my-auto mb-2 text-center">
                    {sweepError}
                  </div>
                )}
                {showConfirmButton ? (
                  <>
                    <Results listings={confirmationItems} cost={confirmationCost} isMobile={adjustLayout}/>
                    <div className="alert alert-primary my-2 text-center">
                      These listings could change depending on volume and liquidity of the collection. Continue?
                    </div>
                    {executingSweepFloor && (
                      <div className="mb-2 text-center fst-italic">Please check your wallet for confirmation</div>
                    )}
                    <div className="d-flex">
                      <Button type="legacy-outlined"
                              onClick={() => {
                                setShowConfirmButton(false)
                                setConfirmationCost(0)
                              }}
                              disabled={executingSweepFloor}
                              className="me-2 flex-fill">
                        Go Back
                      </Button>
                      <Button type="legacy"
                              onClick={handleSweepFloor}
                              isLoading={executingSweepFloor}
                              disabled={executingSweepFloor}
                              className="flex-fill">
                        Confirm Sweep
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {executingSweepFloor && (
                      <div className="mb-2 text-center fst-italic">
                        <small>Please check your wallet for confirmation</small>
                      </div>
                    )}
                    <div className="d-flex">
                      <Button type="legacy"
                              onClick={handleSearch}
                              isLoading={executingSearch}
                              disabled={executingSearch}
                              className="flex-fill">
                        Search
                      </Button>
                    </div>
                  </>
                )}
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

const BudgetSweeperField = ({onChange, disabled, error}) => {
  const user = useSelector((state) => state.user);
  const [budget, setBudget] = useState('');

  const onFieldChange = useCallback((e) => {
    const newValue = e.target.value.toString().replace(numberRegexValidation);
    if ((newValue && parseInt(newValue) < parseInt(user.balance)) || newValue === '') {
      setBudget(newValue);
      onChange(newValue);
    }
  }, [setBudget, user.balance]);

  return (
    <Form.Group className="form-field">
      <Form.Label className="formLabel w-100">
        <div className="d-flex">
          <div className="flex-grow-1">Budget</div>
          <div className="my-auto">
            <Badge
              pill
              bg={user.theme === 'dark' ? 'light' : 'secondary'}
              text={user.theme === 'dark' ? 'dark' : 'light'}
              className="ms-2"
            >
              Balance: {round(user.balance, 2)} CRO
            </Badge>
          </div>
        </div>
      </Form.Label>
      <Form.Control
        className="input"
        type="number"
        value={budget}
        onChange={onFieldChange}
        disabled={disabled}
      />
      <Form.Text className="field-description textError">
        {error}
      </Form.Text>
    </Form.Group>
  )
}

const QuantitySweeperField = ({onChange, disabled, error}) => {
  const [quantity, setQuantity] = useState('');

  const onFieldChange = useCallback((e) => {
    const newValue = e.target.value.toString().replace(numberRegexValidation);
    if (parseInt(newValue) <= maxSweepCount || newValue === '') {
      setQuantity(newValue);
      onChange(newValue);
    }
  }, [setQuantity, quantity]);

  return (
    <Form.Group className="form-field">
      <Form.Label className="formLabel w-100">
        Max Quantity
      </Form.Label>
      <Form.Control
        className="input"
        type="number"
        value={quantity}
        onChange={onFieldChange}
        disabled={disabled}
      />
      <Form.Text className="field-description textError">
        {error}
      </Form.Text>
    </Form.Group>
  )
}

const MaxPricePerItemField = ({onChange, disabled}) => {
  const [price, setPrice] = useState('');
  const [error, setError] = useState(false);

  const onFieldChange = useCallback((e) => {
    const newValue = e.target.value.toString().replace(numberRegexValidation);
    if (newValue || newValue === '') {
      setPrice(newValue);
      onChange(newValue);
    }
  }, [setPrice]);

  return (
    <Form.Group className="form-field">
      <Form.Label className="formLabel w-100">
        Max Price Per Item
      </Form.Label>
      <Form.Control
        className="input"
        type="number"
        value={price}
        onChange={onFieldChange}
        disabled={disabled}
      />
      <Form.Text className="field-description textError">
        {error}
      </Form.Text>
    </Form.Group>
  )
}

const AutoSwapItemsField = ({onChange, disabled}) => {
  const [isChecked, setIsChecked] = useState(true);
  const [error, setError] = useState(false);

  const onFieldChange = useCallback((e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    onChange(newValue);
  }, [setIsChecked, isChecked]);

  return (
    <Form.Group className="form-field d-flex">
      <Form.Label className="formLabel w-100">
        <span>Auto Swap Items</span>
        <span>
          <Tooltip
            label="Automatically swap items that were sold or delisted while sweeping"
            placement="top-start"
          >
            <FontAwesomeIcon icon={faCircleQuestion} className="ms-1" />
          </Tooltip>
        </span>
      </Form.Label>
      <Form.Switch
        checked={isChecked}
        onChange={onFieldChange}
        disabled={disabled}
      />
    </Form.Group>
  )
}

const ActiveFiltersField = memo(({collection, activeFilters}) => {
  const user = useSelector((state) => state.user);
  const [filterLabels, setFilterLabels] = useState([]);

  useEffect(() => {
    const traitFilters = Object.entries(activeFilters.traits).reduce((p, c) => {
      p.push(...c[1].map((t) => {
        const label = isNumeric(t) || t.toLowerCase().includes('none') ? `${c[0]}: ${t}`: t;
        return {
          type: 'trait',
          key: stripSpaces(`trait-${c[0]}-${t}`),
          category: c[0],
          label: mapAttributeString(label, collection.address),
          value: t
        }
      }));
      return p;
    }, []);
    const powertraitFilters = Object.entries(activeFilters.powertraits).reduce((p, c) => {
      p.push(...c[1].map((t) => {
        const label = isNumeric(t) || t.toLowerCase().includes('none') ? `${c[0]}: ${t}`: t;
        return {
          type: 'powertrait',
          key: stripSpaces(`powertrait-${c[0]}-${t}`),
          category: c[0],
          label: mapAttributeString(label, collection.address),
          value: t
        }
      }));
      return p;
    }, []);

    const returnArray = [...traitFilters, ...powertraitFilters];

    if (activeFilters.minPrice || activeFilters.maxPrice) {
      returnArray.push({
        type: 'price',
        label: priceLabel(activeFilters.minPrice, activeFilters.maxPrice)
      })
    }

    if (activeFilters.minRank || activeFilters.maxRank) {
      returnArray.push({
        type: 'rank',
        label: rankLabel(activeFilters.minRank, activeFilters.maxRank)
      })
    }

    if (activeFilters.search) {
      returnArray.push({
        type: 'search',
        label: activeFilters.search
      })
    }

    if (activeFilters.listed) {
      returnArray.push({
        type: 'status',
        key: 'status-buynow',
        label: 'Buy Now'
      })
    }

    setFilterLabels(returnArray);
  }, [activeFilters]);

  const priceLabel = (min, max) => {
    if (!min && !max) return null;

    if (min && max) {
      return `${commify(min)} - ${commify(max)} CRO`;
    } else if (min && !max) {
      return `At least ${commify(min)} CRO`;
    } else if (!min && max) {
      return `Max ${commify(max)} CRO`;
    } else return 'N/A';
  }

  const rankLabel = (min, max) => {
    if (!min && !max) return null;

    if (min && max) {
      return `Rank ${commify(min)} - ${commify(max)}`;
    } else if (min && !max) {
      return `At least rank ${commify(min)}`;
    } else if (!min && max) {
      return `Max rank ${commify(max)}`;
    } else return 'N/A';
  }

  const ThemedBadge = (props) => {
    return (
      <div className="fs-5">
        <Badge
          bg={user.theme === 'dark' ? 'light' : 'dark'}
          text={user.theme === 'dark' ? 'dark' : 'light'}
        >
          {props.children}
        </Badge>
      </div>
    )
  }

  return (
    <>
      <div className="formLabel mt-3">Selected Filters</div>
      {filterLabels && filterLabels.length > 0 ? (
        <>
          <div className="d-flex flex-wrap">
            {filterLabels.map((filter) => (
              <div className="mx-1">
                <ThemedBadge>
                  <span>{filter.label}</span>
                </ThemedBadge>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>None. Set filters from the collection page</div>
      )}
    </>
  )
});

const Results = ({listings, cost, isMobile}) => {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header as="div">
          Found {listings.length} {listings.length === 1 ? 'listing' : 'listings'} ({commify(cost)} CRO)
        </Accordion.Header>
        <Accordion.Body className="px-1">
          <Swiper
            className={isMobile ? '' :  'mySwiper'}
            spaceBetween={0}
            slidesPerView={3}
            slidesPerGroup={3}
            navigation={true}
            modules={[Lazy, Navigation]}
            breakpoints={{
              600: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              1024: {
                slidesPerView: 5,
                slidesPerGroup: 5,
              },
            }}
          >
            {listings.map((listing) => (
              <SwiperSlide key={listing.listingId}>
                <div className="px-2">
                  <div className="text-center" style={{fontSize:'14px'}}>#{shortString(listing.nftId, 3, 3)}</div>
                  {isBundle(listing.nft.address ?? listing.nft.nftAddress) ? (
                    <AnyMedia
                      image={ImageService.translate('/img/logos/bundle.webp').avatar()}
                      title={listing.nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded swiper-lazy"
                    />
                  ) : (
                    <AnyMedia
                      image={specialImageTransform(listing.nft.address ?? listing.nft.nftAddress, listing.nft.image)}
                      title={listing.nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded swiper-lazy"
                    />
                  )}
                  <div className="text-center" style={{fontSize:'14px'}}>{listing.price} CRO</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}