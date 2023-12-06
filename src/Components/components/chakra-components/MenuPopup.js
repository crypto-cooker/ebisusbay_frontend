import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text,} from '@chakra-ui/react'

import {getTheme} from '@src/Theme/theme';
import {useSelector} from "react-redux";
import {faEllipsisH} from "@fortawesome/free-solid-svg-icons";

const MenuPopup = ({ options = [] }) => {
  const userTheme = useSelector((state) => state.user.theme);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<Icon as={FontAwesomeIcon} icon={faEllipsisH} />}
        size='sm'
        h='full'
        variant='unstyled'
        my='auto'
      />
      <MenuList color={getTheme(userTheme).colors.textColor3} zIndex={2}>
        {options.map(option => (
          <>
            {option.type === 'url' ? (
              <MenuItem key={option.label} as='a' href={`${option.url}${window.location}`}>
                <Icon as={FontAwesomeIcon} icon={option.icon} />
                <Text ms={2}>{option.label}</Text>
              </MenuItem>
            ) : (
              <MenuItem key={option.label} as='a' onClick={option.handleClick}>
                <Icon as={FontAwesomeIcon} icon={option.icon} />
                <Text ms={2}>{option.label}</Text>
              </MenuItem>
            )}
          </>
        ))}
      </MenuList>
    </Menu>
  )
};

export default MenuPopup;