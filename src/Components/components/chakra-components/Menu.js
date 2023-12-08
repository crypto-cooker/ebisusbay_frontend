import {Menu as MenuCK, MenuItem, MenuList,} from '@chakra-ui/react'

import {getTheme} from '@src/Theme/theme';
import {useUser} from "@src/components-v2/useUser";

const Menu = ({MenuButton, MenuItems = []}) => {
  const {theme: userTheme} = useUser();

  return (
    <MenuCK bg={getTheme(userTheme).colors.bgColor1} >
      {MenuButton}
      <MenuList bg={getTheme(userTheme).colors.bgColor1} zIndex={2}>
        {MenuItems.map((item, key) => {
          return (
            <MenuItem key={key}>{item}</MenuItem>
          )
        })}
      </MenuList>
    </MenuCK>
  )
}

export default Menu; 