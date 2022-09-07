import {Offcanvas} from "react-bootstrap";
import PriceFilter from "@src/Components/Collection/Filters/PriceFilter";
import RankFilter from "@src/Components/Collection/Filters/RankFilter";
import TraitsFilter from "@src/Components/Collection/Filters/TraitsFilter";
import PowertraitsFilter from "@src/Components/Collection/Filters/PowertraitsFilter";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {StatusFilter} from "@src/Components/Collection/Filters/StatusFilter";
import {pushQueryString} from "@src/helpers/query";
import {resetFilters} from "@src/GlobalState/collectionSlice";
import {useRouter} from "next/router";
import {getTheme} from "@src/Theme/theme";

export const MobileFilters = ({address, show, onHide, traits, powertraits}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.user.theme);
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const hasTraits = () => {
    return traits != null && Object.entries(traits).length > 0;
  };

  const hasPowertraits = () => {
    return powertraits != null && Object.entries(powertraits).length > 0;
  };

  const onClearAll = () => {
    currentFilter.traits = {};
    currentFilter.powertraits = {};
    currentFilter.minPrice = null;
    currentFilter.maxPrice = null;
    currentFilter.minRank = null;
    currentFilter.maxRank = null;
    currentFilter.search = null;
    currentFilter.listed = null;

    for (const item of document.querySelectorAll('.trait-checkbox input[type=checkbox], .powertrait-checkbox input[type=checkbox], .status-checkbox input[type=checkbox]')) {
      item.checked = false;
    }
    for (const item of document.querySelectorAll('#filter-price input, #filter-rank input')) {
      item.value = '';
    }
    document.getElementById('collection-search').value = '';

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(resetFilters());
  };

  return (
    <Offcanvas show={show} placement="bottom" onHide={onHide} className="filter-pane">
      <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="pb-5 overflow-hidden">
          <StatusFilter keyPrefix="mobile" />
          <PriceFilter address={address} />
          <RankFilter address={address} />
          <hr className="mt-4 mb-2"/>
          {hasTraits() && <TraitsFilter address={address} keyPrefix="mobile" />}
          {hasPowertraits() && <PowertraitsFilter address={address} keyPrefix="mobile" />}
        </div>
        <div className="d-flex fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
          <div className="flex-fill">
            <Button type="legacy-outlined" className="w-100" style={{height: '100%'}} onClick={onClearAll}>
              <span className="ms-2">Clear all</span>
            </Button>
          </div>
          <div className="flex-fill ms-4">
            <Button type="legacy" className="w-100" style={{height: '100%'}} onClick={onHide}>
              <span className="ms-2">Done</span>
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}