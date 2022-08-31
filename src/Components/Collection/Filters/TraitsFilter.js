import React, { memo, useEffect, useState } from 'react';
import {Accordion, Badge, Form} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { filterListingsByTrait } from '@src/GlobalState/collectionSlice';
import {humanize, mapAttributeString} from '@src/utils';
import {useRouter} from "next/router";
import {cleanedQuery, pushQueryString} from "@src/helpers/query";

const TraitsFilter = ({ address, identifier }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userTheme = useSelector((state) => state.user.theme);
  const collectionStats = useSelector((state) => state.collection.stats);
  const collectionCachedTraitsFilter = useSelector((state) => state.collection.query.filter.traits);
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const [hideAttributes, setHideAttributes] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  const viewTraitsList = () => {
    if (!collectionStats || !collectionStats.traits) {
      return [];
    }

    return Object.entries(collectionStats.traits);
  };

  const viewSelectedAttributesCount = () => {
    const cachedTraitsFilter = collectionCachedTraitsFilter || {};
    return Object.values(cachedTraitsFilter)
      .map((traitCategoryValue) => Object.values(traitCategoryValue).length)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const traitStatName = (name, stats, category) => {
    let ret = mapAttributeString(name, address, category, true);

    if (stats && stats.count > 0) {
      ret = ret.concat(` (${stats.count})`);
    }

    return ret;
  };

  const viewGetDefaultCheckValue = (traitCategory, id) => {
    const cachedTraitsFilter = collectionCachedTraitsFilter || {};

    if (!cachedTraitsFilter || !cachedTraitsFilter[traitCategory]) {
      return false;
    }

    return cachedTraitsFilter[traitCategory].includes(id) || false;
  };

  const clearAttributeFilters = () => {
    const inputs = document.querySelectorAll('.attribute-checkbox input[type=checkbox]');
    for (const item of inputs) {
      item.checked = false;
    }

    currentFilter.traits = {};

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByTrait({
        traits: currentFilter.traits,
        address,
      })
    );
  };

  const handleCheck = (event, traitCategory) => {
    const { id, checked } = event.target;

    const currentTraitFilters = collectionCachedTraitsFilter || {};

    let allTraits = cleanedQuery({
      ...currentTraitFilters,
      [traitCategory]: [
        ...(currentTraitFilters[traitCategory] || []),
        id
      ].filter((v, i, a) => a.indexOf(v) === i && (v !== id || checked)),
    });

    currentFilter.traits = allTraits;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByTrait({
        traits: allTraits,
        address,
      })
    );
  };

  return (
    <>
      <Accordion id="traits">
        {viewTraitsList()
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
                        id={stats[0]}
                        className="attribute-checkbox"
                        label={traitStatName(stats[0], stats[1], traitCategoryName)}
                        defaultChecked={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                        value={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                        onChange={(t) => handleCheck(t, traitCategoryName)}
                      />
                    </div>
                  ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </>
  );
};

export default memo(TraitsFilter);
