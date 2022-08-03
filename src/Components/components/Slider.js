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

const resolutions = [480, 600, 1600, 1900];

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
    const newSettings = settings;
    if (size > 0 && settings.responsive.length < resolutions.length) {
      if (size <= 3) {
        newSettings.infinite = false,
          newSettings.adaptiveHeight = false
      }
      for (let i = resolutions.length - 1; i >= 0; i--) {

        if (i < size) {
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
  }, [size])

  return (
    <div className="nft">
      <SliderRS {...settingsGeneration()} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
        {children}
      </SliderRS>
    </div>
  )
}

export default Slider;