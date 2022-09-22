import axios from 'axios';
import {appendSecurityHeaders} from "@src/core/http/security";

export class Axios {
  client = null;

  constructor(baseUrl) {
    this.client = axios.create({baseURL: baseUrl});
  }

  static create(baseUrl) {
    return new Axios(baseUrl);
  }

  async get(endpoint, config) {
    return await this.client.get(endpoint, appendSecurityHeaders(config));
  }
}
