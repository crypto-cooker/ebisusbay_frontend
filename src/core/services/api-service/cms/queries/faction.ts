import * as Yup from "yup";

export interface FactionUpdateRequest {
  id: string;
  name?: string;
  addresses?: string[];
  type?: string;
  image?: string;
  officers?: string[];
}

export const factionUpdateRequestSchema: Yup.SchemaOf<FactionUpdateRequest> = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().notRequired(),
  addresses: Yup.array().of(Yup.string()).notRequired(),
  type: Yup.string().notRequired(),
  image: Yup.string().notRequired(),
  officers: Yup.array().of(Yup.string()).notRequired()
}).noUnknown();