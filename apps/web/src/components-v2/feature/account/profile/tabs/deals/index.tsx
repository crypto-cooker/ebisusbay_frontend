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
import useDebounce from "@src/core/hooks/useDebounce";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import ListingsGroup from "@src/components-v2/shared/listings-group";
import DealsFilterContainer from "@src/components-v2/feature/account/profile/tabs/deals/deals-filter-container";
import {DealListQueryParams} from "@src/core/services/api-service/mapi/queries/deallist";
import DealsDataContainer from "@src/components-v2/feature/account/profile/tabs/deals/deals-data-container";
import { useChainId } from "wagmi";

interface DealsProps {
  address: string;
}

export default function Deals({ address }: DealsProps) {
  const {theme: userTheme} = useUser();

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [hasManuallyToggledFilters, setHasManuallyToggledFilters] = useState(false);
  const [searchTerms, setSearchTerms] = useState<string>();
  const debouncedSearch = useDebounce(searchTerms, 500);
  const [offerDirection, setOfferDirection] = useState<'made' | 'received'>('made');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [queryParams, setQueryParams] = useState<DealListQueryParams>({
    sortBy: 'listingtime',
    direction: 'desc',
    maker: offerDirection === 'made' ? address : undefined,
    taker: offerDirection === 'received' ? address : undefined,
  });

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

  const handleSort = useCallback((sortOption: any) => {
    let newSort = {
      sortBy: sortOption,
      direction: 'desc'
    }
    if (queryParams.sortBy === newSort.sortBy) {
      newSort.direction = queryParams.direction === 'asc' ? 'desc' : 'asc'
    }
    setQueryParams({
      ...queryParams,
      sortBy: newSort.sortBy as any,
      direction: newSort.direction as any
    });
  }, [queryParams]);

  const handleChangeOfferDirection = (direction: 'made' | 'received') => {
    if (direction === 'made') {
      setQueryParams({
        ...queryParams,
        maker: address,
        taker: undefined
      });
    } else {
      setQueryParams({
        ...queryParams,
        maker: undefined,
        taker: address
      });
    }
    setOfferDirection(direction);
  };

  const handleToggleFilter = () => {
    setHasManuallyToggledFilters(true);
    setFiltersVisible(!filtersVisible)
  };

  useEffect(() => {
    if (!hasManuallyToggledFilters) {
      setFiltersVisible(!useMobileMenu);
    }
  }, [useMobileMenu]);

  useEffect(() => {
    setQueryParams({...queryParams, search: debouncedSearch});
  }, [debouncedSearch]);

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
            onClick={() => handleChangeOfferDirection('made')}
          >
            Made
          </Button>
          <Button
            isActive={offerDirection === 'received'}
            _active={{
              bg: getTheme(userTheme).colors.textColor4,
              color: 'white'
            }}
            onClick={() => handleChangeOfferDirection('received')}
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

      <Box>
        <DealsFilterContainer
          queryParams={queryParams}
          onFilter={(newParams) => setQueryParams(newParams)}
          filtersVisible={filtersVisible}
          useMobileMenu={!!useMobileMenu}
          onMobileMenuClose={() => setFiltersVisible(false)}
        >
          <DealsDataContainer
            queryParams={queryParams}
            filtersVisible={filtersVisible}
            fullWidth={!filtersVisible || (useMobileMenu ?? false)}
            viewType='grid-sm'
            onSort={handleSort}
          />
        </DealsFilterContainer>
      </Box>

    </Box>
  );
}