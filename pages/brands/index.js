import brands from "@src/core/data/brands.json";
import {Box, SimpleGrid, Text, useMediaQuery, VStack, Wrap, WrapItem} from "@chakra-ui/react";
import {useRouter} from "next/router";
import PageHead from "@src/components-v2/shared/layout/page-head";
import React from "react";
import Header from "@src/components-v2/shared/layout/page-header";
import categories from "@src/core/data/categories.json";
import ImageService from "@src/core/services/image";

const Brands = ({ssrBrands}) => {
  const router = useRouter();
  const [supportsHover] = useMediaQuery('(hover: hover)')

  const navigate = (slug) => {
    router.push(`/brands/${slug}`)
  };

  return (
    <>
      <PageHead
        title="NFT Brands"
        description="Showcasing the most prominent brands on the Cronos chain"
        url={`/brands`}
      />
      <Header title="Brands" subtitle="Showcasing the most prominent brands on the Cronos chain" />
      <Box mt={4} maxW="2560px" mx="auto">
        <SimpleGrid columns={{base: 1, md: 2, lg: 3, xl: 4}} gap={4} mx={6}>
          {ssrBrands.map((brand) => (
            <Box
              key={brand.slug}
              h="200px"
              overflow="hidden"
              position="relative"
              cursor="pointer"
              data-group
              rounded="lg"
              onClick={() => navigate(brand.slug)}
            >
              <Box
                backgroundImage={ImageService.instance.provider.bannerPreview(brand.images.preview ?? brand.images.banner)}
                backgroundSize="cover"
                backgroundPosition="50% 50%"
                h="100%"
                _groupHover={{
                  filter: 'brightness(0.3) blur(5px)',
                  transition:'0.5s ease-out',
                  transform: 'scale(1.1)'
                }}
                transition="0.5s ease"
                filter={supportsHover ? undefined : 'brightness(0.6)'}
              />
              <VStack
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
                left={0}
                w="100%"
                filter={supportsHover ? 'opacity(0)' : 'opacity(1)'}
                transition="0.5s ease-out"
                _groupHover={{
                  filter: 'opacity(1)',
                  transition:'0.5s ease',
                }}
                backdropFilter={supportsHover ? undefined : 'blur(3px)'}
              >
                <Text align="center" fontSize="xl" fontWeight="semibold" color="white">
                  {brand.name}
                </Text>
                <Wrap>
                  <WrapItem>
                    {brand.categories.map((cat) => (
                      <div className="eb-de_countdown text-center" style={{backgroundColor: 'transparent', color: 'white'}}>
                        {categories.find((c) => c.key === cat)?.label}
                      </div>
                    ))}
                  </WrapItem>
                </Wrap>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}

export const getServerSideProps = async ({ params, query }) => {
  const filteredBrands = brands.filter((b) => b.featured);

  return {
    props: {
      ssrBrands: filteredBrands
    },
  };
};

export default Brands;