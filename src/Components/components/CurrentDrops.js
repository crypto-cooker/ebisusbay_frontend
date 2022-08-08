import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import CustomSlide from '../components/CustomSlide';
import {appConfig} from "../../Config";
import Slider from '../components/Slider';
export const drops = appConfig('drops');
export const collections = appConfig('collections');

const CurrentDrops = ({ useCarousel = true }) => {
  const dispatch = useDispatch();
  const threePerRowSize = typeof window !== 'undefined' && window.innerWidth < 992;

  const [currentDrops, setCurrentDrops] = useState([]);
  const [showAll, setShowAll] = useState(false);

  function arrangeCollections() {
    const liveDrops = drops.filter((d) => !d.complete && d.published && d.start && d.start < Date.now());
    const dropCollections = liveDrops.map((d) => {
      const collection = collections.find((c) => c.slug === d.slug);
      return { collection, drop: d };
    });
    const cd = dropCollections.filter((d) => d.collection).sort((a, b) => (a.drop.start < b.drop.start ? 1 : -1));
    console.log('---sadf', cd);
    setCurrentDrops(cd);
  }

  const onSeeMoreClicked = () => {
    setShowAll(true);
  };

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={style} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={style} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  };

  return (
    <>
      {useCarousel  ? (
        <div className="nft">
          <Slider size={currentDrops.length}>
            {currentDrops &&
              currentDrops.map((item, index) => (
                  <CustomSlide
                    key={index}
                    index={index + 1}
                    avatar={item.drop.imgAvatar}
                    banner={item.collection.metadata.card}
                    title={item.drop.title}
                    subtitle={item.drop.author.name}
                    collectionId={item.drop.slug}
                    url={item.drop.redirect ?? `/drops/${item.drop.slug}`}
                    externalPage={!!item.drop.redirect}
                    verified={item.collection.metadata.verified}
                  />
              ))}
          </Slider>
        </div>
      ) : (
        <div className="row">
          {currentDrops &&
            currentDrops
              .slice(showAll ? undefined : 0, showAll ? undefined : threePerRowSize ? 3 : 4)
              .map((item, index) => (
                <div className="col-12 col-xs-6 col-md-4 col-lg-3" key={index}>
                  <CustomSlide
                    key={index}
                    index={index + 1}
                    avatar={item.drop.imgAvatar}
                    banner={item.collection.metadata.card}
                    title={item.drop.title}
                    subtitle={item.drop.author.name}
                    collectionId={item.drop.slug}
                    url={item.drop.redirect ?? `/drops/${item.drop.slug}`}
                    externalPage={!!item.drop.redirect}
                    verified={item.collection.metadata.verified}
                  />
                </div>
              ))}
          {!showAll && (
            <span className="text-end fw-bold pe-4" onClick={onSeeMoreClicked} style={{ cursor: 'pointer' }}>
              See More
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default memo(CurrentDrops);
