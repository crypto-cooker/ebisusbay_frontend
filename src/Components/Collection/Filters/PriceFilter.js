import React, { memo, useState } from 'react';
import {Accordion, Badge, Form} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import { commify } from 'ethers/lib/utils';
import {useRouter} from "next/router";
import {filterListingsByPrice} from "@src/GlobalState/collectionSlice";
import {pushQueryString} from "@src/helpers/query";

const PriceFilter = ({ address, ...props }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userTheme = useSelector((state) => state.user.theme);
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const [minPrice, setMinPrice] = useState(currentFilter.minPrice);
  const [maxPrice, setMaxPrice] = useState(currentFilter.maxPrice);

  const hasActiveRangeFilter = () => {
    return !!currentFilter.minPrice ||
      !!currentFilter.maxPrice;
  };

  const clearAttributeFilters = () => {
    currentFilter.minPrice = null;
    currentFilter.maxPrice = null;

    setMinPrice('');
    setMaxPrice('');

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByPrice({
        address,
        minPrice: null,
        maxPrice: null,
      })
    );
  };

  const onApply = () => {
    const tmpMinPrice = isNaN(parseInt(minPrice)) ? null : parseInt(minPrice);
    const tmpMaxPrice = isNaN(parseInt(maxPrice)) ? null : parseInt(maxPrice);

    if (tmpMinPrice === currentFilter.minPrice &&
      tmpMaxPrice === currentFilter.maxPrice) {
      return;
    }

    currentFilter.minPrice = tmpMinPrice;
    currentFilter.maxPrice = tmpMaxPrice;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByPrice({
        address,
        minPrice: currentFilter.minPrice,
        maxPrice: currentFilter.maxPrice,
      })
    );
  };

  const onMinPriceChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setMinPrice(e.target.value);
    }
  };

  const onMaxPriceChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setMaxPrice(e.target.value);
    }
  };

  const ThemedBadge = (props) => {
    return (
      <Badge
        pill
        bg={userTheme === 'dark' ? 'light' : 'dark'}
        text={userTheme === 'dark' ? 'dark' : 'light'}
      >
        {props.children}
      </Badge>
    )
  }

  return (
    <div {...props}>
      {hasActiveRangeFilter() && (
        <div className="d-flex flex-wrap justify-content-between align-middle mb-2">
          <div className="me-2">
            <ThemedBadge>
              {currentFilter.minPrice && currentFilter.maxPrice ? (
                  <>
                    {commify(currentFilter.minPrice)} - {commify(currentFilter.maxPrice)} CRO
                  </>
                )
                : currentFilter.minPrice && !currentFilter.maxPrice ? <>At least {commify(currentFilter.minPrice)} CRO</>
                  : !currentFilter.minPrice && currentFilter.maxPrice && <>Max {commify(currentFilter.maxPrice)} CRO</>
              }
            </ThemedBadge>
          </div>
          <div
            className="d-inline-block fst-italic my-auto flex-grow-1 text-end"
            style={{ fontSize: '0.8em', cursor: 'pointer' }}
            onClick={clearAttributeFilters}
          >
            Clear
          </div>
        </div>
      )}

      <Accordion defaultActiveKey={hasActiveRangeFilter() ? 'price' : undefined}>
        <Accordion.Item eventKey="price">
          <Accordion.Header>
            <h4 className="my-1">Price</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-xl-6 col-lg-12 px-2 mt-2">
                <Form.Control
                  type="text"
                  placeholder="Min Price"
                  value={minPrice ?? ''}
                  onChange={onMinPriceChange}
                  style={{ marginBottom: 0, marginTop: 0 }}
                />
              </div>
              <div className="col-xl-6 col-lg-12 px-2 mt-2">
                <Form.Control
                  type="text"
                  placeholder="Max Price"
                  value={maxPrice ?? ''}
                  onChange={onMaxPriceChange}
                  style={{ marginBottom: 0, marginTop: 0 }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Button type="legacy" className="ms-auto mt-3" onClick={onApply}>
                  Apply
                </Button>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default memo(PriceFilter);
