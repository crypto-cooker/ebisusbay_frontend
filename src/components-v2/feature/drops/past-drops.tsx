import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Slider from '@src/Components/components/Slider';

import PreviewCard from '@src/components-v2/shared/preview-card';
import { appConfig } from "@src/Config";

const drops = appConfig('drops');
const defaultCardImage = '/img/collections/default/card.jpg';

const PastDrops = () => {
  const dispatch = useDispatch();

  const [pastDrops, setPastDrops] = useState([]);

  function arrangeCollections() {
    const completedDrops = drops.filter((d: any) => d.complete && d.published);
    const dropCollections = completedDrops.sort((a: any, b: any) => (a.start < b.start ? 1 : -1));
    setPastDrops(dropCollections);
  }

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  return (
    <div className="nft">
      <Slider size={pastDrops.length}>
        {pastDrops &&
          pastDrops.map((drop: any, index) => (
            <PreviewCard
              key={index}
              index={index + 1}
              avatar={drop.images.avatar}
              banner={drop.images.preview ?? defaultCardImage}
              title={drop.title}
              subtitle={null}
              collectionId={drop.slug}
              url={`/collection/${drop.slug}`}
              verified={drop.verification.verified}
              contextComponent={null}
            />
          ))}
      </Slider>
    </div>
  );
};

export default memo(PastDrops);
