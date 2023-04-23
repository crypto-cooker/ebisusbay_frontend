import {Listing} from "@src/core/models/listing";
import {createContext} from "react";

export interface MultiSelectContextProps {
  selected: Listing[];
  setSelected: (listings: Listing[]) => void;
  isMobileEnabled: boolean;
};

export const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);