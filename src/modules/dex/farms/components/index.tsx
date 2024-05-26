import DataTable from "@dex/farms/components/data-table";
import {createColumnHelper} from "@tanstack/react-table";
import {
  Avatar,
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
  Switch
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faTableCellsLarge} from "@fortawesome/free-solid-svg-icons";
import React, {ChangeEvent, useMemo, useState} from "react";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {getFarmsUsingMapi} from "@dex/farms/hooks/get-farms";
import {DerivedFarm} from "@dex/farms/constants/types";
import UserFarmsProvider from "@dex/farms/components/provider";
import {useUserFarms} from "@dex/farms/hooks/user-farms";
import {FarmsQueryParams} from "@src/core/services/api-service/mapi/queries/farms";

enum ViewType {
  GRID,
  TABLE
}

enum FarmState {
  ACTIVE = 'active',
  FINISHED = 'finished'
}

export default function FarmsPage() {
  const user = useUser();
  const [stakedOnly, setStakedOnly] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');
  const [queryParams, setQueryParams] = useState<FarmsQueryParams>({});
  const [status, setStatus] = useState<FarmState>(FarmState.ACTIVE);
  const [viewType, setViewType] = useState<ViewType>(ViewType.TABLE);
  const { data: farms, status: farmsStatus, error: farmsError } = getFarmsUsingMapi(queryParams);
  const userFarms = useUserFarms();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerms(value);
  };

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
  }

  const filteredData = useMemo(() => {
    return farms?.filter((farm) => {
      const farmState = farm.data.allocPoint > 0 ? FarmState.ACTIVE : FarmState.FINISHED;
      const userStaked = !!farm.data.pair && (userFarms[farm.data.pair.id]?.stakedBalance > 0 ?? false);
      let condition = true;
      if (status === FarmState.ACTIVE) {
        condition = condition && farmState === FarmState.ACTIVE;
      } else {
        condition = condition && farmState === FarmState.FINISHED;
      }

      if (stakedOnly) {
        condition = condition && userStaked;
      }

      return condition;
    })
  }, [status, farms, stakedOnly]);

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
          <DataTable data={filteredData ?? []} columns={columns} userData={userFarms} />
        ) : (
          <DataTable data={filteredData ?? []} columns={columns} userData={userFarms} />
        )}
      </>
    ) : (
      <Box textAlign='center'>
        No farms found
      </Box>
    )
  }, [filteredData, farmsStatus]);

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
            <HStack pb={2}>
              <Switch isChecked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)}/>
              <Box>Staked only</Box>
            </HStack>
          </Stack>
          <Stack direction='row' align='center' mt={2}>
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
          </Stack>
        </Flex>
        <Box mt={4}>
          {content}
        </Box>
      </Container>
    </UserFarmsProvider>
  )
}


const columnHelper = createColumnHelper<DerivedFarm>();
const columns = [
  columnHelper.accessor("derived.name", {
    cell: (info) => {
      return (
        <HStack>
          {info.row.original.data.pair ? (
            <Box position='relative' w='40px' h='40px'>
              <Avatar
                src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${info.row.original.data.pair.token0.symbol.toLowerCase()}.webp`}
                rounded='full'
                size='xs'
              />
              <Avatar
                src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${info.row.original.data.pair.token1.symbol.toLowerCase()}.webp`}
                rounded='full'
                size='sm'
                position='absolute'
                bottom={0}
                right={0}
              />
            </Box>
          ) : (
            <Box position='relative' w='40px' h='40px'>
              <Avatar
                src='https://cdn-prod.ebisusbay.com/files/dex/images/tokens/frtn.webp'
                rounded='full'
                size='sm'
              />
            </Box>
          )}
          <Box fontWeight='bold'>
            {info.getValue()}
          </Box>
        </HStack>
      )
    },
    header: "Name"
  }),
  columnHelper.accessor("derived.dailyRewards", {
    cell: (info) => {
      return (
        <Box>
          <Box fontSize='xs' fontWeight='bold'>Daily Rewards</Box>
          <Box>{info.getValue()}</Box>
        </Box>
      )
    }
  }),
  columnHelper.accessor("derived.stakedLiquidity", {
    cell: (info) => {
      return (
        <Box>
          <Box fontSize='xs' fontWeight='bold'>Staked Liquidity</Box>
          <Box>{info.getValue()}</Box>
        </Box>
      )
    }
  }),
  columnHelper.accessor("derived.apr", {
    cell: (info) => {
      return (
        <Box>
          <Box fontSize='xs' fontWeight='bold'>APR</Box>
          <Box>{info.getValue()}</Box>
        </Box>
      )
    }
  })
];