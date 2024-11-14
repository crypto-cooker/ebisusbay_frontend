import { HStack, Menu, MenuButton, MenuList, MenuItem, Button, Box, Icon, VStack } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faGamepad, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import NextLink from "next/link";

const NavMenu = (props: any) => {
  const { isMobile } = props;
  return (
    <Box>
      <HStack as={'nav'} spacing={3} me={4} {...props} id="navbar">
        <Menu placement="bottom-end">
          <MenuButton as={Button} height="fit-content" px={2} size="sm" variant="unstyled" color="white">
            <VStack gap={0}>
              {isMobile && <Icon as={FontAwesomeIcon} pt={2} icon={faArrowRightArrowLeft} />}
              <Box>Trade</Box>
            </VStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={NextLink} href="/marketplace" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Explore
            </MenuItem>
            <MenuItem as={NextLink} href="/brands" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Brands
            </MenuItem>
            <MenuItem as={NextLink} href="/collections" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Collections
            </MenuItem>
            <MenuItem as={NextLink} href="/dex/swap" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Swap
            </MenuItem>
            <MenuItem as={NextLink} href="/deal" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Deals
            </MenuItem>
            <MenuItem as={NextLink} href="/drops" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Drops
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu placement="bottom-end">
          <MenuButton as={Button} height="fit-content" px={2} size="sm" variant="unstyled" color="white">
            <VStack gap={0}>
              {isMobile && <Icon as={FontAwesomeIcon} pt={2} icon={faSackDollar} />}
              <Box>Earn</Box>
            </VStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={NextLink} href="/dex/liquidity" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Liquidity
            </MenuItem>
            <MenuItem as={NextLink} href="/dex/farms" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Farms
            </MenuItem>
            <MenuItem as={NextLink} href="/staking" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Staking
            </MenuItem>
            <MenuItem as={NextLink} href="/ryoshi" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Bank
            </MenuItem>
            <MenuItem as={NextLink} href="/rewards" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Rewards
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu placement="bottom-end">
          <MenuButton as={Button} height="fit-content" px={2} size="sm" variant="unstyled" color="white">
            <VStack gap={0}>
              {isMobile && <Icon as={FontAwesomeIcon} pt={2} icon={faGamepad} />}
              <Box>GameFi</Box>
            </VStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={NextLink} href="/ryoshi" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Ryoshi Dynasties
            </MenuItem>
            <MenuItem
              as={NextLink}
              href="/collection/izanamis-cradle-land-deeds?tab=dynastiesMap"
              _hover={{ color: 'inherit' }}
              justifyContent="space-between"
            >
              Realm Registry
            </MenuItem>
            <MenuItem
              as={NextLink}
              href="/collection/ryoshi-playing-cards?tab=pokerRanks"
              _hover={{ color: 'inherit' }}
              justifyContent="space-between"
            >
              Ryoshi Playing Cards
            </MenuItem>
            <MenuItem as={NextLink} href="/xp-leaderboard" _hover={{ color: 'inherit' }} justifyContent="space-between">
              XP Leaderboard
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu placement="bottom-end">
          <MenuButton as={Button} height="fit-content" px={2} size="sm" variant="unstyled" color="white">
            <VStack gap={0}>
              <Box>•••</Box>
            </VStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={NextLink} href="/info" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Info
            </MenuItem>
            <MenuItem as={NextLink} href="/dex/bridge" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Bridge
            </MenuItem>
            <MenuItem as={NextLink} href="/apply" _hover={{ color: 'inherit' }} justifyContent="space-between">
              Listing Requests
            </MenuItem>
            <MenuItem
              as={NextLink}
              href="https://www.ebisusbay.com/blog"
              _hover={{ color: 'inherit' }}
              target={'_blank'}
              justifyContent="space-between"
            >
              Blog
              <ExternalLinkIcon />
            </MenuItem>
            <MenuItem
              as={NextLink}
              href="https://www.ebisusbay.com"
              _hover={{ color: 'inherit' }}
              target={'_blank'}
              justifyContent="space-between"
            >
              Docs
              <ExternalLinkIcon />
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
};

export default memo(NavMenu);
