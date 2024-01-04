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
  const [selectedType, setSelectedType] = useState<TypeTab>(TypeTab.user);

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
        .filter(reputation => ciEquals(reputation.sendingUser.walletAddress, user.address))
        .sort((a, b) => b.points - a.points)
        .map(reputation => ({isFaction: true, reputation}));
  }, [rdContext.user?.reputations, user.address]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Diplomacy'
      isCentered={false}
    >
      <RdModalBody>
        <RdModalBox>
          <Stack direction={{base: 'column', sm: 'row'}} mb={8} justify='space-between'>
            <HStack>
              <Icon as={FontAwesomeIcon} icon={faBalanceScale} boxSize={6} />
              <Text fontSize='xl' fontWeight='bold' textAlign='start'>Faction Reputation</Text>
            </HStack>
            <Select
              onChange={(e) => setSelectedType(e.target.value as TypeTab)}
              value={selectedType}
              maxW='175px'
              size='sm'
              rounded='md'
              alignSelf='end'
            >
              <option value={TypeTab.user}>As User</option>
              {!!rdContext.user?.faction && <option value={TypeTab.faction}>As Faction</option>}
            </Select>
          </Stack>

          <Flex direction='row' justify='center' mt={2}>
            <SimpleGrid columns={selectedType === TypeTab.faction ? 2 : 1}>
              <RdTabButton size='sm' isActive={selectedDirection === DirectionTab.outgoing} onClick={handleDirectionChange(DirectionTab.outgoing)}>
                Outgoing
              </RdTabButton>
              {selectedType === TypeTab.faction && (
                <RdTabButton size='sm' isActive={selectedDirection === DirectionTab.incoming} onClick={handleDirectionChange(DirectionTab.incoming)}>
                  Incoming
                </RdTabButton>
              )}
            </SimpleGrid>
          </Flex>
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

const ReputationList = ({reputations, hasMixedTypes, extractPrimaryValue, extractSecondaryValue}: ReputationListProps) => {
  const [factionsOnly, setFactionsOnly] = useState(true);

  const handleFactionsOnlyChange = () => {
    setFactionsOnly(!factionsOnly);
  };

  return (
    <>
      {hasMixedTypes && (
        <Flex justify={{base: 'space-between', sm: 'end'}} align='center'>
          <Box>Viewing {factionsOnly ? 'factions' : 'users'}</Box>
          <Button size='sm' ms={2} onClick={handleFactionsOnlyChange}>Show {factionsOnly ? 'Users' : 'Factions'}</Button>
        </Flex>
      )}
      {reputations.filter(entry => factionsOnly ? entry.isFaction : !entry.isFaction).map((entry, index) => (
        <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
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
    </>
  )
}

type ReputationMeterProps = {
  reputation: number; // Expected range is -100 to 100
}

const ReputationMeter: React.FC<ReputationMeterProps> = ({ reputation }) => {
  // Convert the reputation value to a percentage for positioning the marker
  const markerPosition = ((reputation + 1000000) / 2000000) * 100;

  return (
    <Box width='full' p={4}>
      <Text mb={2}>Reputation: <strong>{reputation}</strong></Text>
      <Box
        position='relative'
        height='10px'
        bgGradient={`linear(to-r, #7D3500, #B45402, #808080, #0087d3, #2ec2e5)`}
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
