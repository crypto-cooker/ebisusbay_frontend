import {createContext} from "react";

export interface RyoshiDynastiesPreloaderProps {
  images: { [key: string]: HTMLImageElement };
  getPreloadedImage: (key: string) => string;
}

export const RyoshiDynastiesPreloaderContext = createContext<RyoshiDynastiesPreloaderProps | null>(null);