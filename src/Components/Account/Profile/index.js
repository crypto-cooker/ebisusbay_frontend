import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useRouter } from 'next/router';
import Button from '@src/Components/components/common/Button';
import Avatar from './Avatar';

import styles from './profile.module.scss';
import {hostedImage, ImageKitService} from "@src/helpers/image";
import {caseInsensitiveCompare, isUserBlacklisted, shortAddress} from "@src/utils";
import Inventory from "@src/Components/Account/Profile/Inventory";
import Collections from "@src/Components/Account/Profile/Collections";
import Listings from "@src/Components/Account/Profile/Listings";
import Offers from "@src/Components/Account/Profile/Offers";
import Sales from "@src/Components/Account/Profile/Sales";
import Favorites from "@src/Components/Account/Profile/Favorites";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import PageHead from "@src/Components/Head/PageHead";
import {pushQueryString} from "@src/helpers/query";
import {ethers} from "ethers";
import {Badge} from "react-bootstrap";
import {Grid, GridItem, useBreakpointValue, useColorModeValue} from "@chakra-ui/react";
import { motion } from 'framer-motion'
import {BatchListingDrawer} from "@src/Components/Account/Profile/Inventory/BatchListingDrawer";
import {closeBatchListingCart} from "@src/GlobalState/batchListingSlice";

const MotionGrid = motion(Grid)

const tabs = {
  inventory: 'inventory',
  collections: 'collections',
  listings: 'listings',
  offers: 'offers',
  sales: 'sales',
  favorites: 'favorites',
};

export default function Profile({ address, profile, tab }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const batchListingCart = useSelector((state) => state.batchListing);
  const router = useRouter();
  const batchListingBorderColor = useColorModeValue('#000', '#FFF');
  const variants = {
    expand: { gridTemplateColumns: '1fr 358px' },
    collapse: { gridTemplateColumns: '1fr 0' },
  }
  const useMobileCartView = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  const navigateTo = (route) => {
    router.push(route);
  };

  const [currentTab, setCurrentTab] = React.useState(tab ?? tabs.inventory);
  const handleTabChange = useCallback((newTab) => {
    pushQueryString(router, {address: profile.username ?? address, tab: newTab});
    setCurrentTab(newTab);
  }, [address]);

  const [isProfileOwner, setIsProfileOwner] = useState(false);
  useEffect(() => {
    setIsProfileOwner(user && caseInsensitiveCompare(address, user.address));
  }, [user, address])

  const identifier = profile.username ?? address;
  const username = () => {
    try {
      if (identifier.startsWith('0x')) {
        return shortAddress(ethers.utils.getAddress(identifier));
      }
      return identifier;
    } catch (e) {
      return identifier;
    }
  }

  const profilePicture = profile.profilePicture ?
    ImageKitService.from(profile.profilePicture).setWidth(200).setHeight(200).buildUrl() :
    hostedImage('/img/avatar.jpg');

  // Ensure correct tab highlighted when changing from AccountMenu while already in Profile page
  useEffect(() => {
    setCurrentTab(tab ?? tabs.inventory);
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

  return (
    <div className={styles.profile} style={{zIndex:1}}>
      <PageHead
        title={username()}
        description={profile.bio}
        image={profilePicture}
        url={`/account/${address}`}
      />
      <MotionGrid
        animate={batchListingCart.isDrawerOpen && !useMobileCartView ? 'expand' : 'collapse'}
        variants={variants}
        gridTemplateColumns="1fr 0"
      >
        <GridItem>
          {profile.banner ? (
            <section
              id="profile_banner"
              className="jumbotron breadcumb no-bg"
              style={{
                backgroundImage: `url(${ImageKitService.buildBannerUrl(profile.banner)})`,
                backgroundPosition: '50% 50%',
              }}
            >
              <div className="mainbreadcumb"></div>
            </section>
          ) : (
            <section className="jumbotron breadcumb no-bg tint">
              <div className="mainbreadcumb"></div>
            </section>
          )}
          <section className="gl-legacy px-5 pt-4">
            <div className={`${styles.userInfo} row`}>
              <div className="d-sm-flex text-center text-sm-start">
                <div className="flex-shrink-0">
                  <Avatar src={profilePicture} />
                </div>
                <div className="flex-grow-1 ms-sm-4 me-sm-4">
                  <div className={styles.username}>{username()}</div>
                  {isUserBlacklisted(address) && (
                    <div className="d-flex">
                      <Badge bg="danger">Blacklisted</Badge>
                    </div>
                  )}
                  <div className={styles.bio}>{profile.bio}</div>
                  <div className={`${styles.socials} text-center text-sm-start mb-2 mb-sm-0`}>
                    <span className="fs-4"><SocialsBar socials={profile} address={address} /></span>
                  </div>
                </div>

                {isProfileOwner && (
                  <div className="d-flex flex-column bd-highlight mb-3">
                    <Button onClick={() => navigateTo('/account/settings/profile')} className="w-auto">Settings</Button>
                    {/*<Button styleType="default-outlined" className="mt-2 w-auto">More</Button>*/}
                  </div>
                )}
              </div>
            </div>
            <div className="row mt-2 mt-sm-4">
              <div className="de_tab">
                <ul className="de_nav mb-4 text-center text-sm-start">
                  <li className={`tab mb-2 ${currentTab === tabs.inventory ? 'active' : ''}`}>
                    <span onClick={() => handleTabChange(tabs.inventory)}>Inventory</span>
                  </li>
                  {isProfileOwner && (
                    <li className={`tab mb-2 ${currentTab === tabs.collections ? 'active' : ''}`}>
                      <span onClick={() => handleTabChange(tabs.collections)}>Collections</span>
                    </li>
                  )}
                  <li className={`tab mb-2 ${currentTab === tabs.listings ? 'active' : ''}`}>
                    <span onClick={() => handleTabChange(tabs.listings)}>Listings</span>
                  </li>
                  {isProfileOwner && (
                    <li className={`tab mb-2 ${currentTab === tabs.offers ? 'active' : ''}`}>
                      <span onClick={() => handleTabChange(tabs.offers)}>Offers</span>
                    </li>
                  )}
                  <li className={`tab ${currentTab === tabs.sales ? 'active' : ''}`}>
                    <span onClick={() => handleTabChange(tabs.sales)}>Sales</span>
                  </li>
                  {isProfileOwner && (
                    <li className={`tab ${currentTab === tabs.favorites ? 'active' : ''}`}>
                      <span onClick={() => handleTabChange(tabs.favorites)}>Favorites</span>
                    </li>
                  )}
                </ul>
                <div className="de_tab_content">
                  {currentTab === tabs.inventory && (
                    <Inventory address={address} />
                  )}
                  {currentTab === tabs.collections && isProfileOwner && (
                    <Collections address={address} />
                  )}
                  {currentTab === tabs.listings && (
                    <Listings address={address} />
                  )}
                  {currentTab === tabs.offers && isProfileOwner && (
                    <Offers address={address} />
                  )}
                  {currentTab === tabs.sales && (
                    <Sales address={address} />
                  )}
                  {currentTab === tabs.favorites && isProfileOwner && (
                    <Favorites address={address} />
                  )}
                </div>
              </div>
            </div>
          </section>
        </GridItem>
        <GridItem borderLeft={useMobileCartView ? 'none' : '0.5px solid'} borderLeftColor={batchListingBorderColor}>
          <BatchListingDrawer
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
