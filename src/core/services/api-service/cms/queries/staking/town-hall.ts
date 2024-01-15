import * as Yup from "yup";

export interface TownHallStakeRequest {
  nfts: Array<{nftId: string, amount: number}>;
  collectionAddress: string;
  isAll: boolean;
}

export interface TownHallUnstakeRequest {
  nfts: Array<{nftId: string, amount: number}>;
  collectionAddress?: string;
  isAll: boolean;
  invalidOnly: boolean;
}

export const townHallStakeRequestSchema: Yup.SchemaOf<TownHallStakeRequest> = Yup.object().shape({
  nfts: Yup.array().of(Yup.object().shape({
    nftId: Yup.string().required(),
    amount: Yup.number().required(),
  }))
    .when('isAll', {
      is: true,
      then: Yup.array().notRequired(),
      otherwise: Yup.array().of(Yup.object().shape({
        nftId: Yup.string().required(),
        amount: Yup.number().required(),
      })).required()
    }),
  collectionAddress: Yup.string().required(),
  isAll: Yup.boolean().required(),
}).noUnknown();

export const townHallUnstakeRequestSchema: Yup.SchemaOf<TownHallUnstakeRequest> = Yup.object().shape({
  nfts: Yup.array().of(Yup.object().shape({
    nftId: Yup.string().required(),
    amount: Yup.number().required(),
  }))
    .when(['isAll', 'invalidOnly'], {
      is: (isAll: boolean, invalidOnly: boolean) => isAll || invalidOnly,
      then: Yup.array().notRequired(),
      otherwise: Yup.array().of(Yup.object().shape({
        nftId: Yup.string().required(),
        amount: Yup.number().required(),
      })).required()
    }),
  collectionAddress: Yup.string()
    .when('nfts', {
      is: (nfts: any) => !nfts || nfts.length === 0,
      then: Yup.string().notRequired(),
      otherwise: Yup.string().required()
    }),
  isAll: Yup.boolean().required(),
  invalidOnly: Yup.boolean().required(),
}).noUnknown();