import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Slider from '../components/Slider';

import CustomSlide from '../components/CustomSlide';
import { appConfig } from "../../Config";

const drops = appConfig('drops');
const collections = appConfig('collections');
const defaultCardImage = '/img/collections/default/card.jpg';

const PastDrops = () => {
  const dispatch = useDispatch();

  const [pastDrops, setPastDrops] = useState([]);

  function arrangeCollections() {
    const completedDrops = drops.filter((d) => d.complete && d.published);
    const dropCollections = completedDrops.map((d) => {
      const collection = collections.find((c) => c.slug === d.slug);
      return { collection, drop: d };
    });
    setPastDrops(dropCollections.filter((d) => d.collection).sort((a, b) => (a.drop.start < b.drop.start ? 1 : -1)));
  }

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  return (
    <div className="nft">
      <Slider size={pastDrops.length}>
        {pastDrops &&
          pastDrops.map((item, index) => (
            <CustomSlide
              key={index}
              index={index + 1}
              avatar={item.drop.imgAvatar}
              banner={item.collection.metadata.card ?? defaultCardImage}
              title={item.drop.title}
              collectionId={item.drop.slug}
              url={`/collection/${item.collection.slug}`}
              verified={item.collection.metadata.verified}
            />
          ))}
      </Slider>
    </div>
  );
};

export default memo(PastDrops);
