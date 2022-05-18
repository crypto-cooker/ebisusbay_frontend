import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from './constants';
import CustomSlide from '../components/CustomSlide';
import config from '../../Assets/networks/rpc_config.json';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
export const drops = config.drops;
export const collections = config.known_contracts;

const carouselSetings = {
  ...settings,
};

const CurrentDrops = ({ useCarousel = true }) => {
  const dispatch = useDispatch();
  const threePerRowSize = window.innerWidth < 992;

  const [currentDrops, setCurrentDrops] = useState([]);
  const [showAll, setShowAll] = useState(false);

  function arrangeCollections() {
    const liveDrops = drops.filter((d) => !d.complete && d.published && d.start && d.start < Date.now());
    const dropCollections = liveDrops.map((d) => {
      const collection = collections.find((c) => c.slug === d.slug);
      return { collection, drop: d };
    });
    setCurrentDrops(dropCollections.filter((d) => d.collection).sort((a, b) => (a.drop.start < b.drop.start ? 1 : -1)));
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
      {useCarousel ? (
        <div className="nft">
          <Slider {...carouselSetings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
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
          currentDrops.slice(showAll ? undefined : 0, showAll ? undefined : (threePerRowSize ? 3 : 4)).map((item, index) => (
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
            <span className="text-end fw-bold pe-4" onClick={onSeeMoreClicked} style={{cursor: 'pointer'}}>See More</span>
          )}
        </div>
      )}
    </>
  );
};

export default memo(CurrentDrops);
