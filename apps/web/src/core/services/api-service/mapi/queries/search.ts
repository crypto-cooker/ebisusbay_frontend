import {isEmptyObj} from "@market/helpers/utils";

class SearchQuery {
  address?: string;
  page?: number;
  pageSize?: number;
  id?: string;
  search: string;
  sortBy?: string;
  direction?: string;
  verified?: boolean;
  owner?: string;
  slug?: string;

  constructor(json: any) {
    this.search = json.search;
    Object.assign(this, json);
  }

  toQuery() {
    const addresses = Array.isArray(this.address) ? this.address.join(',') : this.address;

    const obj = {
      address: addresses,
      page: this.page,
      pageSize: this.pageSize,
      id: this.id,
      search: this.search,
      sortBy: this.sortBy,
      direction: this.direction,
      verified: this.verified,
      owner: this.owner,
      slug: this.slug
    };

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return !!v && !isEmptyObj(v)
    }));
  }
}

export default SearchQuery;