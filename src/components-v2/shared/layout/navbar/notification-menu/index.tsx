import React, {memo, useCallback, useState} from 'react';
import {useRouter} from 'next/router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faCog, faTrash} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import {timeSince} from '@src/utils';
import {useQuery} from "@tanstack/react-query";
import useDeleteNotifications from "@src/hooks/useDeleteNotifications";
import {getNotifications} from "@src/core/cms/next/notifications";
import Button from "@src/Components/components/Button";
import {useAppSelector} from "@src/Store/hooks";
import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay, Flex, Spinner,
  Text
} from "@chakra-ui/react";

const NotificationMenu = function () {
  const history = useRouter();
  const {address, theme, profile}: {address: any, theme: any, profile: any} = useAppSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [requestDeleteNotifications] = useDeleteNotifications();

  const { isPending, isError, error, data: notifications, refetch } = useQuery({
    queryKey: ['Notifications', address],
    queryFn: () => getNotifications(address),
    enabled: !!profile?.id,
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
    await requestDeleteNotifications(address);
    await refetch();
  };

  const handleDeleteNotification = (notification: any) => async (e: any) => {
    await requestDeleteNotifications(address, notification.id);
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
                        <Box key={item.createdAt} className={classnames('card eb-nft__card px-3 py-2 mb-2', styles.card)}>
                          <Flex>
                            <div className="flex-fill">
                              <div className="text-muted fst-italic">
                                <div className="flex-fill">{timeSince(new Date(item.createdAt))} ago</div>
                              </div>
                              <span className="cursor-pointer" onClick={() => navigateTo(item.link)}>
                                {item.message}
                              </span>
                            </div>
                            <div className="cursor-pointer my-auto ms-4" onClick={handleDeleteNotification(item)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
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
