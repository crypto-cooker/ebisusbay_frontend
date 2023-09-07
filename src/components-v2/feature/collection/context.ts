import {createContext} from "react";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";

export interface CollectionPageContextProps {
  queryParams: FullCollectionsQueryParams;
  setQueryParams: (params: FullCollectionsQueryParams) => void;
};

export const CollectionPageContext = createContext<CollectionPageContextProps | null>(null);