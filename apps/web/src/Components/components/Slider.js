import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

const Slider = ({ children, size }) => {
  return (
    <div className="nft">
      {size > 0 && (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation={true}
          modules={[Navigation, Pagination]}
          className="mySwiper"
          breakpoints={{
            600: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1900: {
              slidesPerView: 4,
            },
          }}
        >
          {children.map((c) => <SwiperSlide>{c}</SwiperSlide>)}
        </Swiper>
      )}
    </div>
  )
}

export default Slider;