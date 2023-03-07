import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.api,
});

export async function refreshToken(address, token, listingId) {
  return await api.put('refresh', {address, token, listingId});
}