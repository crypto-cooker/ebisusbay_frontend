import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import ListingsRepository from "@src/core/services/api-service/mapi/repositories/listings";
import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import axios from "axios";
import {appConfig} from "@src/Config";
import Listing from "@src/core/models/listing";
import OffersQuery, {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import OffersRepository from "@src/core/services/api-service/mapi/repositories/offers";
import {Offer} from "@src/core/models/offer";
const config = appConfig();

class Mapi {
  private listings;
  private offers;

  constructor(apiKey?: string) {
    this.listings = new ListingsRepository(apiKey);
    this.offers = new OffersRepository(apiKey);
  }

  async getListings(query?: ListingsQuery): Promise<PagedList<Listing>> {
    const response = await this.listings.getListings(query);

    return new PagedList<Listing>(
      response.data.listings,
      response.data.page,
      response.data.page < response.data.totalPages
    )
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    const api = axios.create({baseURL: config.urls.api});
    return await api.get(`search`, {params: {query}});
  }

  async getOffers(query?: OffersQueryParams): Promise<PagedList<Offer>> {
    const response = await this.offers.getOffers(new OffersQuery(query));

    return new PagedList<Offer>(
      response.data.offers,
      response.data.page,
      response.data.page < response.data.totalPages
    )
  }

  async getMadeOffersByUser(address: string, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;

    return await this.getOffers(query);
  }
}

export default Mapi;