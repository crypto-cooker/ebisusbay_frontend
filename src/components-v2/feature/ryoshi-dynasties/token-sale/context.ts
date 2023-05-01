import {Listing} from "@src/core/models/listing";
import {createContext} from "react";

export interface TokenSaleContextProps {
  paused: boolean;
  userFortunePurchased?: number;
  totalFortunePurchased: number;
  exchangeRate: number;
  maxAllocation: number;
};

export const TokenSaleContext = createContext<TokenSaleContextProps | null>(null);