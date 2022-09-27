import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faSquareTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';
import Button from "@src/Components/components/common/Button";
import { toast } from "react-toastify";

import useOutSide from '../../hooks/useOutSide';

const options = [
  {
    url: 'https://www.facebook.com/sharer/sharer.php?u=',
    socialMedia: 'facebook',
    icon: faFacebook,
  },
  {
    url: 'https://twitter.com/intent/tweet?text=',
    socialMedia: 'twitter',
    icon: faSquareTwitter
  },
  {
    url: 'https://telegram.me/share/?url=',
    socialMedia: 'telegram',
    icon: faTelegram
  }
]

const FIELD_HEIGHT = 55;
const DEFAULT_MENU_SPACING = 30;

const SocialMediaPopup = ({ children }) => {

  const { visible, setVisible, ref } = useOutSide(false);
  const router = useRouter()

  const pxInset = (DEFAULT_MENU_SPACING + FIELD_HEIGHT * (
    options.length)
  );

  const onClick = useCallback(() => {
    setVisible((prevSate) =>
      !prevSate
    )
  }, [setVisible]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location);
    toast.info(`Link copied!`);
  }, [navigator, window.location])

  return (
    <>
      <Button styleType="default-outlined" onClick={onClick}>
        {React.cloneElement(children)}
      </Button>

      {visible && <div className='social-media-popup' style={{ inset: `-${pxInset}px auto auto -200px` }} ref={ref}>
        <ul>
          {options.map(option => <li
            key={option.socialMedia}>
            <a href={`${option.url}${window.location}`} target='_blank' >
              <div className='icon_container'>
                <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
              </div>
              <div className='label_container'>
                <span>Share on {option.socialMedia}</span>
              </div>
            </a>
          </li>)}
          <li onClick={copyLink} >
            <div className='icon_container'>
              <FontAwesomeIcon icon={faCopy} style={{ height: 28 }} />
            </div>
            <div className='label_container'>
              <span>
                Copy Link
              </span>
            </div>
          </li>
        </ul>
      </div>}
    </>
  )
};

export default SocialMediaPopup;