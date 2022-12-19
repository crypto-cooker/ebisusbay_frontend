import React, {useState} from 'react';
import PageHead from "../../src/Components/Head/PageHead";
import {hostedImage, ImageKitService} from "@src/helpers/image";
import brands from '@src/core/data/brands.json';
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import Footer from "@src/Components/components/Footer";
import EndpointProxyService from "@src/services/endpoint-proxy.service";
import {caseInsensitiveCompare, siPrefixedNumber} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {appConfig} from "@src/Config";
import {useRouter} from "next/router";
import CollectionsTab from "@src/Components/Brand/Tabs/CollectionsTab/CollectionsTab";
import ListingsTab from "@src/Components/Brand/Tabs/ListingsTab/ListingsTab";
import {pushQueryString} from "@src/helpers/query";

const drops = appConfig('drops');
const tabs = {
  collections: 'collections',
  listings: 'listings',
  staking: 'staking'
};

const Brand = ({ brand, collections, stats, query }) => {
  const router = useRouter();
  const [viewMore, setViewMore] = useState(false);
  const isClippingDescription = useBreakpointValue(
    {base: brand.description.length > 150, md: brand.description.length > 225},
    {fallback: 'md'}
  )
  const bannerBgColor= useColorModeValue('black', 'transparent');

  const [currentTab, setCurrentTab] = useState(query.tab ?? tabs.collections);
  const handleBtnClick = (key) => () => {
    pushQueryString(router, {...query, tab: key});
    setCurrentTab(key);
  };

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
              <Button size="xs" colorScheme="blue" variant="link" onClick={() => setViewMore(true)}>
                View More
              </Button>
            )}
          </Box>
          <Flex my="auto" ms={{base: 0, md: 2}} justify={{base: 'start', md: 'end'}} mt={{base: 2, md: 'auto'}}>
            <SimpleGrid columns={{base: 2, sm: 4, md: 2, lg: 4}} spacing={3}>
              {Object.entries(stats).map(([key, stat]) => (
                <Stat key={key}>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatNumber>{siPrefixedNumber(stat.value, 4)}</StatNumber>
                </Stat>
              ))}
            </SimpleGrid>
          </Flex>
        </SimpleGrid>
      </Box>

      <Box as="section" className="gl-legacy no-top" mt={6} mx={8} maxW="2560px">
        <div className="de_tab">
          <ul className="de_nav mb-2">
            <li className={`tab ${currentTab === tabs.collections ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.collections)}>Collections</span>
            </li>
            <li className={`tab ${currentTab === tabs.listings ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.listings)}>Listings</span>
            </li>
          </ul>

          <div className="de_tab_content">
            {currentTab === tabs.collections && (
              <CollectionsTab collections={collections} />
            )}
            {currentTab === tabs.listings && (
              <ListingsTab brand={brand} collections={collections} />
            )}
          </div>
        </div>
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

  // Only using hidden collections for stats aggregation for now
  if (brand.hidden) {
    brandKeyedAddresses.push(...brand.hidden.map((address, key) => {
      return {
        address: address.toLowerCase(),
        position: (key + 100)
      }
    }));
  }

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
      c.hidden = brand.hidden?.includes(c.address) ?? false;

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


  // Weird Apes stats merge
  sortedCollections.map((c) => {
    const weirdApes = '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44'
    const weirdApesV1 = '0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'
    if (caseInsensitiveCompare(c.address, weirdApes)) {
      const v1Collection = collections.data.collections.find((v1c) => caseInsensitiveCompare(v1c.address, weirdApesV1));
      c.stats.total.active = Number(c.stats.total.active) + Number(v1Collection.stats.total.active)
      c.stats.total.complete = Number(c.stats.total.complete) + Number(v1Collection.stats.total.complete)
      c.stats.total.volume = Number(c.stats.total.volume) + Number(v1Collection.stats.total.volume)
    }
    return c;
  });

  // Remove hidden now that we're done with them
  sortedCollections = sortedCollections.filter((c) => !c.hidden);

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
