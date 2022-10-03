import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faSquareTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { LegacyOutlinedButton } from "@src/Components/components/common/Button";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react'

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

const SocialMediaPopup = ({ children }) => {

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location);
    toast.info(`Link copied!`);
  }, [navigator, window.location])

  return (
    <Popover>
      <PopoverTrigger>
        <LegacyOutlinedButton className="m-0 text-nowrap p-4 pt-2 pb-2 btn-outline inline white">
          {React.cloneElement(children)}
        </LegacyOutlinedButton>
      </PopoverTrigger>
      <PopoverContent width='240px'>
        <PopoverBody>
          <PopoverArrow />
          <div className='social_media_popup'>
            <ul>
              {options.map(option => (
                <a href={`${option.url}${window.location}`} target='_blank' >
                  <li key={option.socialMedia}>
                    <div className='icon_container'>
                      <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
                    </div>
                    <div className='label_container'>
                      <span>Share on {option.socialMedia}</span>
                    </div>
                  </li>
                </a>
              ))}
              <li onClick={copyLink}>
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
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
};

export default SocialMediaPopup;