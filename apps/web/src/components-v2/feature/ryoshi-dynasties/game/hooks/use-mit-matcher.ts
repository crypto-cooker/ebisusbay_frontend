import { useAppConfig } from '@src/config/hooks';
import { ciEquals } from '@market/helpers/utils';


export const useMitMatcher = () => {
  const { config: appConfig } = useAppConfig();

  const isMitNft = (nft: any) => {
    const nftAddress = nft.contractAddress ?? nft.nftAddress;
    const chainId = nft.chain ?? nft.chainId;
    return ciEquals(nftAddress, appConfig.mit.address) && chainId === appConfig.mit.chainId;
  }

  return {
    isMitNft
  }
}

export default useMitMatcher;