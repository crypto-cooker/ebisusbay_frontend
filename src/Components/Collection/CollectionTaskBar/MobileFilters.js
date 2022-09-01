import {Offcanvas} from "react-bootstrap";
import PriceFilter from "@src/Components/Collection/Filters/PriceFilter";
import RankFilter from "@src/Components/Collection/Filters/RankFilter";
import TraitsFilter from "@src/Components/Collection/Filters/TraitsFilter";
import PowertraitsFilter from "@src/Components/Collection/Filters/PowertraitsFilter";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useSelector} from "react-redux";
import {StatusFilter} from "@src/Components/Collection/Filters/StatusFilter";

export const MobileFilters = ({address, show, onHide, traits, powertraits}) => {
  const theme = useSelector((state) => state.user.theme);

  const hasTraits = () => {
    return traits != null && Object.entries(traits).length > 0;
  };

  const hasPowertraits = () => {
    return powertraits != null && Object.entries(powertraits).length > 0;
  };

  return (
    <Offcanvas show={show} placement="bottom" onHide={onHide}>
      <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="pb-5 overflow-hidden">
          <StatusFilter className="mb-3" />
          <PriceFilter className="mb-3" address={address} />
          <RankFilter className="mb-3" address={address} />
          {hasTraits() && <TraitsFilter address={address} />}
          {hasPowertraits() && <PowertraitsFilter address={address} />}
        </div>
        <div className="d-flex fixed-bottom mx-2 my-2">
          <div className="flex-fill">
            <Button type="legacy-outlined" className="w-100" style={{height: '100%'}}>
              <FontAwesomeIcon icon={faFilter} />
              <span className="ms-2">Clear</span>
            </Button>
          </div>
          <div className="flex-fill ms-4">
            <Button type="legacy" className="w-100" style={{height: '100%'}}>
              <FontAwesomeIcon icon={faFilter} />
              <span className="ms-2">Apply</span>
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}