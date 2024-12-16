import chainConfigs, {AppChainConfig, ChainSlug, isSupportedChainId, SupportedChainId} from "@src/config/chains";

function isChainSlug(slug: string): slug is ChainSlug {
  return Object.values(chainConfigs).some(config => config.slug === slug);
}

// export function getChainBySlug(slug: string) {
//   if (!isChainSlug(slug)) {
//     return undefined;
//   }
//
//   return Object.values(chainConfigs).find((chainConfig) => chainConfig.slug === slug);
// }

export function getChainBySlug<T extends number | string>(
  slug: T
): T extends SupportedChainId ? AppChainConfig : AppChainConfig | undefined {
  const chain = Object.values(chainConfigs).find((chainConfig) => chainConfig.slug === slug);

  if (chain && !isSupportedChainId(chain.chain.id)) {
    return undefined as any;
  }

  return chain as any;
}

export function getChainById<T extends number | string>(
  id: T
): T extends SupportedChainId ? AppChainConfig : AppChainConfig | undefined {
  if (!isSupportedChainId(id)) {
    return undefined as any;
  }

  return chainConfigs[id as SupportedChainId] as any;
}


export function getChainByIdOrSlug(idOrSlug: number | string) {
  if (isNaN(Number(idOrSlug)) && isChainSlug(idOrSlug as string)) {
    return getChainBySlug(idOrSlug as string);
  }

  return getChainById(idOrSlug);
}