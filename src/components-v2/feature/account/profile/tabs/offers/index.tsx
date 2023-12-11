import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faSearch} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Collapse,
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
import {useUser} from "@src/components-v2/useUser";

interface OffersProps {
  address: string;
}

export default function Offers({ address }: OffersProps) {
  const {theme: userTheme} = useUser();

  const [filtersVisible, setFiltersVisible] = useState(true);
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

  useEffect(() => {
    if (!hasManuallyToggledFilters) {
      setFiltersVisible(!useMobileMenu);
    }
  }, [useMobileMenu]);

  return (
    <Box>
      <Stack direction='row' mb={2} align='center' justify='space-between'>
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
              color: 'white'
            }}
            onClick={() => setOfferDirection('made')}
          >
            Made
          </Button>
          <Button
            isActive={offerDirection === 'received'}
            _active={{
              bg: getTheme(userTheme).colors.textColor4,
              color: 'white'
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
            icon={<Icon as={FontAwesomeIcon} icon={faSearch} className="py-1" />}
          />
        ) : (
          <InputGroup flex='1'>
            <Input
              placeholder="Search by name"
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