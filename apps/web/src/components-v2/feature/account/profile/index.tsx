import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import styles from './profile.module.scss';
import {hostedImage} from "@src/helpers/image";
import {appUrl, ciEquals, isUserBlacklisted, username} from "@market/helpers/utils";
import Inventory from "@src/components-v2/feature/account/profile/tabs/inventory";
import Collections from "@src/Components/Account/Profile/Collections";
import Listings from "@src/components-v2/feature/account/profile/tabs/listings";
import Offers from "@src/components-v2/feature/account/profile/tabs/offers";
import Deals from "@src/components-v2/feature/account/profile/tabs/deals";
import Sales from "@src/Components/Account/Profile/Sales";
import Favorites from "@src/Components/Account/Profile/Favorites";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {pushQueryString} from "@src/helpers/query";
import {
  Avatar,
  Box,
  Button as ChakraButton,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
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
  useClipboard,
  useColorModeValue,
  useMediaQuery,
  Wrap
} from "@chakra-ui/react";
import {motion} from 'framer-motion'
import BatchDrawer from "@src/components-v2/feature/account/profile/tabs/inventory/batch/batch-drawer";
import {closeBatchListingCart} from "@market/state/redux/slices/user-batch";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import {getTheme} from "@src/global/theme/theme";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faEllipsisV, faHandshake} from "@fortawesome/free-solid-svg-icons";
import {ChevronDownIcon} from "@chakra-ui/icons";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";
import Link from "next/link";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {toast} from "react-toastify";

const MotionGrid = motion(Grid)

enum TabKey {
  inventory = 'inventory',
  collections = 'collections',
  listings = 'listings',
  offers = 'offers',
  deals = 'deals',
  sales = 'sales',
  favorites = 'favorites'
}

const tabs: {[key: string]: {label: string, overflow?: string, private: boolean}} = {
  inventory: {
    label: 'Inventory',
    private: false,
  },
  listings: {
    label: 'Listings',
    private: false,
  },
  offers: {
    label: 'Offers',
    private: true,
  },
  deals: {
    label: 'Deals',
    private: true,
  },
  sales: {
    label: 'Sales',
    overflow: 'Sales',
    private: false,
  },
  favorites: {
    label: 'Favorites',
    overflow: 'Favs',
    private: false,
  }
};

interface ProfileProps {
  address: string;
  profile: any;
  tab?: string;
}

