import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import styles from './profile.module.scss';
import {hostedImage} from "@src/helpers/image";
import {caseInsensitiveCompare, isUserBlacklisted, shortAddress, username} from "@src/utils";
import Inventory from "@src/components-v2/feature/account/profile/tabs/inventory";
import Collections from "@src/Components/Account/Profile/Collections";
import Listings from "@src/components-v2/feature/account/profile/tabs/listings";
import Offers from "@src/components-v2/feature/account/profile/tabs/offers";
import Sales from "@src/Components/Account/Profile/Sales";
import Favorites from "@src/Components/Account/Profile/Favorites";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {pushQueryString} from "@src/helpers/query";
import {ethers} from "ethers";
import {
  Avatar,
  Box,
  Button as ChakraButton,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  Text,
  useBreakpointValue,
  useMediaQuery,
  Wrap
} from "@chakra-ui/react";
import {motion} from 'framer-motion'
import BatchDrawer from "@src/components-v2/feature/account/profile/tabs/inventory/batch/batch-drawer";
import {closeBatchListingCart} from "@src/GlobalState/user-batch";
import {useAppDispatch, useAppSelector} from "@src/Store/hooks";
import {getTheme} from "@src/Theme/theme";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import {ChevronDownIcon} from "@chakra-ui/icons";
import ImageService from "@src/core/services/image";

const MotionGrid = motion(Grid)

enum TabKey {
  inventory = 'inventory',
  collections = 'collections',
  listings = 'listings',
  offers = 'offers',
  sales = 'sales',
  favorites = 'favorites'
}

const tabs: {[key: string]: {label: string, overflow?: string}} = {
  inventory: {
    label: 'Inventory',
  },
  listings: {
    label: 'Listings',
  },
  offers: {
    label: 'Offers',
  },
  sales: {
    label: 'Sales',
    overflow: 'Sales',
  },
  favorites: {
    label: 'Favorites',
    overflow: 'Favs',
  }
};

interface ProfileProps {
  address: string;
  profile: any;
  tab?: string;
}

