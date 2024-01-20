import React, {memo, useCallback, useState} from 'react';
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faCog, faTrash} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import {timeSince} from '@src/utils';
import {useQuery} from "@tanstack/react-query";
import useDeleteNotifications from "@src/hooks/useDeleteNotifications";
import {getNotifications} from "@src/core/cms/next/notifications";
import Button from "@src/Components/components/Button";
import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Spinner,
  Text
} from "@chakra-ui/react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";

const NotificationMenu = function () {
  const history = useRouter();
  const {address, theme, profile} = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [requestDeleteNotifications] = useDeleteNotifications();
  const cardBg = useColorModeValue('white', '#333');

  const { isPending, isError, error, data: notifications, refetch } = useQuery({
    queryKey: ['Notifications', address],
    queryFn: () => getNotifications(address!),
    enabled: !!address && !!profile?.id,
    staleTime: 1000 * 60
  });

  const handleClose = () => {
    setShowMenu(false);
  };

  const openMenu = useCallback(async () => {
    setShowMenu(true);
  }, [showMenu]);

  const navigateTo = (link: string) => {
    handleClose();
    history.push(link);
  };

  const handleClearNotifications = async () => {
    await requestDeleteNotifications(address!);
    await refetch();
  };

  const handleDeleteNotification = (notification: any) => async (e: any) => {
    await requestDeleteNotifications(address!, notification.id);
    await refetch();
  }

  const handleSettingsClicked = async () => {
    history.push('/account/settings/notification');
    handleClose();
  };

  return address && (
    <div>
      <div className="de-menu-notification" onClick={openMenu}>
        {notifications?.length > 0 && (
          <div className="d-count">{notifications.length > 99 ? '+' : notifications.length}</div>
        )}
        <span>
          <FontAwesomeIcon icon={faBell} color={theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>

      <Drawer
        isOpen={showMenu}
        onClose={handleClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody>
            {isPending ? (
              profile.error ? (
                <>
                  <p className="text-center">Error loading profile</p>
                </>
              ) : !profile.id ? (
                <>
                  <p className="text-center">Create a profile to activate notifications</p>
                  <Button type="legacy"
                          className="mx-auto"
                          onClick={() => navigateTo('/account/settings/profile')}>
                    Create Profile
                  </Button>
                </>
              ) : (
                <Center>
                  <Spinner />
                </Center>
              )
            ) : isError ? (
              <>
                {profile.error ? (
                  <>
                    <p className="text-center">Error loading profile</p>
                  </>
                ) : !profile.id ? (
                  <>
                    <p className="text-center">Create a profile to activate notifications</p>
                    <Button type="legacy"
                            className="mx-auto"
                            onClick={() => navigateTo('/account/settings/profile')}>
                      Create Profile
                    </Button>
                  </>
                ) : (
                  <p className="text-center">Error: {(error as any)?.message}</p>
                )}
              </>
            ) : (
              <>
                <div className="d-flex justify-content-between">
                  <FontAwesomeIcon icon={faCog} onClick={handleSettingsClicked} className="cursor-pointer" />
                  {notifications.length > 0 && (
                    <div className={classnames('mb-3 cursor-pointer text-end', styles.clear)} onClick={handleClearNotifications}>
                      Clear All Notifications
                    </div>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <div className="flex-fill h-auto">
                    {notifications.length > 0 && (
                      notifications.map((item: any) => (
                        <Box key={item.createdAt} p={2} mb={2} className={classnames('card eb-nft__card', styles.card)} bg={cardBg}>
                          <Flex>
                            <Box me={2} p={1} my='auto' w='60px'>
                              <Image
                                src={ImageService.translate(imageMappings[item.type].icon).avatar()}
                                alt={imageMappings[item.type].alt}
                                w={50}
                                h={50}
                              />
                            </Box>
                            <Box flex='1' textAlign='start'>
                              <Box className='text-muted fst-italic'>
                                {timeSince(new Date(item.createdAt))} ago
                              </Box>
                              <span className="cursor-pointer" onClick={() => navigateTo(item.link)}>
                                {item.message}
                              </span>
                            </Box>
                            <Box my='auto' ms={4} me={1} cursor='pointer' onClick={handleDeleteNotification(item)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Box>
                          </Flex>
                        </Box>
                      ))
                    )}
                  </div>
                ) : (
                  <Text align='center' py={6}>There are no notifications to display</Text>
                )}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default memo(NotificationMenu);


const imageMappings: {[key:string]: {icon: string, alt: string}} = {
  SOLD: {
    icon: '/img/icons/notifications/sold.svg',
    alt: 'Sold'
  },
  LISTED: {
    icon: '/img/icons/notifications/listed.svg',
    alt: 'Listed'
  },
  OFFER_MADE: {
    icon: '/img/icons/notifications/offer-made.svg',
    alt: 'Offer Made'
  },
  OFFER_ACCEPTED: {
    icon: '/img/icons/notifications/offer-accepted.svg',
    alt: 'Offer Accepted'
  },
  FAVORITE_LISTED: {
    icon: '/img/icons/notifications/favorite-listed.svg',
    alt: 'Favorite Listed'
  },
  LEVEL_UP: {
    icon: '/img/icons/notifications/level-up.svg',
    alt: 'Level Up'
  },
  XP_GAINED: {
    icon: '/img/icons/notifications/xp-gained.svg',
    alt: 'XP Gained'
  },
  GENERAL: {
    icon: '/img/icons/notifications/general.svg',
    alt: 'General Notification'
  },
  ANNOUNCEMENT: {
    icon: '/img/icons/notifications/announcement.svg',
    alt: 'Announcement'
  }
}