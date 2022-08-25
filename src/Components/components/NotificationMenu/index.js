import React, {memo, useCallback, useState} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBell, faTrash} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import {timeSince} from '@src/utils';
import {Offcanvas, Spinner} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";
import useDeleteNotifications from "@src/hooks/useDeleteNotifications";
import Link from "next/link";
import {getNotifications} from "@src/core/cms/next/notifications";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import Button from "@src/Components/components/Button";

const NotificationMenu = function () {
  const history = useRouter();
  const {address, theme, profile} = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [requestDeleteNotifications] = useDeleteNotifications();
  const [signature, setSignature] = useState(null);
  const [awaitingSignature, getSigner] = useCreateSigner();

  const { isLoading, isError, error, data:notifications, refetch } = useQuery(
    ['Notifications', address, signature],
    () => getNotifications(address, signature),
    {enabled: !!signature}
  )

  const handleClose = () => {
    setShowMenu(false);
  };

  const handleExit = () => {
    setSignature(false);
  };

  const openMenu = useCallback(async () => {
    setShowMenu(true);
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    setSignature(signatureInStorage);
  }, [signature, showMenu, getSigner]);

  const navigateTo = (link) => {
    handleClose();
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
      <div className="de-menu-notification" onClick={openMenu}>
        {notifications?.length > 0 && (
          <div className="d-count">{notifications.length > 99 ? '+' : notifications.length}</div>
        )}
        <span>
          <FontAwesomeIcon icon={faBell} color={theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>

      <Offcanvas show={showMenu} onHide={handleClose} placement="end" onExited={handleExit}>
        <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isLoading ? (
            awaitingSignature || signature ? (
              <div className="col-lg-12 text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <p className="text-center">Verify your wallet to view notifications</p>
                <Button type="legacy"
                        className="mx-auto"
                        onClick={openMenu}
                        isLoading={isLoading && awaitingSignature}
                        disabled={isLoading && awaitingSignature}>
                  Retry
                </Button>
              </>
            )
          ) : isError ? (
            <p className="text-center">Error: {error.message}</p>
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
            <>
              {notifications.length > 0 ? (
                <div className="d-flex flex-column">
                  <div className={classnames('mb-3 cursor-pointer text-end', styles.clear)} onClick={handleClearNotifications}>
                    Clear All Notifications
                  </div>

                  <div className="flex-fill h-auto ">
                    {notifications.length > 0 && (
                      notifications.map((item, index) => (
                        <div key={index} className="d-flex mb-3">
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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center">There are no notifications to display</p>
              )}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default memo(NotificationMenu);
