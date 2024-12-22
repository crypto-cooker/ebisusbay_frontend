import { useAppConfig } from '@src/config/hooks';
import { ciEquals } from '@market/helpers/utils';
import { ChainId } from '@pancakeswap/chains';
import { useContext } from 'react';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';


export const useMitMatcher = () => {
  const { config: appConfig } = useAppConfig();
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const isMitNft = (nft: any) => {
    const nftAddress = nft.contractAddress ?? nft.nftAddress;
    const chainId = nft.chain ?? nft.chainId;
    return ciEquals(nftAddress, appConfig.mit.address) && chainId === appConfig.mit.chainId;
  }

  const isMitDependency = (nft: any) => {
    const dependencies = [
      {
        address: '0x613e49aabe1a18d6ec50aa427c60adb1ae153872', // Mystic Sea Dragons - Cronos Testnet
        chainId: ChainId.CRONOS_TESTNET
      },
      {
        address: '0xb34a19ba70c865edae4696735904a414f37f48ab', // Mystic Sea Dragons - Cronos ZKEVM
        chainId: ChainId.CRONOS_ZKEVM
      }
    ];

    const nftAddress = nft.contractAddress ?? nft.nftAddress;
    return dependencies.some((d) => ciEquals(d.address, nftAddress));
  }

  const isMitRequirementEnabled = (type: 'bank' | 'barracks') => {
    if (!rdConfig) return false;
    const buildingConfig = type === 'bank' ? rdConfig.bank : rdConfig.barracks;
    const mitConfig = buildingConfig.staking.nft.collections.find((c) => c.slug === 'materialization-infusion-terminal');

    return mitConfig?.active ?? false;
  }

  return {
    isMitNft,
    isMitDependency,
    isMitRequirementEnabled
  }
}

export default useMitMatcher;