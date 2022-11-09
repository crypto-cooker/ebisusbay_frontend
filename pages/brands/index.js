import brands from "@src/core/data/brands.json";
import {Box, Center, LinkBox, LinkOverlay, SimpleGrid, Text} from "@chakra-ui/react";
import Footer from "@src/Components/components/Footer";
import NextLink from 'next/link';
import {useRouter} from "next/router";
import PageHead from "@src/Components/Head/PageHead";
import {hostedImage} from "@src/helpers/image";
import React from "react";
import Header from "@src/Components/Collections/components/Header";

const Brands = ({ brand, collections, stats }) => {
  const router = useRouter();

  const navigate = (slug) => {
    router.push(`/brands/${slug}`)
  };

  return (
    <>
      <PageHead
        title="Brands"
        description="Showcasing the most prominent brands on the Cronos chain"
        url={`/brands`}
      />
      <Header title={'Brands'} />
      <Box mt={4} maxW="2560px" mx="auto">
        <SimpleGrid columns={{base: 1, md: 2, lg: 3, xl: 4}} gap={4} mx={6}>
          {brands.map((brand) => (
            <Box
              h="200px"
              overflow="hidden"
              position="relative"
              cursor="pointer"
              data-group
              rounded="lg"
              onClick={() => navigate(brand.slug)}
            >
              <Box
                backgroundImage={hostedImage(brand.images.preview ?? brand.images.banner)}
                backgroundSize="cover"
                h="100%"
                _groupHover={{
                  filter: 'brightness(0.3) blur(5px)',
                  transition:'0.5s ease',
                  transform: 'scale(1.1)'
                }}
                transition="0.5s ease"
              />
              <Box
                position="absolute"
                top="50%"
                left={0}
                w="100%"
                filter="opacity(0)"
                transition="0.5s ease"
                _groupHover={{
                  filter: 'opacity(1)',
                  transition:'0.5s ease',
                }}
              >
                <Text align="center" fontSize="xl" fontWeight="semibold" color="white">
                  {brand.name}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <Footer />
      </Box>
    </>
  )
}

export const getServerSideProps = async ({ params, query }) => {
  return {
    props: {
      brands
    },
  };
};

export default Brands;