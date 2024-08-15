import {appConfig} from "@src/config";

const config = appConfig();
const api = {
  baseUrl: config.urls.api,
  endpoint: '/walletoverview',
};

export async function getWalletOverview(walletAddress) {


  const url = new URL(api.endpoint, `${api.baseUrl}`);
  const queryString1 = new URLSearchParams({
    pageSize: 1000,
    wallet: walletAddress
  });
  const queryString2 = new URLSearchParams({
    pageSize: 1000,
    wallet: walletAddress,
    chain: 282
  });

  const uri1 = `${url}?${queryString1}`;
  const uri2 = `${url}?${queryString2}`;

  const [response1, response2] = await Promise.all([
    fetch(uri1).then(response => response.json()),
    fetch(uri2).then(response => response.json())
  ]);

  const json1 = response1 || { status: 200, data: [] };
  const json2 = response2 || { status: 200, data: [] };

  const json = {
    status: Math.max(json1.status, json2.status),
    data: [...json1.data.erc1155, ...json1.data.erc721, ...json2.data.erc1155, ...json2.data.erc721]
  };

  return json;


}