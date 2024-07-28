import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import {FarmsQuery, farmsQuerySchema} from "@src/core/services/api-service/mapi/queries/farms";

class FarmsRepository extends MapiRepository {

  async getFarms(query?: FarmsQuery) {
    await farmsQuerySchema.validate(query);

    return await this.api.get(`farms`, {
      params: query?.toQuery()
    });
  }
}

export default FarmsRepository;