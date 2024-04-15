import {Contract, ethers} from "ethers";
import Market from "@src/global/contracts/Marketplace.json";
import {appConfig} from "@src/Config";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

export async function collectionRoyaltyPercent(address, id) {
  try {
    if (!id) {
      const marketRoyalty = await readMarket.getRoyalty(address);
      return marketRoyalty.percent / 100;
    }

    const royalty = await readMarket.calculateRoyalty(address, id, 1000);
    return Number(royalty) / 10;
  } catch (error) {
    console.log('error retrieving royalties for collection', error);
    return 0;
  }
}