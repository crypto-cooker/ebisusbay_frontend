import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LegacyOutlinedButton } from "@src/Components/components/common/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react'

import { getTheme } from '@src/Theme/theme';
import { useDispatch, useSelector } from "react-redux";

const MenuPopup = ({ children, options = [] }) => {
  const userTheme = useSelector((state) => state.user.theme);

  return (
    <Popover>
      <PopoverTrigger>
        <LegacyOutlinedButton className="m-0 text-nowrap p-4 pt-2 pb-2 btn-outline inline white">
          {React.cloneElement(children)}
        </LegacyOutlinedButton>
      </PopoverTrigger>
      <PopoverContent width='240px' bg={getTheme(userTheme).colors.bgColor1}>
        <PopoverBody p='0'>
          <div className='social_media_popup'>
            <ul>
              {options.map(option => (
                option.type === 'url' ?
                  (
                    <a href={`${option.url}${window.location}`} target='_blank' >
                      <li key={option.label}>
                        <div className='icon_container'>
                          <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
                        </div>
                        <div className='label_container'>
                          <span>{option.label}</span>
                        </div>
                      </li>
                    </a>

                  )
                  :
                  (<li onClick={option.handleClick} key={option.label}>
                    <div className='icon_container'>
                      <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
                    </div>
                    <div className='label_container'>
                      <span>
                        {option.label}
                      </span>
                    </div>
                  </li>)

              ))}
            </ul>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
};

export default MenuPopup;