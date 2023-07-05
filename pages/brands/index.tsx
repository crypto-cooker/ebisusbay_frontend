import brands from "@src/core/data/brands.json";
import {Box, Button, SimpleGrid, Text, useMediaQuery, VStack, Wrap, WrapItem} from "@chakra-ui/react";
import {useRouter} from "next/router";
import PageHead from "@src/components-v2/shared/layout/page-head";
import Header from "@src/components-v2/shared/layout/page-header";
import categories from "@src/core/data/categories.json";
import ImageService from "@src/core/services/image";
import {GetServerSidePropsContext} from "next";
import {useState} from "react";

interface BrandsProps {
  ssrBrands: any[]
}

const Brands = ({ssrBrands}: BrandsProps) => {
  const router = useRouter();
  const [supportsHover] = useMediaQuery('(hover: hover)')
  const [showAll, setShowAll] = useState<boolean>(false);

  const navigate = (slug: string) => {
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
          {ssrBrands.filter((brand) => showAll || brand.featured).map((brand) => (
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
                backgroundImage={ImageService.translate(brand.images.preview ?? brand.images.banner).bannerPreview()}
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
                    {brand.categories.map((cat: any) => (
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
        {!showAll && (
          <Box textAlign='center' mt={4}>
            <Button
              variant='primary'
              onClick={() => setShowAll(true)}
            >
              Show All
            </Button>
          </Box>
        )}
      </Box>
    </>
  )
}

export const getStaticProps = async () => {
  // const filteredBrands = brands.filter((b) => b.featured);

  return {
    props: {
      ssrBrands: brands.sort((a, b) => (b.featured === a.featured) ? 0 : (a.featured ? -1 : 1))
    },
  };
};

export default Brands;