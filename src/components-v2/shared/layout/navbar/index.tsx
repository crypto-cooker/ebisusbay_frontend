import React, {RefObject, useEffect, useState} from 'react';
import Link from 'next/link';
import {createGlobalStyle} from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowsLeftRightToLine,
  faArrowsUpDown,
  faCoins,
  faMoon,
  faSackDollar,
  faSun
} from '@fortawesome/free-solid-svg-icons';

import AccountMenu from './account-menu';
import NotificationMenu from './notification-menu';
import {
  Box,
  Button,
  Divider,
  Flex, Grid,
  Heading,
  HStack, Icon,
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
import {useTokenExchangeRate} from "@market/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {round} from "@market/helpers/utils";
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
  const [shouldHideTitle] = useMediaQuery('(max-width: 1080px)');
  const [shouldHideFrtn] = useMediaQuery('(max-width: 410px)');
  const { tokenUsdRate } = useTokenExchangeRate(config.tokens.frtn.address, Number(config.chain.id));
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
              <Box me={2}>
                <Link href='https://swap.ebisusbay.com/#/swap?outputCurrency=0x055c517654d72A45B0d64Dc8733f8A38E27Fd49C'>
                  <Image
                    src={ImageService.translate(`/img/ryoshi-with-knife/coin-logo.png`).convert()}
                    h='35px'
                    w='35px'
                  />
                </Link>
              </Box>

              {!!currentFrtnPrice && !shouldHideFrtn && (
                <Link href='https://swap.ebisusbay.com/#/swap?outputCurrency=0xaF02D78F39C0002D14b95A3bE272DA02379AfF21' target='_blank'>
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
                <Menu placement='bottom-end'>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm' variant='unstyled' color='white'>
                    DEX
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} href='https://swap.ebisusbay.com' _hover={{color: 'inherit'}} justifyContent='end'>Swap</MenuItem>
                    <MenuItem as={Link} href='/dex/farms' _hover={{color: 'inherit'}} justifyContent='end'>Farms</MenuItem>
                    <MenuItem as={Link} href='/liberator' _hover={{color: 'inherit'}} justifyContent='end'>Liberator</MenuItem>
                  </MenuList>
                </Menu>
                <Menu placement='bottom-end'>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm' variant='unstyled' color='white'>
                    Marketplace
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} href='/marketplace' _hover={{color: 'inherit'}} justifyContent='end'>Explore</MenuItem>
                    <MenuItem as={Link} href='/collections' _hover={{color: 'inherit'}} justifyContent='end'>Collections</MenuItem>
                    <MenuItem as={Link} href='/deal' _hover={{color: 'inherit'}} justifyContent='end'>Deals</MenuItem>
                    <MenuItem as={Link} href='/brands' _hover={{color: 'inherit'}} justifyContent='end'>Brands</MenuItem>
                    <MenuItem as={Link} href='/drops' _hover={{color: 'inherit'}} justifyContent='end'>Drops</MenuItem>
                    <MenuItem as={Link} href='/imo' _hover={{color: 'inherit'}} justifyContent='end'>IMO</MenuItem>
                    <MenuItem as={Link} href='/apply' _hover={{color: 'inherit'}} justifyContent='end'>Listing Requests</MenuItem>
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
                    <MenuItem as={Link} href='/collection/izanamis-cradle-land-deeds?tab=dynastiesMap' _hover={{color: 'inherit'}} justifyContent='end'>Realm Registry</MenuItem>
                    <MenuItem as={Link} href='/collection/ryoshi-playing-cards?tab=pokerRanks' _hover={{color: 'inherit'}} justifyContent='end'>Ryoshi Playing Cards</MenuItem>
                    <MenuItem as={Link} href='/xp-leaderboard' _hover={{color: 'inherit'}} justifyContent='end'>XP Leaderboard</MenuItem>
                    <MenuItem as={Link} href='/rewards' _hover={{color: 'inherit'}} justifyContent='end'>Rewards</MenuItem>
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
                    <NavLink name='Deals' to='/deal' onClick={onClose} />
                    <NavLink name='Brands' to='/brands' onClick={onClose} />
                    <NavLink name='Drops' to='/drops' onClick={onClose} />
                    <NavLink name='IMO' to='/imo' onClick={onClose} />
                    <NavLink name='Listing Requests' to='/apply' onClick={onClose} />
                  </VStack>
                </Box>
                <Box>
                  <VStack align='end' spacing={0} mb={2}>
                    <Heading size='md' className='col-white'>GameFi</Heading>
                    <Divider borderColor='white' w='150px' mb={2} mt={1} />
                  </VStack>
                  <VStack align='end'>
                    <NavLink name='Ryoshi Dynasties' to='/ryoshi' onClick={onClose} />
                    <NavLink name='Realm Registry' to='/collection/izanamis-cradle-land-deeds?tab=dynastiesMap' onClick={onClose} />
                    <NavLink name='Ryoshi Playing Cards' to='/collection/ryoshi-playing-cards?tab=pokerRanks' onClick={onClose} />
                    <NavLink name='XP Leaderboard' to='/xp-leaderboard' onClick={onClose} />
                    <NavLink name='Rewards' to='/rewards' onClick={onClose} />
                  </VStack>
                </Box>
              </SimpleGrid>
              <Stack spacing={2} justify='stretch' maxW='375px' mx='auto'>
                <SimpleGrid columns={2} spacing={2}>
                  <Link href='https://swap.ebisusbay.com'>
                    <Button
                      variant='outline'
                      onClick={onClose}
                      size='sm'
                      color='white'
                      fontWeight='bold'
                      w='full'
                      colorScheme='none'
                      leftIcon={<Icon as={FontAwesomeIcon} icon={faCoins} />}
                    >
                      Swap
                    </Button>
                  </Link>
                  <Link href='/dex/farms'>
                    <Button
                      variant='outline'
                      onClick={onClose}
                      size='sm'
                      color='white'
                      fontWeight='bold'
                      w='full'
                      colorScheme='none'
                      leftIcon={<Icon as={FontAwesomeIcon} icon={faSackDollar} />}
                    >
                      Farms
                    </Button>
                  </Link>
                </SimpleGrid>
                <Button
                  variant='outline'
                  size='sm'
                  color='white'
                  fontWeight='bold'
                  w='full'
                  leftIcon={<Icon as={FontAwesomeIcon} icon={theme === 'dark' ? faMoon : faSun} />}
                  colorScheme='none'
                  onClick={handleToggleTheme}
                >
                  Dark mode
                </Button>
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
};
export default Header;