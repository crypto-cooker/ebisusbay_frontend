import axios, {AxiosInstance} from "axios";
import {appConfig} from "@src/config";
const config = appConfig();

abstract class CmsRepository {
  public cms: AxiosInstance;

  constructor(apiKey?: string) {
    this.cms = axios.create({baseURL: config.urls.cms});
    if (apiKey) this.cms.defaults.headers.common['eb-api-key'] = apiKey;
  }

}

export default CmsRepository;