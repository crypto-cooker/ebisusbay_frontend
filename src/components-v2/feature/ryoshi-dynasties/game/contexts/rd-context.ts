import {createContext} from "react";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {RdUserContext} from "@src/core/services/api-service/types";

export interface RyoshiDynastiesContextProps {
  config: RyoshiConfig;
  user?: RdUserContext;
  refreshUser: () => Promise<void>;
}

export const RyoshiDynastiesContext = createContext<RyoshiDynastiesContextProps | null>(null);