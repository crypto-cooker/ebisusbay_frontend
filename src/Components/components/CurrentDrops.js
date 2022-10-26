import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CustomSlide from '../components/CustomSlide';
import {appConfig} from "@src/Config";
import Slider from '../components/Slider';

const drops = appConfig('drops');

const CurrentDrops = ({ useCarousel = true }) => {
  const dispatch = useDispatch();
  const threePerRowSize = typeof window !== 'undefined' && window.innerWidth < 992;

  const [currentDrops, setCurrentDrops] = useState([]);
  const [showAll, setShowAll] = useState(false);

  function arrangeCollections() {
    const liveDrops = drops.filter((d) => !d.complete && d.published && d.start && d.start < Date.now());
    const cd = liveDrops.filter((d) => d.collection).sort((a, b) => (a.start < b.start ? 1 : -1));
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
              currentDrops.map((drop, index) => (
                  <CustomSlide
                    key={index}
                    index={index + 1}
                    avatar={drop.images.avatar}
                    banner={drop.images.preview}
                    title={drop.title}
                    subtitle={drop.author.name}
                    collectionId={drop.slug}
                    url={drop.redirect ?? `/drops/${drop.slug}`}
                    externalPage={!!drop.redirect}
                    verified={drop.verification.verified}
                  />
              ))}
          </Slider>
        </div>
      ) : (
        <div className="row">
          {currentDrops &&
            currentDrops
              .slice(showAll ? undefined : 0, showAll ? undefined : threePerRowSize ? 3 : 4)
              .map((drop, index) => (
                <div className="col-12 col-xs-6 col-md-4 col-lg-3" key={index}>
                  <CustomSlide
                    key={index}
                    index={index + 1}
                    avatar={drop.images.avatar}
                    banner={drop.images.preview}
                    title={drop.title}
                    subtitle={drop.author.name}
                    collectionId={drop.drop.slug}
                    url={drop.redirect ?? `/drops/${drop.slug}`}
                    externalPage={!!drop.redirect}
                    verified={drop.verification.verified}
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
