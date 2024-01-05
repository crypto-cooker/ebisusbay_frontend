import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalBody, RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import React, {useContext, useMemo, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBalanceScale, faShieldAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {useUser} from "@src/components-v2/useUser";
import {ciEquals, isAddress, shortAddress} from "@src/utils";
import {Reputation} from "@src/core/services/api-service/types";
import {commify} from "ethers/lib/utils";

interface DiplomacyProps {
  isOpen: boolean;
  onClose: () => void;
}

enum DirectionTab {
  incoming = 'incoming',
  outgoing = 'outgoing'
}

enum TypeTab {
  user = 'user',
  faction = 'faction'
}

const Diplomacy = ({isOpen, onClose}: DiplomacyProps) => {
  const user = useUser();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [selectedDirection, setSelectedDirection] = useState<DirectionTab>(DirectionTab.outgoing);
  const [selectedType, setSelectedType] = useState<TypeTab>(!!rdContext.user?.faction ? TypeTab.faction : TypeTab.user);

  const handleDirectionChange = (key: DirectionTab) => (e: any) => {
    setSelectedDirection(key);
  };

  const userFactionSent = useMemo(() => {
    if (!rdContext.user?.reputations) return [];
    if (!rdContext.user?.faction) return [];
    return rdContext.user.reputations.filter(reputation => {
      const matchesSendingUser = ciEquals(reputation.sendingUser.walletAddress, user.address);
      const matchesSendingFaction = !!reputation.sendingFaction && reputation.sendingFaction.id === rdContext.user?.faction?.id;
      return matchesSendingUser && matchesSendingFaction;
    }).sort((a, b) => b.points - a.points)
      .map(reputation => ({isFaction: true, reputation}));
  }, [rdContext.user?.reputations, rdContext.user?.faction]);

  const userFactionReceived = useMemo(() => {
      if (!rdContext.user?.reputations) return [];
      if (!rdContext.user?.faction) return [];
      return rdContext.user.reputations.filter(reputation => {
        const matchesReceivingFaction = reputation.receivingFaction.id === rdContext.user?.faction?.id;
        const isSelfReputation = ciEquals(reputation.sendingUser.walletAddress, user.address);
        return matchesReceivingFaction && !isSelfReputation;
      }).sort((a, b) => b.points - a.points)
        .map(reputation => ({isFaction: !!reputation.sendingFaction, reputation}));
  }, [rdContext.user?.reputations, rdContext.user?.faction]);

  const userSentToFactions = useMemo(() => {
      if (!rdContext.user?.reputations) return [];
      return rdContext.user.reputations
        .filter(reputation => !!reputation.receivingFaction && ciEquals(reputation.sendingUser.walletAddress, user.address))
        .sort((a, b) => b.points - a.points)
        .map(reputation => ({isFaction: true, reputation}));
  }, [rdContext.user?.reputations, user.address]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Diplomacy'
      titleIcon={<Icon as={FontAwesomeIcon} icon={faBalanceScale} />}
      isCentered={false}
    >
      <RdModalBody>
        <RdModalBox>
          <Box textAlign='center'>Interact with factions to establish reputation. Actions such as deployments and delegations will create positive reputation while other actions such as battles will create negative reputation.</Box>
        </RdModalBox>
        <RdModalBox mt={2}>
          <Stack direction={{base: 'column', sm: 'row'}} mb={8} justify='space-between'>
            <Text fontSize='xl' fontWeight='bold' textAlign='start'>{selectedType === TypeTab.user ? 'User' : 'Faction'} Reputation</Text>
            {!!rdContext.user?.faction && (
              <Select
                onChange={(e) => setSelectedType(e.target.value as TypeTab)}
                value={selectedType}
                maxW='175px'
                size='sm'
                rounded='md'
                alignSelf='end'
              >
                <option value={TypeTab.user}>As User</option>
                <option value={TypeTab.faction}>As Faction</option>
              </Select>
            )}
          </Stack>

          {selectedType === TypeTab.faction && (
          <Flex direction='row' justify='center' mt={2}>
            <SimpleGrid columns={selectedType === TypeTab.faction ? 2 : 1}>
              <RdTabButton size='sm' isActive={selectedDirection === DirectionTab.outgoing} onClick={handleDirectionChange(DirectionTab.outgoing)}>
                Outgoing
              </RdTabButton>
              <RdTabButton size='sm' isActive={selectedDirection === DirectionTab.incoming} onClick={handleDirectionChange(DirectionTab.incoming)}>
                Incoming
              </RdTabButton>
            </SimpleGrid>
          </Flex>
          )}
          <Box mt={2}>
            {selectedType === TypeTab.faction && selectedDirection === DirectionTab.incoming ? (
              <>
                <Box textAlign='center' mb={6}>Reputation based on actions performed by factions or users</Box>
                <Accordion key='faction-incoming' w='full' mt={2} allowMultiple>
                  <ReputationList
                    reputations={userFactionReceived}
                    hasMixedTypes={true}
                    extractPrimaryValue={(reputation) => {
                      if (reputation.sendingFaction) return reputation.sendingFaction.name;
                      if (isAddress(reputation.sendingUser.username)) return shortAddress(reputation.sendingUser.username);
                      return reputation.sendingUser.username;
                    }}
                    extractSecondaryValue={(reputation) => {
                      if (!reputation.sendingFaction) return undefined;
                      if (isAddress(reputation.sendingUser.username)) return shortAddress(reputation.sendingUser.username);
                      return reputation.sendingUser.username;
                    }}
                  />
                </Accordion>
              </>
            ) : selectedType === TypeTab.faction && selectedDirection === DirectionTab.outgoing ? (
              <>
                <Box textAlign='center' mb={6}>Reputation based on actions performed by yourself representing your faction</Box>
                <Accordion key='faction-outgoing' w='full' mt={2} allowMultiple>
                  <ReputationList
                    reputations={userFactionSent}
                    hasMixedTypes={false}
                    extractPrimaryValue={(reputation) => reputation.receivingFaction.name}
                  />
                </Accordion>
              </>
            ) : selectedType === TypeTab.user && selectedDirection === DirectionTab.outgoing && (
              <>
                <Box textAlign='center' mb={6}>Reputation based on actions performed by yourself as an individual</Box>
                <Accordion key='user-outgoing' w='full' mt={2} allowMultiple>
                  <ReputationList
                    reputations={userSentToFactions}
                    hasMixedTypes={false}
                    extractPrimaryValue={(reputation) => reputation.receivingFaction.name}
                  />
                </Accordion>
              </>
            )}
          </Box>
        </RdModalBox>
      </RdModalBody>
    </RdModal>
  )
}

export default Diplomacy;

interface ReputationListProps {
  reputations: Array<{isFaction: boolean, reputation: Reputation}>;
  hasMixedTypes: boolean;
  extractPrimaryValue: (reputation: Reputation) => string | number;
  extractSecondaryValue?: (reputation: Reputation) => string | number;
}

const reputationListPageSize = 50;
const ReputationList = ({reputations, hasMixedTypes, extractPrimaryValue, extractSecondaryValue}: ReputationListProps) => {
  const [factionsOnly, setFactionsOnly] = useState(true);
  const [limit, setLimit] = useState(reputationListPageSize);

  const filteredReputations = useMemo(() => {
    return reputations.filter(entry => factionsOnly ? entry.isFaction : !entry.isFaction);
  }, [reputations, factionsOnly]);

  const handleFactionsOnlyChange = () => {
    setFactionsOnly(!factionsOnly);
    setLimit(reputationListPageSize);
  };

  return (
    <>
      {hasMixedTypes && (
        <Flex justify={{base: 'space-between', sm: 'end'}} align='center'>
          <Box>Viewing {factionsOnly ? 'factions' : 'users'}</Box>
          <Button size='sm' ms={2} onClick={handleFactionsOnlyChange}>Show {factionsOnly ? 'Users' : 'Factions'}</Button>
        </Flex>
      )}
      {filteredReputations.length > 0 ? (
        <>
          {filteredReputations.slice(0, limit).map((entry, index) => (
            <AccordionItem key={index} bgColor='#564D4A' rounded='md' mt={2}>
              <AccordionButton>
                <Flex w='full'>
                  <Box flex='1' textAlign='left' my='auto'>
                    <HStack>
                      <Icon as={FontAwesomeIcon} icon={entry.isFaction ? faShieldAlt : faUser} boxSize={4} />
                      <Box>
                        <Box>{extractPrimaryValue(entry.reputation)}</Box>
                        {!!extractSecondaryValue && (
                          <Box fontSize='xs'>
                            {extractSecondaryValue(entry.reputation)}
                          </Box>
                        )}
                      </Box>
                    </HStack>
                  </Box>
                  <Box ms={2} my='auto' fontWeight='bold'>{entry.reputation.level}</Box>
                  <AccordionIcon ms={4} my='auto'/>
                </Flex>
              </AccordionButton>
              <AccordionPanel pb={1} fontSize='sm'>
                <ReputationMeter reputation={entry.reputation.points} />
              </AccordionPanel>
            </AccordionItem>
          ))}
          {filteredReputations.length > limit && (
            <Center mt={4}>
              <Button onClick={() => setLimit(limit + reputationListPageSize)}>View More</Button>
            </Center>
          )}
        </>
      ) : (
        <Box textAlign='center'>
          No reputation to display yet. Interact with some factions and check back again.
        </Box>
      )}
    </>
  )
}

type ReputationMeterProps = {
  reputation: number; // Expected range is -100 to 100
}

const ReputationMeter: React.FC<ReputationMeterProps> = ({ reputation }) => {
  // Array of reputation points from lowest to highest
  const pointsArray = [
    -1000000, -250000, -100000, -50000, -24000, -12000, -6000, -3000, -1500, -500,
    0,
    500, 1500, 3000, 6000, 12000, 24000, 50000, 100000, 250000, 1000000
  ];

  // Set marker position so that it smoothly follows an evenly distributed path based on the pointsArray
  const markerPosition = useMemo(() => {
    const boundedReputation = Math.min(Math.max(reputation, -1000000), 1000000);

    let lowerIndex = pointsArray.length - 2;
    for (let i = 1; i < pointsArray.length; i++) {
      if (boundedReputation <= pointsArray[i]) {
        lowerIndex = i - 1;
        break;
      }
    }

    const rangeMin = pointsArray[lowerIndex];
    const rangeMax = pointsArray[lowerIndex + 1];
    const rangeRatio = (boundedReputation - rangeMin) / (rangeMax - rangeMin);

    const totalLevels = pointsArray.length - 1;
    return ((lowerIndex + rangeRatio) / totalLevels) * 100;

  }, [reputation]);

  return (
    <Box width='full' p={4}>
      <Text mb={2}>Reputation: <strong>{commify(reputation)}</strong></Text>
      <Box
        position='relative'
        height='10px'
        bgGradient='linear(to-r, #7D3500, #B45402, #FFD700 43%, #808080 48%, #808080 52%, #2ec2e5 57%, #00b377 75%, #00ff7f)'
        borderRadius='md'
        border='1px solid #FDAB1A'
      >
        <Box
          position='absolute'
          left={`${markerPosition}%`}
          top='50%'
          transform='translate(-50%, -50%)'
          width='6px'
          height='200%'
          bgColor='white'
          border='1px solid #555'
        />
      </Box>
    </Box>
  );
};
