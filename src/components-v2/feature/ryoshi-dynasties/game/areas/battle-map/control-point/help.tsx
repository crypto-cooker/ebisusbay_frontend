import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, ListItem,
  Stack,
  Text, UnorderedList,
} from '@chakra-ui/react';
import localFont from "next/font/local";
import React, {useContext} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {secondsToDhms} from "@src/utils";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

const HelpPage = () => {
  const { config: rdConfig, game: rdGameConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const controlPoints = rdGameConfig?.game.season.map.regions.flatMap(region => region.controlPoints) || [];
  const controlPointMap: Record<number, string> = rdGameConfig?.game.season.map.regions.flatMap(region => region.controlPoints).reduce((acc, cp) => {
    acc[cp.id] = cp.name;
    return acc;
  }, {} as Record<number, string>) || {};

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>
      <Box p={4}>
        <Text>
          Click on any control points on the map to see its information such as current leaders, deployment and attack options.
        </Text>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How to attack other factions
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                To attack other factions, you must first deploy your troops by clicking the "Dispatch Troops" tab. From there, you can choose how many troops to deploy and from which faction.
              </Text>
              <Text mt={4}>
                Once troops have been deployed, click the "Attack" tab and choose a faction to attack. You can only attack with as many troops as you have deployed to that control point. To lean more about the Skirmish and Conquest battle types, click the <strong>Battle Types</strong> FAQ below.
              </Text>
              <Text mt={4}>
                At the conclusion of a battle, your result will be shown. If your faction has won the battle then you will be presented with NFT rewards. Click to claim or wait until later to claim them in the Barracks.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Battle Types
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                There are two primary battle types: <strong>Skirmish</strong> and <strong>Conquest</strong>.
              </Text>

              <Box mt={4}>
                <Text fontSize='lg' fontWeight='bold'>Skirmish</Text>
                <Text>
                  In Skirmish, one battle will take place and the result will be calculated on the amount of troops used to attack vs. the amount of defender troops. The winner is determined by who slays the most opponent troops. The attacker can only attack with an amount of troops that is less or equal to the amount of defender troops.
                </Text>
              </Box>
              <Box mt={4}>
                <Text fontSize='lg' fontWeight='bold'>Conquest</Text>
                <Text>
                  In Conquest, multiple battles will take place until one side loses all their troops. The winner is determined by which faction is left with troops at the end of the battle. The maximum amount of troops that can be used in a Conquest battle is 3.
                </Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Can I relocate deployed troops?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                Yes, by clicking the "Relocate" tab in the Dispatch section, you can relocate from one control point to another. Troops can move freely to other control points within the same region. However, there are limited pathways to control points outside the region.
              </Text>
              <Text mt={2}>
                Note that relocating is taxing on your troops. {rdConfig.armies.recallTax * 100}% of them will be lost on the way to the new control point.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Relocation Pathways
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                Each control point has additional paths that troops can take beyond their region of origin:
              </Text>
              <UnorderedList>
                {controlPoints.map(cp => (
                  <ListItem>
                    <strong>{cp.name}</strong>: {cp.paths && cp.paths.length > 0
                    ? cp.paths.map(pathId => controlPointMap[pathId]).join(', ')
                    : 'None'}
                  </ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How often can I deploy and/or relocate troops?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                Deploying and relocating troops are subject to a variable cooldown period which increases daily. See below:
              </Text>
              <UnorderedList>
                {rdConfig.armies.redeploymentDelay.map((delay, i) => (
                  <ListItem>Day {i+1}: {secondsToDhms(delay)}</ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  )
}

export default HelpPage;