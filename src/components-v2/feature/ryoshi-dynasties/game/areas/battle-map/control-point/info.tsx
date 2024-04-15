import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";
import React, {useEffect, useMemo, useState} from 'react';
import {RdControlPoint} from "@src/core/services/api-service/types";
import ImageService from "@src/core/services/image";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {pluralize} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";

interface InfoTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
  useCurrentGameId: boolean;
}

const InfoTab = ({controlPoint, refreshControlPoint, useCurrentGameId}: InfoTabProps) => {
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false, lg: false, xl: false, '2xl': false })
  const [gameEndDate, setGameEndDate] = useState('');

  const topFiveLeaders = controlPoint?.leaderBoard ? controlPoint.leaderBoard?.slice(0, 5) : [];

  const controlPointLeaders = useMemo(() => {
    if (!controlPoint.leaderBoard) return <></>;

    return topFiveLeaders.map((faction, index ) =>  (
      <Tr key={index}>
        <Td textAlign='start' w={16}>{index+1}</Td>
        <Td
          textAlign='left'
          alignSelf='center'
          alignContent='center'
          alignItems='center'
          isTruncated
        >
          <HStack>
            <Avatar
              width='40px'
              height='40px'
              padding={1}
              src={ImageService.translate(faction.image).avatar()}
              rounded='xs'
            />
            <Text isTruncated={isMobile} maxW='100px'>{faction.name}</Text>
          </HStack>
        </Td>
        <Td textAlign='left' maxW='200px' isNumeric>{commify(faction.totalTroops)}</Td>
      </Tr>
    ));
  }, [controlPoint, topFiveLeaders]);

  useEffect(() => {
    refreshControlPoint();
  }, []);

  return (
    <>
      <Flex mx={4}>
        <Flex flexDirection='column' textAlign='center' justifyContent='space-around'>
          {!!topFiveLeaders[0]?.totalTroops ? (
            <TableContainer w={{base: '100%', sm:'100%'}} h='250px'>
              <Table size='m'>
                <Thead>
                  <Tr>
                    <Th textAlign='left' color='gray.400'>Rank</Th>
                    <Th textAlign='left' color='gray.400'>Faction</Th>
                    <Th textAlign='left' color='gray.400' isNumeric>Troops</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {controlPointLeaders}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Box minH='200px'>
              <Center>
                <Text margin='100'>No Troops currently deployed</Text>
              </Center>
            </Box>
          )}
          <Flex mb={4}>
            {useCurrentGameId ? (
              <RdModalBox isFooter={true}>
                The faction with the highest troop count will receive <strong>{controlPoint.points}</strong> {pluralize(controlPoint.points, 'point')} every 5-minute interval
              </RdModalBox>
            ) : (
              <Text as='i' textColor='#aaa'>
                Final standings at {gameEndDate}. <b>{controlPoint.points}</b> points were awarded to <b>{controlPoint?.leaderBoard[0]?.name}</b>
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default InfoTab;

interface StringProps {
  stringLength: number;
}