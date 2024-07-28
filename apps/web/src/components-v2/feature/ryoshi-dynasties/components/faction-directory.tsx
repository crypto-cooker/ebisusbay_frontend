// - Searchable List of Factions
// - faction leader info
// - Link to collection pages
// - Click to linkable details screen
// - All troop info
// - Reputation tab
// - Game history
// - Total points earned all time
// - delegation controls

import {Flex, FormLabel, Grid, GridItem, Text, useMediaQuery, VStack,} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {appConfig} from "@src/config";
import {getAllFactionsSeasonId} from "@src/core/api/RyoshiDynastiesAPICalls";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import SearchFaction from "@src/components-v2/feature/ryoshi-dynasties/components/search-factions";

const FactionDirectoryComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")[0];
    const config = appConfig();
    const [factions, setFactions] = useState<string[]>([])
    const [allFactions, setAllFactions] = useState<any>([]);
    // const {game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
    const [selectedFaction, setSelectedFaction] = useState<string>('');
    const HandleSelectCollectionCallback = (factionName: string) => {
        setSelectedFaction(factionName);
      }

    // const GetFactions = async () => {
		// if(!rdGameContext) return;
    //
    //     console.log('rdGameContext', rdGameContext);
    //     const factions = await getAllFactionsSeasonId(rdGameContext.game.id, rdGameContext.season.id);
    //     // console.log('factions', factions);
    //     setAllFactions(factions);
    // }

	// useEffect(() => {
	// 	if(!rdGameContext) return;
  //       GetFactions();
  //       console.log('rdGameContext', rdGameContext);
	// }, [rdGameContext])

    useEffect(() => {
        if(allFactions.length > 0) {
            console.log('allFactions', allFactions);
        }
    }, [allFactions])


return (
    <Flex w={'100%'} h={'500px'} justifyContent={'center'} >
      <VStack>
        <Text>Directory</Text>
        <Grid templateColumns={{base:'repeat(1, 1fr)', sm:'repeat(5, 1fr)'}} gap={6} marginBottom='4'>
            <GridItem w='100%' h='5' >
            <FormLabel> Faction:</FormLabel>
            </GridItem>
            <GridItem colSpan={{base:5, sm:4}} w='100%' >
            {/*<SearchFaction handleSelectCollectionCallback={HandleSelectCollectionCallback} allFactions={allFactions} imgSize={"lrg"}/>*/}
            </GridItem>
        </Grid>
      </VStack>
    </Flex>
  );
}

export default FactionDirectoryComponent;