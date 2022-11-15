import React, {useState} from 'react';
import PageHead from "../../src/Components/Head/PageHead";
import {hostedImage, ImageKitService} from "@src/helpers/image";
import brands from '@src/core/data/brands.json';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import CustomSlide from "@src/Components/components/CustomSlide";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import Footer from "@src/Components/components/Footer";
import EndpointProxyService from "@src/services/endpoint-proxy.service";
import {caseInsensitiveCompare, siPrefixedNumber} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {appConfig} from "@src/Config";
import MintingButton from "@src/Components/Collection/MintingButton";
import {useRouter} from "next/router";

const drops = appConfig('drops');

const Brand = ({ brand, collections, stats }) => {
  const router = useRouter();
  const [viewMore, setViewMore] = useState(false);
  const isClippingDescription = useBreakpointValue(
    {base: brand.description.length > 150, md: brand.description.length > 225},
    {fallback: 'md'}
  )
  const bannerBgColor= useColorModeValue('black', 'transparent');

  const handleMintingButtonClick = (drop) => {
    if (drop.redirect) {
      window.open(drop.redirect, '_blank');
    } else {
      router.push(`/drops/${drop.slug}`)
    }
  }

  return (
    <>
      <PageHead
        title={brand.name}
        description={brand.description}
        url={`/brands/${brand.slug}`}
        image={hostedImage(brand.images.preview ?? brand.images.banner)}
      />
      <Box
        position="relative"
        minH="300px"
        shadow="0 1px 25px black"
        color="white"
        backgroundColor={bannerBgColor}
      >
        <Box
          style={{
            backgroundImage: `url(${ImageKitService.buildBannerUrl(brand.images.banner ?? brand.images.preview ?? '')})`,
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
          filter='brightness(0.3)'
          h="100%"
          position="absolute"
          w="100%"
        />
        <SimpleGrid columns={{base: 1, md: 2}} position="relative" bottom={0} px={10} pt={{base: '75px', md:'40px'}} pb={4} maxW="2560px">
          <Box>
            <Heading color="inherit">{brand.name}</Heading>
            <SocialsBar
              socials={brand.socials}
            />
            <Text maxW="800px" mt={1} noOfLines={viewMore ? 0 : {base: 3, md: 5}}>
              {brand.description}
            </Text>
            {isClippingDescription && !viewMore && (
              <Button size="xs" colorScheme="blue" onClick={() => setViewMore(true)}>
                View More
              </Button>
            )}
          </Box>
          <Flex my="auto" ms={{base: 0, md: 2}} justify={{base: 'start', md: 'end'}} mt={{base: 2, md: 'auto'}}>
            <SimpleGrid columns={{base: 2, sm: 4, md: 2, lg: 4}} spacing={3}>
              {Object.entries(stats).map(([key, stat]) => (
                <Stat key={key}>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatNumber>{siPrefixedNumber(stat.value)}</StatNumber>
                </Stat>
              ))}
            </SimpleGrid>
          </Flex>
        </SimpleGrid>
      </Box>

      <Box as="section" className="gl-legacy no-top" mt={6} mx={8} maxW="2560px">
        <Box>
          <Center>
            <Heading>Collections</Heading>
          </Center>
          <div className="small-border"></div>
        </Box>
        <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} gap={{base: 4, '2xl': 8}}>
          {collections.map((collection, index) => (
            <CustomSlide
              key={index}
              index={index + 1}
              banner={collection.metadata.card}
              title={collection.name}
              contextComponent={collection.drop && !collection.drop.complete ?
                <MintingButton onClick={() => handleMintingButtonClick(collection.drop)}/> :
                undefined
              }
              subtitle={
                <Box>
                  <Text noOfLines={2} fontSize="xs" px={2}>{collection.metadata.description}</Text>
                  <Wrap mt={2} justify="center" spacing={5}>
                    <WrapItem>
                      <Stat size="sm">
                        <StatLabel fontSize="xs">Items</StatLabel>
                        <StatNumber>{collection.totalSupply ? siPrefixedNumber(collection.totalSupply) : '-'}</StatNumber>
                      </Stat>
                    </WrapItem>
                    <WrapItem>
                      <Stat size="sm">
                        <StatLabel fontSize="xs">Active</StatLabel>
                        <StatNumber>{siPrefixedNumber(collection.stats.total.active)}</StatNumber>
                      </Stat>
                    </WrapItem>
                    <WrapItem>
                      <Stat size="sm">
                        <StatLabel fontSize="xs">Sales</StatLabel>
                        <StatNumber>{siPrefixedNumber(collection.stats.total.complete)}</StatNumber>
                      </Stat>
                    </WrapItem>
                    <WrapItem>
                      <Stat size="sm">
                        <StatLabel fontSize="xs">Volume</StatLabel>
                        <StatNumber>{siPrefixedNumber(collection.stats.total.volume)}</StatNumber>
                      </Stat>
                    </WrapItem>
                  </Wrap>
                </Box>
              }
              url={`/collection/${collection.slug ?? collection.address}`}
              verified={collection.verification.verified}
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

  if (!brand) {
    return {
      notFound: true
    }
  }

  const brandKeyedAddresses = brand.collections.map((address, key) => {
    return {
      address: address.toLowerCase(),
      position: key
    }
  });
  const brandAddresses = brandKeyedAddresses.map((o) => o.address);
  const endpointService = new EndpointProxyService();
  const collections = await endpointService.getCollections({address: brandAddresses.join(',')});
  let splitCollections = [];
  let sortedCollections = collections.data.collections
    .filter((c) => !!c.metadata && Object.keys(c.metadata).length > 0)
    .map((c) => {
      c.position = brandKeyedAddresses.find((o) => caseInsensitiveCompare(o.address, c.address)).position;
      const drop = drops.find((d) => d.slug === c.slug);
      c.drop = drop ?? null;

      if (c.slug === 'founding-member') {
        const vip = c.tokens[2];
        vip.stats = {
          total: c.stats.tokens[2]
        }
        vip.totalSupply = 1000;
        splitCollections.push(vip);

        c.stats = {
          total: c.stats.tokens[1],
        };
        c.totalSupply = 10000;
      }
      return c;
    })
    .sort((a, b) => a.position > b.position ? 1 : -1);
  sortedCollections.splice(sortedCollections.length - 1, 0, ...splitCollections);

  let initialStats = {
    items: {
      label: 'Items',
      value: 0,
    },
    listings: {
      label: 'Active',
      value: 0,
    },
    complete: {
      label: 'Sales',
      value: 0,
    },
    volume: {
      label: 'Volume',
      value: 0,
    }
  }

  const stats = sortedCollections.reduce((p, n) => {
    p.items.value += Number(n.totalSupply ?? 0);
    p.listings.value += Number(n.stats.total.active ?? 0);
    p.complete.value += Number(n.stats.total.complete ?? 0);
    p.volume.value += Number(n.stats.total.volume ?? 0);
    return p;
  }, initialStats);

  return {
    props: {
      brand: brand,
      collections: sortedCollections,
      stats: stats,
      query: query,
    },
  };
};

export default Brand;
