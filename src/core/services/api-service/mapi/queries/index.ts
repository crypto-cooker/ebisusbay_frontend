import {isEmptyObj} from "@src/utils";

abstract class Query<Params> {
  params?: Params;

  constructor(params?: Params) {
    this.params = {
      ...this.defaultParams(),
      ...params
    };
  }

  abstract defaultParams(): Params;

  toQuery() {
    const obj = {...this.params};

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return v !== undefined && !isEmptyObj(v)
    }));
  }

}

export default Query;