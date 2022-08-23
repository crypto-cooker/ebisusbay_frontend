import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBell, faTrash} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import {timeSince} from '@src/utils';
import {Offcanvas, Spinner} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";
import useDeleteNotifications from "@src/Components/Account/Settings/hooks/useDeleteNotifications";
import Link from "next/link";
import {getNotifications} from "@src/core/cms/next/notifications";

const NotificationMenu = function () {
  const history = useRouter();
  const {address, theme, profile} = useSelector((state) => state.user);
  const [showpop, setShowpop] = useState(false);
  const [requestDeleteNotifications] = useDeleteNotifications();

  // const fetcher = async ({ pageParam = 1 }) => {
  //   return await getNotifications(address, {page: pageParam});
  // };
  //
  // const {
  //   data:notifications,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   status,
  //   refetch
  // } = useInfiniteQuery(['Notifications', address], fetcher, {
  //   getNextPageParam: (lastPage, pages) => {
  //
  //     console.log('PAGES', pages, lastPage)
  //     return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
  //   },
  // })

  const { isLoading, isFetching, isError, error, data:notifications, refetch } = useQuery(
    ['Notifications', address],
    () => getNotifications(address),
    {enabled: !!profile.id}
  )

  const closePop = () => {
    setShowpop(false);
  };

  const navigateTo = (link) => {
    closePop();
    history.push(link);
  };

  const handleClearNotifications = async () => {
    await requestDeleteNotifications(address);
    await refetch();
  };

  const handleDeleteNotification = (notification) => async (e) => {
    await requestDeleteNotifications(address, notification.id);
    await refetch();
  }

  return address && (
    <div>
      <div className="de-menu-notification" onClick={() => setShowpop(!showpop)}>
        {notifications?.length > 0 && (
          <div className="d-count">{notifications.length > 99 ? '+' : notifications.length}</div>
        )}
        <span>
          <FontAwesomeIcon icon={faBell} color={theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>

      <Offcanvas show={showpop} onHide={closePop} placement="end">
        <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {status === "loading" ? (
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : status === "error" ? (
            <p className="text-center">Error: {error.message}</p>
          ) : !profile.id ? (
            <p className="text-center">
              <Link href="/account/settings/profile">Create a profile to activate notifications</Link>
            </p>
          ) : (
            <>
              {notifications.length > 0 && (
                <div className="d-flex flex-column">
                  <div className={classnames('mb-3 cursor-pointer text-end', styles.clear)} onClick={handleClearNotifications}>
                    Clear All Notifications
                  </div>

                  <div className="flex-fill h-auto overflow-scroll">
                    {notifications.length > 0 && (
                      notifications.map((item, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex text-muted fst-italic">
                            <div className="flex-fill">{timeSince(new Date(item.createdAt))} ago</div>
                            <div className="cursor-pointer" onClick={handleDeleteNotification(item)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
                          </div>
                          <span className="cursor-pointer" onClick={() => navigateTo(item.link)}>
                        {item.message}
                      </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default memo(NotificationMenu);
