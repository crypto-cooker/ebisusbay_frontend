import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { faDiscord, faTwitter, faMedium, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSquare, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LayeredIcon from './LayeredIcon';

const Footer = () => {
  const location = useLocation();
  const userTheme = useSelector((state) => {
    return state.user.theme;
  });

  return (
    <footer className="footer-light" data-is-in-home-page={(location.pathname === '/').toString()}>
      <div className="container text-center">
        <h5>Frens</h5>
        <div className="row align-items-center">
          <div className="col">
            <a href="https://nebkas.ro" target="_blank" rel="noreferrer">
              <img
                src={userTheme === 'light' ? '/img/logos/nebkas-logo.png' : '/img/logos/nebkas-logo.png'}
                alt="nebkas.co"
                width="128px"
              />
            </a>
          </div>
          <div className="col">
            <a href="https://weare.fi/en/" target="_blank" rel="noreferrer">
              <img
                src={userTheme === 'light' ? '/img/logos/wearefi-logo.png' : '/img/logos/wearefi-white.png'}
                alt="WeAre Solutions"
                width={userTheme === 'light' ? '64px' : '160px'}
              />
            </a>
          </div>
          <div className="col">
            <a href="https://crodex.app/" target="_blank" rel="noreferrer">
              <img
                src={userTheme === 'light' ? '/img/logos/crodex.png' : '/img/logos/crodex-white.png'}
                alt="CRODEX"
                width="150px"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="subfooter">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-2">
              <img height="40px" src="/img/web_logo.svg" alt="#" />
            </div>

            <div className="col-10 social-icons d-flex justify-content-end">
              <a href="https://discord.gg/ebisusbay" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faDiscord} bgIcon={faSquare} shrink={8} />
              </a>
              <a href="https://twitter.com/EbisusBay" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faTwitter} bgIcon={faSquare} shrink={7} />
              </a>
              <a href="https://www.instagram.com/ebisusbayofficial" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faInstagram} bgIcon={faSquare} shrink={7} />
              </a>
              <a href="https://blog.ebisusbay.com" target="_blank" rel="noreferrer">
                <LayeredIcon icon={faMedium} bgIcon={faSquare} shrink={7} />
              </a>
              <a href="mailto:support@ebisusbay.com">
                <LayeredIcon icon={faEnvelope} bgIcon={faSquare} shrink={7} />
              </a>
            </div>

            <a href="/tos.html" target="_blank" rel="noreferrer" className="col-12 pt-3 text-center">
              &nbsp;{'Terms of Service'}
            </a>

            <span className="col-12 pt-3 copy text-center" style={{ opacity: '0.6' }}>
              Copyright &copy; 2022 EbisusBay.com. All rights reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
