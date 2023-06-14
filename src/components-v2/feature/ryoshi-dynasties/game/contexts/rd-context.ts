import {createContext} from "react";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {RdGameContext, RdUserContext} from "@src/core/services/api-service/types";

export interface RyoshiDynastiesContextProps {
  config: RyoshiConfig;
  user?: RdUserContext;
  refreshUser: () => Promise<void>;
  game?: RdGameContext;
  refreshGame: () => Promise<void>;
}

export const RyoshiDynastiesContext = createContext<RyoshiDynastiesContextProps | null>(null);