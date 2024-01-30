import React, {ChangeEvent, useCallback, useState} from 'react';
import Switch from '@src/Components/components/common/Switch';
import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from '@src/components-v2/shared/layout/page-header';
import Table from './table';
import useFeatureFlag from '@src/hooks/useFeatureFlag';
import Constants from '@src/constants';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSort} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  CloseButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useBreakpointValue
} from "@chakra-ui/react";
import useDebounce from "@src/core/hooks/useDebounce";
import {DefaultContainer} from "@src/components-v2/shared/default-container";


const Collections = () => {
  const isMobileLayout = useBreakpointValue({base: true, lg: false}, {fallback: 'lg'})

  const [searchTerms, setSearchTerms] = useState<string>();
  const [timeFrame, setTimeFrame] = useState<string | null>('7d');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const debouncedSearch = useDebounce(searchTerms, 500);

  const { Features } = Constants;
  const isSwitchEnabled = useFeatureFlag(Features.VERIFIED_SWITCH_COLLECTION);

  const handleSearch = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerms(value);
  }, []);

  const handleClearSearch = () => {
    setSearchTerms('');
  }

  return (
    <div>
      <PageHead
        title="Collections"
        description="View the top performing collections on Ebisu's Bay Marketplace"
        url="/collections"
      />
      <PageHeader title={'Collections'} />

      <DefaultContainer>
        <Stack direction={{base: 'column', md: 'row'}} mt={4} w='full'>
          <Box flex='1'>
            <InputGroup>
              <Input
                placeholder="Search for Collection"
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
          </Box>
          <Box className="text-center text-lg-end">
            <ul className="activity-filter">
              {isSwitchEnabled ? <li style={{ border: 'none' }}>
                <Switch isChecked={onlyVerified} setIsChecked={setOnlyVerified} text={'Only Verified'} />
              </li> : null}
              {isMobileLayout && (
                <li id="sale" className={`px-3 ${showMobileSort ? 'active' : ''}`} onClick={() => setShowMobileSort(!showMobileSort)}>
                  <FontAwesomeIcon icon={faSort} />
                </li>
              )}
              <li id="sale" className={timeFrame === '1d' ? 'active' : ''} onClick={() => setTimeFrame('1d')}>
                1d
              </li>
              <li id="sale" className={timeFrame === '7d' ? 'active' : ''} onClick={() => setTimeFrame('7d')}>
                7d
              </li>
              <li id="sale" className={timeFrame === '30d' ? 'active' : ''} onClick={() => setTimeFrame('30d')}>
                30d
              </li>
              <li id="sale" className={timeFrame === null ? 'active' : ''} onClick={() => setTimeFrame(null)}>
                All Time
              </li>
            </ul>
          </Box>
        </Stack>
        <Table timeFrame={timeFrame} searchTerms={debouncedSearch} onlyVerified={onlyVerified} showMobileSort={showMobileSort && isMobileLayout!} />
      </DefaultContainer>
    </div>
  );
};
export default Collections;
