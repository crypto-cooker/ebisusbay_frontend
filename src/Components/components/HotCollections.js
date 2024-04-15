import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '../components/Slider';

import PreviewCard from '../../components-v2/shared/preview-card';
import { getAllCollections } from '@market/state/redux/slices/collectionsSlice';

const HotCollections = () => {
  const dispatch = useDispatch();

  const hotCollections = useSelector((state) => {
    return state.collections.collections
      .slice()
      .sort((a, b) => {
        const aVal = parseInt(a.volume1d); // * parseInt(a.sales1d);
        const bVal = parseInt(b.volume1d); // * parseInt(b.sales1d);
        return aVal < bVal ? 1 : -1;
      })
      .slice(0, 10);
  });

  useEffect(() => {
    dispatch(getAllCollections());
  }, [dispatch]);

  return (
    <div className="nft">
      <Slider size={hotCollections.length}>
        {hotCollections &&
          hotCollections.map((item, index) => (
            <PreviewCard
              key={index}
              index={index + 1}
              avatar={item.metadata.avatar}
              banner={item.metadata.card}
              title={item.name}
              collectionId={item.address}
              url={`/collection/${item.slug}`}
              verified={item.verification?.verified}
            />
          ))}
      </Slider>
    </div>
  );
};

export default memo(HotCollections);
