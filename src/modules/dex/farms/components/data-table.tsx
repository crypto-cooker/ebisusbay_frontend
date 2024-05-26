import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel, Row,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {
  Box,
  Collapse,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link, SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
  useBreakpointValue,
  useColorModeValue, useDisclosure,
  VStack
} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {Card} from "@src/components-v2/foundation/card";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {faExternalLinkAlt, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEnableFarm, useHarvestRewards} from "@dex/farms/hooks/farm-actions";
import {DerivedFarm} from "@dex/farms/constants/types";
import {appConfig} from "@src/Config";
import UnstakeLpTokensDialog from "@dex/farms/components/unstake-lp-tokens-dialog";
import StakeLpTokensDialog from "@dex/farms/components/stake-lp-tokens";
import {UserFarms, UserFarmState} from "@dex/farms/state/user";
import {ethers} from "ethers";
import {round} from "@market/helpers/utils";

const config =  appConfig();

export type DataTableProps = {
  data: DerivedFarm[];
  columns: ColumnDef<DerivedFarm, any>[];
  userData: UserFarms;
};

export default function DataTable({ data, columns, userData }: DataTableProps) {
  const user = useUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const showLiquidityColumn = useBreakpointValue({ base: false, lg: true }, { fallback: 'lg' });
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const [columnVisibility, setColumnVisibility] = useState({
    derived_stakedLiquidity: true,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const [rowFocused, setRowFocused] = useState<string | null>(null);

  useEffect(() => {
    setColumnVisibility({
      ...columnVisibility,
      derived_stakedLiquidity: showLiquidityColumn ?? true,
    });
  }, [showLiquidityColumn]);

  return (
    <>
      {!!data && data.length > 0 && (
        <Box border={`1px solid ${getTheme(user.theme).colors.borderColor2}`} rounded='lg' overflow='hidden'>
          <Table>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  isSmallScreen={isSmallScreen ?? false}
                  showLiquidityColumn={showLiquidityColumn ?? false}
                  userData={userData?.[row.original.data.pair?.id ?? config.contracts.frtn]}
                />
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </>
  );
}

function TableRow({row, isSmallScreen, showLiquidityColumn, userData}: {row: Row<DerivedFarm>, isSmallScreen: boolean, showLiquidityColumn: boolean, userData?: UserFarmState}) {
  const user = useUser();
  const [enableFarm, enablingFarm] = useEnableFarm();
  const [harvestRewards, harvestingRewards] = useHarvestRewards();useColorModeValue('#FFFFFF', '#404040')
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const [rowFocused, setRowFocused] = useState(false);
  const { isOpen: isOpenUnstake, onOpen: onOpenUnstake, onClose:  onCloseUnstake } = useDisclosure();
  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose:  onCloseStake } = useDisclosure();

  return (
    <React.Fragment>
      <Tr
        borderTop={`1px solid ${getTheme(user.theme).colors.borderColor2}`}
        _first={{
          borderTop: 'none',
        }}
        cursor='pointer'
        onClick={() => row.toggleExpanded()}
        bg={rowFocused ? hoverBackground : getTheme(user.theme).colors.bgColor5}
        onMouseUp={() => setRowFocused(false)}
        onMouseDown={() => setRowFocused(true)}
      >
        {row.getVisibleCells()
          .filter((cell, index) => !isSmallScreen || index === 0)
          .map((cell, index) => {
            const meta: any = cell.column.columnDef.meta;
            const isFirstColumn = index === 0;
            return (
              <Td
                key={index}
                isNumeric={meta?.isNumeric}
                borderBottom='inherit'
                colSpan={isSmallScreen && isFirstColumn ? row.getVisibleCells().length + 1 : 1}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            );
          })
        }
        <Td
          paddingEnd={0}
          borderBottom='inherit'
          w='40px'
          rowSpan={isSmallScreen ? 2 : 1}
          verticalAlign={isSmallScreen ? 'middle' : 'inherit'}
        >
          <Flex justify='center'>
            <IconButton
              aria-label='Expand row'
              icon={row.getIsExpanded() ? <ChevronUpIcon /> : <ChevronDownIcon />}
              variant='unstyled'
              onClick={() => row.toggleExpanded()}
            />
          </Flex>
        </Td>
      </Tr>
      {isSmallScreen && (
        <Tr
          bg={rowFocused ? hoverBackground : getTheme(user.theme).colors.bgColor5}
          onMouseUp={() => setRowFocused(false)}
          onMouseDown={() => setRowFocused(true)}
        >
          <Td padding={0} border='none'>
            <Stack direction='row' spacing={0} width='100%'>
              {row.getVisibleCells().slice(1).map((cell) => (
                <Box flex='1' padding={4}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </Stack>
          </Td>
        </Tr>
      )}
      <Tr
        borderTop={row.getIsExpanded() ? `1px solid ${getTheme(user.theme).colors.borderColor2}` : 'none'}
        bgColor={getTheme(user.theme).colors.bgColor1}
      >
        <Td colSpan={6} padding={0} border='none'>
          <Collapse in={row.getIsExpanded()} animateOpacity>
            <Stack
              padding={4}
              direction={{ base: 'column-reverse', lg: 'row' }}
              align='center'
            >
              <VStack w={{ base: 'full', lg: '200px' }} align='start' spacing={1} justify='stretch'>
                {!showLiquidityColumn && (
                  <>
                    <Flex justify='space-between' w='full'>
                      <Box fontWeight='bold'>APR</Box>
                      <Box fontWeight='bold'>{row.original.derived.apr}</Box>
                    </Flex>
                    <Flex justify='space-between' w='full'>
                      <Box fontWeight='bold'>Liquidity</Box>
                      <Box fontWeight='bold'>{row.original.derived.stakedLiquidity}</Box>
                    </Flex>
                  </>
                )}
                <Link fontWeight='bold' href={`https://swap.ebisusbay.com/#/add/${row.original.data.pair?.token0.id}/${row.original.data.pair?.token1.id}`} color='#218cff'>
                  <HStack>
                    <>Get {row.original.derived.name} LP</>
                    <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />
                  </HStack>
                </Link>
                <Link fontWeight='bold' href={`${config.urls.explorer}address/${row.original.data.pair?.id}`} color='#218cff'>
                  <HStack>
                    <>View Contract</>
                    <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />
                  </HStack>
                </Link>
                {/*<Link fontWeight='bold' href='' color='#218cff'>*/}
                {/*  <HStack>*/}
                {/*    <>See Pair Info</>*/}
                {/*    <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />*/}
                {/*  </HStack>*/}
                {/*</Link>*/}
              </VStack>
              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                flex={1}
                width='full'
                gap={2}
              >
                <Card flex={1}>
                  <Box fontSize='sm' fontWeight='bold' mb={2}>EARNED REWARDS</Box>
                  <Flex justify='space-between' align='center'>
                    <Box
                      fontSize='xl'
                      fontWeight='bold'
                      overflowX='auto'
                    >
                      FRTN {round(ethers.utils.formatEther(userData?.earnings ?? 0), 2)}
                    </Box>
                    <PrimaryButton
                      isDisabled={harvestingRewards || userData?.earnings === 0}
                      isLoading={harvestingRewards}
                      onClick={() => harvestRewards(row.original.data.pid)}
                    >
                      Harvest
                    </PrimaryButton>
                  </Flex>
                </Card>
                {userData?.approved ? (
                  <Card flex={1}>
                    <Box fontSize='sm' fontWeight='bold' mb={2}>{row.original.derived.name} STAKED</Box>
                    <Flex justify='space-between' align='center'>
                      <Box
                        fontSize='xl'
                        fontWeight='bold'
                        overflowX='auto'
                      >
                        {round(ethers.utils.formatEther(userData.stakedBalance), 8)}
                      </Box>
                      <HStack w='104px'>
                        <SecondaryButton onClick={onOpenUnstake}>
                          <Icon as={FontAwesomeIcon} icon={faMinus} />
                        </SecondaryButton>
                        <SecondaryButton onClick={onOpenStake}>
                          <Icon as={FontAwesomeIcon} icon={faPlus} />
                        </SecondaryButton>
                      </HStack>
                    </Flex>
                  </Card>
                ) : (
                  <Card flex={1}>
                    <Box fontSize='sm' fontWeight='bold' mb={2}>ENABLE FARM</Box>
                    <SecondaryButton
                      w='full'
                      isDisabled={enablingFarm}
                      isLoading={enablingFarm}
                      onClick={() => enableFarm(row.original.data.pair?.id ?? config.contracts.frtn)}
                    >
                      Enable
                    </SecondaryButton>
                  </Card>
                )}
              </SimpleGrid>
            </Stack>
          </Collapse>
        </Td>
      </Tr>
      {!!userData && (
        <>
          <StakeLpTokensDialog
            isOpen={isOpenStake}
            onClose={onCloseStake}
            farm={row.original}
            userData={userData}
          />
          <UnstakeLpTokensDialog
            isOpen={isOpenUnstake}
            onClose={onCloseUnstake}
            farm={row.original}
            userData={userData}
          />
        </>
      )}
    </React.Fragment>
  )
}