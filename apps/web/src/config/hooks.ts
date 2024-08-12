import config, {AppEnvironment} from './app';
import appChainConfig, {SupportedChainId} from './chains';
import {useMemo} from "react";
import {ChainId} from "@pancakeswap/chains";

export function useAppConfig() {
  const currentEnv = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV ?? AppEnvironment.PRODUCTION;

    // Type assertion to ensure env is of type AppEnvironment
    if (Object.values(AppEnvironment).includes(env as AppEnvironment)) {
      return env as AppEnvironment;
    }

    // Fallback to PRODUCTION if the value is not a valid AppEnvironment
    return AppEnvironment.PRODUCTION;
  }, []);

  const appConfig = useMemo(() => {
    const chosenConfig = config[currentEnv];
    if (chosenConfig.inherits && config[chosenConfig.inherits]) {
      const clonedConfig = deepMerge({}, config[chosenConfig.inherits]); // Clone and merge to avoid mutating the original
      return deepMerge(clonedConfig, config[currentEnv]);
    }

    return chosenConfig;
  }, [currentEnv]);

  const isLocalEnv = currentEnv === AppEnvironment.LOCAL;
  const isTestnet = currentEnv === AppEnvironment.TESTNET || appConfig.inherits === AppEnvironment.TESTNET;

  return {
    config: appConfig,
    currentEnv,
    isLocalEnv,
    isTestnet
  };
}

export function useAppChainConfig(chainId?: SupportedChainId) {
  const config = useMemo(() => appChainConfig[chainId ?? ChainId.CRONOS] ?? appChainConfig[ChainId.CRONOS]!, [chainId]);

  return {
    config
  }
}

export function getAppChainConfig(chainId?: SupportedChainId) {
  return appChainConfig[chainId ?? ChainId.CRONOS] ?? appChainConfig[ChainId.CRONOS]!;
}

function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  // Iterate over source properties
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // If the value is an object, recurse.
      if (source[key] instanceof Object && !(source[key] instanceof Array)) {
        if (!(key in target)) {
          (target as any)[key] = {};
        }
        deepMerge((target as any)[key], source[key] as any);
      } else {
        // Otherwise, just set the value.
        (target as any)[key] = source[key];
      }
    }
  }
  return target as T & U;
}