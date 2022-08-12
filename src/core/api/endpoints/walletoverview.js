import {appConfig} from "@src/Config";

const config = appConfig();
const api = {
  baseUrl: config.urls.api,
  endpoint: '/walletoverview',
};

export async function getWalletOverview(walletAddress) {
  let queryString = new URLSearchParams({
    wallet: walletAddress
  });

  const url = new URL(api.endpoint, `${api.baseUrl}`);
  const uri = `${url}?${queryString}`;

  const json = await (await fetch(uri)).json();

  if (json.status !== 200 || !json.data) return { ...json, ...{ data: [] } };

  json.data = [...json.data.erc1155, ...json.data.erc721];

  return json;
}