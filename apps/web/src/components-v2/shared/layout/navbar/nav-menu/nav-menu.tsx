import { HStack, Menu, MenuButton, MenuList, MenuItem, Link, Button, Box } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';

const NavMenu = (props: any) => {
  return (
    <HStack as={'nav'} spacing={3} me={4} {...props}>
      <Menu placement="bottom-end">
        <MenuButton as={Button} px={2} size="sm" variant="unstyled" color="white">
          <FontAwesomeIcon icon={faCoins}/>
          Trade
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/marketplace" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Explore
          </MenuItem>
          <MenuItem as={Link} href="/brands" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Brands
          </MenuItem>
          <MenuItem as={Link} href="/collections" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Collections
          </MenuItem>
          <MenuItem as={Link} href="/dex/swap" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Swap
          </MenuItem>
          <MenuItem as={Link} href="/deal" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Deals
          </MenuItem>
          <MenuItem as={Link} href="/drops" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Drops
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu placement="bottom-end">
        <MenuButton as={Button} px={2} size="sm" variant="unstyled" color="white">
          Earn
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/dex/liquidity" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Liquidity
          </MenuItem>
          <MenuItem as={Link} href="/dex/farms" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Farms
          </MenuItem>
          <MenuItem as={Link} href="/staking" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Staking
          </MenuItem>
          <MenuItem as={Link} href="/ryoshi" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Bank
          </MenuItem>
          <MenuItem as={Link} href="/rewards" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Rewards
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu placement="bottom-end">
        <MenuButton as={Button} px={2} size="sm" variant="unstyled" color="white">
          GameFi
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/ryoshi" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Ryoshi Dynasties
          </MenuItem>
          <MenuItem
            as={Link}
            href="/collection/izanamis-cradle-land-deeds?tab=dynastiesMap"
            _hover={{ color: 'inherit' }}
            justifyContent="space-between"
          >
            Realm Registry
          </MenuItem>
          <MenuItem
            as={Link}
            href="/collection/ryoshi-playing-cards?tab=pokerRanks"
            _hover={{ color: 'inherit' }}
            justifyContent="space-between"
          >
            Ryoshi Playing Cards
          </MenuItem>
          <MenuItem as={Link} href="/xp-leaderboard" _hover={{ color: 'inherit' }} justifyContent="space-between">
            XP Leaderboard
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu placement="bottom-end">
        <MenuButton as={Button} px={2} size="sm" variant="unstyled" color="white">
          •••
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/dex/bridge" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Bridge
          </MenuItem>
          <MenuItem as={Link} href="/apply" _hover={{ color: 'inherit' }} justifyContent="space-between">
            Listing Requests
          </MenuItem>
          <MenuItem
            as={Link}
            href="https://www.ebisusbay.com/blog"
            _hover={{ color: 'inherit' }}
            target={'_blank'}
            justifyContent="space-between"
          >
            Blog
            <ExternalLinkIcon />
          </MenuItem>
          <MenuItem
            as={Link}
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
  );
};

export default memo(NavMenu);
