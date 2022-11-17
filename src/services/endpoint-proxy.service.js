import {getCollections as nextGetCollections} from "@src/core/api/next/collectioninfo";
import {getCollections as mapiGetCollections} from "@src/core/api/endpoints/collectioninfo";

class EndpointProxyService {

  constructor(useProxy = false) {
    this.useProxy = useProxy;
  };

  // MAPI Endpoints
  async getCollections(params) {
    return this.useProxy ? nextGetCollections(params) : mapiGetCollections(params);
  }

  // CMS Endpoints


}

export default EndpointProxyService;