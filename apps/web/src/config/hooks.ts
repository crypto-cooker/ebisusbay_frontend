import config, { AppEnvironment } from './app';
import appChainConfig, { isSupportedChainId, SupportedChainId } from './chains';
import { useEffect, useMemo, useState } from "react";
import { ChainId } from "@pancakeswap/chains";
import { useActiveChainId } from "@eb-pancakeswap-web/hooks/useActiveChainId";
import { getChainById, getChainByIdOrSlug } from '@src/helpers';
import { BridgeContract } from '@dex/bridge/constants/types';

function getCurrentEnv() {
  const env = process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV ?? AppEnvironment.PRODUCTION;

  // Type assertion to ensure env is of type AppEnvironment
  if (Object.values(AppEnvironment).includes(env as AppEnvironment)) {
    return env as AppEnvironment;
  }

  // Fallback to PRODUCTION if the value is not a valid AppEnvironment
  return AppEnvironment.PRODUCTION;
}

function findAppConfig(env: AppEnvironment) {
  const chosenConfig = config[env];
  if (chosenConfig.inherits && config[chosenConfig.inherits]) {
    const clonedConfig = deepMerge({}, config[chosenConfig.inherits]); // Clone and merge to avoid mutating the original
    return deepMerge(clonedConfig, config[env]);
  }

  return chosenConfig;
}

export function getAppConfig() {
  const currentEnv = getCurrentEnv()

  const appConfig = findAppConfig(currentEnv)

  const isLocalEnv = currentEnv === AppEnvironment.LOCAL;
  const isTestnet = currentEnv === AppEnvironment.TESTNET || appConfig.inherits === AppEnvironment.TESTNET;

  return {
    config: appConfig,
    currentEnv,
    isLocalEnv,
    isTestnet
  };
}

export function useAppConfig() {
  const currentEnv = useMemo(() => getCurrentEnv(), []);

  const appConfig = useMemo(() => findAppConfig(currentEnv), [currentEnv]);

  const isLocalEnv = currentEnv === AppEnvironment.LOCAL;
  const isTestnet = currentEnv === AppEnvironment.TESTNET || appConfig.inherits === AppEnvironment.TESTNET;

  return {
    config: appConfig,
    currentEnv,
    isLocalEnv,
    isTestnet
  };
}

export function useAppChainConfig(chainId?: ChainId) {
  const { chainId: activeChainId } = useActiveChainId();

  const config = useMemo(() => {
    if (!chainId) chainId = activeChainId;

    if (!chainId || !isSupportedChainId(chainId)) {
      return appChainConfig[ChainId.CRONOS]!;
    }
    return appChainConfig[chainId] ?? appChainConfig[ChainId.CRONOS]!
  }, [chainId, activeChainId]);

  return {
    config,
    chainId: activeChainId
  }
}

export function useBridgeContract(currencyId: string | undefined) {
  const { config } = useAppChainConfig();
  const bridge = useMemo<BridgeContract | undefined>(() => {
    if (typeof currencyId != "undefined") {
      const bridge: BridgeContract | undefined = config.bridges.find((bridge) => bridge.currencyId.toLocaleLowerCase().includes(currencyId?.toLocaleLowerCase()));
      return bridge
    } else {
      return undefined
    }
  }, [currencyId])

  return bridge
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

export function useChainSlugById(chainId: number) {
  return useMemo(() => {
    const chainConfig = getChainById(chainId);
    return chainConfig?.slug ?? chainId
  }, [chainId]);
}

export function useChainById(chainId: number) {
  return useMemo(() => {
    const chainConfig = getChainById(chainId);
    return chainConfig?.chain ?? chainId
  }, [chainId]);
}

export function useChainByIdOrSlug(idOrSlug: number | string) {
  return useMemo(() => {
    const chainConfig = getChainByIdOrSlug(idOrSlug);
    return chainConfig?.chain ?? idOrSlug
  }, [idOrSlug]);
}