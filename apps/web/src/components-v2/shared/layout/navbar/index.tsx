import React, { RefObject, useEffect, useState } from 'react';
import Link from 'next/link';
import { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faMoon, faSackDollar, faSun, faWater } from '@fortawesome/free-solid-svg-icons';

import AccountMenu from './account-menu';
import NotificationMenu from './notification-menu';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
  useOutsideClick,
  VStack
} from '@chakra-ui/react';
import Cart from './cart/cart';
import { ChevronDownIcon, CloseIcon, ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import Search from '@src/components-v2/shared/layout/navbar/search';
import MobileSearchDrawer from '@src/components-v2/shared/layout/navbar/search/drawer';
import { useTokenExchangeRate } from '@market/hooks/useGlobalPrices';
import { appConfig } from '@src/config';
import FortuneIcon from '@src/components-v2/shared/icons/fortune';
import { round } from '@market/helpers/utils';
import ImageService from '@src/core/services/image';
import { useUser } from '@src/components-v2/useUser';
import {NetworkSwitcher} from "@src/components-v2/shared/layout/navbar/network-switcher";
import {useRouter} from "next/router";
import NavMenu from './nav-menu';

const config = appConfig();

const GlobalStyles = createGlobalStyle`
  header#myHeader {
    background: ${({ theme }: {theme: any}) => theme.colors.bgColor4};
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
`;

const NavLink = ({name, to, onClick}: {name: string, to: string, onClick?: any}) => {
  return (
    <Link href={to} className='single-link' onClick={onClick}>
      {name}
    </Link>
  );
}

const Header = function () {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {theme, profile, toggleTheme} = useUser();
  const shouldUseMobileSearch = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg'},
  );
  const [shouldHideTitle] = useMediaQuery('(max-width: 1080px)');
  const [shouldHideFrtn] = useMediaQuery('(max-width: 410px)');
  const { tokenUsdRate } = useTokenExchangeRate(config.tokens.frtn.address, Number(config.chain.id));
  const [currentFrtnPrice, setCurrentFrtnPrice] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // const ref: RefObject<HTMLDivElement> = React.useRef(null)
  // useOutsideClick({
  //   ref: ref,
  //   handler: onClose,
  // });

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
  };

  useEffect(() => {
    try {
      if (tokenUsdRate) {
        setCurrentFrtnPrice(round(tokenUsdRate, shouldUseMobileSearch ? 2 : 3));
      }
    } catch (e) {
      console.error('Error setting global FRTN price', e);
    }
  }, [tokenUsdRate]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   if (isMounted && router.isReady) {
  //     setIsRouterReady(true);
  //   }
  // }, [isMounted, router.isReady]);

  return (
    <Box>
      <GlobalStyles />
      <Box px={{base:2, md:4}} as="header" position="fixed" w="100%" zIndex={200} id="myHeader" className="navbar2">
        <Box maxW="2560px">
          <Flex h={16} alignItems={'center'}>
            <Link href="/">
              <HStack spacing={2}>
                <Image
                  src={theme === 'light' ? '/img/logo-light.svg' : '/img/logo-dark.svg'}
                  alt='ebisus bay logo'
                  w='44px'
                />
                {!shouldHideTitle && (
                  <Image
                    src={ImageService.translate('/img/logos/eb-title.png').custom({height: 17})}
                    maxH='17px'
                  />
                )}
              </HStack>
            </Link>
            {!shouldUseMobileSearch ? (
              <Box flexGrow={1} me={2} ms={4}>
                <Search />
              </Box>
            ) : (
              <Spacer />
            )}

            <Flex alignItems={'center'} className="mainside">
              <Box me={2}>
                <Link href='/dex/swap?outputCurrency=0x055c517654d72A45B0d64Dc8733f8A38E27Fd49C'>
                  <Image
                    src={ImageService.translate(`/img/ryoshi-with-knife/coin-logo.png`).convert()}
                    h='35px'
                    w='35px'
                  />
                </Link>
              </Box>

              {!!currentFrtnPrice && !shouldHideFrtn && (
                <Link href='/dex/swap?outputCurrency=0xaF02D78F39C0002D14b95A3bE272DA02379AfF21' target='_blank'>
                  <HStack fontSize='sm' fontWeight='bold' me={{base: 1, sm: 4}} spacing={1}>
                    <FortuneIcon boxSize={{base: 4, md: 6}} />
                    <Text as='span' className='col-white'>${currentFrtnPrice}</Text>
                  </HStack>
                </Link>
              )}

              <NavMenu display={{ base: 'none', md: 'flex' }}/>

              {shouldUseMobileSearch && <MobileSearchDrawer />}
              <Cart />
              {profile && <NotificationMenu />}
              {isMounted && <NetworkSwitcher />}
              <span className="my-auto">
                <AccountMenu />
              </span>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <NavMenu position={"fixed"} bottom={0} display={{base: 'flex', md: 'none'}} justifyContent={'space-around'} className="mobile-navbar"/>
    </Box>
  );
};
export default Header;