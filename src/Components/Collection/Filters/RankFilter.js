import React, { memo, useState } from 'react';
import {Accordion, Form} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import {useRouter} from "next/router";
import {pushQueryString} from "@src/helpers/query";
import {filterListingsByPrice} from "@src/GlobalState/collectionSlice";

const RankFilter = ({ address, ...props }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentFilter = useSelector((state) => state.collection.query.filter);

  const [minRank, setMinRank] = useState(currentFilter.minRank);
  const [maxRank, setMaxRank] = useState(currentFilter.maxRank);

  const hasActiveRangeFilter = () => {
    return !!currentFilter.minRank ||
      !!currentFilter.maxRank;
  };

  const onApply = () => {
    const tmpMinRank = isNaN(parseInt(minRank)) ? null : parseInt(minRank);
    const tmpMaxRank = isNaN(parseInt(maxRank)) ? null : parseInt(maxRank);

    if (tmpMinRank === currentFilter.minRank &&
      tmpMaxRank === currentFilter.maxRank) {
      return;
    }

    currentFilter.minRank = tmpMinRank;
    currentFilter.maxRank = tmpMaxRank;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByPrice({
        address,
        minPrice: currentFilter.minPrice,
        maxPrice: currentFilter.maxPrice,
        minRank: currentFilter.minRank,
        maxRank: currentFilter.maxRank,
      })
    );
  };

  const onMinRankChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setMinRank(e.target.value);
    }
  };

  const onMaxRankChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setMaxRank(e.target.value);
    }
  };

  return (
    <div {...props}>
      <Accordion defaultActiveKey={hasActiveRangeFilter() ? 'price' : undefined}>
        <Accordion.Item eventKey="price">
          <Accordion.Header>
            <h5 className="my-1">Rank</h5>
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-xl-6 col-lg-12 px-2 mt-2">
                <Form.Control
                  type="text"
                  placeholder="Min Rank"
                  value={minRank ?? ''}
                  onChange={onMinRankChange}
                  style={{ marginBottom: 0, marginTop: 0 }}
                />
              </div>
              <div className="col-xl-6 col-lg-12 px-2 mt-2">
                <Form.Control
                  type="text"
                  placeholder="Max Rank"
                  value={maxRank ?? ''}
                  onChange={onMaxRankChange}
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

export default memo(RankFilter);
