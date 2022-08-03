import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import CustomSlide from '../components/CustomSlide';
import { appConfig } from "../../Config";

const collections = appConfig('collections');
const drops = appConfig('drops');

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  adaptiveHeight: 300,
  lazyLoad: true,
  responsive: [],
};

const resolutions = [480, 600, 1600, 1900];

const UpcomingDrops = () => {
  const dispatch = useDispatch();

  const [upcomingDrops, setUpcomingDrops] = useState([]);

  function arrangeCollections() {
    const nextDrops = drops.filter((d) => !d.complete && d.published && (!d.start || d.start > Date.now()));
    const dropCollections = nextDrops.map((d) => {
      const collection = collections.find((c) => c.slug === d.slug);
      return { collection, drop: d };
    });

    const dropsWithDate = dropCollections
      .filter((d) => d.collection && d.drop.start)
      .sort((a, b) => (a.drop.start > b.drop.start ? 1 : -1));
    const dropsWithoutDate = dropCollections
      .filter((d) => d.collection && !d.drop.start)
      .sort((a, b) => (a.drop.name > b.drop.name ? 1 : -1));

    setUpcomingDrops([...dropsWithDate, ...dropsWithoutDate]);
  }

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

  const settingsGeneration = (cant) => {
    const newSettings = settings;
    if (cant > 0 && settings.responsive.length < resolutions.length) {
      if (cant <= 3) {
        newSettings.infinite = false,
          newSettings.adaptiveHeight = false
      }
      for (let i = resolutions.length - 1; i >= 0; i--) {

        if (i < cant) {
          newSettings.responsive.push({
            breakpoint: resolutions[i],
            settings: {
              slidesToShow: i + 1,
              slidesToScroll: i + 1,
              infinite: true,
            },
          })
        } else {
          newSettings.responsive.push({
            breakpoint: resolutions[i],
            settings: {
              slidesToShow: i + 1,
              slidesToScroll: i + 1,
              infinite: false,
            },
          })
        }
      }
    }

    return newSettings;
  }

  return (
    <div className="nft">
      {upcomingDrops.length > 0 && <Slider {...settingsGeneration(upcomingDrops.length)} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
        {upcomingDrops && upcomingDrops.map((item, index) => (
          <CustomSlide
            key={index}
            index={index + 1}
            avatar={item.drop.imgAvatar}
            banner={item.collection.metadata.card}
            title={item.drop.title}
            subtitle={`${item.drop.start ? new Date(item.drop.start).toDateString() : 'TBA'}`}
            collectionId={item.drop.slug}
            url={item.drop.redirect ?? `/drops/${item.drop.slug}`}
            externalPage={!!item.drop.redirect}
            verified={item.collection.metadata.verified}
          />
        ))}
      </Slider>
      }
    </div>
  );
};

export default memo(UpcomingDrops);
