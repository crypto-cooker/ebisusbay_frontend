import chainConfigs, {ChainSlug, isSupportedChainId} from "@src/config/chains";

function isChainSlug(slug: string): slug is ChainSlug {
  return Object.values(chainConfigs).some(config => config.slug === slug);
}

export function getChainBySlug(slug: string) {
  if (!isChainSlug(slug)) {
    return undefined;
  }

  return Object.values(chainConfigs).find((chainConfig) => chainConfig.slug === slug);
}

export function getChainById(id: number | string) {
  if (!isSupportedChainId(id)) {
    return undefined;
  }

  return chainConfigs[id];
}

export function getChainByIdOrSlug(idOrSlug: number | string) {
  if (isNaN(Number(idOrSlug)) && isChainSlug(idOrSlug as string)) {
    return getChainBySlug(idOrSlug as string);
  }

  return getChainById(idOrSlug);
}