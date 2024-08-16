import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text,} from '@chakra-ui/react'

import {getTheme} from '@src/global/theme/theme';
import {faEllipsisH} from "@fortawesome/free-solid-svg-icons";
import {useUser} from "@src/components-v2/useUser";

const MenuPopup = ({ options = [] }) => {
  const {theme: userTheme} = useUser();

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
          <React.Fragment key={option.label}>
            {option.type === 'url' ? (
              <MenuItem as='a' href={`${option.url}${window.location}`}>
                <Icon as={FontAwesomeIcon} icon={option.icon} />
                <Text ms={2}>{option.label}</Text>
              </MenuItem>
            ) : (
              <MenuItem onClick={option.handleClick}>
                <Icon as={FontAwesomeIcon} icon={option.icon} />
                <Text ms={2}>{option.label}</Text>
              </MenuItem>
            )}
          </React.Fragment>
        ))}
      </MenuList>
    </Menu>
  )
};

export default MenuPopup;