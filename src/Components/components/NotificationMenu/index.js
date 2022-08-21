import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import {shortAddress, timeSince} from '@src/utils';
import {Offcanvas, Spinner} from "react-bootstrap";
import {getNotifications} from "@src/core/cms/endpoints/notifications";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";



const NotificationMenu = function () {
  const history = useRouter();
  const {address, theme} = useSelector((state) => state.user);
  const [showpop, setShowpop] = useState(false);

  const { isLoading, error, data:notifications, status } = useQuery(['Notifications', address], () =>
    getNotifications(address)
  )
  console.log('data', notifications);

  const closePop = () => {
    setShowpop(false);
  };

  const navigateTo = (link) => {
    closePop();
    history.push(link);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

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
                {notifications.data.length > 0 ? (
                  notifications.data.map((item, index) => (
                    <div key={index}>
                      <span className="cursor-pointer" onClick={() => navigateTo(item.link)}>
                          <div className="text-muted fst-italic">{timeSince(new Date(item.createdAt))} ago</div>
                          <div>{item.message}</div>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.empty}>No new notifications</div>
                )}
              {notifications.length > 0 && (
                <div className={classnames('mt-3 cursor-pointer', styles.clear)} onClick={handleClearNotifications}>
                  Clear All Notifications
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
