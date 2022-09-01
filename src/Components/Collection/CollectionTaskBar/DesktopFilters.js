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
    <>
      <StatusFilter className="mb-3" />
      <PriceFilter className="mb-3" address={address} />
      <RankFilter className="mb-3" address={address} />
      {hasTraits() && <TraitsFilter address={address} />}
      {hasPowertraits() && <PowertraitsFilter address={address} />}
    </>
  )
}