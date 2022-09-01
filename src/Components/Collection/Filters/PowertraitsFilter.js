import React, {memo} from 'react';
import {Accordion, Form} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';

import {humanize, mapAttributeString, stripSpaces} from '@src/utils';
import {filterListingsByTrait} from '@src/GlobalState/collectionSlice';
import {useRouter} from "next/router";
import {cleanedQuery, pushQueryString} from "@src/helpers/query";

const PowertraitsFilter = ({ address }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const collectionStats = useSelector((state) => state.collection.stats);
  const collectionCachedTraitsFilter = useSelector((state) => state.collection.query.filter.powertraits);
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const viewPowertraitsList = () => {
    if (!collectionStats || !collectionStats.powertraits) {
      return [];
    }

    return Object.entries(collectionStats.powertraits);
  };

  const traitStatName = (name, stats, category) => {
    return mapAttributeString(name, address, category, true);
  };

  const viewGetDefaultCheckValue = (traitCategory, id) => {
    const cachedTraitsFilter = collectionCachedTraitsFilter || {};

    if (!cachedTraitsFilter || !cachedTraitsFilter[traitCategory]) {
      return false;
    }

    return cachedTraitsFilter[traitCategory].includes(id) || false;
  };

  const handleCheck = (event, traitName, traitCategory) => {
    const { id, checked } = event.target;
    const name = id.substring(id.indexOf('-') + 1);

    const currentTraitFilters = collectionCachedTraitsFilter || {};

    let allTraits = cleanedQuery({
      ...currentTraitFilters,
      [traitCategory]: [
        ...(currentTraitFilters[traitCategory] || []),
        traitName
      ].filter((v, i, a) => a.indexOf(v) === i && (v !== traitName || checked)),
    });

    currentFilter.powertraits = allTraits;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByTrait({
        powertraits: allTraits,
        address,
      })
    );
  };

  return (
    <div className="my-4" flush>
      <Accordion id="powertraits">
        {viewPowertraitsList()
          .sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1))
          .map(([traitCategoryName, traitCategoryValues], key) => (
            <Accordion.Item eventKey={key} key={key}>
              <Accordion.Header>{humanize(traitCategoryName)}</Accordion.Header>
              <Accordion.Body>
                {Object.entries(traitCategoryValues)
                  .filter((t) => t[1].count > 0)
                  .sort((a, b) => {
                    if (!isNaN(a[0]) && !isNaN(b[0])) {
                      return parseInt(a[0]) > parseInt(b[0]) ? 1 : -1;
                    }
                    return a[0] > b[0] ? 1 : -1;
                  })
                  .map((stats) => (
                    <div key={`${traitCategoryName}-${stats[0]}`}>
                      <Form.Check
                        type="checkbox"
                        id={stripSpaces(`powertrait-${traitCategoryName}-${stats[0]}`)}
                        className="trait-checkbox"
                      >
                        <Form.Check.Input type={'checkbox'}
                                          value={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                                          onChange={(t) => handleCheck(t, stats[0], traitCategoryName)}
                                          defaultChecked={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                        />
                        <Form.Check.Label className="w-100">
                          <div className="d-flex justify-content-between cursor-pointer w-100">
                            <div>{traitStatName(stats[0], stats[1], traitCategoryName)}</div>
                            {stats[1]?.count && (
                              <span className="text-muted">({stats[1].count})</span>
                            )}
                          </div>
                        </Form.Check.Label>
                      </Form.Check>
                    </div>
                  ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default memo(PowertraitsFilter);
