import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {
  Avatar,
  Box,
  Collapse,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
  Wrap
} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon, QuestionOutlineIcon} from "@chakra-ui/icons";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {Card} from "@src/components-v2/foundation/card";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {faCalculator, faExternalLinkAlt, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEnableFarm, useHarvestRewards} from "@dex/farms/hooks/farm-actions";
import {DerivedFarm, FarmState} from "@dex/farms/constants/types";
import {appConfig} from "@src/Config";
import UnstakeLpTokensDialog from "@dex/farms/components/unstake-lp-tokens-dialog";
import StakeLpTokensDialog from "@dex/farms/components/stake-lp-tokens";
import {UserFarms, UserFarmState} from "@dex/farms/state/user";
import {ethers} from "ethers";
import {round} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import {useUserFarmsRefetch} from "@dex/farms/hooks/user-farms";
import RoiCalculator from "@dex/farms/components/roi-calculator";

const config =  appConfig();

export type DataTableProps = {
  data: DerivedFarm[];
  userData: UserFarms;
};

export default function DataTable({ data, userData }: DataTableProps) {
  const user = useUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const showLiquidityColumn = useBreakpointValue({ base: false, lg: true }, { fallback: 'lg' });
  const isSmallScreen = useBreakpointValue({ base: true, sm: false }, { ssr: false });
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
                  userData={userData?.[row.original.data.pair.id]}
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
  const { refetchBalances } = useUserFarmsRefetch();
  const [harvestRewards, harvestingRewards] = useHarvestRewards();useColorModeValue('#FFFFFF', '#404040')
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const [rowFocused, setRowFocused] = useState(false);
  const { isOpen: isOpenUnstake, onOpen: onOpenUnstake, onClose:  onCloseUnstake } = useDisclosure();
  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose:  onCloseStake } = useDisclosure();

  const handleStakeSuccess = async () => {
    onCloseStake();
    onCloseUnstake();
    await new Promise(r => setTimeout(r, 2000));
    refetchBalances();
  }

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
                <Box key={`m-${cell.column.id}`} flex='1' padding={4}>
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
                <Link fontWeight='bold' href={`https://swap.ebisusbay.com/#/add/${row.original.data.pair.token0.id}/${row.original.data.pair.token1.id}`} color='#218cff'>
                  <HStack>
                    <>Get {row.original.derived.name} LP</>
                    <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} boxSize={3} />
                  </HStack>
                </Link>
                <Link fontWeight='bold' href={`${config.urls.explorer}address/${row.original.data.pair.id}`} color='#218cff'>
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
                  <Wrap justify='space-between' align='center'>
                    <Box
                      fontSize='xl'
                      fontWeight='bold'
                    >
                      FRTN {commify(round(ethers.utils.formatEther(userData?.earnings ?? 0), 2))}
                    </Box>
                    <PrimaryButton
                      isDisabled={harvestingRewards || userData?.earnings === 0n || !userData?.approved}
                      isLoading={harvestingRewards}
                      onClick={() => harvestRewards(row.original.data.pid)}
                    >
                      Harvest
                    </PrimaryButton>
                  </Wrap>
                </Card>
                {userData?.approved ? (
                  <Card flex={1}>
                    <Box fontSize='sm' fontWeight='bold' mb={2}>{row.original.derived.name} STAKED</Box>
                    <Wrap justify='space-between' align='center'>
                      <Box
                        fontSize='xl'
                        fontWeight='bold'
                      >
                        {round(ethers.utils.formatEther(userData.stakedBalance), 8)}
                      </Box>
                      {round(ethers.utils.formatEther(userData.stakedBalance), 8) > 0 && (
                        <HStack w='104px' justify='end'>
                          <SecondaryButton onClick={onOpenUnstake}>
                            <Icon as={FontAwesomeIcon} icon={faMinus} />
                          </SecondaryButton>
                          {row.original.derived.state !== FarmState.FINISHED && (
                            <SecondaryButton onClick={onOpenStake}>
                              <Icon as={FontAwesomeIcon} icon={faPlus} />
                            </SecondaryButton>
                          )}
                        </HStack>
                      )}
                    </Wrap>
                  </Card>
                ) : (
                  <Card flex={1}>
                    <Box fontSize='sm' fontWeight='bold' mb={2}>ENABLE FARM</Box>
                    <SecondaryButton
                      w='full'
                      isDisabled={enablingFarm}
                      isLoading={enablingFarm}
                      onClick={() => enableFarm(row.original.data.pair.id)}
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
            onSuccess={handleStakeSuccess}
          />
          <UnstakeLpTokensDialog
            isOpen={isOpenUnstake}
            onClose={onCloseUnstake}
            farm={row.original}
            userData={userData}
            onSuccess={handleStakeSuccess}
          />
        </>
      )}
    </React.Fragment>
  )
}

const columnHelper = createColumnHelper<DerivedFarm>();
const columns: ColumnDef<DerivedFarm, any>[] = [
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
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
      };

      return (
        <Box>
          <Box fontSize='xs' fontWeight='bold'>Staked Liquidity</Box>
          <HStack>
            <Box>{info.getValue()}</Box>
            <Popover>
              <PopoverTrigger>
                <IconButton onClick={handleClick} aria-label='Express Mode Help' icon={<QuestionOutlineIcon />} variant='unstyled' h='20px' minW='20px'/>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>Total value of the funds in this farm’s liquidity pool</PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        </Box>
      )
    }
  }),
  columnHelper.accessor("derived.apr", {
    cell: (info) => {
      const { isOpen: isOpenRoiCalc, onOpen: onOpenRoiCalc, onClose: onCloseRoiCalc } = useDisclosure();

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onOpenRoiCalc();
      };

      return (
        <Box>
          <Box fontSize='xs' fontWeight='bold'>APR</Box>
          <HStack>
            <Box>{info.getValue()}</Box>
            <Box>
              <IconButton
                aria-label='ROI'
                onClick={handleClick}
                variant='unstyled'
                icon={<Icon as={FontAwesomeIcon} icon={faCalculator} />}
              />
            </Box>
          </HStack>
          <RoiCalculator
            isOpen={isOpenRoiCalc}
            onClose={onCloseRoiCalc}
            farm={info.row.original}
            // userData={userData}
          />
        </Box>
      )
    }
  })
];