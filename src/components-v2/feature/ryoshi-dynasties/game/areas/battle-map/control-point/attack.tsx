import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Center,
  Flex,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Tag,
  Text,
  VStack
} from "@chakra-ui/react";
import {getProfileArmies} from "@src/core/api/RyoshiDynastiesAPICalls";
import {capitalizeFirstLetter, createSuccessfulTransactionToastContent, useInterval} from '@src/utils';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import BattleConclusion
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/battle-conclusion';

//contracts
import {BigNumber, Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Battlefield from "@src/Contracts/Battlefield.json";
import Resources from "@src/Contracts/Resources.json";
import {io} from "socket.io-client";

import ImageService from "@src/core/services/image";
import {RdControlPoint, RdGameState} from "@src/core/services/api-service/types";
import {parseErrorMessage} from "@src/helpers/validator";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {RdModalBody, RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {ApiService} from "@src/core/services/api-service";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import * as Sentry from "@sentry/nextjs";

interface AttackerFaction {
  name: string;
  factionId: number;
  armyId: string;
  troops: number;
  image: string;
  role: string;
  hasMultiple: boolean;
}

interface BattleType {
  id: number;
  name: string;
  maxTroops: number;
  desc: string;
}

const attackTypes: Array<BattleType> = [
  { id: 1, name: 'Conquest', maxTroops: 3, desc: 'Launch a relentless assault, battling until all troops are eliminated or the opposing faction is defeated'},
  { id: 2, name: 'Skirmish', maxTroops: Infinity, desc: 'Engage in a single attack using the number of troops you wager'}
];

interface AttackTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
  skirmishPrice: number;
  conquestPrice: number;
  allFactions: any[];
}

const AttackTab = ({controlPoint, refreshControlPoint, skirmishPrice, conquestPrice, allFactions}: AttackTabProps) => {
  const config = appConfig();
  const user = useUser();
  const {requestSignature} = useEnforceSignature();
  const {game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [displayConclusion, setDisplayConclusion] = useState(false);

  const [playerArmies, setPlayerArmies] = useState<AttackerFaction[]>([]);

  // New
  const [selectedAttackerId, setSelectedAttackerId] = useState<string>();
  const selectedAttacker = playerArmies?.find((army) => army.armyId === selectedAttackerId);
  const [attackerTroops, setAttackerTroops] = useState(0);
  const [selectedDefenderId, setSelectedDefenderId] = useState<string>();
  const selectedDefender = controlPoint.leaderBoard?.find((faction) => faction.id.toString() === selectedDefenderId);

  const [selectedAttackTypeId, setSelectedAttackTypeId] = useState(1);
  const selectedAttackType = attackTypes.find((attackTypeEnum: any) => attackTypeEnum.id === selectedAttackTypeId);

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //contract interactions
  const [koban, setKoban] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Attacking...');
  const [battleAttack, setBattleAttack] = useState<any>([]);
  const [isWaitingForResult, setIsWaitingForResult] = useState(false);

  const handleAttackAmountChange = (valueAsString: string, valueAsNumber: number) => setAttackerTroops(valueAsNumber)

  const attackCost = selectedAttackTypeId == 2 ? skirmishPrice : conquestPrice;

  const handleConnect = async () => {
    user.connect();
  }

  const handleChangeAttacker = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAttackerId(e.target.value);
  }

  const handleChangeDefender = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDefenderId(e.target.value);
  }

  const getPlayerArmies = async () => {
    try {
      const signature = await requestSignature();
      const data = await getProfileArmies(user.address?.toLowerCase(), signature);
      const armies = data.data.data
        .filter((army: any) => army.controlPointId == controlPoint.id)
        .map((army: any) => {
          return {
            name: allFactions.find(f => f.id === army.factionId).name,
            factionId: army.factionId,
            armyId: army.uuid,
            troops: army.troops,
            image: allFactions.find(f => f.id === army.factionId).image,
            role: army.role,
            hasMultiple: data.data.data
              .filter((a: any) => a.controlPointId == controlPoint.id && a.factionId === army.factionId).length > 1
          }
        });

      setPlayerArmies(armies);
    } catch (error) {
      console.log(error)
    }
  }

  const checkForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.resources, Resources, readProvider);
    const tx = await resourceContract.isApprovedForAll(user.address?.toLowerCase(), config.contracts.battleField);
    return tx;
  }

  const beginAttack = async () => {
    if (!user.address) return;

    try {
      setIsExecuting(true);
      const signature = await requestSignature();

      //check for approval
      const approved = await checkForApproval();

      if (koban < (Number(attackCost) * Number(attackerTroops))) {
        toast.error(`You need at least ${attackCost} Koban per troop to attack`);
        setIsExecuting(false);
        return;
      }

      if (!approved) {
        toast.warning("Please approve the pop up to allow the contract to spend your resources");
        setExecutingLabel('Approving contract...');
        const resourceContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
        const tx = await resourceContract.setApprovalForAll(config.contracts.battleField, true);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }

      const controlPointId = controlPoint.id;

      setExecutingLabel('Attacking...');
      const data = await ApiService.withoutKey().ryoshiDynasties.attack({
        troops: Number(attackerTroops),
        controlPointId,
        factionId: selectedAttacker!.factionId,
        defendingFactionId: selectedDefender!.id,
        battleType: selectedAttackTypeId,
        role: selectedAttacker!.role === 'officer' ? 'officer' : undefined
      }, user.address, signature);

      const timestamp = Number(data.timestampInSeconds);
      const attacker = data.attacker;
      const attackId = Number(data.attackId);
      const troops = Number(data.troops);
      const sig = data.signature;

      var attackPayload = {
        timestamp: timestamp,
        attacker: attacker,
        attackId: attackId,
        quantity: troops,
        battleType: selectedAttackTypeId
      };

      const attackContract = new Contract(config.contracts.battleField, Battlefield, user.provider.signer);
      await attackContract.attackFaction(attackPayload, sig);
      toast.success('Battle initiated! Waiting on result');
      beginWaitingForResult();
    } catch (error: any) {
      console.log(error);
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const beginWaitingForResult = () => {
    setIsWaitingForResult(true);
    setSocketAttempts(0);
  }

  const [socketAttempts, setSocketAttempts] = useState(0);

  useInterval(() => {
    if (socketAttempts > 10) {
      setIsWaitingForResult(false);
      return;
    }
    if (isWaitingForResult) {
      setSocketAttempts(socketAttempts + 1);
    } else {
      setIsWaitingForResult(false);
      setSocketAttempts(0);
    }
  }, 1000);

  function handleAttack() {
    setShowAlert(false);
    if (!selectedAttacker) {
      setAlertMessage("Must select an attacker faction");
      setShowAlert(true);
      return;
    }

    if (!selectedDefender) {
      setAlertMessage("Must select a defending faction");
      setShowAlert(true);
      return;
    }

    if (selectedAttackTypeId === 2 && attackerTroops > selectedAttacker.troops)  {
      setAlertMessage("Cannot attack with more troops than you have available");
      setShowAlert(true);
      return;
    }

    if (selectedAttackTypeId === 2 && attackerTroops > selectedDefender.totalTroops)  {
      setAlertMessage("Cannot attack with more troops than the defender has");
      setShowAlert(true);
      return;
    }

    if (selectedAttackTypeId === 1 && attackerTroops > 3) {
      setAlertMessage("Max troops for conquest attacks are 3");
      setShowAlert(true);
      return;
    }

    if (selectedAttacker.factionId === selectedDefender.id) {
      setAlertMessage("Cannot attack your own faction");
      setShowAlert(true);
      return;
    }

    if(selectedAttacker.troops <= 1) {
      setAlertMessage("You must have at least 2 troops on the point to attack");
      setShowAlert(true);
      return;
    }

    if(selectedDefender.totalTroops <= 0) {
      setAlertMessage("Defender must have at least 1 troop");
      setShowAlert(true);
      return;
    }

    if (attackerTroops <= 0) {
      setAlertMessage("Must attack with at least 1 troop");
      setShowAlert(true);
      return;
    }

    if (rdGameContext?.state === RdGameState.RESET) {
      setAlertMessage("Game has ended. Please wait until the next game begins");
      setShowAlert(true);
    }

    beginAttack();
  }

  const retrieveKobanBalance = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.resources, Resources, readProvider);
    const tx = await resourceContract.balanceOf(user.address?.toLowerCase(), 1);
    setKoban(Number(ethers.utils.hexValue(BigNumber.from(tx))));
  }

  const toggleBattleConclusion = () => {
    setDisplayConclusion(!displayConclusion);
  }
  
  useEffect(() => {
    refreshControlPoint();
    retrieveKobanBalance();
    getPlayerArmies();
  }, []);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    if (!user.address) return;

    const socket = io(`${config.urls.cmsSocket}ryoshi-dynasties/battles?walletAddress=${user.address.toLowerCase()}`);

    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    function onBattleAttackEvent(data:any) {
      // console.log('BATTLE_ATTACK', data)
      const parsedAttack = JSON.parse(data);
      // console.log('parsedAtack', parsedAtack)
      if (parsedAttack && parsedAttack.success) {
        setBattleAttack(parsedAttack);
        setIsExecuting(false);
        setIsWaitingForResult(false);
        toggleBattleConclusion();
      } else {
        toast.error('Unable to process attack. Please try again later.');
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('BATTLE_ATTACK', onBattleAttackEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('BATTLE_ATTACK', onBattleAttackEvent);
    };
  }, [!!user.address]);

  return (
    <Box>
      {!!user.address ? (
        <RdModalBody>
          {displayConclusion && !!selectedAttacker && !!selectedDefender ? (
            <BattleConclusion
              attacker={selectedAttacker}
              attackerTroops={attackerTroops}
              defender={selectedDefender}
              battleAttack={battleAttack}
              onAttackAgain={toggleBattleConclusion}
              onRetrieveKobanBalance={retrieveKobanBalance}
            />
          ) : (
            <>
              <Box textAlign='center' fontSize='sm'>
                Faction owners can use deployed troops to attack other factions
              </Box>

              <Box mt={4}>
                <VStack w='full'>
                  {playerArmies.length > 0 ? (
                    <Select
                      name='attackersFaction'
                      backgroundColor='#292626'
                      value={selectedAttackerId}
                      onChange={handleChangeAttacker}
                      placeholder='Select Attacker'
                    >
                      {playerArmies.map((army) => (
                        <option
                          key={army.armyId}
                          style={{ background: '#272523' }}
                          value={army.armyId}
                        >
                          {army.name}{army.hasMultiple && <> (As {capitalizeFirstLetter(army.role)})</>}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Box
                      bgColor='#292626'
                      p={2}
                      rounded='md'
                      textAlign='center'
                      h={10}
                      w='full'
                    >
                      <Text textAlign='center' textColor={'#aaa'} fontSize={'14px'} as={"i"}>You currently have no troops deployed</Text>
                    </Box>
                  )}

                  <Select
                    name='defendersFaction'
                    backgroundColor='#292626'
                    value={selectedDefenderId}
                    onChange={handleChangeDefender}
                    placeholder='Select Defender'
                  >
                    {controlPoint.leaderBoard.filter(faction => faction.totalTroops > 0).map((faction, index) => (
                      <option style={{ background: '#272523' }} value={faction.id} key={faction.name}>{faction.name}</option>
                    ))}
                  </Select>

                  {!!selectedAttacker && (
                    <Tag alignSelf='end' fontSize='md'>Deployed Troops: {selectedAttacker.troops}</Tag>
                  )}

                  <NumberInput
                    defaultValue={1}
                    min={1}
                    max={selectedAttackType?.maxTroops}
                    name="quantity"
                    onChange={handleAttackAmountChange}
                    value={attackerTroops}
                    bgColor='#292626'
                    borderRadius='10px'
                    w='full'
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper color='#ffffff' />
                      <NumberDecrementStepper color='#ffffff' />
                    </NumberInputStepper>
                  </NumberInput>
                  <Center>
                    <Flex direction='row' justify='center' mb={2}>
                      <RdTabButton
                        isActive={selectedAttackTypeId === 1}
                        onClick={() => setSelectedAttackTypeId(1)}
                      >
                        Conquest
                      </RdTabButton>
                      <RdTabButton
                        isActive={selectedAttackTypeId === 2}
                        onClick={() => setSelectedAttackTypeId(2)}
                      >
                        Skirmish
                      </RdTabButton>
                    </Flex>
                  </Center>
                </VStack>
              </Box>

              <RdModalBox>
                <SimpleGrid templateColumns='1fr 25px 1fr' alignItems='center' minH='160px'>
                  <GridItem>
                    {!!selectedAttacker && (
                      <Avatar
                        boxSize={{base: '50px', sm: '100px'}}
                        objectFit="cover"
                        src={ImageService.translate(selectedAttacker.image).fixedWidth(100, 100)}
                      />
                    )}
                  </GridItem>
                  <GridItem rowSpan={3} fontSize='xl'>
                    vs
                  </GridItem>
                  <GridItem textAlign='end'>
                    {!!selectedDefender && (
                      <Avatar
                        boxSize={{base: '50px', sm: '100px'}}
                        objectFit="cover"
                        src={ImageService.translate(selectedDefender.image).fixedWidth(100, 100)}
                      />
                    )}
                  </GridItem>
                  <GridItem>
                    <Text textAlign='left' fontSize={{base: '16px', sm: '24px'}}>{selectedAttacker?.name}</Text>
                  </GridItem>
                  <GridItem textAlign='end'>
                    <Text textAlign='right' fontSize={{base: '16px', sm: '24px'}}>{selectedDefender?.name}</Text>
                  </GridItem>
                  <GridItem>
                    {!!selectedAttacker && (
                      <Text textAlign='left' fontSize={{base: '12px', sm: '16px'}}>Attack Strength: {attackerTroops}</Text>
                    )}
                  </GridItem>
                  <GridItem>
                    {!!selectedDefender && (
                      <Text textAlign='right' fontSize={{base: '12px', sm: '16px'}}>Troops stationed: {selectedDefender.totalTroops}</Text>
                    )}
                  </GridItem>
                </SimpleGrid>
              </RdModalBox>

              {/* Alert */}
              <Flex justify={"center"} align={"center"} >
                <Box p='1'>
                  {showAlert && (
                    <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>{alertMessage}</AlertTitle>
                    </Alert>)}
                </Box>
              </Flex>
              <Center>
                <HStack>
                  <Text fontSize={'14px'}>Costs</Text>
                  <Text cursor='pointer' fontSize={'14px'}>{attackCost} $Koban</Text>
                  <Text fontSize={'14px'}>per troop you attack with ({attackCost * attackerTroops})</Text>
                </HStack>
              </Center>
              <Flex alignContent={'center'} justifyContent={'center'}>
                <Box ps='20px'>
                  <AuthenticationRdButton>
                    <RdButton
                      minW='200px'
                      size={{base: 'md', sm: 'lg'}}
                      stickyIcon={true}
                      onClick={handleAttack}
                      isLoading={isExecuting || isWaitingForResult}
                      isDisabled={isExecuting || isWaitingForResult}
                      marginTop='2'
                      marginBottom='2'
                      loadingText={executingLabel}
                    >
                      {user.address ? 'Attack' : 'Connect'}
                    </RdButton>
                  </AuthenticationRdButton>
                </Box>
              </Flex>

              <Center>
                <Flex justifyContent='space-between' w='90%' >
                  <Text fontSize={'12px'}>Your $Koban: {koban}</Text>
                </Flex>
              </Center>
            </>
          )}
        </RdModalBody>
      ) : (
        <Box textAlign='center' pt={8} pb={4} px={2}>
          <Box ps='20px'>
            <RdButton
              w='250px'
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleConnect}
            >
              Connect
            </RdButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default AttackTab;