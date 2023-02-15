import React, {useRef, useState} from 'react';
import {AnyMedia} from '@src/Components/components/AnyMedia'
import {specialImageTransform} from '@src/hacks';
import {Box, Center, Flex} from "@chakra-ui/react";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Navigation, Thumbs} from "swiper";
import {fallbackImageUrl} from "@src/core/constants";

const ImageContainer = ({ nft }) => {
  console.log('NFT', nft);
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
                  image={specialImageTransform(nft.address, nft.image)}
                  video={nft.video ?? nft.animation_url}
                  videoProps={{ height: 'auto', autoPlay: true }}
                  title={'title'}
                  usePlaceholder={false}
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
              <AnyMedia
                image={specialImageTransform(nft.address, nft.image)}
                video={nft.video ?? nft.animation_url}
                videoProps={{ height: 'auto', autoPlay: true }}
                title={'title'}
                usePlaceholder={false}
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