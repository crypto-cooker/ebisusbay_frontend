import React, {forwardRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faHamburger, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

import AccountMenu from '../components/AccountMenu';
import NotificationMenu from '../components/NotificationMenu';
import { setTheme } from '@src/GlobalState/User';
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Stack, Text,
  useColorMode,
  useDisclosure, useOutsideClick
} from "@chakra-ui/react";
import Cart from "@src/Components/v2/modules/navbar/cart";
import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons";

const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };

const GlobalStyles = createGlobalStyle`
  header#myHeader {
    background: ${({ theme }) => theme.colors.bgColor4};
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
`;

const NavLink = ({name, to, onClick}) => {
  return (
    <Link href={to}>
      <a onClick={onClick}>
        {name}
      </a>
    </Link>
  );
}

const Header = function () {
  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const { colorMode, setColorMode } = useColorMode()
  const {theme, profile, address} = useSelector((state) => state.user);

  const ref = React.useRef()
  useOutsideClick({
    ref: ref,
    handler: onClose,
  })

  const { Features } = Constants;
  const isNotificationsEnabled = useFeatureFlag(Features.CMS_NOTIFICATIONS);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    setColorMode(newTheme);
  };

  return (
    <>
      <GlobalStyles />
      <Box px={{base:2, md:"3rem"}} as="header" position="fixed" w="100%" zIndex={200} id="myHeader" className="navbar2">
        <Box maxW="2560px">
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <HStack spacing={8} alignItems={'center'}>
              <Link href="/">
                <a>
                  <HStack
                    as={'nav'}
                    spacing={2}>
                        <img
                          src={theme === 'light' ? '/img/logo-light.svg' : '/img/logo-dark-prod.svg'}
                          alt="ebisus bay logo"
                          style={{ width: '44px', height: '40px' }}
                        />
                    <Text
                      fontSize="lg"
                      pt={2}
                      fontWeight="normal"
                      color="white"
                      minWidth="97px"
                      display={{base: 'none', sm: 'block'}}
                    >
                      Ebisu's Bay
                    </Text>
                  </HStack>
                </a>
              </Link>
            </HStack>
            <Flex alignItems={'center'} className="mainside">
              <HStack
                as={'nav'}
                spacing={3}
                display={{base: 'none', md: 'flex'}}
                me={4}
              >
                <NavLink name={'Home'} to={'/'} />
                <NavLink name={'Marketplace'} to={'/marketplace'} />
                <NavLink name={'Collections'} to={'/collections'} />
                <NavLink name={'Drops'} to={'/drops'} />
                <NavLink name={'Stats'} to={'/stats'} />
                <NavLink name={'Ryoshi Tales'} to={'/ryoshi-tales'} />
              </HStack>
              <span onClick={toggleTheme} className="cursor-pointer me-3 my-auto">
              <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} color="#fff" />
            </span>

              <span className={address ? '' : 'me-2'}>
              <Cart />
            </span>
              {isNotificationsEnabled && profile && (
                <NotificationMenu />
              )}
              <span className="my-auto">
              <AccountMenu />
            </span>
              <IconButton
                size={'md'}
                icon={isOpen ? <CloseIcon/> : <FontAwesomeIcon icon={faBars} />}
                aria-label={'Open Menu'}
                display={{md: 'none'}}
                onClick={isOpen ? onClose : onOpen}
                color="white"
                variant="unstyled"
              />
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{md: 'none'}} textAlign="end" ref={ref}>
              <Stack as={'nav'} spacing={4}>
                <NavLink name={'Home'} to={'/'} onClick={onClose} />
                <NavLink name={'Marketplace'} to={'/marketplace'} onClick={onClose} />
                <NavLink name={'Collections'} to={'/collections'} onClick={onClose} />
                <NavLink name={'Drops'} to={'/drops'} onClick={onClose} />
                <NavLink name={'Stats'} to={'/stats'} onClick={onClose} />
                <NavLink name={'Ryoshi Tales'} to={'/ryoshi-tales'} onClick={onClose}/>

              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
};
export default Header;
