import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {listingState} from "@src/core/api/enums";
import {limitSizeOptions} from "@src/Components/components/constants/filter-options";
import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import {CollectionInfoQuery} from "@src/core/services/api-service/mapi/queries/collectioninfo";
import {getCollectionTraits} from "@src/core/api";

class CollectionsRepository extends MapiRepository {

  async getCollections(query?: CollectionInfoQuery) {
    let defaultQuery = {
      page: 1,
      pageSize: 50,
    };

    return await this.api.get(`collectioninfo`, {
      params: {...defaultQuery, ...query?.toQuery()}
    });
  }

  // async getCollection(query?: ListingsQuery) {
  //   let defaultQuery = {
  //     state: listingState.ACTIVE,
  //     page: 1,
  //     pageSize: limitSizeOptions.lg,
  //     sortBy: 'listingId',
  //     direction: 'desc'
  //   };
  //
  //   return await this.api.get(`collectioninfo`, {
  //     params: {...defaultQuery, ...query?.toQuery()}
  //   });
  // }

  async getCollectionTraits(address: string) {
    return await this.api.get(`collectionrarity`, {
      params: {address}
    });
  }
}

export default CollectionsRepository;