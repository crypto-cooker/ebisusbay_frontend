import React, {RefObject} from 'react';
import {useDispatch} from 'react-redux';
import Link from 'next/link';
import {createGlobalStyle} from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

import AccountMenu from './account-menu';
import NotificationMenu from './notification-menu';
import {setTheme} from '@src/GlobalState/User';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useOutsideClick
} from "@chakra-ui/react";
import Cart from "./cart";
import {ChevronDownIcon, CloseIcon, HamburgerIcon} from "@chakra-ui/icons";
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
    <Link href={to} className='single-link'>
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
                me={4}
              >
                <NavLink name={'Rewards'} to={'/rewards'} />
                <Menu placement='bottom-end'>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm' variant='unstyled' color='white'>
                    Marketplace
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} href='/marketplace' _hover={{color: 'inherit'}} justifyContent='end'>Explore</MenuItem>
                    <MenuItem as={Link} href='/collections' _hover={{color: 'inherit'}} justifyContent='end'>Collections</MenuItem>
                    <MenuItem as={Link} href='/brands' _hover={{color: 'inherit'}} justifyContent='end'>Brands</MenuItem>
                    <MenuItem as={Link} href='/drops' _hover={{color: 'inherit'}} justifyContent='end'>Drops</MenuItem>
                    <MenuItem as={Link} href='/apply' _hover={{color: 'inherit'}} justifyContent='end'>Become a Creator</MenuItem>
                    {/*<MenuItem as='a' href='/stats'>Stats</MenuItem>*/}
                    {/*<MenuItem as='a' href='/auctions'>Auction</MenuItem>*/}
                  </MenuList>
                </Menu>
                <Menu placement='bottom-end'>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm' variant='unstyled' color='white'>
                    GameFi
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} href='/ryoshi' _hover={{color: 'inherit'}} justifyContent='end'>Ryoshi Dynasties</MenuItem>
                  </MenuList>
                </Menu>
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
                <NavLink name={'Rewards'} to={'/rewards'} onClick={onClose} />
                <NavLink name={'Ryoshi Dynasties'} to={'/ryoshi'} />
                <NavLink name={'Marketplace'} to={'/marketplace'} onClick={onClose} />
                <NavLink name={'Collections'} to={'/collections'} onClick={onClose} />
                <NavLink name={'Brands'} to={'/brands'} onClick={onClose} />
                <NavLink name={'Drops'} to={'/drops'} onClick={onClose} />
                <NavLink name={'Become a Creator'} to={'/apply'} onClick={onClose} />
                {/*<NavLink name={'Stats'} to={'/stats'} onClick={onClose} />*/}
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
