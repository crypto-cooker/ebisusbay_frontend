import React, { memo } from 'react';
import Slider from '../components/Slider';

import CustomSlide from './CustomSlide';
import { appConfig } from "../../Config";
const drops = appConfig('drops');

const LatestDropsCollection = () => {
  return (
    <div className="nft">
      <Slider size={drops.length}>
        {drops &&
          drops.map((drop, index) => (
            <CustomSlide
              key={index}
              index={index + 1}
              avatar="/img/collections/crosmonauts/avatar.png"
              banner="/img/collections/crosmonauts/card.png"
              title={drop.title}
              // subtitle={drop.subtitle}
              collectionId={drop.address}
              url={`/drops/${drop.slug}`}
            />
          ))}
      </Slider>
    </div>
  );
};

export default memo(LatestDropsCollection);