export default function Profile({ address, profile, tab }: ProfileProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const batchListingCart = useAppSelector((state) => state.batchListing);
  const router = useRouter();
  const variants = {
    expand: { gridTemplateColumns: '1fr 358px' },
    collapse: { gridTemplateColumns: '1fr 0px' },
  }
  const useMobileCartView = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );
  const [useMobileLayout] = useMediaQuery('(max-width: 580px)');
  const overflowCount = useBreakpointValue<number>(
    {base: 2, sm: 1, md: 0},
    {fallback: 'md'},
  );

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const [currentTab, setCurrentTab] = React.useState(tab ?? TabKey.inventory);
  const handleTabChange = useCallback((newTab: string) => {
    pushQueryString(router, {address: profile.username ?? address, tab: newTab});
    setCurrentTab(newTab);
  }, [address]);

  const [isProfileOwner, setIsProfileOwner] = useState(false);
  useEffect(() => {
    setIsProfileOwner(user && caseInsensitiveCompare(address, user.address));
  }, [user, address])

  const profilePicture = profile.profilePicture ?
    ImageService.translate(profile.profilePicture).custom({width: 200, height: 200}) :
    hostedImage('/img/profile-avatar.webp');

  // Ensure correct tab highlighted when changing from AccountMenu while already in Profile page
  useEffect(() => {
    setCurrentTab(tab ?? TabKey.inventory);
  }, [tab]);

  useEffect(() => {
    if (!user.address && batchListingCart.isDrawerOpen) {
      dispatch(closeBatchListingCart());
    }
  }, [user.address]);

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      dispatch(closeBatchListingCart());
    }, []);
  }

  const identifier = profile.username ?? address;

  const [overflowTabKey, setOverflowTabKey] = useState<string>();

  const handleOverflowTabChange = (tabKey: string) => {
    setOverflowTabKey(tabKey);
    handleTabChange(TabKey[tabKey as keyof typeof TabKey]);
  };

  return (
    <div className={styles.profile} >
      <PageHead
        title={username(identifier)}
        description={profile.bio}
        image={profilePicture}
        url={`/account/${address}`}
      />
      <MotionGrid
        animate={batchListingCart.isDrawerOpen && !useMobileCartView ? 'expand' : 'collapse'}
        variants={variants}
        gridTemplateColumns="1fr 0px"
      >
        <GridItem>
          {profile.banner ? (
              <Image
                h={{base: '100px', sm: '150px', md: '250px', lg: '300px', xl: '360px'}}
                w='full'
                src={ImageService.translate(profile.banner).banner()}
                objectFit='cover'
                backgroundRepeat='no-repeat'
                backgroundPosition='50% 50%'
              />
          ) : (
            <Image
              h={{base: '100px', sm: '150px', md: '250px', lg: '300px', xl: '360px'}}
              w='full'
              src={user.theme === 'dark' ? '/img/background/header-dark.webp' : '/img/background/Ebisu-DT-Header.webp'}
              objectFit='cover'
              backgroundRepeat='no-repeat'
            />
          )}
          <section className={`px-4 pt-2 ${useMobileCartView ? 'px-4' : 'px-5'}`}>
            <Box mb={6}>
              <Flex>
                <Flex mt={{base: -16, lg: -20, xl: -20}}>
                  <Avatar
                    src={profilePicture}
                    rounded='full'
                    size={{base: 'xl', lg: '2xl'}}
                    border={`4px solid ${getTheme(user.theme).colors.bgColor1}`}
                  />
                </Flex>
                {!useMobileLayout && (
                  <Flex direction='column' ms={4} flex={1}>
                    <Wrap align='center'>
                      <Heading>{username(identifier)}</Heading>
                      <SocialsBar socials={profile} address={address} />
                    </Wrap>
                    {isUserBlacklisted(address) && (
                      <Flex>
                        <Tag size='sm' colorScheme='red' variant='solid'>Blacklisted</Tag>
                      </Flex>
                    )}
                    <Text className={styles.bio}>{profile.bio}</Text>
                  </Flex>
                )}
                <HStack align='top' flex={useMobileLayout ? 1 : 0}>
                  <Spacer/>
                  {useMobileLayout && (
                    <Box style={{marginTop: '1px !important'}}>
                      <SocialsBar socials={profile} address={address} />
                    </Box>
                  )}
                  {isProfileOwner && (
                    <>
                      {useMobileLayout ? (
                        <IconButton
                          aria-label='User Settings'
                          variant='primary'
                          size='sm'
                          fontSize='sm'
                          icon={<FontAwesomeIcon icon={faCog} />}
                          rounded='full'
                          onClick={() => navigateTo('/account/settings/profile')}
                        />
                      ) : (
                        <ChakraButton
                          variant='primary'
                          size='sm'
                          fontSize='sm'
                          onClick={() => navigateTo('/account/settings/profile')}
                        >
                          Settings
                        </ChakraButton>
                      )}
                    </>
                  )}
                </HStack>
              </Flex>
              {useMobileLayout && (
                <Flex direction='column' flex={1}>
                  <Heading>{username(identifier)}</Heading>
                  {isUserBlacklisted(address) && (
                    <Flex>
                      <Tag size='sm' colorScheme='red' variant='solid'>Blacklisted</Tag>
                    </Flex>
                  )}
                  <Text className={styles.bio}>{profile.bio}</Text>
                </Flex>
              )}
            </Box>
              <HStack spacing={1} w='full'>
                {Object.entries(tabs).slice(0, Object.keys(tabs).length - overflowCount!).map(([key, tab]) => (
                  <ChakraButton
                    isActive={currentTab === key}
                    onClick={() => handleTabChange(key)}
                    rounded='3px'
                    variant='tab'
                    size={{base: 'sm', sm: 'md'}}
                    color={currentTab === key ? 'white' : getTheme(user.theme).colors.textColor3}
                  >
                    {tab.label}
                  </ChakraButton>
                ))}
                <Spacer />
                {overflowCount && (
                  <Menu>
                    {overflowTabKey ? (
                      <MenuButton
                        as={ChakraButton}
                        aria-label='More'
                        rightIcon={<ChevronDownIcon />}
                        size={{base: 'sm', sm: 'md'}}
                        variant='tab'
                        rounded='3px'
                        bg={overflowTabKey === currentTab ? '#35669e' : 'auto'}
                      >
                        {tabs[overflowTabKey].overflow}
                      </MenuButton>
                    ) : (
                      <MenuButton
                        as={IconButton}
                        aria-label='More'
                        icon={<FontAwesomeIcon icon={faEllipsisV} />}
                        size={{base: 'sm', sm: 'md'}}
                        variant='tab'
                        rounded='3px'
                      />
                    )}
                    <MenuList zIndex={10} fontSize={{base: 'sm', sm: 'md'}}>
                      {Object.entries(tabs).filter(([k, v]) => !!v.overflow).map(([key, value]) => (
                        <MenuItem onClick={() => handleOverflowTabChange(key)}>{value.label}</MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                )}
              </HStack>
            <div className="row mt-4 mt-sm-4">
              <div className="de_tab">
                <div className="de_tab_content">
                  {currentTab === TabKey.inventory && (
                    <Inventory address={address} />
                  )}
                  {currentTab === TabKey.collections && isProfileOwner && (
                    <Collections address={address} />
                  )}
                  {currentTab === TabKey.listings && (
                    <Listings address={address} />
                  )}
                  {currentTab === TabKey.offers && isProfileOwner && (
                    <Offers address={address} />
                  )}
                  {currentTab === TabKey.sales && (
                    <Sales address={address} />
                  )}
                  {currentTab === TabKey.favorites && isProfileOwner && (
                    <Favorites address={address} />
                  )}
                </div>
              </div>
            </div>
          </section>
        </GridItem>
        <GridItem>
          <BatchDrawer
            onClose={() => dispatch(closeBatchListingCart())}
            position="fixed"
            w="358px"
            h="calc(100vh - 74px)"
          />
        </GridItem>
      </MotionGrid>
    </div>
  );
}

function useScrollTabIntoView(index: number) {
  const tablistRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const selectedTab = tablistRef.current?.querySelector(
      "[role=tab][aria-selected]"
    );
    console.log('scrollllllorrr')

    selectedTab?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [index]);

  return tablistRef;
}