import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {commify} from "ethers/lib/utils";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Badge} from "react-bootstrap";
import {cleanedQuery, pushQueryString} from "@src/helpers/query";
import {useRouter} from "next/router";
import {
  filterListingsByPrice,
  filterListingsByTrait,
  resetFilters,
  resetListings, searchListings
} from "@src/GlobalState/collectionSlice";
import {isNumeric} from "@src/utils";
import {listingState} from "@src/core/api/enums";

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
        const name = isNumeric(t) || t.toLowerCase().includes('none') ? `${c[0]}: ${t}`: t;
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
        const name = isNumeric(t) || t.toLowerCase().includes('none') ? `${c[0]}: ${t}`: t;
        return {
          type: 'powertrait',
          category: c[0],
          name
        }
      }));
      return p;
    }, []);

    const returnArray = [...traitFilters, ...powertraitFilters];

    if (currentFilter.minPrice || currentFilter.maxPrice) {
      returnArray.push({
        type: 'price',
        name: priceLabel(currentFilter.minPrice, currentFilter.maxPrice)
      })
    }

    if (currentFilter.minRank || currentFilter.maxRank) {
      returnArray.push({
        type: 'rank',
        name: rankLabel(currentFilter.minRank, currentFilter.maxRank)
      })
    }

    if (currentFilter.search) {
      returnArray.push({
        type: 'search',
        name: currentFilter.search
      })
    }

    if (currentFilter.listed) {
      returnArray.push({
        type: 'listed',
        name: currentFilter.listed === listingState.SOLD
      })
    }

    console.log('sadf', currentFilter)
    setFilters(returnArray);
  }, [
    currentFilter.traits,
    currentFilter.powertraits,
    currentFilter.minPrice,
    currentFilter.maxPrice,
    currentFilter.minRank,
    currentFilter.maxRank,
    currentFilter.search,
    currentFilter.listed,
  ]);

  const priceLabel = (min, max) => {
    if (!min && max) return null;

    if (min && max) {
      return `${commify(min)} - ${commify(max)} CRO`;
    } else if (min && !max) {
      return `At least ${commify(min)} CRO`;
    } else if (!min && max) {
      return `Max ${commify(max)} CRO`;
    } else return 'N/A';
  }

  const rankLabel = (min, max) => {
    if (!min && max) return null;

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
          bg={userTheme === 'dark' ? 'light' : 'dark'}
          text={userTheme === 'dark' ? 'dark' : 'light'}
        >
          {props.children}
        </Badge>
      </div>
    )
  }

  const onClearAll = () => {
    currentFilter.traits = {};
    currentFilter.powertraits = {};
    currentFilter.minPrice = null;
    currentFilter.maxPrice = null;
    currentFilter.minRank = null;
    currentFilter.maxRank = null;
    currentFilter.search = null;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(resetFilters());
  };

  const onRemove = (filter) => {
    if (filter.type === 'trait') {
      removeTrait(filter);
    } else if (filter.type === 'powertrait') {
      removePowertrait(filter);
    } else if (filter.type === 'price') {
      removePrice(filter);
    } else if (filter.type === 'rank') {
      removeRank(filter);
    } else if (filter.type === 'search') {
      removeSearch(filter);
    } else if (filter.type === 'listed') {
      removeListed(filter);
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

  const removePrice = (filter) => {
    currentFilter.minPrice = null;
    currentFilter.maxPrice = null;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByPrice({
        address: collection.address,
        minRank: currentFilter.minRank,
        maxRank: currentFilter.maxRank,
        minPrice: null,
        maxPrice: null,
      })
    );
  }

  const removeRank = (filter) => {
    currentFilter.minRank = null;
    currentFilter.maxRank = null;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByPrice({
        address: collection.address,
        minPrice: currentFilter.minPrice,
        maxPrice: currentFilter.maxPrice,
        minRank: null,
        maxRank: null,
      })
    );
  }

  const removeSearch = (filter) => {
    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(searchListings(null));
  }

  const removeListed = (filter) => {

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
      <div className="d-flex flex-wrap">
        {filters.map((filter) => (
          <div className="mx-1">
            <ThemedBadge>
              <span>{filter.name}</span>
              <span className="ms-2 cursor-pointer" onClick={() => onRemove(filter)}>X</span>
            </ThemedBadge>
          </div>
        ))}
        <div className="mx-1 my-auto cursor-pointer">
          <span onClick={onClearAll}>Clear All</span>
        </div>
      </div>
    </div>
  )
}