import {Contract, ethers} from "ethers";
import Market from "@src/Contracts/Marketplace.json";
import {appConfig} from "@src/Config";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

export async function collectionRoyaltyPercent(address, id) {
  try {
    if (!id) {
      const marketRoyalty = await readMarket.getRoyalty(address);
      return marketRoyalty.percent;
    }

    const royalty = await readMarket.calculateRoyalty(address, id, 100);
    return Number(royalty);
  } catch (error) {
    console.log('error retrieving royalties for collection', error);
    return 0;
  }
}