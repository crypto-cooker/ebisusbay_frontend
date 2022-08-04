import { useCallback } from 'react';
import SliderRS from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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

const MAX_ITEM_RENDER = 4
const resolutions = [1900, 1600, 600, 480];


const Slider = ({ children, size }) => {

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

  const settingsGeneration = useCallback(() => {
    return resolutions.reduce((config, breakpoint, i) => {
      const adaptiveHeight = size > 3 ? settings.adaptiveHeight : false
      const infinite = typeof adaptiveHeight == 'boolean'? adaptiveHeight : false

      return ({
        ...config,
        infinite,
        adaptiveHeight,
        responsive: [
          ...config.responsive,
          {
            breakpoint,
            settings: {
              slidesToShow: MAX_ITEM_RENDER - i,
              slidesToScroll: MAX_ITEM_RENDER - i,
              infinite: MAX_ITEM_RENDER - i < size,
            },
          }
        ]
      })
    }, settings)
  }, [size])

  return (
    <div className="nft">
      {size > 0 && (
        <SliderRS {...settingsGeneration()} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
          {children}
        </SliderRS>
      )}
    </div>
  )
}

export default Slider;