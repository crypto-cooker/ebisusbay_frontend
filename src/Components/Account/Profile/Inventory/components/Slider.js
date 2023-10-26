import React, {useState} from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";
import { Center, Box } from "@chakra-ui/react";

export default function Slider({ children, size }) {

  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <>
    {size > 0 && (
      <Box maxW={'75vw'}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          onSlideChange={({ activeIndex }) => setCurrentIndex(activeIndex)}>

          <Center className="index-counter">
            {`${currentIndex + 1} of ${size}`}
          </Center>

          {children.map((c) => <SwiperSlide>{c}</SwiperSlide>)}

        </Swiper>
      </Box>
    )}
    </>
  );
}