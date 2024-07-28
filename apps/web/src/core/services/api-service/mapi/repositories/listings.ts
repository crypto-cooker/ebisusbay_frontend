import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {listingState} from "@src/core/api/enums";
import {limitSizeOptions} from "@src/Components/components/constants/filter-options";
import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";

class ListingsRepository extends MapiRepository {

  async getListings(query?: ListingsQuery) {
    let defaultQuery = {
      state: listingState.ACTIVE,
      page: 1,
      pageSize: limitSizeOptions.lg,
      sortBy: 'listingId',
      direction: 'desc'
    };

    return await this.api.get(`listings`, {
      params: {...defaultQuery, ...query?.toQuery()}
    });
  }

  async getUnfilteredListings(query?: ListingsQuery) {
    let defaultQuery = {
      page: 1,
      pageSize: limitSizeOptions.lg,
      sortBy: 'listingTime',
      direction: 'desc'
    };

    return await this.api.get(`unfilteredlistings`, {
      params: {...defaultQuery, ...query?.toQuery()}
    });
  }
}

export default ListingsRepository;