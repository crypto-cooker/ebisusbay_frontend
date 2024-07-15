import React, { memo, useEffect, useState } from 'react';

import Slider from '../components/Slider';
import PreviewCard from '../../components-v2/shared/preview-card';
import { appConfig } from "@src/Config";
import {useAppDispatch} from "@market/state/redux/store/hooks";

const drops = appConfig('drops');

const UpcomingDrops = () => {
  const dispatch = useAppDispatch();

  const [upcomingDrops, setUpcomingDrops] = useState([]);

  function arrangeCollections() {
    const nextDrops = drops.filter((d) => !d.complete && d.published && (!d.start || d.start > Date.now()));

    const dropsWithDate = nextDrops
      .filter((d) => d.start)
      .sort((a, b) => (a.start > b.start ? 1 : -1));
    const dropsWithoutDate = nextDrops
      .filter((d) => !d.start)
      .sort((a, b) => (a.name > b.name ? 1 : -1));

    setUpcomingDrops([...dropsWithDate, ...dropsWithoutDate]);
  }

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  return (
    <div className="nft">
      <Slider size={upcomingDrops.length}>
        {upcomingDrops && upcomingDrops.map((drop, index) => (
          <PreviewCard
            key={index}
            index={index + 1}
            avatar={drop.images.avatar}
            banner={drop.images.preview}
            title={drop.title}
            subtitle={`${drop.start ? new Date(drop.start).toDateString() : 'TBA'}`}
            collectionId={drop.slug}
            url={drop.redirect ?? `/drops/${drop.slug}`}
            externalPage={!!drop.redirect}
            verified={drop.verification.verified}
          />
        ))}
      </Slider>
    </div>
  );
};

export default memo(UpcomingDrops);
