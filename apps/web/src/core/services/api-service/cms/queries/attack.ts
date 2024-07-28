import * as Yup from "yup";

export interface AttackRequest {
  factionId: number;
  defendingFactionId: number;
  troops: number;
  controlPointId: number;
  battleType?: number;
  role?: string;
}

export const attackRequestSchema: Yup.SchemaOf<AttackRequest> = Yup.object().shape({
  factionId: Yup.number().required(),
  defendingFactionId: Yup.number().required(),
  troops: Yup.number().required(),
  controlPointId: Yup.number().required(),
  battleType: Yup.number().notRequired(),
  role: Yup.string().notRequired(),
}).noUnknown();