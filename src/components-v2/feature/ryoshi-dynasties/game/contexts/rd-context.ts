import {createContext} from "react";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";

export interface RyoshiDynastiesContextProps {
  config: RyoshiConfig;
}

export const RyoshiDynastiesContext = createContext<RyoshiDynastiesContextProps | null>(null);