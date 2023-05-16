import {appConfig} from "@src/Config";
import {Drop, mapDrop} from "@src/core/models/drop";
import {caseInsensitiveCompare} from "@src/utils";

const drops = appConfig('drops');

class LocalDataService {
  getDrop(slug: string): Drop | null {
    const drop = drops.find((drop: any) => caseInsensitiveCompare(drop.slug, slug));
    return !!drop ? mapDrop(drop) : null;
  }
}

export default new LocalDataService();