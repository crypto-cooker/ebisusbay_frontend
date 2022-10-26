import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Slider from '../components/Slider';
import CustomSlide from '../components/CustomSlide';
import { appConfig } from "../../Config";

const drops = appConfig('drops');

const UpcomingDrops = () => {
  const dispatch = useDispatch();

  const [upcomingDrops, setUpcomingDrops] = useState([]);

  function arrangeCollections() {
    const nextDrops = drops.filter((d) => !d.complete && d.published && (!d.start || d.start > Date.now()));
    const dropCollections = nextDrops.map((d) => {
      return { drop: d };
    });

    const dropsWithDate = dropCollections
      .filter((d) => d.drop.start)
      .sort((a, b) => (a.drop.start > b.drop.start ? 1 : -1));
    const dropsWithoutDate = dropCollections
      .filter((d) => !d.drop.start)
      .sort((a, b) => (a.drop.name > b.drop.name ? 1 : -1));

    setUpcomingDrops([...dropsWithDate, ...dropsWithoutDate]);
  }

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  return (
    <div className="nft">
      <Slider size={upcomingDrops.length}>
        {upcomingDrops && upcomingDrops.map((item, index) => (
          <CustomSlide
            key={index}
            index={index + 1}
            avatar={item.drop.images.avatar}
            banner={item.drop.images.preview}
            title={item.drop.title}
            subtitle={`${item.drop.start ? new Date(item.drop.start).toDateString() : 'TBA'}`}
            collectionId={item.drop.slug}
            url={item.drop.redirect ?? `/drops/${item.drop.slug}`}
            externalPage={!!item.drop.redirect}
            verified={item.drop.verification.verified}
          />
        ))}
      </Slider>
    </div>
  );
};

export default memo(UpcomingDrops);
