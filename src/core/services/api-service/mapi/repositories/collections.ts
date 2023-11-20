import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import {CollectionInfoQuery} from "@src/core/services/api-service/mapi/queries/collectioninfo";
import {FullCollectionsQuery} from "@src/core/services/api-service/mapi/queries/fullcollections";

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

  async getFullCollections(query?: FullCollectionsQuery): Promise<any> {
    let defaultQuery = {
      page: 1,
      pageSize: 50,
      burnt: 0
    };

    return await this.api.get(`fullcollections`, {
      params: {...defaultQuery, ...query?.toQuery()}
    });
  }
}

export default CollectionsRepository;