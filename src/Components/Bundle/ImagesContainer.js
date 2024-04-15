import React, {useRef, useState} from 'react';
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from '@market/helpers/hacks';
import {Box, Center, Flex} from "@chakra-ui/react";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Navigation, Thumbs} from "swiper/modules";
import {fallbackImageUrl} from "@src/core/constants";
import ImageService from "@src/core/services/image";

const ImageContainer = ({ nft }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef(null)

  const selectImage = (index) => {
    if (sliderRef) {
      sliderRef.current?.swiper.slideTo(index)
    }
  }

  return nft.nfts ? (
    <Flex className='bundle-images-container' flexDir='column' width='100%' >
      <div className="card-img-container">

        <Swiper
          ref={sliderRef}
          navigation={true}
          modules={[Navigation, FreeMode, Thumbs]}
          className="mySwiper"
          onSlideChange={({ activeIndex }) => setCurrentIndex(activeIndex)}
          value={3}
        >

          <Center className="index-counter">
            {`${currentIndex + 1} of ${nft.nfts?.length}`}
          </Center>

          {nft.nfts.map((nft) => (
            <SwiperSlide key={nft.id}>
              <Flex className='main-image' flexDir='column'>
                <AnyMedia
                  image={ImageService.translate(specialImageTransform(nft.address, nft.image)).convert()}
                  video={nft.video ?? nft.animationUrl ?? nft.animation_url}
                  videoProps={{ height: 'auto', autoPlay: true }}
                  thumbnail={!!nft.video || !!nft.animationUrl || !!nft.animation_url ? ImageService.translate(nft.video ?? nft.animationUrl ?? nft.animation_url).thumbnail() : undefined}
                  title={nft.name}
                  usePlaceholder={true}
                  className="img-fluid img-rounded mb-sm-30"
                />
              </Flex>
            </SwiperSlide>))}

        </Swiper>
      </div>
      <Flex className='image-menu' padding='8px' >
        <Flex>
          {nft.nfts.map((nft, index) => (
            <Box key={nft.id} className={currentIndex === index ? 'active' : ''} w='72px' marginRight='16px' onClick={() => { selectImage(index) }}>
              <MultimediaImage
                source={ImageService.translate(specialImageTransform(nft.address, nft.image)).fixedWidth(100, 100)}
                fallbackSource={ImageService.translate(ImageService.translate(nft.image).thumbnail()).fixedWidth(100, 100)}
                title={nft.name}
                className="img-fluid img-rounded mb-sm-30"
              />
            </Box>))}
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <AnyMedia
      image={fallbackImageUrl()}
      title={nft.name}
      className="img-fluid img-rounded mb-sm-30"
    />
  );
}

export default ImageContainer;