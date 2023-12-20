import axios, {AxiosInstance} from "axios";

class Croscription {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({baseURL: 'http://154.56.56.249:8081/indexer'});
  }

  async getBalance(address: string, tick?: string) {
    try {
      let url = `balance/${address.toLowerCase()}`;
      if (tick) {
        url += `/${tick}`;
      }

      const response = await this.axios.get(url);
      return response.data.balance;
    } catch (e) {
      return [];
    }
  }

  async getCrosBalance(address: string) {
    try {
      return this.getBalance(address, 'cros');
    } catch (e) {
      return [];
    }
  }
}

export default Croscription;

interface UserBalance {
  tick: string;
  amount: number
}