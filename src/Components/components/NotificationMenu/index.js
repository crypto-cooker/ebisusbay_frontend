import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './notificationmenu.module.scss';
import { shortAddress } from '../../../utils';

const dummy = [
  {
    avatar: '',
    address: '0xd97b3FE49Da58302893808A856B8214439Ae578e',
    message: 'started following you',
    timestamp: '1 hour ago',
  },
  {
    avatar: '',
    address: '0xd87b3FE49Da58302893808A856B8214439Ae678e',
    message: 'liked one of your items',
    timestamp: '2 hour ago',
  },
  {
    avatar: '',
    address: '0xd77b3FE49Da58302893808A856B8214439Ae778e',
    message: 'Slothy#1 has been sold',
    timestamp: '6 hour ago',
  },
  {
    avatar: '',
    address: '0xd67b3FE49Da58302893808A856B8214439Ae878e',
    message: 'Slothy#2 has a higher bid',
    timestamp: '6 hour ago',
  },
  {
    avatar: '',
    address: '0xd57b3FE49Da58302893808A856B8214439Ae978e',
    message: 'started following you',
    timestamp: '8 hour ago',
  },
];

const NotificationMenu = function () {
  const history = useRouter();
  const walletAddress = useSelector((state) => state.user.address);
  const [showpop, setShowpop] = useState(false);
  const [notifications, setNotifications] = useState(dummy);

  const closePop = () => {
    setShowpop(false);
  };
  const refpop = useOnclickOutside(() => {
    closePop();
  });

  const navigateTo = (link) => {
    closePop();
    history.push(link);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className={classnames('mainside d-flex', styles.notification)}>
      {walletAddress && (
        <div id="de-click-menu-profile" className="de-menu-profile">
          <span onClick={() => setShowpop(!showpop)}>
            <FontAwesomeIcon icon={faBell} color="#fff" />
          </span>
          {showpop && (
            <div className={classnames('popshow', styles.popshow)} ref={refpop}>
              <h3>Notifications</h3>
              <ul className={styles.list}>
                {notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <li key={index}>
                      <span onClick={() => navigateTo(`/`)}>
                        <span>
                          <Blockies seed={item.address} size="8" scale="5" />
                        </span>
                        <span className="ms-3">
                          <div>{shortAddress(item.address)}</div>
                          <div>{item.message}</div>
                          <div>{item.timestamp}</div>
                        </span>
                      </span>
                    </li>
                  ))
                ) : (
                  <div className={styles.empty}>Notifications are coming ...</div>
                )}
              </ul>
              {notifications.length > 0 && (
                <div className={classnames('mt-3 cursor-pointer', styles.clear)} onClick={handleClearNotifications}>
                  Clear All Notifications
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(NotificationMenu);
