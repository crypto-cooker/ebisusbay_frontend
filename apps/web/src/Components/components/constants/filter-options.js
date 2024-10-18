import {appConfig} from "@src/config";
import {MarketFilterCollection} from "@src/Components/Models/market-filters.model";
import { isCollectionListable } from "@market/helpers/utils";

export const limitSizeOptions = {
  md: 12,
  lg: 50
}

export const marketPlaceCollectionFilterOptions = appConfig('legacyCollections')
  .filter((c) => isCollectionListable(c))
  .sort((a, b) => (a.name > b.name ? 1 : -1))
  .map((x) => new MarketFilterCollection(x.name, x.is1155 && x.split ? `${x.address}-${x.id}` : x.address));