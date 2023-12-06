import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import {useAppSelector} from "@src/Store/hooks";
import {toast} from "react-toastify";
import {getTroopsOnControlPoint,} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {RdControlPoint, RdGameState} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import SearchFaction from "@src/components-v2/feature/ryoshi-dynasties/components/search-factions";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {QuestionOutlineIcon} from "@chakra-ui/icons";
import {getLengthOfTime} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";

const tabs = {
  move: 'move',
  deploy: 'deploy',
};
interface DeployTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
  factionsSubscribedToSeason: any[];
}

const DispatchTab = ({controlPoint, refreshControlPoint, factionsSubscribedToSeason}: DeployTabProps) => {
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const [currentTab, setCurrentTab] = useState(tabs.deploy);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  // const [troopsAvailable, setTroopsAvailable] = useState(0);
  const [troopsDeployed, setTroopsDeployed] = useState<{armies: Array<{factionId: number, troops: number}>, sum: number}>({armies: [], sum: 0});  const [factionSubscribed, setFactionSubscribed] = useState(false);

  const hasFaction = rdContext.user?.faction && rdContext.user.faction.isEnabled;
  const playerFaction = rdContext.user?.faction;

  const cooldownRate = useMemo(() => {
    const { redeploymentDelay: dates } = rdContext.config.armies;
    const gameStart = rdContext.game?.game.startAt;

    if (!gameStart || isNaN(Date.parse(gameStart))) {
      return 'N/A';
    }

    const currentTimestamp = new Date().getTime();
    const startTimestamp = new Date(gameStart).getTime();
    const diff = currentTimestamp - startTimestamp;
    const diffInDays = Math.floor(diff / (1000 * 3600 * 24));

    const value = dates[diffInDays];
    if (!value) return 'N/A';

    return getLengthOfTime(value);
  }, [rdContext.config.armies.redeploymentDelay, rdContext.game?.game.startAt]);

  const getUserTroopsOnPoint = async () => {
    if (!user.address) return;

    try {
      const signature = await requestSignature();
      const data = await getTroopsOnControlPoint(
        user.address.toLowerCase(),
        signature,
        controlPoint.id,
        rdContext?.game?.game.id
      );
      setTroopsDeployed(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFormSuccess = async () => {
    getUserTroopsOnPoint();
    refreshControlPoint();
  }

  useEffect(() => {
    getUserTroopsOnPoint();
  }, [])

  // useEffect(() => {
  //   if(!rdContext?.user) return;
  //
  //   if(rdContext.user.game.troops.faction?.available.total !== undefined && hasFaction) {
  //     setTroopsAvailable(rdContext.user.game.troops.faction.available.total);
  //   } else if(rdContext.user.game.troops.user.available.total !== undefined && !hasFaction) {
  //     setTroopsAvailable(rdContext.user.game.troops.user.available.total);
  //   }
  // }, [rdContext]);

  return (
    <Box p={4}>
      <RdModalBox>
        <Flex justify='space-between'>
          <Box>
            <Text as='span' my='auto'>Cooldown after next deploy/relocation</Text>
            <Popover>
              <PopoverTrigger>
                <QuestionOutlineIcon ms={1} cursor='pointer' mb={1}/>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>After deploying/relocating, you can only do so again after the cooldown period. Click the "?" at the top right to learn more.</PopoverBody>
              </PopoverContent>
            </Popover>
            <Text as='span' ms={1}>:</Text>
          </Box>
          <Text fontWeight='bold' textAlign='end'>{cooldownRate}</Text>
        </Flex>
      </RdModalBox>
      <RdModalBox mt={2}>
        <AuthenticationRdButton>
          <Center>
            <Flex direction='row' justify='center' mb={2}>
              <RdTabButton
                isActive={currentTab === tabs.deploy}
                onClick={() => setCurrentTab(tabs.deploy)}
              >
                Deploy
              </RdTabButton>
              <RdTabButton
                isActive={currentTab === tabs.move}
                onClick={() => setCurrentTab(tabs.move)}
              >
                Relocate
              </RdTabButton>
            </Flex>
          </Center>

          {currentTab === tabs.deploy ? (
            <DeployForm
              controlPointId={controlPoint.id}
              hasFaction={!!hasFaction}
              subscribedFactions={factionsSubscribedToSeason}
              onSuccess={handleFormSuccess}
            />
          ) : currentTab === tabs.move && (
            <RelocateForm
              fromControlPoint={controlPoint}
              hasFaction={!!hasFaction}
              subscribedFactions={factionsSubscribedToSeason}
              troopsDeployed={troopsDeployed}
              onSuccess={handleFormSuccess}
            />
          )}
        </AuthenticationRdButton>
      </RdModalBox>
    </Box>
  )
}

export default DispatchTab;


interface DeployFormProps {
  controlPointId: number;
  hasFaction: boolean;
  subscribedFactions: Array<{id: number, uuid: string, name: string, image: string, isEnabled: boolean, type: string, addresses: string[]}>;
  onSuccess: () => void;
}

const DeployForm = ({controlPointId, hasFaction, subscribedFactions, onSuccess}: DeployFormProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [toFactionId, setToFactionId] = useState<string>();
  const [factionError, setFactionError] = useState('');
  const [troopsAvailable, setTroopsAvailable] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [troopsSource, setTroopsSource] = useState('user');

  const {requestSignature} = useEnforceSignature();

  const playerFaction = rdContext.user?.faction;
  const maxTroops = troopsAvailable > 0 ? troopsAvailable : 0;
  const selectedToFaction = subscribedFactions.find(faction => faction.id.toString() === toFactionId);

  const handleQuantityChange = (stringValue: string, numValue: number) => setSelectedQuantity(numValue);
  const handleChangeToFaction = (e: ChangeEvent<HTMLSelectElement>) => setToFactionId(e.target.value);
  // const handleChangeTroopsSource = (e: ChangeEvent<HTMLSelectElement>) => setTroopsSource(e.target.value);

  const handleDeployTroops = async () => {
    if (!user.address) return;

    if (rdContext.game?.state === RdGameState.RESET) {
      toast.error("Game has ended. Please wait until the next game begins")
      return
    }

    if (!toFactionId || !selectedToFaction) {
      toast.error(`You must select a faction`);
      return;
    }
    if (subscribedFactions.filter(faction => faction.id.toString() === toFactionId)[0]?.addresses.length === 0) {
      toast.error(`Faction must have addresses to participate`);
      return;
    }

    if (selectedQuantity > troopsAvailable) {
      toast.error(`You cant deploy more troops than you have available`);
      return;
    }
    if (selectedQuantity <= 0) {
      toast.error(`You must deploy at least 1 troop`);
      return;
    }

    deployTroops();
  }

  const deployTroops = async () => {
    if (!rdContext?.game?.game.id || !user.address) {
      toast.error('Unknown error. Please refresh');
      return;
    }

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.deployTroops(
        selectedQuantity,
        controlPointId,
        rdContext.game.game.id,
        parseInt(toFactionId!),
        user.address.toLowerCase(),
        signature
      )

      setSelectedQuantity(0);
      await rdContext.refreshUser();
      onSuccess();
      toast.success(`${selectedQuantity} troops deployed on behalf of ${selectedToFaction!.name}`);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleSelectSearchedFaction = (factionName: string) => {
    const faction = subscribedFactions.find(faction => faction.name === factionName);
    if (faction) setToFactionId(faction.id.toString());
  }

  useEffect(() => {
    if(!rdContext?.user) return;

    const canSetFactionTroops = rdContext.user.game.troops.faction?.available.total !== undefined && hasFaction;
    if (troopsSource === 'user') {
      setTroopsAvailable(rdContext.user.game.troops.user.available.total);
    } else if (troopsSource === 'faction' && canSetFactionTroops) {
      setTroopsAvailable(rdContext.user.game.troops.faction.available.total);
    }
  }, [rdContext, troopsSource]);

  useEffect(() => {
    if (hasFaction) {
      setToFactionId(playerFaction!.id.toString());
      setTroopsSource('faction')
    }
  }, []);

  return (
    <Box mt={2}>
      <SimpleGrid columns={{base: 1, sm: 2}} spacing={4}>
        <FormControl>
          <FormLabel fontSize='sm' color='#aaa'>
            From Source:
          </FormLabel>
          {hasFaction ? (
            <Flex fontWeight='bold' h={{base: 'auto', sm: '40px'}} align='center'>{playerFaction!.name}</Flex>
            // <Select
            //   bg='none'
            //   style={{ background: '#272523' }}
            //   value={troopsSource}
            //   onChange={handleChangeTroopsSource}
            //   placeholder='Select a source'
            //   mt={2}
            // >
            //   <option style={{ background: '#272523' }} value='user'>User Troops</option>
            //   <option style={{ background: '#272523' }} value='faction'>{playerFaction!.name}</option>
            // </Select>
          ) : (
            <Flex fontWeight='bold' h={{base: 'auto', sm: '40px'}} align='center'>User Troops</Flex>
          )}
        </FormControl>
        <FormControl>
          <FormLabel fontSize='sm' color='#aaa'>
            Troops To Deploy:
          </FormLabel>
          <Stack direction='row'>
            <NumberInput
              defaultValue={1}
              min={1}
              max={maxTroops}
              name="quantity"
              onChange={handleQuantityChange}
              value={selectedQuantity}
              w='full'
            >
              <NumberInputField />
              <NumberInputStepper >
                <NumberIncrementStepper color='#ffffff'/>
                <NumberDecrementStepper color='#ffffff'/>
              </NumberInputStepper>
            </NumberInput>
            <Button
              variant={'outline'}
              onClick={() => setSelectedQuantity(maxTroops)}
              color='white'
            >
              Max
            </Button>
          </Stack>
          <HStack justifyContent='space-between' mt={1}>
            <Text fontSize='sm' color='#aaa' align='right'>Troops Available:</Text>
            <Text fontWeight='bold'>{maxTroops}</Text>
          </HStack>
        </FormControl>

      </SimpleGrid>

      <Spacer h='8'/>

      <FormControl
        isInvalid={!!factionError}
        mb='24px'
        bg='none'
      >
        <FormLabel fontSize='sm' color='#aaa'>
          To Faction:
        </FormLabel>
        <Box>
          {hasFaction ? (
            <Flex fontWeight='bold'>{playerFaction!.name}</Flex>
          ) : (
            <>
              <SearchFaction
                handleSelectCollectionCallback={handleSelectSearchedFaction}
                allFactions={subscribedFactions}
                imgSize={"lrg"}
              />
              <Select
                bg='none'
                style={{ background: '#272523' }}
                value={toFactionId}
                onChange={handleChangeToFaction}
                placeholder='Select a faction'
                mt={2}
              >
                {subscribedFactions.map((faction, index) => (
                  <option
                    style={{ background: '#272523' }}
                    value={faction.id.toString()}
                    key={faction.id}
                  >
                    <Image
                      src={faction.image}
                      width='50px'
                      height='50px'
                    />
                    {faction.name}
                  </option>
                ))}
              </Select>
            </>
          )}
        </Box>
        <FormErrorMessage>{factionError}</FormErrorMessage>
      </FormControl>

      <Box textAlign='center'>
        <RdButton
          w='250px'
          fontSize={{base: 'lg', sm: 'lg'}}
          onClick={handleDeployTroops}
          disabled={isExecuting}
        >
          Deploy
        </RdButton>
      </Box>

    </Box>
  )
}

interface RelocateFormProps {
  fromControlPoint: { id: number, paths: number[], regionId: number };
  hasFaction: boolean;
  subscribedFactions: Array<{id: number, uuid: string, name: string, image: string, isEnabled: boolean, type: string, addresses: string[]}>
  troopsDeployed: {armies: Array<{factionId: number, troops: number}>, sum: number};
  onSuccess: () => void;
}

const RelocateForm = ({fromControlPoint, hasFaction, subscribedFactions, troopsDeployed, onSuccess}: RelocateFormProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [fromFactionId, setFromFactionId] = useState<string>();
  const [toFactionId, setToFactionId] = useState<string>();
  const [toControlPointId, setToControlPointId] = useState<string>();
  // const [troopsDeployed, setTroopsDeployed] = useState<{armies: Array<{factionId: number, troops: number}>, sum: number}>({armies: [], sum: 0});
  const [isExecuting, setIsExecuting] = useState(false);
  const {requestSignature} = useEnforceSignature();

  const fromControlPointId = fromControlPoint.id;
  const playerFaction = rdContext.user?.faction;
  const maxTroops = troopsDeployed.armies.find(army => army.factionId === parseInt(fromFactionId!))?.troops || 0;
  const selectedFromFaction = subscribedFactions.find(faction => faction.id.toString() === fromFactionId);
  const selectedToFaction = subscribedFactions.find(faction => faction.id.toString() === toFactionId);
  const hasRelocatableTroops = troopsDeployed.sum > 0;

  const availableControlPoints = useMemo(() => {
    if (!rdContext.game) return [];

    const currentRegionId = fromControlPoint.regionId;

    try {
      return rdContext.game?.game.season.map.regions
        .flatMap(region => region.controlPoints.map(cp => ({ ...cp, regionId: region.id })))
        .filter(controlPoint =>
          controlPoint.id !== fromControlPoint.id &&
          (controlPoint.regionId === currentRegionId || fromControlPoint.paths.includes(controlPoint.id))
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [rdContext.game?.game.season.map.regions]);

  const handleQuantityChange = (stringValue: string, numValue: number) => setSelectedQuantity(numValue);
  const handleChangeFromFaction = (e: ChangeEvent<HTMLSelectElement>) => setFromFactionId(e.target.value);
  const handleChangeToFaction = (e: ChangeEvent<HTMLSelectElement>) => setToFactionId(e.target.value);
  const handleChangeToControlPoint = (e: ChangeEvent<HTMLSelectElement>) => setToControlPointId(e.target.value);

  const handleRelocateTroops = async () => {
    if (!user.address) return;

    if (rdContext.game?.state === RdGameState.RESET) {
      toast.error("Game has ended. Please wait until the next game begins")
      return
    }

    if(!fromFactionId || !selectedFromFaction) {
      toast.error(`You must select a source faction`);
      return;
    }
    if(!toFactionId || !selectedToFaction) {
      toast.error(`You must select a destination faction`);
      return;
    }

    if (!toControlPointId) {
      toast.error(`You must select a destination control point`);
      return;
    }
    if (parseInt(toControlPointId) === fromControlPointId) {
      toast.error(`You must select a different destination control point`);
      return;
    }
    if (subscribedFactions.filter(faction => faction.id.toString() === fromFactionId)[0].addresses.length === 0) {
      toast.error(`Source faction must have addresses to participate`);
      return;
    }
    if (subscribedFactions.filter(faction => faction.id.toString() === toFactionId)[0].addresses.length === 0) {
      toast.error(`Destination faction must have addresses to participate`);
      return;
    }

    if (selectedQuantity > maxTroops) {
      toast.error(`You cant relocate more troops than you have available from this faction`);
      return;
    }
    if (selectedQuantity <= 0) {
      toast.error(`You must relocate at least 1 troop`);
      return;
    }

    deployTroops();
  }

  const deployTroops = async () => {
    if (!rdContext?.game?.game.id || !user.address) {
      toast.error('Unknown error. Please refresh');
      return;
    }

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.relocateTroops(
        selectedQuantity,
        fromControlPointId,
        parseInt(toControlPointId!),
        parseInt(fromFactionId!),
        parseInt(toFactionId!),
        user.address.toLowerCase(),
        signature
      )

      setSelectedQuantity(0);
      await rdContext.refreshUser();
      onSuccess();
      toast.success(`${selectedQuantity} troops relocated on behalf of ${selectedToFaction!.name}`);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleSelectSearchedFaction = (factionName: string) => {
    const faction = subscribedFactions.find(faction => faction.name === factionName);
    if (faction) setToFactionId(faction.id.toString());
  }

  useEffect(() => {
    if (hasFaction) {
      setFromFactionId(playerFaction!.id.toString());
      setToFactionId(playerFaction!.id.toString());
    }
  }, []);

  return (
    <Box mt={2}>
      {hasRelocatableTroops ? (
        <>
          <SimpleGrid columns={{base: 1, sm: 2}} spacing={4}>
            <FormControl>
              <FormLabel fontSize='sm' color='#aaa'>
                From Faction:
              </FormLabel>
              <Box my='auto'>
                {hasFaction ? (
                  <Flex fontWeight='bold' h={{base: 'auto', sm: '40px'}} align='center'>{playerFaction!.name}</Flex>
                ) : (
                  <Select
                    bg='none'
                    style={{ background: '#272523' }}
                    value={fromFactionId}
                    onChange={handleChangeFromFaction}
                    placeholder='Select a faction'
                  >
                    {subscribedFactions.filter(faction => troopsDeployed.armies.find(army => army.factionId === faction.id)).map((faction, index) => (
                      <option
                        style={{ background: '#272523' }}
                        value={faction.id}
                        key={faction.id}
                      >
                        <Image
                          src={faction.image}
                          width='50px'
                          height='50px'
                        />
                        {faction.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Box>
            </FormControl>
            <FormControl mt={{base: 4, sm: 0}}>
              <FormLabel fontSize='sm' color='#aaa'>
                Amount:
              </FormLabel>
              <Box>
                <Stack direction='row'>
                  <NumberInput
                    defaultValue={1}
                    min={1}
                    max={maxTroops}
                    name="quantity"
                    onChange={handleQuantityChange}
                    value={selectedQuantity}
                  >
                    <NumberInputField />
                    <NumberInputStepper >
                      <NumberIncrementStepper color='#ffffff'/>
                      <NumberDecrementStepper color='#ffffff'/>
                    </NumberInputStepper>
                  </NumberInput>
                  <Button
                    variant='outline'
                    onClick={() => setSelectedQuantity(maxTroops)}
                    color='white'
                    w='65px'
                  >
                    Max
                  </Button>
                </Stack>
              </Box>
              <HStack justifyContent='space-between' mt={1}>
                <Text fontSize='sm' color='#aaa' align='right'>Troops Available:</Text>
                <Text fontWeight='bold'>{maxTroops}</Text>
              </HStack>
            </FormControl>
          </SimpleGrid>

          <Spacer h='8'/>

          <SimpleGrid columns={{base: 1, sm: 2}} spacing={4}>
            <FormControl>
              <FormLabel fontSize='sm' color='#aaa'>
                To Faction:
              </FormLabel>
              <Box>
                {hasFaction ? (
                  <Flex fontWeight='bold' h={{base: 'auto', sm: '40px'}} align='center'>{playerFaction!.name}</Flex>
                ) : (
                  <>
                    <SearchFaction
                      handleSelectCollectionCallback={handleSelectSearchedFaction}
                      allFactions={subscribedFactions}
                      imgSize={"lrg"}
                    />
                    <Select
                      bg='none'
                      style={{ background: '#272523' }}
                      value={toFactionId}
                      onChange={handleChangeToFaction}
                      placeholder='Select a faction'
                      mt={2}
                    >
                      {subscribedFactions.map((faction, index) => (
                        <option
                          style={{ background: '#272523' }}
                          value={faction.id.toString()}
                          key={faction.id}
                        >
                          <Image
                            src={faction.image}
                            width='50px'
                            height='50px'
                          />
                          {faction.name}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
            </FormControl>
            <FormControl mt={{base: 4, sm: 0}}>
              <FormLabel fontSize='sm' color='#aaa'>
                To Control Point:
              </FormLabel>
              <Box>
                <Select
                  bg='none'
                  style={{ background: '#272523' }}
                  value={toControlPointId}
                  onChange={handleChangeToControlPoint}
                  placeholder='Select a control point'
                >
                  {availableControlPoints.map((controlPoint, index) => (
                      <option
                        key={index}
                        style={{ background: '#272523' }}
                        value={controlPoint.id}
                      >
                        {controlPoint.name}
                      </option>
                    ))}
                </Select>
              </Box>
            </FormControl>
          </SimpleGrid>

          <Spacer h='8'/>

          <Box textAlign='center'>
            <RdButton
              w='250px'
              fontSize={{base: 'lg', sm: 'lg'}}
              onClick={handleRelocateTroops}
              disabled={isExecuting}
            >
              Relocate
            </RdButton>
          </Box>
        </>
      ) : (
        <Box textAlign='center'>
          <Text>No deployed Ryoshi have been located. Either they were eliminated in battle or none have been deployed here yet.</Text>
          <Text mt={2}>Click the <strong>Deploy</strong> tab to deploy some Ryoshi.</Text>
        </Box>
      )}
    </Box>
  )
}