import React, {useEffect, useState} from 'react';
import Blockies from 'react-blockies';
import {isBundle, isCrosmocraftsPartsCollection} from '@src/utils';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import CollectionInfoBar from '@src/Components/components/CollectionInfoBar';
import SalesCollection from '@src/Components/components/SalesCollection';
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {pushQueryString} from "@src/helpers/query";
import {useRouter} from "next/router";
import {AspectRatio, Avatar, Box, Button, Flex, Heading, Image, Text, useBreakpointValue} from "@chakra-ui/react";
import MintingButton from "@src/Components/Collection/MintingButton";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import useGetStakingPlatform from "@src/hooks/useGetStakingPlatform";
import ImageService from "@src/core/services/image";
import CollectionBundlesGroup from "@src/Components/components/CollectionBundlesGroup";
import Items from "@src/components-v2/feature/collection/tabs/items";
import {useQuery} from "@tanstack/react-query";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {getStats} from "@src/components-v2/feature/collection/collection-721";
import {getTheme} from "@src/Theme/theme";
import {BlueCheckIcon} from "@src/components-v2/shared/icons/blue-check";
import {useUser} from "@src/components-v2/useUser";


const tabs = {
  items: 'items',
  bundles: 'bundles',
  activity: 'activity'
};

interface Collection1155Props {
  collection: any;
  tokenId?: string;
  ssrTab?: string;
  ssrQuery: FullCollectionsQueryParams;
  activeDrop?: any;
}

// TODO fix
const hasRank = false;

const Collection1155 = ({ collection, tokenId, ssrTab, ssrQuery, activeDrop = null }: Collection1155Props) => {
  const router = useRouter();
  const user = useUser();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { stakingPlatform } = useGetStakingPlatform(collection.address);
  const [openMenu, setOpenMenu] = React.useState(tabs.items);
  const isMobileLayout = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});

  const { data: collectionStats } = useQuery({
    queryKey: ['CollectionStats', collection.address],
    queryFn: () => getStats(collection, null, collection.mergedAddresses),
    refetchOnWindowFocus: false
  });

  const handleBtnClick = (key: string) => (e: any) => {
    setOpenMenu(key);

    pushQueryString(router, {
      slug: router.query.slug,
      tab: key
    });
  };

  const handleMintingButtonClick = () => {
    if (activeDrop.redirect) {
      window.open(activeDrop.redirect, '_blank');
    } else {
      router.push(`/drops/${activeDrop.slug}`)
    }
  }

  useEffect(() => {
    setOpenMenu(ssrTab ?? tabs.items);
    // eslint-disable-next-line
  }, [collection.address]);

  return (
    <Box>
      <AspectRatio ratio={{base: 4/3, sm: 2.66}} maxH='360px'>
        {(!!collection.metadata.card || !!collection.metadata.banner)  ? (
          <>
            {isMobileLayout ? (
              <Image src={ImageService.translate(collection.metadata.card ?? collection.metadata.banner).banner()} alt='banner' objectFit='cover' />
            ) : (
              <Image src={ImageService.translate(collection.metadata.banner).banner()} alt='banner' objectFit='cover' />
            )}
          </>
        ) : <></>}
      </AspectRatio>
      <Box as='section' className="gl-legacy container d_coll no-top no-bottom">
        <Flex mt={{base: '-55px', lg: '-73px'}} justify='center'>
          <Box position='relative'>
            {collection.metadata.avatar ? (
              <Avatar
                src={ImageService.translate(collection.metadata.avatar).fixedWidth(150, 150)}
                rounded='full'
                size={{base: 'xl', sm: '2xl'}}
                border={`6px solid ${getTheme(user.theme).colors.bgColor1}`}
                bg={getTheme(user.theme).colors.bgColor1}
              />
            ) : (
              <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
            )}
            {collection.verification.verified && (
              <Box position='absolute' bottom={2} right={2}>
                <BlueCheckIcon boxSize={6}/>
              </Box>
            )}
          </Box>
        </Flex>
        <Box className="profile_name">
          <Flex justify="center" align="center" mb={4}>
            <Heading as="h4" size="md" my="auto">
              {collection.name}
            </Heading>
            {activeDrop && (
              <MintingButton onClick={handleMintingButtonClick} />
            )}
          </Flex>
          <CollectionVerificationRow
            doxx={collection.verification?.doxx}
            kyc={collection.verification?.kyc}
            escrow={collection.verification?.escrow}
            creativeCommons={collection.verification?.creativeCommons}
            center={true}
          />
          {collection.metadata.description && (
            <Box>
              <Text noOfLines={showFullDescription ? 0 : 2}>{collection.metadata.description}</Text>
              {collection.metadata.description.length > 255 && (
                <Button variant="link" onClick={() => setShowFullDescription(!showFullDescription)}>
                  See {showFullDescription ? 'less' : 'more'}
                  {showFullDescription ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
              )}
            </Box>
          )}
          <Box className="fs-4 mt-2">
            <SocialsBar
              address={collection.address}
              socials={collection.metadata}
            />
          </Box>
        </Box>
      </Box>

      <Box mt={8}>
        {collectionStats && (
          <>
            {hasRank && collection.metadata?.rarity === 'rarity_sniper' && (
              <div className="row">
                <div className="col-lg-8 col-sm-10 mx-auto text-center mb-3" style={{ fontSize: '0.8em' }}>
                  Rarity scores and ranks provided by{' '}
                  <a href="https://raritysniper.com/" target="_blank" rel="noreferrer">
                    <span className="color">Rarity Sniper</span>
                  </a>
                </div>
              </div>
            )}
            <div className="d-item col-md-12 mx-auto">
              <CollectionInfoBar collectionStats={collectionStats} />
            </div>
            {isCrosmocraftsPartsCollection(collection.address) && (
              <div className="row mb-2">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  Collect Crosmocraft parts to{' '}
                  <a href="/build-ship">
                    <span className="color">build your Crosmocraft!</span>
                  </a>
                </div>
              </div>
            )}
            {!!stakingPlatform && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  NFTs from this collection can be staked at{' '}
                  <a href={stakingPlatform.url} target="_blank" rel="noreferrer">
                    <span className="color">{stakingPlatform.name}</span>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </Box>
      <Box className="de_tab">
        <ul className="de_nav mb-2">
          <li id="Mainbtn0" className={`tab ${openMenu === tabs.items ? 'active' : ''}`}>
            <span onClick={handleBtnClick(tabs.items)}>Items</span>
          </li>
          {!isBundle(collection.address) && (
            <li className={`tab ${openMenu === tabs.bundles ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.bundles)}>Bundles</span>
            </li>
          )}
          <li id="Mainbtn1" className={`tab ${openMenu === tabs.activity ? 'active' : ''}`}>
            <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
          </li>
        </ul>

        <Box className="de_tab_content" px={2}>
          {openMenu === tabs.items && (
            <Items
              collection={collection}
              initialQuery={ssrQuery}
              traits={collectionStats?.traits}
              powertraits={collectionStats?.powertraits}
            />
          )}
          {openMenu === tabs.bundles && (
            <div className="tab-2 onStep fadeIn container">
              <CollectionBundlesGroup
                collection={collection}
              />
            </div>
          )}
          {openMenu === tabs.activity && (
            <div className="tab-2 onStep fadeIn">
              <SalesCollection cacheName="collection" collectionId={collection.address} tokenId={tokenId} />
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Collection1155;
