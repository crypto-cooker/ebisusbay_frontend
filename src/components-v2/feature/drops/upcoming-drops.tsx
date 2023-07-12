import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Slider from '@src/Components/components/Slider';
import CustomSlide from '@src/Components/components/CustomSlide';
import { appConfig } from "@src/Config";

const drops = appConfig('drops');

const UpcomingDrops = () => {
  const dispatch = useDispatch();

  const [upcomingDrops, setUpcomingDrops] = useState<any[]>([]);

  function arrangeCollections() {
    const nextDrops = drops.filter((d: any) => !d.complete && d.published && (!d.start || d.start > Date.now()));

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
          <CustomSlide
            key={index}
            index={index + 1}
            avatar={drop.images.avatar}
            banner={drop.slug === 'izanamis-cradle-land-deeds' ? '/img/collections/izanamis-cradle-land-deeds/card-animated.webp' : drop.images.preview}
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
