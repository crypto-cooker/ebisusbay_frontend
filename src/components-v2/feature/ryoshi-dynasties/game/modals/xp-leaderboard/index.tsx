import React, {ChangeEvent, ReactElement,useCallback, useContext, useEffect, useRef, useState} from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button as ChakraButton,
  Center,
  Checkbox,
  CheckboxGroup,
  Spinner,
} from "@chakra-ui/react"
import {useFormik} from 'formik';
import {disbandFaction, editFaction} from "@src/core/api/RyoshiDynastiesAPICalls";
import {shortAddress} from "@src/utils";
import {ArrowBackIcon, DownloadIcon, EditIcon} from "@chakra-ui/icons";
import localFont from "next/font/local";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import { RdFaction } from "@src/core/services/api-service/types";
import {useInfiniteQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
// import {FactionQueryParams} from "@src/core/services/api-service/mapi/queries/faction";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import InfiniteScroll from 'react-infinite-scroll-component';
import ResponsiveXPTable from "@src/components-v2/feature/ryoshi-dynasties/game/modals/xp-leaderboard/responsive-xp-table";
import SearchFaction from "@src/components-v2/feature/ryoshi-dynasties/components/search-factions";
import {useAppSelector} from "@src/Store/hooks";

interface AllianceCenterProps {
  isOpen: boolean;
  onClose: () => void;
}
import axios from "axios";
import {appConfig} from "@src/Config";
const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

interface QueryParams{
  // addresss?: string;
  // signature?: string;
  page?: number;
}
interface XPProfile {
  profile: {
    walletAddress: string;
    username: string;
    profileImage: string;
  },
  experience: number;
}
 

const FactionDirectory = ({isOpen, onClose}: AllianceCenterProps) => {

  const [queryParams, setQueryParams] = useState<QueryParams>({});
  const getFactions = async (query?: QueryParams): Promise<PagedList<XPProfile>> => {
    const response = await api.get(`ryoshi-dynasties/experience/leaderboard`, {
      params: query
    });

    return response.data;
  }
  const fetcher = async ({ pageParam = 1 }) => {
    const data = await getFactions({
      ...queryParams,
      page: pageParam,
    });

    return data;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery(
    ['Factions', queryParams],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  );

  // const [allFactions, setAllFactions] = useState<any>([]);
  // const [selectedFaction, setSelectedFaction] = useState<RdFaction>(null);
  const user = useAppSelector((state) => {
    return state.user;
  });
  const HandleSelectCollectionCallback = (factionName: string) => {
    //get the faction from the list of all factions
    // let faction = allFactions.find((f:any) => f.name === factionName);
    // setSelectedFaction(faction);
  }

  const handleSort = useCallback((field: string) => {
    // let newSort = {
    //   sortBy: field,
    //   direction: 'desc'
    // }
    // if (queryParams.sortBy === newSort.sortBy) {
    //   newSort.direction = queryParams.direction === 'asc' ? 'desc' : 'asc'
    // }
    // setQueryParams({
    //   ...queryParams,
    //   sortBy: newSort.sortBy as any,
    //   direction: newSort.direction as any
    // });
  }, [queryParams]);

  const loadMore = () => {
    fetchNextPage();
  };

  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

useEffect(() => {
  if(!user.address) return;

  setQueryParams({
  })
} , [user])

useEffect(() => {
  if(!data) return;

  console.log("data: ", data.pages.flat()[0].data);
  // setAllFactions(data.pages.flat()[0].data);

} , [data])

return (
  <>
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Faction Directory'
    >
      <Center>
      <Box h={'50px'} w={"90%"} justifySelf='center' zIndex={2}>
        {/* <SearchFaction 
          handleSelectCollectionCallback={HandleSelectCollectionCallback} 
          allFactions={allFactions} 
          imgSize={"lrg"}
          
        /> */}
      </Box>
      </Center>

      <Box>
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={loadMore}
            hasMore={hasNextPage ?? false}
            style={{ overflow: 'hidden' }}
            loader={
              <Center>
                <Spinner />
              </Center>
            }
          >
            {status === "loading" ? (
              <Center>
                <Spinner />
              </Center>
            ) : status === "error" ? (
              <p>Error: {(error as any).message}</p>
            ) : (
              <ResponsiveXPTable
                data={data}
                // selectedFaction={selectedFaction}
                onUpdate={(faction) => {
                  // dispatch(MyListingsCollectionPageActions.showMyNftPageListDialog(listing.nft, listing))
                }}
                onSort={handleSort}
                onCancel={(faction) => {
                  // dispatch(MyListingsCollectionPageActions.showMyNftPageCancelDialog(listing))
                }}
                // breakpointValue={filtersVisible ? 'xl' : 'lg'}
              />
            )}
          </InfiniteScroll>
      </Box>

  
    </RdModal>
    </>
)
}
export default FactionDirectory;
