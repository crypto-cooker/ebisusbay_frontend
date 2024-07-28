import {createContext} from "react";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";

export interface MarketplacePageContextProps {
  queryParams: ListingsQueryParams;
  setQueryParams: (params: ListingsQueryParams) => void;
};

export const MarketplacePageContext = createContext<MarketplacePageContextProps | null>(null);