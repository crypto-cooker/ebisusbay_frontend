import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {
  RdFaction,
  RdUserContextGameTroops,
  RdUserContextNoOwnerFactionTroops,
  RdUserContextOwnerFactionTroops
} from "@src/core/services/api-service/types";
import {useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useClipboard,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {commify, isAddress} from "ethers/lib/utils";
import {shortAddress} from "@market/helpers/utils";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {CopyIcon, DownloadIcon} from "@chakra-ui/icons";
import {
  RdModalBody,
  RdModalBox,
  RdModalBoxHeader
} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import ImageService from "@src/core/services/image";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {appConfig} from "@src/Config";
import {ApiService} from "@src/core/services/api-service";
import RdButton from "../../../../components/rd-button";
import DelegateTroopsForm
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-ryoshi/delegate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";

const config = appConfig();

interface RyoshiTotalsProps {
  isOpen: boolean;
  onClose: () => void;
}

const breakdownTabs = {
  user: 'user',
  faction: 'faction'
};

const RyoshiTotals = ({isOpen, onClose}: RyoshiTotalsProps) => {
  const user = useUser();
  const {requestSignature} = useEnforceSignature();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [selectedGame, setSelectedGame] = useState<string>('current');
  const [troopsByGame, setTroopsByGame] = useState<RdUserContextGameTroops | undefined>(rdContext.user?.game.troops);
  const [currentTab, setCurrentTab] = useState(breakdownTabs.user);
  const [focusedGameId, setFocusedGameId] = useState<number>(rdContext.game?.game.id ?? 0);
  const [loadingTroopsBreakdown, setLoadingTroopsBreakdown] = useState(false);
  const { isOpen: isOpenDelegate, onOpen: onOpenDelegate, onClose: onCloseDelegate } = useDisclosure();

  const handleTabChange = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleGameChange = async (game?: string) => {
    if (!rdContext.user) return;

    if (game === 'previous' && !!rdContext.game) {
      try {
        setLoadingTroopsBreakdown(true);
        const previousGameId = rdContext.game.history.previousGameId;
        const signature = await requestSignature();
        const troops = await ApiService.withoutKey().ryoshiDynasties.getTroopsBreakdown(previousGameId, user.address!, signature);
        setTroopsByGame(troops);
        setFocusedGameId(previousGameId);
      } catch (e) {
        console.log(e);
        setTroopsByGame(rdContext.user.game.troops);
        setFocusedGameId(rdContext.game.game.id);
      } finally {
        setLoadingTroopsBreakdown(false);
      }
    } else {
      setTroopsByGame(rdContext.user.game.troops);
    }
  }

  useEffect(() => {
    if(!rdContext.user) return;

    setTroopsByGame(rdContext.user.game.troops);
    setSelectedGame('current');
  }, [rdContext.user]);

  useEffect(() => {
    handleGameChange(selectedGame);
  }, [selectedGame]);

  return (
    <>
      <RdModal
        isOpen={isOpen}
        onClose={onClose}
        title='Ryoshi Dispatch'
        titleIcon={<Icon as={FontAwesomeIcon} icon={faUsers} />}
        isCentered={false}
      >
        <RdModalBody>
          <RdModalBox>
            <RdModalBoxHeader>
              Delegate Ryoshi
            </RdModalBoxHeader>
            <VStack spacing={0} alignItems='start' mt={2}>
              <Text color={'#aaa'}>Delegate your Ryoshi to let any of your favorite factions manage your deployments and battles.</Text>
              <Stack direction={{base: 'column', sm: 'row'}} justify='end' w='full' mt={2}>
                {(!!rdContext.user && rdContext.user.game.troops.user.available.total > 0) ? (
                  <RdButton
                    onClick={onOpenDelegate}
                    maxH='50px'
                    size='sm'
                  >
                    Delegate
                  </RdButton>
                ) : (
                  <Text color='#aaa' mt={2}>No Ryoshi available</Text>
                )}
              </Stack>
            </VStack>
          </RdModalBox>
          <RdModalBox mt={2}>
            {!!rdContext.user && (
              <>
                <Stack direction={{base: 'column', sm: 'row'}} mb={8} justify='space-between'>
                  <HStack>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={6}/>
                    <Text fontSize='xl' fontWeight='bold'textAlign='start'>Ryoshi On Duty</Text>
                  </HStack>
                  {!!rdContext.game && rdContext.game.history.previousGameId > 0 && (
                    <Select
                      onChange={(e) => setSelectedGame(e.target.value)}
                      value={selectedGame}
                      maxW='175px'
                      size='sm'
                      rounded='md'
                      alignSelf='end'
                    >
                      <option value='current'>Current Game</option>
                      <option value='previous'>Previous Game</option>x
                    </Select>
                  )}
                </Stack>

                <Flex direction='row' justify='center' mt={2}>
                  <SimpleGrid columns={!!troopsByGame?.faction ? 2 : 1}>
                    <RdTabButton size='sm' isActive={currentTab === breakdownTabs.user} onClick={handleTabChange(breakdownTabs.user)}>
                      User Owned
                    </RdTabButton>
                    {!!troopsByGame?.faction && (
                      <RdTabButton size='sm' isActive={currentTab === breakdownTabs.faction} onClick={handleTabChange(breakdownTabs.faction)}>
                        Faction Owned
                      </RdTabButton>
                    )}
                  </SimpleGrid>
                </Flex>
                {!!troopsByGame && (
                  <Box mt={4}>
                    {currentTab === breakdownTabs.user ? (
                      <Box>
                        <TroopsBreakdown
                          troops={troopsByGame.user}
                          gameId={focusedGameId}
                        />
                      </Box>
                    ) : currentTab === breakdownTabs.faction && !!troopsByGame.faction && (
                      <Box>
                        <TroopsBreakdown
                          faction={rdContext.user.faction}
                          troops={troopsByGame.faction}
                          gameId={focusedGameId}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </>
            )}
          </RdModalBox>
        </RdModalBody>
      </RdModal>
      <DelegateTroopsForm
        isOpen={isOpenDelegate}
        onClose={onCloseDelegate}
        delegateMode='delegate'
      />
    </>
  )
}


const TroopsBreakdown = ({faction, troops, gameId}: {faction?: RdFaction, gameId: number, troops: RdUserContextOwnerFactionTroops | RdUserContextNoOwnerFactionTroops}) => {
  const user = useUser();

  const {signature} = useEnforceSignature();

  return (
    <Accordion w='full' mt={2} allowMultiple>
      <AccordionItem bgColor='#564D4A' rounded='md'>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Total</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.overall.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} fontSize='sm'>
          <SimpleGrid columns={2} w='full'>
            <Box textAlign='start'>Owned</Box>
            <Box textAlign='end'>{commify(troops.overall.owned)}</Box>
            {!!faction && faction.isEnabled && (
              <>
                <Box textAlign='start'>Delegated</Box>
                <Box textAlign='end'>{commify(troops.overall.delegated)}</Box>
              </>
            )}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Available</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.available.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          <Text color='#ccc' textAlign='start' pb={2}>Troops ready for deployment</Text>
          <SimpleGrid columns={2} w='full'>
            <Box textAlign='start'>Owned</Box>
            <Box textAlign='end'>{commify(troops.available.owned)}</Box>
            {/*{rdContext.user.faction && rdContext.user.faction.isEnabled && (*/}
            {/*  <>*/}
            {/*    <Box textAlign='start'>Delegated</Box>*/}
            {/*    <Box textAlign='end'>{commify(rdContext.user.season.troops.delegate.total)}</Box>*/}
            {/*  </>*/}
            {/*)}*/}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Delegations</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.delegate.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          {faction && faction.isEnabled ? (
            <>
              <Text color='#ccc' textAlign='start' pb={2}>Troops received from users</Text>
              {(troops as RdUserContextOwnerFactionTroops).delegate.users.length > 0 ? (
                <>
                  <SimpleGrid columns={2} w='full'>
                    {(troops as RdUserContextOwnerFactionTroops).delegate.users.map((user, index) => (
                      <React.Fragment key={index}>
                        <Box textAlign='start'>
                          <CopyableText
                            text={user.profileWalletAddress}
                            label={isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}
                          />
                        </Box>
                        <Box textAlign='end'>{commify(user.troops)}</Box>
                      </React.Fragment>
                    ))}
                  </SimpleGrid>
                  <ExportDataComponent
                    data={(troops as RdUserContextOwnerFactionTroops).delegate.users.map((user) => ({
                      address: user.profileWalletAddress,
                      name: user.profileName,
                      troops: user.troops,
                    })).sort((a, b) => b.troops - a.troops)}
                    address={user.address!}
                    signature={signature}
                    gameId={gameId}
                  />
                </>
              ) : (
                <>None</>
              )}
            </>
          ) : (
            <>
              <Text color='#ccc' textAlign='start' pb={2}>Troops delegated to factions</Text>
              {(troops as RdUserContextNoOwnerFactionTroops).delegate.factions.length > 0 ? (
                <SimpleGrid columns={2} w='full'>
                  {(troops as RdUserContextNoOwnerFactionTroops).delegate.factions.map((faction, index) => (
                    <React.Fragment key={index}>
                      <Box textAlign='start'>{faction.factionName}</Box>
                      <Box textAlign='end'>{commify(faction.troops)}</Box>
                    </React.Fragment>
                  ))}
                </SimpleGrid>
              ) : (
                <>None</>
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Deployments</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.deployed.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          <Text color='#ccc' textAlign='start' pb={2}>Troops deployed to control points</Text>
          {faction && faction.isEnabled ? (
            <>
              {(troops as RdUserContextOwnerFactionTroops).deployed.users.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextOwnerFactionTroops).deployed.users.map((user, index) => (
                    <AccordionItem key={index} bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>
                          <CopyableText
                            text={user.profileWalletAddress}
                            label={isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}
                          />
                        </Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(user.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {user.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {user.controlPoints.map((cp) => (
                              <React.Fragment key={cp.name}>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </React.Fragment>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          ) : (
            <>
              {(troops as RdUserContextNoOwnerFactionTroops).deployed.factions.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextNoOwnerFactionTroops).deployed.factions.map((faction, index) => (
                    <AccordionItem key={index} bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>{faction.factionName}</Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(faction.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {faction.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {faction.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Slain</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.slain.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          <Text color='#ccc' textAlign='start' pb={2}>Troops defeated in battle</Text>
          {faction && faction.isEnabled ? (
            <>
              {(troops as RdUserContextOwnerFactionTroops).slain.users.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextOwnerFactionTroops).slain.users.map((user, index) => (
                    <AccordionItem key={index} bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>
                          <CopyableText
                            text={user.profileWalletAddress}
                            label={isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}
                          />
                        </Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(user.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {user.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {user.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          ) : (
            <>
              {(troops as RdUserContextNoOwnerFactionTroops).slain.factions.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextNoOwnerFactionTroops).slain.factions.map((faction, index) => (
                    <AccordionItem key={index} bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>{faction.factionName}</Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(faction.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {faction.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {faction.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

const CopyableText = ({text, label}: {text: string, label: string}) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('');

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <Text cursor='pointer' onClick={onCopy}>{label}</Text>
  )
}

const ExportDataComponent = ({data, gameId, address, signature}: {data: any, gameId: number, address: string, signature: string}) => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const downloadLink = URL.createObjectURL(blob);
  const [token, setToken] = useState('');
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const {isOpen, onOpen} = useDisclosure();

  const handleAlternative = async () => {
    const response = await axios.get('/api/export/request-token', {
      params: {
        address,
        signature,
        gameId,
        type: 'ryoshi-dynasties/delegations'
      }
    });
    if (response.data.token) {
      setValue(`${config.urls.app}ryoshi/export?token=${response.data.token}`)
    }
    setToken(response.data.token);
  }

  useEffect(() => {
    if (!!value) {
      onCopy();
    }
  }, [value]);

  return (
    <Box textAlign='end' mt={2}>
      <Button
        variant='link'
        size='xs'
        leftIcon={<DownloadIcon />}
        onClick={onOpen}
        color='#FDAB1A'
      >
        Export Options
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Stack direction='row' justify='center' my={2}>
          <Link
            href={downloadLink}
            download='delegations.csv'
          >
            <Button
              leftIcon={<DownloadIcon />}
              size='sm'
              _hover={{
                color:'#F48F0C'
              }}
            >
              Export Data
            </Button>
          </Link>
          <Box>
            <Button
              leftIcon={<CopyIcon />}
              size='sm'
              onClick={handleAlternative}
            >
              {hasCopied ? "Copied!" : "Copy Download link"}
            </Button>
          </Box>
        </Stack>
      </Collapse>
    </Box>
  )
}


function convertToCSV(objArray: Array<{ [key: string]: any }>) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  if (array.length === 0) return '';
  let str = '';

  // headers
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      // Handle values that contain comma or newline
      let value = array[i][index] ?? '';
      line += '"' + value.toString().replace(/"/g, '""') + '"';
    }
    str += line + '\r\n';
  }
  return str;
}

export default RyoshiTotals;