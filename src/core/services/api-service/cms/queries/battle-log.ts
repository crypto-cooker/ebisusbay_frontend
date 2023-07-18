import * as Yup from "yup";

export interface GetBattleLog {
  address: string;
  signature: string;
  gameId: number;
  page?: number;
  pageSize?: number;
  orderBy?: string;
}

export const getBattleLogSchema: Yup.SchemaOf<GetBattleLog> = Yup.object().shape({
  address: Yup.string().required(),
  signature: Yup.string().required(),
  gameId: Yup.number().required(),
  page: Yup.number().optional().default(1),
  pageSize: Yup.number().optional().default(10),
  orderBy: Yup.string().optional()
}).noUnknown();