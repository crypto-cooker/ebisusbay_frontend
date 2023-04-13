import {appConfig} from "@src/Config";
import {Axios} from "@src/core/http/axios";

const config = appConfig();
const api = Axios.create(config.urls.api);

interface PriceProps {
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

export async function getPrice(chainId: number): Promise<PriceProps> {
  try{
    const response = await api.get(`prices`);
    
    return response.data.prices.find((p: any) => p.chain === chainId);
  }
  catch(error){
    throw error;
  }
}