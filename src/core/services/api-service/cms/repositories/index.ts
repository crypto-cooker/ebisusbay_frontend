import axios, {AxiosInstance} from "axios";
import {appConfig} from "@src/Config";
const config = appConfig();

abstract class CmsRepository {
  public api: AxiosInstance;

  constructor(apiKey?: string) {
    this.api = axios.create({baseURL: config.urls.api});
    if (apiKey) this.api.defaults.headers.common['eb-api-key'] = apiKey;
  }

}

export default CmsRepository;