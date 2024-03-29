import React, {RefObject, useEffect, useState} from 'react';
import Link from 'next/link';
import {createGlobalStyle} from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

import AccountMenu from './account-menu';
import NotificationMenu from './notification-menu';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
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
} from "@chakra-ui/react";
import Cart from "./cart";
import {ChevronDownIcon, CloseIcon, HamburgerIcon} from "@chakra-ui/icons";
import Search from "@src/components-v2/shared/layout/navbar/search";
import MobileSearchDrawer from "@src/components-v2/shared/layout/navbar/search/drawer";
import {useTokenExchangeRate} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {round} from "@src/utils";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";

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
  const [shouldHideTitle] = useMediaQuery('(max-width: 516px)');
  const [shouldHideFrtn] = useMediaQuery('(max-width: 410px)');
  const { tokenUsdRate } = useTokenExchangeRate(config.tokens.frtn.address, config.chain.id);
  const [currentFrtnPrice, setCurrentFrtnPrice] = useState(0);

  const ref: RefObject<HTMLDivElement> = React.useRef(null)
  useOutsideClick({
    ref: ref,
    handler: onClose,
  });

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

  return (
    <>
      <GlobalStyles />
      <Box px={{base:2, md:4}} as="header" position="fixed" w="100%" zIndex={200} id="myHeader" className="navbar2">
        <Box maxW="2560px" ref={ref}>
          <Flex h={16} alignItems={'center'}>
            <Link href="/">
              <HStack spacing={2}>
                <Image
                  src={theme === 'light' ? '/img/logo-light.svg' : '/img/logo-dark.svg'}
                  alt='ebisus bay logo'
                  w='44px'
                />
                {!shouldHideTitle && shouldUseMobileSearch ? (
                  <Image
                    src={ImageService.translate('/img/logos/eb-title-sm.png').convert()}
                    maxH='40px'
                  />
                ) : !shouldHideTitle && (
                  <Image
                    src={ImageService.translate('/img/logos/eb-title-lg.png').convert()}
                    maxH='40px'
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
              <Box me={4}>
                <Link href='https://swap.ebisusbay.com/#/swap?outputCurrency=0x055c517654d72A45B0d64Dc8733f8A38E27Fd49C&inputCurrency=0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'>
                  <Image
                    src={ImageService.translate(`/img/ryoshi-with-knife/ryoshiwithknife_village.apng`).fixedWidth(30, 50)}
                    h='50px'
                    w='30px'
                  />
                </Link>
              </Box>

              {!!currentFrtnPrice && !shouldHideFrtn && (
                <Link href='https://swap.ebisusbay.com/#/swap?outputCurrency=0xaF02D78F39C0002D14b95A3bE272DA02379AfF21&inputCurrency=0xc21223249CA28397B4B6541dfFaEcC539BfF0c59' target='_blank'>
                  <HStack fontSize='sm' fontWeight='bold' me={{base: 1, sm: 4}} spacing={1}>
                    <FortuneIcon boxSize={{base: 4, md: 6}} />
                    <Text as='span' className='col-white'>${currentFrtnPrice}</Text>
                  </HStack>
                </Link>
              )}

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
                    <MenuItem as={Link} href='/swap' _hover={{color: 'inherit'}} justifyContent='end'>Swap</MenuItem>
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
                    <MenuItem as={Link} href='/collection/izanamis-cradle-land-deeds?tab=dynastiesMap' _hover={{color: 'inherit'}} justifyContent='end'>Izanami&apos;s Cradle</MenuItem>
                    <MenuItem as={Link} href='/collection/ryoshi-playing-cards?tab=pokerRanks' _hover={{color: 'inherit'}} justifyContent='end'>Crypto HODL&apos;em</MenuItem>
                    <MenuItem as={Link} href='/xp-leaderboard' _hover={{color: 'inherit'}} justifyContent='end'>XP Leaderboard</MenuItem>
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
            <Box pb={2} display={{md: 'none'}}>
              <SimpleGrid columns={2} p={2}>
                <Box>
                  <VStack align='start' spacing={0} mb={2}>
                    <Heading size='md' className='col-white'>Marketplace</Heading>
                    <Divider borderColor='white' w='150px' mb={2} mt={1} />
                  </VStack>
                  <VStack align='start'>
                    <NavLink name='Explore' to='/marketplace' onClick={onClose} />
                    <NavLink name='Collections' to='/collections' onClick={onClose} />
                    <NavLink name='Swap' to='/swap' onClick={onClose} />
                    <NavLink name='Brands' to='/brands' onClick={onClose} />
                    <NavLink name='Drops' to='/drops' onClick={onClose} />
                    <NavLink name='Become a Creator' to='/apply' onClick={onClose} />
                  </VStack>
                </Box>
                <Box>
                  <VStack align='end' spacing={0} mb={2}>
                    <Heading size='md' className='col-white'>GameFi</Heading>
                    <Divider borderColor='white' w='150px' mb={2} mt={1} />
                  </VStack>
                  <VStack align='end'>
                    <NavLink name='Ryoshi Dynasties' to='/ryoshi' onClick={onClose} />
                    <NavLink name='Izanami&apos;s Cradle' to='/collection/izanamis-cradle-land-deeds?tab=dynastiesMap' onClick={onClose} />
                    <NavLink name='Crypto HODL&apos;em' to='/collection/ryoshi-playing-cards?tab=pokerRanks' onClick={onClose} />
                    <NavLink name='XP Leaderboard' to='/xp-leaderboard' onClick={onClose} />
                    <NavLink name='Rewards' to='/rewards' onClick={onClose} />
                  </VStack>
                </Box>
              </SimpleGrid>
              <Stack mt={2} align='center'>
                {/*<NavLink name={'Stats'} to={'/stats'} onClick={onClose} />*/}
                {/*<NavLink name={'Auction'} to={'/auctions/mutant-serum'} />*/}

                <Box onClick={handleToggleTheme} fontSize="14px" fontWeight="bold" color="#fff" cursor="pointer">
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