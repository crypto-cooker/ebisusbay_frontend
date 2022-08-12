import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.api,
});

export async function refreshToken(address, token) {
  const response = await api.put('refresh', {
    params: {address, token}
  })

  console.log('response', response);

  return response;
}