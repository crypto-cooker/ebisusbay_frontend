import React, {RefObject} from 'react';
import {useDispatch} from 'react-redux';
import Link from 'next/link';
import {createGlobalStyle} from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

import AccountMenu from './account-menu';
import NotificationMenu from './notification-menu';
import {setTheme} from '@src/GlobalState/User';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useOutsideClick
} from "@chakra-ui/react";
import Cart from "./cart";
import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons";
import Search from "@src/components-v2/shared/layout/navbar/search";
import MobileSearchDrawer from "@src/components-v2/shared/layout/navbar/search/drawer";
import {useAppSelector} from "@src/Store/hooks";

const GlobalStyles = createGlobalStyle`
  header#myHeader {
    background: ${({ theme }: {theme: any}) => theme.colors.bgColor4};
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
`;

const NavLink = ({name, to, onClick}: {name: string, to: string, onClick?: any}) => {
  return (
    <Link href={to}>
      {name}
    </Link>
  );
}

const Header = function () {
  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const { colorMode, setColorMode } = useColorMode()
  const {theme, profile, address} = useAppSelector((state) => state.user);
  const shouldUseMobileSearch = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg'},
  );

  const ref: RefObject<HTMLDivElement> = React.useRef(null)
  useOutsideClick({
    ref: ref,
    handler: onClose,
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    setColorMode(newTheme);
  };

  return (
    <>
      <GlobalStyles />
      <Box px={{base:2, md:4}} as="header" position="fixed" w="100%" zIndex={200} id="myHeader" className="navbar2">
        <Box maxW="2560px" ref={ref}>
          <Flex h={16} alignItems={'center'}>
            <Link href="/">
              <HStack spacing={2}>
                <Box w="44px" >
                  <img
                    src={theme === 'light' ? '/img/logo-light.svg' : '/img/logo-dark.svg'}
                    alt="ebisus bay logo"
                  />
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="normal"
                  color="white"
                  minW="97px"
                  display={{base: 'none', sm: 'block'}}
                >
                  Ebisu's Bay
                </Text>
              </HStack>
            </Link>
            {!shouldUseMobileSearch && (
              <Box w="100%" me={2} ms={4}>
                <Search />
              </Box>
            )}
            <Spacer />
            <Flex alignItems={'center'} className="mainside">
              <HStack
                as={'nav'}
                spacing={3}
                display={{base: 'none', md: 'flex'}}
                me={2}
              >
                <NavLink name={'Marketplace'} to={'/marketplace'} />
                <NavLink name={'Collections'} to={'/collections'} />
                <NavLink name={'Brands'} to={'/brands'} />
                <NavLink name={'Drops'} to={'/drops'} />
                <NavLink name={'Stats'} to={'/stats'} />
                {/*<NavLink name={'Auction'} to={'/auctions/mutant-serum'} />*/}
              </HStack>

              {shouldUseMobileSearch && <MobileSearchDrawer />}
              <Cart />
              {profile && <NotificationMenu />}
              <span className="my-auto">
                <AccountMenu />
              </span>
              <IconButton
                size={'md'}
                icon={isOpen ? <CloseIcon/> : <HamburgerIcon boxSize={6}/>}
                aria-label={'Open Menu'}
                display={{md: 'none'}}
                onClick={isOpen ? onClose : onOpen}
                color="white"
                variant="unstyled"
                ms={2}
              />
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{md: 'none'}} textAlign="end">
              <Stack as={'nav'} spacing={4}>
                <NavLink name={'Marketplace'} to={'/marketplace'} onClick={onClose} />
                <NavLink name={'Collections'} to={'/collections'} onClick={onClose} />
                <NavLink name={'Brands'} to={'/brands'} onClick={onClose} />
                <NavLink name={'Drops'} to={'/drops'} onClick={onClose} />
                <NavLink name={'Stats'} to={'/stats'} onClick={onClose} />
                {/*<NavLink name={'Auction'} to={'/auctions/mutant-serum'} />*/}

                <Box onClick={toggleTheme} fontSize="14px" fontWeight="bold" color="#fff" cursor="pointer">
                  <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} color="#fff" className="me-2"/> Dark mode
                </Box>
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
};
export default Header;
