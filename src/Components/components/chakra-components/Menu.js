import {
  Menu as MenuCK,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'

import { getTheme } from '@src/Theme/theme';
import { useDispatch, useSelector } from "react-redux";

const Menu = ({MenuButton, MenuItems = []}) => {

  const userTheme = useSelector((state) => state.user.theme);

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