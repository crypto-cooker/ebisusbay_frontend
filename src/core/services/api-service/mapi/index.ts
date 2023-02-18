import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import ListingsRepository from "@src/core/services/api-service/mapi/repositories/listings";
import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import axios from "axios";
import {appConfig} from "@src/Config";
import Listing from "@src/core/models/listing";
const config = appConfig();

class Mapi {
  private listings;

  constructor() {
    this.listings = new ListingsRepository();
  }

  async getListings(query?: ListingsQuery): Promise<PagedList<Listing>> {
    const response = await this.listings.getListings(query);

    return new PagedList<Listing>(
      response.data.listings,
      response.data.page,
      response.data.page >= response.data.totalPages
    )
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    const api = axios.create({baseURL: config.urls.api});
    return await api.get(`search`, {params: {query}});
  }
}

export default Mapi;