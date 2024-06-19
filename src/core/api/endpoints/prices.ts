import {appConfig} from "@src/Config";
import {Axios} from "@src/core/http/axios";
import {ciEquals} from "@market/helpers/utils";

const config = appConfig();
const api = Axios.create(config.urls.api);

export interface PriceProps {
  usdPrice: string;
  chain: number;
  currency: string;
}

export async function getPrices(): Promise<PriceProps[]> {
  try{
    const response = await api.get(`prices`);

    return response.data.prices;
  }
  catch(error){
    throw error;
  }
}

export async function getPrice(chainId: number, token?: string): Promise<PriceProps> {
  try{
    const response = await api.get(`prices`);
    
    return response.data.prices.find((p: any) => p.chain === chainId && (!token || ciEquals(p.currency, token)));
  }
  catch(error){
    throw error;
  }
}