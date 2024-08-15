import Query from "@src/core/services/api-service/mapi/queries/index";
import * as Yup from "yup";
import {InvalidState, OrderState} from "@src/core/services/api-service/types";

export const dealListQuerySchema: Yup.SchemaOf<DealListQueryParams> = Yup.object().shape({
  id: Yup.string().optional(),
  verified: Yup.number().optional(),
  maker: Yup.string().optional(),
  taker: Yup.string().optional(),
  sortBy: Yup.mixed().oneOf(['id', 'listingtime', 'saletime', 'expirationdate']).optional(),
  direction: Yup.mixed().oneOf(['asc', 'desc']).optional(),
  state: Yup.number().optional(),
  page: Yup.number().optional().default(1),
  pageSize: Yup.number().optional().default(50),
  search: Yup.string().optional(),
  invalid: Yup.number().optional(),
  minListingTime: Yup.number().optional(),
  maxListingTime: Yup.number().optional(),
}).noUnknown();

export interface DealListQueryParams {
  id?: string;
  verified?: number;
  maker?: string;
  taker?: string;
  sortBy?: 'id' | 'listingtime' | 'saletime' | 'expirationdate';
  direction?: 'asc' | 'desc';
  state?: OrderState;
  page?: number;
  pageSize?: number;
  search?: string;
  invalid?: InvalidState;
  minListingTime?: number;
  maxListingTime?: number;
}

export class DealListQuery extends Query<DealListQueryParams> {

  defaultParams(): DealListQueryParams {
    return {
      state: OrderState.ACTIVE
    };
  }
}
