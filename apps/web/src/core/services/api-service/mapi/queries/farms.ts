import Query from "@src/core/services/api-service/mapi/queries/index";
import * as Yup from "yup";

export const farmsQuerySchema: Yup.SchemaOf<FarmsQueryParams> = Yup.object().shape({
  sortBy: Yup.mixed().oneOf(['totalusers', 'apr', 'stakedLiquidity', 'pid']),
  direction: Yup.mixed().oneOf(['asc', 'desc']),
  finished: Yup.number().optional(),
  search: Yup.string().optional(),
  chain: Yup.number().optional()
}).noUnknown();

export interface FarmsQueryParams {
  sortBy?: 'users' | 'apr' | 'stakedliquidity' | 'pid';
  direction?: 'asc' | 'desc';
  finished?: number;
  search?: string;
  chain?: number;
}

export class FarmsQuery extends Query<FarmsQueryParams> {

  defaultParams(): FarmsQueryParams {
    return {};
  }
}
