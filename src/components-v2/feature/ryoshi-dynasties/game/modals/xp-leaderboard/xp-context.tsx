import {RdFaction} from "@src/core/services/api-service/types";
import {createContext} from "react";

export interface MultiSelectContextPropsFaction {
  selected: RdFaction[];
  setSelected: (listings: RdFaction[]) => void;
  isMobileEnabled: boolean;
};

export const MultiSelectContextFaction  = createContext<MultiSelectContextPropsFaction | null>(null);