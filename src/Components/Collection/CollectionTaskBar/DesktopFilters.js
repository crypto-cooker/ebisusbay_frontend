import TraitsFilter from "@src/Components/Collection/Filters/TraitsFilter";
import PowertraitsFilter from "@src/Components/Collection/Filters/PowertraitsFilter";
import React from "react";
import PriceFilter from "@src/Components/Collection/Filters/PriceFilter";
import RankFilter from "@src/Components/Collection/Filters/RankFilter";
import {StatusFilter} from "@src/Components/Collection/Filters/StatusFilter";

export const DesktopFilters = ({address, traits, powertraits}) => {

  const hasTraits = () => {
    return traits != null && Object.entries(traits).length > 0;
  };

  const hasPowertraits = () => {
    return powertraits != null && Object.entries(powertraits).length > 0;
  };

  return (
    <div className="filter-pane">
      <StatusFilter keyPrefix="desktop" />
      <PriceFilter address={address} />
      <RankFilter address={address} />
      <hr className="mt-4 mb-2"/>
      {hasTraits() && <TraitsFilter address={address} keyPrefix="desktop" />}
      {hasPowertraits() && <PowertraitsFilter address={address} keyPrefix="desktop" />}
    </div>
  )
}