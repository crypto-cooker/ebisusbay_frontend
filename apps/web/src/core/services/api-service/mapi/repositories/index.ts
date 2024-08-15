import axios, {AxiosInstance} from "axios";
import {appConfig} from "@src/config";

const config = appConfig();

abstract class MapiRepository {
  public api: AxiosInstance;

  constructor(apiKey?: string) {
    this.api = axios.create({
      baseURL: config.urls.api,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();

          // convert array params to comma separated values
          for (const key of Object.keys(params)) {
            const param = params[key];
            if (Array.isArray(param)) {
              searchParams.append(key, param.join(','));
            } else {
              searchParams.append(key, param);
            }
          }

          return searchParams.toString();
        }
      }
    });
    if (apiKey) this.api.defaults.headers.common['eb-api-key'] = apiKey;
  }

}

export default MapiRepository;