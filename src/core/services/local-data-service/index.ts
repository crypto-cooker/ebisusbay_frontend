import {appConfig} from "@src/Config";
import {Drop, mapDrop} from "@src/core/models/drop";
import {ciEquals, millisecondTimestamp} from "@market/helpers/utils";
import ads from "@src/core/data/ads2.json";
import {AdPlacement, DropsAdDetails, RdAdDetails} from "@src/core/services/local-data-service/types";

const drops = appConfig('drops');

class LocalDataService {
  getDrop(slug: string): Drop | null {
    const drop = drops.find((drop: any) => ciEquals(drop.slug, slug));
    return !!drop ? mapDrop(drop) : null;
  }

  getAdsByPlacement<T extends AdPlacement>(typeGuard: (ad: AdPlacement) => ad is T): T[] {
    return (ads as AdPlacement[]).filter(typeGuard);
  }

  getRdBoardAds() {
    return this.getAdsByPlacement((ad): ad is AdPlacement & { details: RdAdDetails } => ad.placement === 'rd-board')
      .filter(ad => {
        const now = Date.now();
        return now > millisecondTimestamp(ad.start) && (!ad.end || now < millisecondTimestamp(ad.end));
      })
      .sort((a, b) => a.details.weight < b.details.weight ? 1 : -1);
  }

  getDropsAds() {
    return this.getAdsByPlacement((ad): ad is AdPlacement & { details: DropsAdDetails } => ad.placement === 'drops')
      .filter(ad => {
        const now = Date.now();
        return now > millisecondTimestamp(ad.start) && (!ad.end || now < millisecondTimestamp(ad.end));
      })
      .sort((a, b) => a.details.weight < b.details.weight ? 1 : -1);
  }
}

export default new LocalDataService();