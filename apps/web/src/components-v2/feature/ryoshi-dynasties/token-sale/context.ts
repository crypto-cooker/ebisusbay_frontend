import {Listing} from "@src/core/models/listing";
import {createContext} from "react";

export interface TokenSaleContextProps {
  paused: boolean;
  userCroContributed?: number;
  totalCroContributed: number;
  exchangeRate: number;
  maxAllocation: number;
};

export const TokenSaleContext = createContext<TokenSaleContextProps | null>(null);