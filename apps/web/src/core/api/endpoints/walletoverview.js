import {appConfig} from "@src/config";

const config = appConfig();
const api = {
  baseUrl: config.urls.api,
  endpoint: '/v2/walletoverview',
};

export async function getWalletOverview(walletAddress) {
  const url = new URL(api.endpoint, `${api.baseUrl}`);
  const queryString1 = new URLSearchParams({
    pageSize: 1000,
    wallet: walletAddress
  });

  const response = await fetch(`${url}?${queryString1}`)
  const json = await response.json();

  return {
    status: json.status,
    data: json.collections
  }
}