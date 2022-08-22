import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBell, faTrash} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import {timeSince} from '@src/utils';
import {Offcanvas, Spinner} from "react-bootstrap";
import {getNotifications} from "@src/core/cms/endpoints/notifications";
import {useQuery} from "@tanstack/react-query";
import useDeleteNotifications from "@src/Components/Account/Settings/hooks/useDeleteNotifications";

const NotificationMenu = function () {
  const history = useRouter();
  const {address, theme} = useSelector((state) => state.user);
  const [showpop, setShowpop] = useState(false);
  const [requestDeleteNotifications] = useDeleteNotifications();

  const { isLoading, error, data:notifications, status, refetch } = useQuery(['Notifications', address], () =>
    getNotifications(address)
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
    <div className={classnames('mainside d-flex', styles.notification)}>
        <div id="de-click-menu-profile" className="de-menu-profile">
          <span onClick={() => setShowpop(!showpop)}>
            <FontAwesomeIcon icon={faBell} color="#fff" />
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
            <p>Error: {error.message}</p>
          ) : (
            <>
              {notifications.data.length > 0 && (
                <div className={classnames('mb-3 cursor-pointer text-end', styles.clear)} onClick={handleClearNotifications}>
                  Clear All Notifications
                </div>
              )}
              {notifications.data.length > 0 ? (
                notifications.data.map((item, index) => (
                  <div key={index}>
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
              ) : (
                <div className={classnames('text-center', styles.empty)}>
                  No new notifications
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
