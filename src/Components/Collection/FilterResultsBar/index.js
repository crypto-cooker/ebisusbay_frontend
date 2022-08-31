import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {commify} from "ethers/lib/utils";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Badge} from "react-bootstrap";
import {cleanedQuery, pushQueryString} from "@src/helpers/query";
import {useRouter} from "next/router";
import {filterListingsByTrait} from "@src/GlobalState/collectionSlice";
import {isNumeric} from "@src/utils";

export const FilterResultsBar = ({collection}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userTheme = useSelector((state) => state.user.theme);
  const {
    totalCount: resultsCount,
    query: {filter: currentFilter},
  } = useSelector((state) => state.collection);

  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const traitFilters = Object.entries(currentFilter.traits).reduce((p, c) => {
      p.push(...c[1].map((t) => {
        const name = isNumeric(t) ? `${c[0]}: ${t}`: t;
        return {
          type: 'trait',
          category: c[0],
          name
        }
      }));
      return p;
    }, []);
    const powertraitFilters = Object.entries(currentFilter.powertraits).reduce((p, c) => {
      p.push(...c[1].map((t) => {
        const name = isNumeric(t) ? `${c[0]}: ${t}`: t;
        return {
          type: 'powertrait',
          category: c[0],
          name
        }
      }));
      return p;
    }, []);
    setFilters([...traitFilters, ...powertraitFilters]);
  }, [currentFilter.traits, currentFilter.powertraits]);

  const ThemedBadge = (props) => {
    return (
      <Badge
        bg={userTheme === 'dark' ? 'light' : 'dark'}
        text={userTheme === 'dark' ? 'dark' : 'light'}
      >
        {props.children}
      </Badge>
    )
  }

  const onRemove = (filter) => {
    if (filter.type === 'trait') {
      removeTrait(filter);
    } else if (filter.type === 'powertrait') {
      removePowertrait(filter);
    } else if (filter.type === 'price') {

    } else if (filter.type === 'rank') {

    }
  };

  const removeTrait = (filter) => {
    const currentTraitFilters = currentFilter.traits || {};
    currentTraitFilters[filter.category] = currentTraitFilters[filter.category]?.filter((v) => !v.includes(filter.name));
    currentFilter.traits = cleanedQuery(currentTraitFilters);

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });
    dispatch(
      filterListingsByTrait({
        traits: currentFilter.traits,
        address: collection.address,
      })
    );
  }

  const removePowertrait = (filter) => {
    const currentPowertraitFilters = currentFilter.powertraits || {};
    currentPowertraitFilters[filter.category] = currentPowertraitFilters[filter.category]?.filter((v) => !v.includes(filter.name));
    currentFilter.powertraits = cleanedQuery(currentPowertraitFilters);

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });
    dispatch(
      filterListingsByTrait({
        powertraits: currentFilter.powertraits,
        address: collection.address,
      })
    );
  }

  return !currentFilter.isEmpty() && (
    <div className="my-2">
      <div className="d-flex justify-content-between my-2">
        <div>
          <FontAwesomeIcon icon={faSync} />
        </div>
        <div>
          {resultsCount ? commify(resultsCount) : 0} items
        </div>
      </div>
      <div className="d-flex">
        {filters.map((filter) => (
          <div className="mx-1">
            <ThemedBadge>
              <span>{filter.name}</span>
              <span className="ms-2 cursor-pointer" onClick={() => onRemove(filter)}>X</span>
            </ThemedBadge>
          </div>
        ))}
      </div>
    </div>
  )
}