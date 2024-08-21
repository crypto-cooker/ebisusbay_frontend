import {Contract, ethers} from "ethers";
import Market from "@src/global/contracts/Marketplace.json";
import {getAppChainConfig} from "@src/config/hooks";
import {appConfig} from "@src/config";
import {getChainByIdOrSlug} from "@src/helpers";


export async function collectionRoyaltyPercent(address, id, chainId) {
  try {
    let portContract;
    if (chainId) {
      const chainConfig = getChainByIdOrSlug(chainId);
      if (!chainConfig) return 0;

      const config = getAppChainConfig(chainConfig.chain.id)
      const readProvider = new ethers.providers.JsonRpcProvider(config.chain.rpcUrls.default.http[0]);
      portContract = new Contract(config.contracts.market, Market.abi, readProvider);
    } else {
      const config = appConfig();
      const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
      portContract = new Contract(config.contracts.market, Market.abi, readProvider);
    }

    if (!id) {
      const marketRoyalty = await portContract.getRoyalty(address);
      return marketRoyalty.percent / 100;
    }

    const royalty = await portContract.calculateRoyalty(address, id, 1000);
    return Number(royalty) / 10;
  } catch (error) {
    console.log('error retrieving royalties for collection', error);
    return 0;
  }
}