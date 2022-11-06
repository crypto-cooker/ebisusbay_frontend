import React, { useEffect, useState } from 'react';
import PageHead from "../../src/Components/Head/PageHead";
import {hostedImage, ImageKitService} from "@src/helpers/image";
import brands from '@src/core/data/brands.json';
import {appConfig} from "@src/Config";
import {Box, Button, Center, Heading, SimpleGrid, Text, useBreakpointValue} from "@chakra-ui/react";
import CustomSlide from "@src/Components/components/CustomSlide";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import Footer from "@src/Components/components/Footer";

const Brand = ({ brand, collections }) => {
  const [viewMore, setViewMore] = useState(false);
  const isClippingDescription = useBreakpointValue(
    {base: true, sm: false},
    {fallback: 'sm'}
  )

  return (
    <>
      <PageHead
        title={brand.name}
        description={brand.description}
        url={`/brand/${brand.slug}`}
        image={hostedImage(brand.images.banner)}
      />
      <Box
        position="relative"
        minH="300px"
        shadow="0 1px 25px black"
      >
        <Box
          style={{
            backgroundImage: `url(${ImageKitService.buildBannerUrl(brand.images.banner ?? '')})`,
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
          filter='brightness(0.4)'
          h="100%"
          position="absolute"
          w="100%"
        >

        </Box>
        <Box position="relative" bottom={0} px={10} pt={{base: '75px', md:'40px'}} pb={4}>
          <Heading color="white">{brand.name}</Heading>
          <SocialsBar
            socials={brand.socials}
          />
          <Text maxW="800px" mt={1} color="white" noOfLines={{base: viewMore ? 0 : 3, sm: 0}}>
            {brand.description}
          </Text>
          {brand.description.length > 150 && isClippingDescription && !viewMore && (
            <Button size="xs" colorScheme="blue" onClick={() => setViewMore(true)}>
              View More
            </Button>
          )}
        </Box>
        <div className="mainbreadcumb"></div>
      </Box>

      <Box mt={6}>
        <Box>
          <Center>
            <Heading as="h2" size="xl" mb={2}>Collections</Heading>
          </Center>
        </Box>
        <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}}>
          {collections.map((collection, index) => (
            <CustomSlide
              key={index}
              index={index + 1}
              banner={collection.metadata.card}
              avatar={collection.metadata.avatar}
              title={collection.name}
              subtitle={collection.metadata.description}
              collectionId={collection.slug ?? collection.address}
              url={`/collection/${collection.slug ?? collection.address}`}
              verified={collection.metadata.verified}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Footer />
    </>
  );
};

export const getServerSideProps = async ({ params, query }) => {
  const slug = params?.slug;
  const brand = brands.find((brand) => brand.slug === slug);

  // @todo: replace with API query once /collectioninfo supports multiple addresses
  const brandCollections = brand.collections.map((address) => address.toLowerCase());
  const allCollections = appConfig('collections');
  const collections = allCollections.filter((c) => brandCollections.includes(c.address.toLowerCase()));

  if (!brand) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      brand: brand,
      collections: collections,
      query: query,
    },
  };
};

export default Brand;
