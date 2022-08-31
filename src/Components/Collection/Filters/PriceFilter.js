import React, { memo, useState } from 'react';
import {Accordion, Form} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import {useRouter} from "next/router";
import {filterListingsByPrice} from "@src/GlobalState/collectionSlice";
import {pushQueryString} from "@src/helpers/query";

const PriceFilter = ({ address, ...props }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentFilter = useSelector((state) => state.collection.query.filter);

  const [minPrice, setMinPrice] = useState(currentFilter.minPrice);
  const [maxPrice, setMaxPrice] = useState(currentFilter.maxPrice);

  const hasActiveRangeFilter = () => {
    return !!currentFilter.minPrice ||
      !!currentFilter.maxPrice;
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
        minRank: currentFilter.minRank,
        maxRank: currentFilter.maxRank,
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

  return (
    <div {...props}>
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