export default function Profile({ address, profile, tab }: ProfileProps) {
  const dispatch = useAppDispatch();
  const user = useUser();
  const batchListingCart = useAppSelector((state) => state.batchListing);
  const router = useRouter();
  const { onCopy, value, setValue, hasCopied } = useClipboard(appUrl(`/deal/create/${address}`).toString());

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
  const pulseColorClass = useColorModeValue(
    'pulse-animation-light',
    'pulse-animation-dark'
  );

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const [currentTab, setCurrentTab] = React.useState(tab ?? TabKey.inventory);
  const handleTabChange = useCallback((newTab: string) => {
    pushQueryString(router, {address: profile?.username ?? address, tab: newTab});
    setCurrentTab(newTab);
  }, [address]);

  const [isProfileOwner, setIsProfileOwner] = useState(false);
  useEffect(() => {
    setIsProfileOwner(user && ciEquals(address, user.address));
  }, [user.wallet.address, address])

  const profilePicture = profile?.profilePicture ?
    ImageService.translate(profile.profilePicture).custom({width: 200, height: 200}) :
    hostedImage('/img/profile-avatar.webp');

  // Ensure correct tab highlighted when changing from AccountMenu while already in Profile page
  useEffect(() => {
    setCurrentTab(tab ?? TabKey.inventory);
  }, [tab]);

  useEffect(() => {
    if (!user.wallet.address && batchListingCart.isDrawerOpen) {
      dispatch(closeBatchListingCart());
    }
  }, [user.wallet.address]);

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      dispatch(closeBatchListingCart());
    }, []);
  }

  const identifier = profile?.username ?? address;

  const [overflowTabKey, setOverflowTabKey] = useState<string>();

  const handleOverflowTabChange = (tabKey: string) => {
    setOverflowTabKey(tabKey);
    handleTabChange(TabKey[tabKey as keyof typeof TabKey]);
  };

  const handleCopyDealLink = () => {
    onCopy();
    toast.success('Deal link copied!');
  }

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
                <Flex mt={{base: '-55px', lg: '-73px'}}>
                  <Avatar
                    src={profilePicture}
                    rounded='full'
                    size={{base: 'xl', lg: '2xl'}}
                    border={`6px solid ${getTheme(user.theme).colors.bgColor1}`}
                    bg={getTheme(user.theme).colors.bgColor1}
                  />
                </Flex>
                {!useMobileLayout && (
                  <Flex direction='column' ms={4} flex={1}>
                    <Wrap align='center'>
                      <Heading>{username(identifier)}</Heading>
                      <SocialsBar socials={profile} address={address}/>
                      {isProfileOwner && (
                        <span onClick={handleCopyDealLink} style={{cursor: 'pointer'}} title="Copy Deal Link">
                          <LayeredIcon icon={faHandshake}/>
                        </span>
                      )}
                    </Wrap>
                    {isUserBlacklisted(address) && (
                      <Flex>
                        <Tag size='sm' colorScheme='red' variant='solid'>Blacklisted</Tag>
                      </Flex>
                    )}
                    <Text className={styles.bio}>{profile.bio}</Text>
                  </Flex>
                )}
                <HStack align='top' flex={useMobileLayout ? 1 : 0} mt={1}>
                  <Spacer/>
                  {useMobileLayout && (
                    <Box style={{marginTop: '1px !important'}}>
                      <SocialsBar socials={profile} address={address} />
                    </Box>
                  )}
                  {isProfileOwner ? (
                    <>
                      {useMobileLayout ? (
                        <>
                          <span onClick={handleCopyDealLink} style={{cursor: 'pointer'}} title="Copy Deal Link">
                            <LayeredIcon icon={faHandshake}/>
                          </span>
                          <IconButton
                            aria-label='User Settings'
                            variant='primary'
                            size='sm'
                            fontSize='sm'
                            icon={<FontAwesomeIcon icon={faCog} />}
                            rounded='full'
                            onClick={() => navigateTo('/account/settings/profile')}
                          />
                        </>
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
                  ) : useMobileLayout ? (
                    <Link href={`/deal/create/${address}`}>
                      <IconButton
                        aria-label='Make a Deal'
                        variant='primary'
                        size='sm'
                        fontSize='sm'
                        icon={<FontAwesomeIcon icon={faHandshake} />}
                        rounded='full'
                      />
                    </Link>
                  ) : (
                    <Link href={`/deal/create/${address}`}>
                      <ChakraButton
                        variant='primary'
                        size='sm'
                        fontSize='sm'
                        leftIcon={<Icon as={FontAwesomeIcon} icon={faHandshake} />}
                      >
                        Make a Deal
                      </ChakraButton>
                    </Link>
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
                {Object.entries(tabs).filter(([_, tab]) => !tab.private || isProfileOwner).slice(0, Object.keys(tabs).length - overflowCount!).map(([key, tab]) => (
                  <ChakraButton
                    key={key}
                    isActive={currentTab === key}
                    onClick={() => handleTabChange(key)}
                    rounded='3px'
                    variant='tab'
                    size={{base: 'sm', sm: 'md'}}
                    color={currentTab === key ? 'white' : getTheme(user.theme).colors.textColor3}
                  >
                    {/*{key === TabKey.deals && isProfileOwner && (*/}
                    {/*  <Box*/}
                    {/*    position='absolute'*/}
                    {/*    top={-1}*/}
                    {/*    right={-1}*/}
                    {/*    bg='#FD8800'*/}
                    {/*    rounded='full'*/}
                    {/*    w='10px'*/}
                    {/*    h='10px'*/}
                    {/*    animation={`${pulseColorClass} 1.5s infinite`}*/}
                    {/*  />*/}
                    {/*)}*/}
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
                  {currentTab === TabKey.deals && isProfileOwner && (
                    <Deals address={address} />
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