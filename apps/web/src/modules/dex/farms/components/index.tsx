import DataTable from "@dex/farms/components/data-table";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Select,
  Spinner,
  Stack,
  Switch,
  VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBank, faList, faTableCellsLarge} from "@fortawesome/free-solid-svg-icons";
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {getFarmsUsingMapi} from "@dex/farms/hooks/get-farms";
import UserFarmsProvider from "@dex/farms/components/provider";
import {useUserFarms} from "@dex/farms/hooks/user-farms";
import {FarmsQueryParams} from "@src/core/services/api-service/mapi/queries/farms";
import DataGrid from "@dex/farms/components/data-grid";
import {FarmState} from "@dex/farms/constants/types";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import Link from "next/link";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import { ChainId } from "@pancakeswap/chains";

enum ViewType {
  GRID,
  TABLE
}

interface LocalQuery {
  search?: string;
  sortByEarned?: boolean;
}

export default function FarmsPage() {
  const user = useUser();
  const {chainId} = useActiveChainId();
  const [stakedOnly, setStakedOnly] = useState(false);
  const [searchTerms, setSearchTerms] = useState<string>();
  const [queryParams, setQueryParams] = useState<FarmsQueryParams>({
    sortBy: 'users',
    direction: 'desc',
    chain: chainId
  });
  const [status, setStatus] = useState<FarmState>(FarmState.ACTIVE);
  const [viewType, setViewType] = useState<ViewType>(ViewType.TABLE);
  const { data: farms, status: farmsStatus, error: farmsError } = getFarmsUsingMapi(queryParams);
  const userFarms = useUserFarms();

  const [localQueryParams, setLocalQueryParams] = useState<LocalQuery>({});

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
    setLocalQueryParams({...localQueryParams, search: e.target.value});
  }, []);

  const handleSort = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (value === 'apr') {
      setQueryParams({
        ...queryParams,
        sortBy: 'apr',
        direction: 'desc'
      });
    } else if (value === 'liquidity') {
      setQueryParams({
        ...queryParams,
        sortBy: 'stakedliquidity',
        direction: 'desc'
      });
    } else if (value === 'latest') {
      setQueryParams({
        ...queryParams,
        sortBy: 'pid',
        direction: 'desc'
      });
    } else if (value === 'hot') {
      setQueryParams({
        ...queryParams,
        sortBy: 'users',
        direction: 'desc'
      });
    }

    setLocalQueryParams({...localQueryParams, sortByEarned: value === 'earned'})
  }

  const filteredData = useMemo(() => {
    const data = farms?.filter((farm) => {
      const userStaked = !!farm.data.pair && (userFarms[farm.data.pair.id]?.stakedBalance > 0 ?? false);
      let condition = status === farm.derived.state;

      if (stakedOnly) {
        condition = condition && userStaked;
      }

      if (localQueryParams.search && localQueryParams.search.length > 0) {
        condition = condition && farm.data.pair.name.toLowerCase().includes(localQueryParams.search.toLowerCase());
      }

      return condition;
    });

    if (localQueryParams.sortByEarned) {
      return data?.sort((a, b) => {
        const earningsA = userFarms[a.data.pair.id]?.earnings ?? 0n;
        const earningsB = userFarms[b.data.pair.id]?.earnings ?? 0n;

        if (earningsA < earningsB) return 1;
        if (earningsA > earningsB) return -1;
        return 0;
      });
    }

    return data;
  }, [status, farms, stakedOnly, localQueryParams, userFarms, chainId]);

  const content = useMemo(() => {
    return farmsStatus === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : farmsStatus === "error" ? (
      <Box textAlign='center'>
        Error: {(farmsError as any).message}
      </Box>
    ) : (!!filteredData && filteredData.length > 0) ? (
      <>
        {viewType === ViewType.GRID ? (
          <DataGrid data={filteredData ?? []} userData={userFarms} />
        ) : (
          <DataTable data={filteredData ?? []} userData={userFarms} />
        )}
      </>
    ) : (
      <Box textAlign='center'>
        No farms found
      </Box>
    )
  }, [filteredData, farmsStatus, userFarms, viewType, localQueryParams, chainId]);

  useEffect(() => {
    setQueryParams({...queryParams, chain: chainId});
  }, [chainId]);

  return (
    <UserFarmsProvider>
      <Container maxW='container.xl' mt={2}>
        <Flex justify='space-between' direction={{base: 'column', md: 'row'}}>
          <Stack direction='row' align='end' mt={2}>
            <IconButton
              aria-label='Table Layout'
              icon={<Icon as={FontAwesomeIcon} icon={faList} />}
              isActive={viewType === ViewType.TABLE}
              onClick={() => setViewType(ViewType.TABLE)}
            />
            <IconButton
              aria-label='Table Layout'
              icon={<Icon as={FontAwesomeIcon} icon={faTableCellsLarge} />}
              isActive={viewType === ViewType.GRID}
              onClick={() => setViewType(ViewType.GRID)}
            />
            <Box>
              <Box fontWeight='bold' fontSize='sm'>Filter By</Box>
              <ButtonGroup isAttached variant='outline'>
                <Button
                  aria-label='Grid View (Small)'
                  isActive={status === FarmState.ACTIVE}
                  _active={{
                    bg: getTheme(user.theme).colors.textColor4,
                    color: 'white'
                  }}
                  onClick={() => setStatus(FarmState.ACTIVE)}
                >
                  Live
                </Button>
                <Button
                  aria-label='Grid View (Large)'
                  isActive={status === FarmState.FINISHED}
                  _active={{
                    bg: getTheme(user.theme).colors.textColor4,
                    color: 'white'
                  }}
                  onClick={() => setStatus(FarmState.FINISHED)}
                >
                  Finished
                </Button>
              </ButtonGroup>
            </Box>
            <Stack pb={2} direction={{base: 'column-reverse', sm: 'row'}}>
              <Switch isChecked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)}/>
              <Box fontSize={{base: 'sm', sm: 'md'}} fontWeight={{base: 'bold', sm: 'normal'}}>Staked only</Box>
            </Stack>        
          </Stack>
          <Stack direction='row' align='end' mt={2}>
            <Box>
              <Box fontWeight='bold' fontSize='sm'>Sort By</Box>
              <Select onChange={handleSort}>
                <option key='hot' value='hot'>Hot</option>
                <option key='apr' value='apr'>APR</option>
                <option key='earned' value='earned'>Earned</option>
                <option key='liquidity' value='liquidity'>Liquidity</option>
                <option key='latest' value='latest'>Latest</option>
              </Select>
            </Box>
            <Box>
              <Box fontWeight='bold' fontSize='sm'>Search</Box>
              <Input
                placeholder='Search Farms'
                value={searchTerms}
                onChange={handleSearch}
              />
            </Box>
            <PrimaryButton aria-label='Harvest All'>Harvest All</PrimaryButton>
          </Stack>
        </Flex>
        {status === FarmState.ACTIVE && [ChainId.CRONOS, ChainId.CRONOS_TESTNET].includes(chainId) && (
          <Box
            border={`1px solid ${getTheme(user.theme).colors.borderColor2}`}
            bg={getTheme(user.theme).colors.bgColor5}
            rounded='lg'
            overflow='hidden'
            px={6}
            py={4}
            mt={4}
          >
            <Stack justify='space-between' direction={{base: 'column', sm: 'row'}} align='center' w='full'>
              <HStack>
                <Box w='40px' display={{base: 'none', sm: 'block'}}>
                  <FortuneIcon boxSize={8} />
                </Box>
                <VStack align='start' spacing={{base: 1, sm: 0}}>
                  <HStack fontWeight='bold'>
                    <Box display={{base: 'block', sm: 'none'}}><FortuneIcon boxSize={8} /></Box>
                    <Box fontSize='lg'>FRTN</Box>
                  </HStack>
                  <Box fontSize='sm'>Single stake FRTN to earn Ryoshi Dynasties Troops and up to 50% APR!</Box>
                </VStack>
              </HStack>
              <Box alignSelf={{base: 'end', sm: 'auto'}}>
                <Link href='/ryoshi'>
                  <PrimaryButton leftIcon={<Icon as={FontAwesomeIcon} icon={faBank} />}>
                    Stake In Bank
                  </PrimaryButton>
                </Link>
              </Box>
            </Stack>
          </Box>
        )}
        <Box mt={4}>
          {content}
        </Box>
      </Container>
    </UserFarmsProvider>
  )
}


