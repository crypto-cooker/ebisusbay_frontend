import React, {memo, useEffect, useState} from 'react';

import Slider from '@src/Components/components/Slider';
import PreviewCard from '@src/components-v2/shared/preview-card';
import {appConfig} from "@src/Config";
import LocalDataService from "@src/core/services/local-data-service";
import {millisecondTimestamp} from "@market/helpers/utils";
import {Drop} from "@src/core/models/drop";
import {useAppDispatch} from "@market/state/redux/store/hooks";

const drops = appConfig('drops');

const UpcomingDrops = () => {
  const dispatch = useAppDispatch();

  const [upcomingDrops, setUpcomingDrops] = useState<any[]>([]);

  function arrangeCollections() {

    const ads = LocalDataService
      .getDropsAds()
      .map(ad => ({
        ...ad.details,
        id: 99999,
        slug: ad.name,
        title: ad.name,
        subtitle: '',
        description: '',
        author: {
          ...ad.details.socials,
          name: ad.details.author
        },
        address: '',
        maxMintPerTx: 0,
        maxMintPerAddress: 0,
        totalSupply: 0,
        start: millisecondTimestamp(ad.details.date),
        published: true,
        images: {
          ...ad.details.images,
          banner: ''
        },
        verification: {
          ...ad.details.verification,
          escrow: false
        },
        redirect: ad.details.link.url,
        erc20Only: false,
        memberMitama: 0
      } as Drop));

    const nextDrops = drops
      .concat(ads)
      .filter((d: any) => !d.complete && d.published && (!d.start || d.start > Date.now()));

    const dropsWithDate = nextDrops
      .filter((d: any) => d.start)
      .sort((a: any, b: any) => (a.start > b.start ? 1 : -1));
    const dropsWithoutDate = nextDrops
      .filter((d: any) => !d.start)
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

    setUpcomingDrops([...dropsWithDate, ...dropsWithoutDate]);
  }

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  return (
    <div className="nft">
      <Slider size={upcomingDrops.length}>
        {upcomingDrops && upcomingDrops.map((drop: any, index) => (
          <PreviewCard
            key={index}
            index={index + 1}
            avatar={drop.images.avatar}
            banner={drop.slug === 'izanamis-cradle-land-deeds' ? 'https://cdn-prod.ebisusbay.com/files/collection-images/izanamis-cradle-land-deeds/card-animated.webp' : drop.images.preview}
            title={drop.title}
            subtitle={`${drop.start ? new Date(drop.start).toDateString() : 'TBA'}`}
            collectionId={drop.slug}
            url={drop.redirect ?? `/drops/${drop.slug}`}
            externalPage={!!drop.redirect}
            verified={drop.verification.verified}
            contextComponent={null}
          />
        ))}
      </Slider>
    </div>
  );
};

export default memo(UpcomingDrops);
