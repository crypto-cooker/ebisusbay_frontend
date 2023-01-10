import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.api,
});

export async function refreshToken(address, token, listingId) {
  const response = await api.put('refresh', {address, token, listingId})

  console.log('response', response);

  return response;
}