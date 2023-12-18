import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import GdcClaimsRepository from "@src/core/services/api-service/cms/repositories/gdc-claims";
import {
  BankStakeNft,
  BarracksStakeNft,
  RdBattleLog,
  StakedTokenType,
  TownHallStakeNft
} from "@src/core/services/api-service/types";
import RyoshiDynastiesRepository from "@src/core/services/api-service/cms/repositories/ryoshi-dynasties";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";
import axios, {AxiosInstance} from "axios";

class Croscribe {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({baseURL: 'https://api.croscribe.com/'});
  }

  async getBalance(address: string, tick?: string) {
    try {
      const response = await this.axios.get(`balance/${address.toLowerCase()}`);
      const balances = response.data.balances.map((balance: any) => ({ ...balance, id: balance.token_id})) as UserBalance[]

      if (tick) {
        return balances.filter((balance) => balance.chain === 'CRONOS' && balance.tick === tick);
      }

      return balances;
    } catch (e) {
      return [];
    }
  }
}

export default Croscribe;

interface UserBalance {
  id: number;
  chain: string;
  protocol: string;
  tick: string;
  amount: number
}