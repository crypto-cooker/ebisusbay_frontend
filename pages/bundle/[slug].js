import React from 'react';

import {ImageContainer, ImageSubMenu, Tabs} from "@src/Components/Bundle";
import { Flex, Text } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { useHasHydrated } from '@src/hooks/useHasHydrated';
import { getBundle } from '@src/core/api/endpoints/collectioninfo';

const Bundle = ({bundle}) => {

  return (
    <>
      <section className="gl-legacy container">
        <Flex flexWrap='wrap'>
            <Flex width={['100%', '100%', '40%']} height='min' flexDir='column' alignItems='center'>
              <ImageContainer nft={bundle}/>
              {useHasHydrated() && <ImageSubMenu/>}
            </Flex>
          <Flex className='item_info' width={['100%', '100%', '60%']} flexDir='column' padding='0px 20px' gap='20px'>
            <Heading as="h2" size="xl" >
                {bundle.title}
            </Heading>
              <Text textAlign='justify' maxH='200px' overflow='scroll'>
                {bundle.description}
              </Text>

            <Tabs nft={bundle}/>
          </Flex>
        </Flex>
      </section>
    </>
  )

}

export const getServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  const res = await getBundle(slug);
  
  const bundle = {
    address: res.data.bundle.address,
    description: res.data.bundle.token.metadata.description,
    id: res.data.bundle.id,
    title: res.data.bundle.token.metadata.title,
    nfts: res.data.bundle.token.metadata.nfts,
    listings: res.data.bundle.listings,
  }
  return {
    props: {
      bundle
    },
  };
};

export default Bundle;