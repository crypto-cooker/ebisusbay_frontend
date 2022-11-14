import React, {useState} from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper";
import { Center } from "@chakra-ui/react";

export default function Slider({ children, size }) {

  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <>
    {size > 0 && (
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        onSlideChange={({ activeIndex }) => setCurrentIndex(activeIndex)}
        activeIndex={3}
        onSwiper={(swiper) => console.log(swiper)}>

        <Center className="index-counter">
          {`${currentIndex + 1} of ${size}`}
        </Center>

        {children.map((c) => <SwiperSlide>{c}</SwiperSlide>)}

      </Swiper>
    )}
    </>
  );
}