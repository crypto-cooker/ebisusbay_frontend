import {appConfig} from "@src/Config";
import {MarketFilterCollection} from "@src/Components/Models/market-filters.model";

export const limitSizeOptions = {
  md: 12,
  lg: 50
}

export const marketPlaceCollectionFilterOptions = appConfig('collections')
  .filter((c) => c.listable)
  .sort((a, b) => (a.name > b.name ? 1 : -1))
  .map((x) => new MarketFilterCollection(x.name, x.multiToken && x.split ? `${x.address}-${x.id}` : x.address));