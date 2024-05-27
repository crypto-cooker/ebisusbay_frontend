import {Avatar, Box, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import {DerivedFarm} from "@dex/farms/constants/types";
import {UserFarms, UserFarmState} from "@dex/farms/state/user";
import {useColorModeValue} from "@chakra-ui/color-mode";

export type DataGridProps = {
  data: DerivedFarm[];
  userData: UserFarms;
};


export default function DataGrid({ data, userData }: DataGridProps)  {
  return (
    <SimpleGrid columns={{base: 1, sm: 2, md: 3}} spacing={4}>
      {!!data && data.length > 0 && data.map((farm) => (
        <GridItem key={farm.data.pid} farm={farm} userData={userData?.[farm.data.pair.id]} />
      ))}
    </SimpleGrid>
  );
}

function GridItem({farm, userData}: {farm: DerivedFarm, userData: UserFarmState}) {
  const bgColor = useColorModeValue('#FFF', '#404040')
  const hoverBgColor = useColorModeValue('#FFFFFF', '#404040');
  const borderColor = useColorModeValue('#bbb', '#ffffff33');
  const hoverBorderColor = useColorModeValue('#595d69', '#ddd');

  return (
    <Box h='full' data-group>
      <Box
        border='1px solid'
        borderColor={borderColor}
        rounded='xl'
        boxShadow='5px 5px 20px black'
        backgroundColor={bgColor}
        overflow='hidden'
        h='full'
        p={2}
      >
        <SimpleGrid columns={2}>
          <Box>
            <Box position='relative' w='40px' h='24px'>
              <Avatar
                src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${farm.data.pair.token0.symbol.toLowerCase()}.webp`}
                rounded='full'
                size='xs'
              />
              <Avatar
                src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${farm.data.pair.token1.symbol.toLowerCase()}.webp`}
                rounded='full'
                size='xs'
                position='absolute'
                top={0}
                right={0}
              />
            </Box>
          </Box>
          <Box textAlign='end'>
            {farm.data.pair.name}
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  )
}