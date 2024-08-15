import * as Yup from "yup";

export interface DeployTroopsRequest {
  troops: number;
  toControlPointId: number;
  fromFactionId?: number;
  fromProfileId?: number;
  toFactionId: number;
}

export const deployTroopsRequestSchema: Yup.SchemaOf<DeployTroopsRequest> = Yup.object().shape({
  troops: Yup.number().required(),
  toControlPointId: Yup.number().required(),
  fromFactionId: Yup.number()
    .notRequired()
    .test(
      'xor-fromProfileId',
      'Either fromFactionId or fromProfileId must be provided, but not both',
      function(value) {
        const { fromProfileId } = this.parent;
        return (value == null) !== (fromProfileId == null);
      }
    ),
  fromProfileId: Yup.number()
    .notRequired()
    .test(
      'xor-fromFactionId',
      'Either fromProfileId or fromFactionId must be provided, but not both',
      function(value) {
        const { fromFactionId } = this.parent;
        return (value == null) !== (fromFactionId == null);
      }
    ),
  toFactionId: Yup.number().required(),
}).noUnknown();