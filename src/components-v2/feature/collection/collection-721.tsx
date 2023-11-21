import React, {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {Box, Button, Flex, Heading, Text} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import MintingButton from "@src/Components/Collection/MintingButton";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import {useRouter} from "next/router";
import CollectionInfoBar from "@src/Components/components/CollectionInfoBar";
import {
  caseInsensitiveCompare,
  isBundle,
  isCnsCollection,
  isCronosGorillaBusinessCollection,
  isCronosVerseCollection,
  isCrosmocraftsCollection,
  isLandDeedsCollection, isPlayingCardsCollection
} from "@src/utils";
import useGetStakingPlatform from "@src/hooks/useGetStakingPlatform";
import CollectionBundlesGroup from "@src/Components/components/CollectionBundlesGroup";
import SalesCollection from "@src/Components/components/SalesCollection";
import CollectionCronosverse from "@src/components-v2/feature/collection/tabs/cronosverse";
import DynastiesLands from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands";
import {CnsRegistration} from "@src/Components/Collection/Custom/CnsRegistration";
import {pushQueryString} from "@src/helpers/query";
import styled from "styled-components";
import {getCollectionMetadata, getCollectionPowertraits, getCollectionTraits} from "@src/core/api";
import {getCollections} from "@src/core/api/next/collectioninfo";
import Items from "@src/components-v2/feature/collection/tabs/items";
import PokerLeaderboardComponentPast from "@src/components-v2/feature/poker/poker-leaderboard-past";
import {PokerCollection} from "@src/core/services/api-service/types";

const tabs = {
  items: 'items',
  bundles: 'bundles',
  activity: 'activity',
  cronosverseMap: 'cronosverseMap',
  dynastiesMap: 'dynastiesMap',
  diamondsPokerGame: 'diamondsPokerGame',
  clubsPokerGame: 'clubsPokerGame',
  heartsPokerGame: 'heartsPokerGame',
  spadesPokerGame: 'spadesPokerGame',
  // currentPokerGame: 'currentPokerGame',
  cns: 'cns'
};

const NegativeMargin = styled.div`
  margin-left: -1.75rem !important;
  margin-right: -1.75rem !important;
`;

const ThemedBackground = styled.div`
  background: ${({ theme }) => theme.colors.bgColor1}
`;

interface Collection721Props {
  collection: any;
  ssrTab?: string;
  ssrQuery: FullCollectionsQueryParams;
  activeDrop?: any;
}

// TODO fix
const hasRank = false;

const Collection721 = ({ collection, ssrTab, ssrQuery, activeDrop = null}: Collection721Props) => {
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { stakingPlatform } = useGetStakingPlatform(collection.address);
  const [openMenu, setOpenMenu] = useState(tabs.items);

  const emptyFunction = () => {};

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
      <Box
        as='section'
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${!!collection.metadata.banner ? ImageService.translate(collection.metadata.banner).banner() : ''})`,
          backgroundPosition: '50% 50%',
        }}
      >
        <Box className='mainbreadcumb'></Box>
      </Box>

      <Box as='section' className="gl-legacy container d_coll no-top no-bottom">
        <Box className="profile_avatar">
          <Box className="d_profile_img">
            {collection.metadata.avatar ? (
              <img src={ImageService.translate(collection.metadata.avatar).fixedWidth(150, 150)} alt={collection.name} />
            ) : (
              <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
            )}
            {collection.verification.verified && (
              <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
            )}
          </Box>
        </Box>
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
            <SocialsBar address={collection.address} socials={collection.metadata} />
          </Box>
        </Box>
      </Box>

      <Box mt={8}>
        {collectionStats && (
          <>
            {hasRank && collection.metadata.rarity === 'rarity_sniper' && (
              <div className="row">
                <div className="col-lg-8 col-sm-10 mx-auto text-center mb-3" style={{ fontSize: '0.8em' }}>
                  Rarity scores and ranks provided by{' '}
                  <a href="https://raritysniper.com/" target="_blank" rel="noreferrer">
                    <span className="color">Rarity Sniper</span>
                  </a>
                </div>
              </div>
            )}
            <CollectionInfoBar collectionStats={collectionStats} hideFloor={!collection.listable} />
            {collection.address.toLowerCase() === '0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'.toLowerCase() && (
              <div className="row m-3">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '1.2em' }}>
                  {'  '} Please visit{' '}
                  <a href="/collection/weird-apes-club-v2">
                    <span className="color">here </span>
                  </a>
                  for the newer, migrated contract
                </div>
              </div>
            )}
            {isCrosmocraftsCollection(collection.address) && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  Got Crosmocraft parts?{' '}
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
          <li className={`tab ${openMenu === tabs.items ? 'active' : ''} my-1`}>
            <span onClick={handleBtnClick(tabs.items)}>Items</span>
          </li>
          {!isBundle(collection.address) && (
            <li className={`tab ${openMenu === tabs.bundles ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.bundles)}>Bundles</span>
            </li>
          )}
          <li className={`tab ${openMenu === tabs.activity ? 'active' : ''} my-1`}>
            <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
          </li>
          {isCronosVerseCollection(collection.address) && (
            <li className={`tab ${openMenu === tabs.cronosverseMap ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.cronosverseMap)}>Map</span>
            </li>
          )}
          {isCnsCollection(collection.address) && (
            <li className={`tab ${openMenu === tabs.cns ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.cns)}>Register Domain</span>
            </li>
          )}
          {isLandDeedsCollection(collection.address) && (
            <li className={`tab ${openMenu === tabs.dynastiesMap ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.dynastiesMap)}>Map</span>
            </li>
          )}
          {isPlayingCardsCollection(collection.address) && (
            <>
            <li className={`tab ${openMenu === tabs.diamondsPokerGame ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.diamondsPokerGame)}>Diamonds Game</span>
            </li>
            <li className={`tab ${openMenu === tabs.clubsPokerGame ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.clubsPokerGame)}>Clubs Game</span>
            </li>
            <li className={`tab ${openMenu === tabs.heartsPokerGame ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.heartsPokerGame)}>Hearts Game</span>
            </li>
            <li className={`tab ${openMenu === tabs.spadesPokerGame ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.spadesPokerGame)}>Spades Game</span>
            </li>
            </>
          )}
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
            <div className="tab-2 onStep fadeIn container">
              <SalesCollection cacheName="collection" collectionId={collection.address} />
            </div>
          )}
          {openMenu === tabs.cronosverseMap && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <CollectionCronosverse collection={collection} />
            </NegativeMargin>
          )}
          {openMenu === tabs.dynastiesMap && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <DynastiesLands showBackButton={false} onBack={emptyFunction} />
            </NegativeMargin>
          )}
          {openMenu === tabs.diamondsPokerGame && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <PokerLeaderboardComponentPast pokerCollection={PokerCollection.Diamonds} />
            </NegativeMargin>
          )}
          {openMenu === tabs.clubsPokerGame && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <PokerLeaderboardComponentPast pokerCollection={PokerCollection.Clubs} />
            </NegativeMargin>
          )}
          {openMenu === tabs.heartsPokerGame && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <PokerLeaderboardComponentPast pokerCollection={PokerCollection.Hearts} />
            </NegativeMargin>
          )}
          {openMenu === tabs.spadesPokerGame && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <PokerLeaderboardComponentPast pokerCollection={PokerCollection.Spades} />
            </NegativeMargin>
          )}
          {openMenu === tabs.cns && (
            <CnsRegistration />
          )}
        </Box>
      </Box>
    </Box>
  );

}


export default Collection721;

export const getStats = async (collection: any, id = null, extraAddresses = null) => {
  try {
    const mergedAddresses = extraAddresses ? [collection.address, ...extraAddresses] : collection.address;
    var response;
    if (id != null) {
      const newStats = await getCollectionMetadata(mergedAddresses, null, {
        type: 'tokenId',
        value: id,
      });
      response = {
        collections: newStats.data.collections.map((sCollection: any) => (
          {
            collection: collection.address,
            totalSupply: sCollection.totalSupply,
            totalVolume: sCollection.stats.total.volume,
            numberOfSales: sCollection.stats.total.complete,
            averageSalePrice: sCollection.stats.total.avgSalePrice ?? sCollection.stats.total.avg_sale_price,
            numberActive: sCollection.stats.total.active,
            floorPrice: sCollection.stats.total.floorPrice ?? sCollection.stats.total.floor_price,
            owners: sCollection.holders
          }
        ))
      };
    } else if (Array.isArray(mergedAddresses)) {
      const newStats = await getCollections({address: mergedAddresses.join(',')});
      response = {
        collections: newStats.data.collections.map((sCollection: any) => (
          {
            collection: collection.address,
            totalSupply: sCollection.totalSupply,
            totalVolume: sCollection.stats.total.volume,
            numberOfSales: sCollection.stats.total.complete,
            averageSalePrice: sCollection.stats.total.avgSalePrice ?? sCollection.stats.total.avg_sale_price,
            numberActive: sCollection.stats.total.active,
            floorPrice: sCollection.stats.total.floorPrice ?? sCollection.stats.total.floor_price,
            owners: sCollection.holders
          }
        ))
      }
    } else {
      const newStats = await getCollections({address: mergedAddresses});
      const sCollection = newStats.data.collections[0];
      response = {
        collections: [
          {
            collection: mergedAddresses,
            totalSupply: sCollection.totalSupply,
            totalVolume: sCollection.stats.total.volume,
            numberOfSales: sCollection.stats.total.complete,
            averageSalePrice: sCollection.stats.total.avgSalePrice ?? sCollection.stats.total.avg_sale_price,
            numberActive: sCollection.stats.total.active,
            floorPrice: sCollection.stats.total.floorPrice ?? sCollection.stats.total.floor_price,
            owners: sCollection.holders
          }
        ]
      };
    }
    const traits = await getCollectionTraits(collection.address);
    const powertraits = collection.powertraits ? await getCollectionPowertraits(collection.address) : null;

    let remainingStats: {traits: any, powertraits: any, totalSupply?: number} = {
      traits: traits,
      powertraits: powertraits,
    };
    if (isCronosGorillaBusinessCollection(collection.address)) {
      remainingStats.totalSupply = 4000;
    }

    return {
      ...combineStats(response.collections, collection.address),
      ...remainingStats,
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Combine stats if a collection tracks multiple contracts
 *
 * @param collectionStats stats returned from the API
 * @param anchor primary collection address in which to merge the stats
 * @returns {*}
 */
const combineStats = (collectionStats: any, anchor: string) => {
  const anchoredStats = collectionStats.find((c: any) => caseInsensitiveCompare(c.collection, anchor));
  if (collectionStats.length === 0) return anchoredStats;

  const combined = collectionStats.reduce((a: any, b: any) => {
    return {
      numberActive: parseInt(a.numberActive) + parseInt(b.numberActive),
      volume1d: parseInt(a.volume1d) + parseInt(b.volume1d),
      volume7d: parseInt(a.volume7d) + parseInt(b.volume7d),
      volume30d: parseInt(a.volume30d) + parseInt(b.volume30d),
      totalVolume: parseInt(a.totalVolume) + parseInt(b.totalVolume),
      numberOfSales: parseInt(a.numberOfSales) + parseInt(b.numberOfSales),
      sales1d: parseInt(a.sales1d) + parseInt(b.sales1d),
      sales7d: parseInt(a.sales7d) + parseInt(b.sales7d),
      sales30d: parseInt(a.sales30d) + parseInt(b.sales30d),
      totalRoyalties: parseInt(a.totalRoyalties) + parseInt(b.totalRoyalties),
      floorPrice: parseInt(a.floorPrice) > parseInt(b.floorPrice) ? parseInt(a.floorPrice) : parseInt(b.floorPrice),
      averageSalePrice: (parseInt(a.averageSalePrice) + parseInt(b.averageSalePrice)) / 2,
    };
  });

  return { ...anchoredStats, ...combined };
};