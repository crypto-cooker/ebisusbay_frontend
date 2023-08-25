import {OfferState} from "@src/core/services/api-service/types";
import Query from "@src/core/services/api-service/mapi/queries/index";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";

export interface OffersV2QueryParams extends OffersQueryParams {
  wallet?: string;
}

class OffersV2Query extends Query<OffersV2QueryParams> {

  defaultParams(): OffersV2QueryParams {
    return {
      state: OfferState.ACTIVE,
      traits: {},
      powertraits: {},
      page: 1
    };
  }

}

export default OffersV2Query;