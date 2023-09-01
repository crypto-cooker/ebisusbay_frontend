import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {useAppSelector} from "@src/Store/hooks";
import {
  Box,
  Button,
  ButtonGroup,
  CloseButton, Collapse,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useBreakpointValue
} from "@chakra-ui/react";
import MadeOffers from "@src/components-v2/feature/account/profile/tabs/offers/made-offers";
import ReceivedOffers from "./received-offers";
import useDebounce from "@src/core/hooks/useDebounce";
import {getTheme} from "@src/Theme/theme";

const StyledNav = styled.div`
  .nav-link {
    color: ${({ theme }) => theme.colors.textColor3}
  }
  .nav-link.active {
    background: #218cff;
    color: ${({ theme }) => theme.colors.white}
  }
  .nav-item {
    cursor: pointer
  }
`;

type OfferTab = {
  key: string;
  title: string;
  description: string;
}

const tabs: {[key: string]: OfferTab} = {
  madeDirect: {
    key: 'made-direct',
    title: 'Made Direct Offers',
    description: 'Offers made directly to NFTs'
  },
  madeCollection: {
    key: 'made-collection',
    title: 'Made Collection Offers',
    description: 'Offers made on an entire collection'
  },
  receivedDirect: {
    key: 'received-direct',
    title: 'Received Direct Offers',
    description: 'Offers received on your NFTs'
  },
  receivedPublic: {
    key: 'received-public',
    title: 'Received Public Offers',
    description: 'Offers received on your CRC-1155 NFTs'
  },
  receivedCollection: {
    key: 'received-collection',
    title: 'Received Collection Offers',
    description: 'Offers received directly on collections you own'
  },
}

interface OffersProps {
  address: string;
}

export default function Offers({ address }: OffersProps) {
  const userTheme = useAppSelector((state) => state.user.theme);

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs.madeDirect);
  const [hasManuallyToggledFilters, setHasManuallyToggledFilters] = useState(false);
  const [searchTerms, setSearchTerms] = useState<string>();
  const debouncedSearch = useDebounce(searchTerms, 500);
  const [offerDirection, setOfferDirection] = useState<'made' | 'received'>('made');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const useMobileMenu = useBreakpointValue(
    { base: true, md: false },
    { fallback: 'md', ssr: false },
  );

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerms('');
  }, []);

  const handleToggleFilter = () => {
    setHasManuallyToggledFilters(true);
    setFiltersVisible(!filtersVisible)
  };

  const setTab = (key: any) => {
    const tabKey = Object.entries(tabs).find(([k, v]) =>  v.key === key);
    if (!!tabKey) setActiveTab(tabKey[1]);
  };

  const setMobileTab = (tab: string) => {
    setTab(tab);
    setFiltersVisible(false);
  };

  useEffect(() => {
    if (!hasManuallyToggledFilters) {
      setFiltersVisible(!useMobileMenu);
    }
  }, [useMobileMenu]);


  return (
    <Box>
      <Stack direction='row' mb={2} align='center'>
        <IconButton
          aria-label={'Toggle Filter'}
          onClick={handleToggleFilter}
          variant='outline'
          icon={<Icon as={FontAwesomeIcon} icon={filtersVisible ? faAngleLeft : faFilter} className="py-1" />}
        />
        <ButtonGroup isAttached variant='outline'>
          <Button
            isActive={offerDirection === 'made'}
            _active={{
              bg: getTheme(userTheme).colors.textColor4,
              color: 'light'
            }}
            onClick={() => setOfferDirection('made')}
          >
            Made
          </Button>
          <Button
            isActive={offerDirection === 'received'}
            _active={{
              bg: getTheme(userTheme).colors.textColor4,
              color: 'light'
            }}
            onClick={() => setOfferDirection('received')}
          >
            Received
          </Button>
        </ButtonGroup>
        {useMobileMenu ? (
          <IconButton
            aria-label={'Toggle Search'}
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            variant='outline'
            className={showMobileSearch ? 'active' : ''}
            icon={<Icon as={FontAwesomeIcon} icon={filtersVisible ? faAngleLeft : faFilter} className="py-1" />}
          />
        ) : (
          <InputGroup>
            <Input
              placeholder="Search by name"
              w="100%"
              onChange={handleSearch}
              value={searchTerms}
              color="white"
              _placeholder={{ color: 'gray.300' }}
            />
            {searchTerms?.length && (
              <InputRightElement
                children={<CloseButton onClick={handleClearSearch} />}
              />
            )}
          </InputGroup>
        )}
      </Stack>
      <Box w='full' mb={2}>
        <Collapse in={useMobileMenu && showMobileSearch} animateOpacity>
          <InputGroup>
            <Input
              placeholder="Search by name"
              w="100%"
              onChange={handleSearch}
              value={searchTerms}
              color="white"
              _placeholder={{ color: 'gray.300' }}
            />
            {searchTerms?.length && (
              <InputRightElement
                children={<CloseButton onClick={handleClearSearch} />}
              />
            )}
          </InputGroup>
        </Collapse>
      </Box>

      {offerDirection === 'received' ? (
        <ReceivedOffers
          address={address}
          filtersVisible={filtersVisible}
          setFiltersVisible={setFiltersVisible}
          search={debouncedSearch}
        />
      ) : (
        <MadeOffers
          address={address}
          filtersVisible={filtersVisible}
          setFiltersVisible={setFiltersVisible}
          search={debouncedSearch}
        />
      )}
    </Box>
  );
}