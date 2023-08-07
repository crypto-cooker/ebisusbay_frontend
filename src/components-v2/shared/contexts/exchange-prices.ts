import {createContext} from "react";
import {PriceProps} from "@src/core/api/endpoints/prices";

export interface ExchangePricesContextProps {
  prices: PriceProps[];
}

export const ExchangePricesContext = createContext<ExchangePricesContextProps | null>(null);