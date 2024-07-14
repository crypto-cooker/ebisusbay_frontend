import React, {memo, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import PreviewCard from '@src/components-v2/shared/preview-card';
import {appConfig} from "@src/Config";
import Slider from '@src/Components/components/Slider';
import LocalDataService from "@src/core/services/local-data-service";
import {millisecondTimestamp} from "@market/helpers/utils";
import {Drop} from "@src/core/models/drop";
import {useAppDispatch} from "@market/state/redux/store/hooks";

const drops = appConfig('drops');

const CurrentDrops = ({ useCarousel = true }) => {
  const dispatch = useAppDispatch();
  const threePerRowSize = typeof window !== 'undefined' && window.innerWidth < 992;

  const [currentDrops, setCurrentDrops] = useState([]);
  const [showAll, setShowAll] = useState(false);

  function arrangeCollections() {
    const ads = LocalDataService
      .getDropsAds()
      .map(ad => ({
        ...ad.details,
        id: 99999,
        slug: ad.name,
        title: ad.name,
        subtitle: '',
        description: '',
        author: {
          ...ad.details.socials,
          name: ad.details.author
        },
        address: '',
        maxMintPerTx: 0,
        maxMintPerAddress: 0,
        totalSupply: 0,
        start: millisecondTimestamp(ad.details.date),
        published: true,
        images: {
          ...ad.details.images,
          banner: ''
        },
        verification: {
          ...ad.details.verification,
          escrow: false
        },
        redirect: ad.details.link.url,
        erc20Only: false,
        memberMitama: 0
      } as Drop));

    const liveDrops = drops.concat(ads).filter((d: any) => !d.complete && d.published && d.start && d.start < Date.now());
    const cd = liveDrops.sort((a: any, b: any) => (a.start < b.start ? 1 : -1));
    setCurrentDrops(cd);
  }

  const onSeeMoreClicked = () => {
    setShowAll(true);
  };

  useEffect(() => {
    arrangeCollections();
  }, [dispatch]);

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={style} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );
  };

  const NextArrow = (props: any) => {
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
              currentDrops.map((drop: any, index) => (
                  <PreviewCard
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
                    contextComponent={null}
                  />
              ))}
          </Slider>
        </div>
      ) : (
        <div className="row">
          {currentDrops &&
            currentDrops
              .slice(showAll ? undefined : 0, showAll ? undefined : threePerRowSize ? 3 : 4)
              .map((drop: any, index) => (
                <div className="col-12 col-xs-6 col-md-4 col-lg-3 my-2" key={index}>
                  <PreviewCard
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
                    contextComponent={null}
                  />
                </div>
              ))}
          {!showAll && !!currentDrops && currentDrops.length > 0 && (
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
