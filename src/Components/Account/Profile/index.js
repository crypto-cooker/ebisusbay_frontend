import React, {useCallback, useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { faDiscord, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSquare, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Button from '@src/Components/components/common/Button';
import LayeredIcon from '@src/Components/components/LayeredIcon';
import Avatar from './Avatar';
import useGetSettings from '../Settings/hooks/useGetSettings';

import styles from './profile.module.scss';
import {hostedImage} from "@src/helpers/image";
import {caseInsensitiveCompare, isCronosVerseCollection, shortAddress} from "@src/utils";
import Inventory from "@src/Components/Account/Profile/Inventory";
import Collections from "@src/Components/Account/Profile/Collections";
import Listings from "@src/Components/Account/Profile/Listings";
import Offers from "@src/Components/Account/Profile/Offers";
import Sales from "@src/Components/Account/Profile/Sales";
import Favorites from "@src/Components/Account/Profile/Favorites";

const tabs = {
  inventory: 'inventory',
  collections: 'collections',
  listings: 'listings',
  offers: 'offers',
  sales: 'sales',
  favorites: 'favorites',
};

export default function Profile({ address, userData }) {
  const user = useSelector((state) => state.user);
  // const userData = useGetSettings(slug);
  const router = useRouter();

  const navigateTo = (route) => {
    router.push(route);
  };

  const [currentTab, setCurrentTab] = React.useState(tabs.inventory);
  const handleTabChange = useCallback((tab) => {
    setCurrentTab(tab);
  }, []);

  // useEffect(() => {
  //   if (userData && user?.address && !userData.isLoading && !userData.response) {
  //     console.log('userdata?', userData);
  //     router.push('/');
  //   }
  // }, [userData, user]);

  const [isProfileOwner, setIsProfileOwner] = useState(false);
  useEffect(() => {
    setIsProfileOwner(user && caseInsensitiveCompare(address, user.address));
  }, [user])

  return (
    <div>
      <img src="/img/background/header-dark.webp" alt="banner" className="banner" />
      <section className="container pt-4">
        <div className="row">
          <div className="d-flex">
            <div className="">
              <Avatar src={hostedImage('/img/avatar.jpg')} />
            </div>
            <div className="flex-grow-1">
              <h2>{userData?.response?.cnsName ?? shortAddress(address)}</h2>
            </div>
            {isProfileOwner && (
              <div className="d-flex flex-column bd-highlight mb-3">
                <Button onClick={() => navigateTo('/account/settings/profile')}>Profile Settings</Button>
                <Button styleType="default-outlined" className="mt-2 w-auto">More Options</Button>
              </div>
            )}
          </div>
        </div>
        <div className="row mt-4">
          <div className="de_tab">
            <ul className="de_nav mb-4 text-start">
              <li className={`tab ${currentTab === tabs.inventory ? 'active' : ''}`}>
                <span onClick={() => handleTabChange(tabs.inventory)}>Inventory</span>
              </li>
              <li className={`tab ${currentTab === tabs.collections ? 'active' : ''}`}>
                <span onClick={() => handleTabChange(tabs.collections)}>Collections</span>
              </li>
              <li className={`tab ${currentTab === tabs.listings ? 'active' : ''}`}>
                <span onClick={() => handleTabChange(tabs.listings)}>Listings</span>
              </li>
              <li className={`tab ${currentTab === tabs.offers ? 'active' : ''}`}>
                <span onClick={() => handleTabChange(tabs.offers)}>Offers</span>
              </li>
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
              {currentTab === tabs.collections && (
                <Collections address={address} />
              )}
              {currentTab === tabs.listings && (
                <Listings address={address} />
              )}
              {currentTab === tabs.offers && (
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
    </div>
  );
}
