import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faImage, faSignOutAlt, faShoppingBag, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';

const NotificationMenu = function () {
  const history = useRouter();
  const [showpop, btn_icon_pop] = useState(false);
  const walletAddress = useSelector((state) => {
    return state.user.address;
  });

  const closePop = () => {
    btn_icon_pop(false);
  };
  const refpop = useOnclickOutside(() => {
    closePop();
  });

  const navigateTo = (link) => {
    closePop();
    history.push(link);
  };

  return (
    <div className="mainside d-flex">
      {walletAddress && (
        <div id="de-click-menu-profile" className="de-menu-profile">
          <span onClick={() => btn_icon_pop(!showpop)}>N</span>
          {showpop && (
            <div className="popshow" ref={refpop}>
              <div className="d-line"></div>
              <ul className="de-submenu-profile">
                <li>
                  <span onClick={() => navigateTo(`/nfts`)}>
                    <span>
                      <FontAwesomeIcon icon={faImage} />
                    </span>
                    <span>My NFTs</span>
                  </span>
                </li>
              </ul>
              <div className="d-line"></div>
              <ul className="de-submenu-profile">
                <li>
                  <span onClick={() => navigateTo(`/account/profile`)}>
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <span>User Profile</span>
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(NotificationMenu);
