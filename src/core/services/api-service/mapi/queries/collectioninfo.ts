import Query from "@src/core/services/api-service/mapi/queries/index";
import * as Yup from "yup";

export const collectionInfoQuerySchema: Yup.SchemaOf<CollectionInfoQueryParams> = Yup.object().shape({
  address: Yup.array().of(Yup.string()).optional(),
  page: Yup.number().optional().default(1),
  pageSize: Yup.number().optional().default(50),
  id: Yup.number().optional(),
  search: Yup.string().optional(),
  sortBy: Yup.mixed().oneOf(['totalvolume', 'totalvolume1d', 'totalvolume7d', 'totalvolume30d',
    'totalsales1d', 'totalsales7d', 'totalsales30d', 'totalsales',
    'totalactive', 'totalaveragesaleprice', 'totalfloorprice',
    'volume', 'sales', 'floorprice', 'avgsaleprice', 'active',
    'volume1d', 'sales1d', 'avgsaleprice1d',
    'volume7d', 'sales7d', 'avgsaleprice7d',
    'volume30d', 'sales30d', 'avgsaleprice30d',
    'name']).default('totalvolume'),
  direction: Yup.mixed().oneOf(['asc', 'desc']).default('desc'),
  verified: Yup.number().optional(),
  owner: Yup.string().optional(),
  slug: Yup.string().optional(),
  supported: Yup.number().optional()
}).noUnknown();

export interface CollectionInfoQueryParams {
  address?: string[];
  page?: number;
  pageSize?: number;
  id?: number;
  search?: string;
  sortBy?: 'totalvolume' | 'totalvolume1d' | 'totalvolume7d' | 'totalvolume30d' | 'totalsales1d' |
    'totalsales7d' | 'totalsales30d' | 'totalsales' | 'totalactive' | 'totalaveragesaleprice' |
    'totalfloorprice' | 'volume' | 'sales' | 'floorprice' | 'avgsaleprice' | 'active' | 'volume1d' |
    'sales1d' | 'avgsaleprice1d' | 'volume7d' | 'sales7d' | 'avgsaleprice7d' | 'volume30d' | 'sales30d' |
    'avgsaleprice30d' | 'name';
  direction?: 'asc' | 'desc';
  verified?: number;
  owner?: string;
  slug?: string;
  supported?: number;
}

export class CollectionInfoQuery extends Query<CollectionInfoQueryParams> {

  defaultParams(): CollectionInfoQueryParams {
    return {};
  }
}
