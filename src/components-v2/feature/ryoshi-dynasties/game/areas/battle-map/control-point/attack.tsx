import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {attack, getProfileArmies} from "@src/core/api/RyoshiDynastiesAPICalls";
import {createSuccessfulTransactionToastContent} from '@src/utils';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {useAppSelector} from "@src/Store/hooks";
import BattleConclusion
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/battle-conclusion';
import DailyCheckinModal from "@src/components-v2/feature/ryoshi-dynasties/game/modals/daily-checkin";

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
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

interface AttackTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
  skirmishPrice: number;
  conquestPrice: number;
  allFactions: any[];
}

const AttackTab = ({controlPoint, refreshControlPoint, skirmishPrice, conquestPrice, allFactions}: AttackTabProps) => {
  const dispatch = useDispatch();
  const config = appConfig();
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const {game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [displayConclusion, setDisplayConclusion] = useState(false);
  const { isOpen: isOpenDailyCheckin, onOpen: onOpenDailyCheckin, onClose: onCloseDailyCheckin } = useDisclosure();

  const [attackerTroops, setAttackerTroops] = useState(0);
  const [attackerTroopsAvailable, setAttackerTroopsAvailable] = useState(1);
  const [attackerOptions, setAttackerOptions] = useState<any>([]);
  const [attackerImage, setAttackerImage] = useState('');

  const [defenderTroops, setDefenderTroops] = useState(0);
  const [defenderOptions, setDefenderOptions] = useState<any>([]);
  const [defenderImage, setDefenderImage] = useState('');

  const [factionsLoaded, setFactionsLoaded] = useState(false);
  const [playerArmies, setPlayerArmies] = useState<any>([]);
  const [combinedArmies, setCombinedArmies] = useState<any>([]);
  const handleChange = (value: any) => setAttackerTroops(value)
  const [attackType, setAttackType] = useState(1);

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //contract interactions
  const [koban, setKoban] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Attacking...');
  const [battleAttack, setBattleAttack] = useState<any>([]);

  interface attackTypeInterface {
    id: number;
    name: string;
    maxTroops: number;
    desc: string;
  }
  const attackTypeEnum: Array<attackTypeInterface> = [
    {id:1, name:"Conquest", maxTroops:3, desc: "Launch a relentless assault, battling until all troops are eliminated or the opposing faction is defeated"},
    {id:2, name:"Skirmish", maxTroops:Infinity, desc: "Engage in a single attack using the number of troops you wager"}
  ];
  function getAttackCost(){
    return attackType == 2 ? skirmishPrice : conquestPrice
  }
  const [dataForm, setDataForm] = useState({
    attackersFaction: "" ?? null,
    defendersFaction: "" ?? null,
  })

  const handleConnect = async () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }

  const onChangeInputsAttacker = (e : any) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    if(e.target.value !== ''){
      const faction = combinedArmies.filter((faction:any)=> faction?.name === e.target.value)[0];
      // console.log("faction", faction)
      setAttackerTroopsAvailable(faction.troops);
      setAttackerImage(faction.image);
    } else { 
      setAttackerTroopsAvailable(0);
    }
  }
  const onChangeInputsDefender = (e : any) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    if(e.target.value !== ''){
      setDefenderTroops(controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops);
    } else {
      setDefenderTroops(0);
    }
  }

  const GetPlayerArmies = async () => {
    try {
      const signature = await requestSignature();
      const data = await getProfileArmies(user.address?.toLowerCase(), signature);
      setPlayerArmies(
        data.data.data.filter((army:any) => army.controlPointId == controlPoint.id)
      );
    } catch (error) {
      console.log(error)
    }
  }

  const CheckForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.resources, Resources, readProvider);
    const tx = await resourceContract.isApprovedForAll(user.address?.toLowerCase(), config.contracts.battleField);
    return tx;
  }

  const RealAttack = async () => {
    setIsExecuting(true);
    try {
      const signature = await requestSignature();

      //check for approval
      const approved = await CheckForApproval();

      if(koban < (Number(getAttackCost())*Number(attackerTroops))){
        toast.error("You need at least " +getAttackCost() + " Koban per troop to attack")
        setIsExecuting(false);
        return;
      }

      if(!approved){
        toast.warning("Please approve the pop up to allow the contract to spend your resources")
        setExecutingLabel('Approving contract...');
        const resourceContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
        const tx = await resourceContract.setApprovalForAll(config.contracts.battleField, true);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }

      const controlPointId = controlPoint.id;
      const attackerFactionId = controlPoint.leaderBoard.filter(faction => faction.name === dataForm.attackersFaction)[0].id;
      const defenderFactionId = controlPoint.leaderBoard.filter(faction => faction.name === dataForm.defendersFaction)[0].id;

      // console.log("controlPointId", controlPointId);
      // console.log("attackerFactionId", attackerFactionId + " " + dataForm.attackersFaction);
      // console.log("defenderFactionId", defenderFactionId + " " + dataForm.defenderFaction);
      // console.log("attackerTroops", attackerTroops);
      setExecutingLabel('Attacking...');
      const data = await attack(
        user.address?.toLowerCase(),
        signature,
        Number(attackerTroops),
        controlPointId,
        attackerFactionId,
        defenderFactionId,
        attackType);

      // setAttackId(data.data.data.attackId);

      const timestamp = Number(data.data.data.timestampInSeconds);
      const attacker = data.data.data.attacker;
      const attackId = Number(data.data.data.attackId);
      const troops = Number(data.data.data.troops);
      const sig = data.data.data.signature;

      var attackTuple = {timestamp: timestamp,
                        attacker: attacker,
                        attackId: attackId,
                        quantity: troops,
                        battleType: attackType};

      // console.log("attackTuple", attackTuple);
      // console.log("sig", sig);

      const attackContract = new Contract(config.contracts.battleField, Battlefield, user.provider.getSigner());
      const tx = await attackContract.attackFaction(attackTuple, sig);
      // const receipt = await tx.wait();
      // toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      // ShowAttackConclusion();
      // console.log("receipt", receipt);

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  function PreBattleChecks()
  {
    setShowAlert(false)
    if(dataForm.attackersFaction == ''){
      setAlertMessage("Must select an attacker faction")
      setShowAlert(true)
      return;
    }

    if(attackType === 2 && attackerTroops > attackerTroopsAvailable){
      setAlertMessage("Cannot attack with more troops than you have available")
      setShowAlert(true)
      return;
    }

    if(attackType === 2 && attackerTroops > defenderTroops){
      setAlertMessage("Cannot attack with more troops than the defender has")
      setShowAlert(true)
      return;
    }

    if(attackType === 1 && attackerTroops > 3){
      setAlertMessage("Max troops for conquest attacks are 3")
      setShowAlert(true)
      return;
    }

    if(dataForm.attackersFaction == dataForm.defendersFaction){
      setAlertMessage("Cannot attack your own faction")
      setShowAlert(true)
      return;
    }

    if(attackerTroopsAvailable <= 1)
    {
      setAlertMessage("You must have at least 2 troops on the point to attack")
      setShowAlert(true)
      return;
    }

    if(defenderTroops <= 0)
    {
      setAlertMessage("Defender must have at least 1 troop")
      setShowAlert(true)
      return;
    }

    if(attackerTroops <= 0)
    {
      setAlertMessage("Must attack with atleast 1 troop")
      setShowAlert(true)
      return;
    }

    if (rdGameContext?.state === RdGameState.RESET) {
      setAlertMessage("Game has ended. Please wait until the next game begins")
      setShowAlert(true)
    }

    RealAttack();
  }
  function getDefenderTroopsInRegion(){
    controlPoint.leaderBoard.forEach(faction => {
      if(faction.name === dataForm.defendersFaction){
        // console.log("faction", faction)
        setDefenderTroops(faction.totalTroops);
        setDefenderImage(faction.image);
      }});
  }
  const CheckForKoban = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.resources, Resources, readProvider);
    const tx = await resourceContract.balanceOf(user.address?.toLowerCase(), 1);
    setKoban(Number(ethers.utils.hexValue(BigNumber.from(tx))));
  }
  const GetMaxTroops=()=>{
    const troops = attackTypeEnum.find((attackTypeEnum: any) => attackTypeEnum.id === attackType)?.maxTroops;
    return troops;
  }
  const GetDescription = () => {
    const desc = attackTypeEnum.find((attackTypeEnum: any) => attackTypeEnum.id === attackType)?.desc;
    return desc;
  }
  const forceRefresh = () => {
    // console.log("force refresh")
  }
  const displayConclusionCallback = () => {
    setDisplayConclusion(!displayConclusion);
    console.log("displayConclusion", displayConclusion)
  }

  useEffect(() => {
    if(!controlPoint) return;

    setDefenderOptions(controlPoint.leaderBoard.map((faction, index) => (
      faction.totalTroops > 0 ?
      <option style={{ background: '#272523' }} value={faction.name} key={index}>{faction.name}</option> : null)))
  }, [controlPoint])

  useEffect(() => {
    if(!dataForm.defendersFaction) return;

    setShowAlert(false)
    getDefenderTroopsInRegion()
  }, [dataForm.defendersFaction])
  
  useEffect(() => {
    refreshControlPoint();
    CheckForKoban();
    GetPlayerArmies();
  }, [])

  useEffect(() => {
    if(playerArmies.length > 0 && allFactions.length > 0 && !factionsLoaded) {
      var combinedArmiesLocal: any[] = []

      //we need to combine the playerArmies by factionId
      playerArmies.forEach((army:any) => {
        var found = combinedArmiesLocal.find(f => f.factionId === army.factionId);
        if(found === undefined) {
          combinedArmiesLocal.push({
            name: allFactions.find(f => f.id === army.factionId).name, 
            factionId: army.factionId, 
            troops: army.troops,
            image: allFactions.find(f => f.id === army.factionId).image, 
          });
        }
        else {
          found.troops += army.troops;
        }
      })
      setCombinedArmies(combinedArmiesLocal);
    }
  }, [playerArmies, allFactions])

  useEffect(() => {
    // console.log("combinedArmies changed", combinedArmies)
    if(combinedArmies.length > 0 && !factionsLoaded) {
      setAttackerOptions(combinedArmies.map((faction:any, index:number) => (
        <option 
          style={{ background: '#272523' }}
          value={faction.name}
          key={index}>
          {faction.name}</option>)
      ))
      setFactionsLoaded(true);
    }
  }, [combinedArmies]);
  
  useEffect(() => {
    if (battleAttack.length !== 0) {
      setIsExecuting(false);
    return;
    } 
  }, [battleAttack]);  

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    if (!user.address) return;

    const socket = io(`${config.urls.cmsSocket}ryoshi-dynasties/battles?walletAddress=${user.address.toLowerCase()}`);

    function onConnect() {
      setIsSocketConnected(true);
      // console.log('connected')
    }

    function onDisconnect() {
      setIsSocketConnected(false);
      // console.log('disconnected')
    }

    function onBattleAttackEvent(data:any) {
      console.log('BATTLE_ATTACK', data)
      const parsedAtack = JSON.parse(data);
      // console.log('parsedAtack', parsedAtack)
      displayConclusionCallback();
      setBattleAttack(parsedAtack);
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
    <Flex flexDirection='column' textAlign='center' justifyContent='space-around' >
      {!!user.address ? (
        <>
          {displayConclusion ? (
            <BattleConclusion
              attackerTroops={attackerTroops}
              defenderTroops={defenderTroops}
              battleAttack={battleAttack}
              displayConclusionCallback={displayConclusionCallback}
              CheckForKoban={CheckForKoban}
              attackerImage={attackerImage}
              defenderImage={defenderImage}
              attackersFaction={dataForm.attackersFaction}
              defendersFaction={dataForm.defendersFaction}
            />
          ) : (
            <div>
              <Center>
                <Flex justifyContent='center' w='90%' >
                  <Text textAlign='center' fontSize={'14px'}>Faction owners can use deployed troops to attack other factions</Text>
                </Flex>
              </Center>

              <Spacer m='4' />

              <Center>
                <VStack justifyContent='space-between'>
                  {attackerOptions.length > 0 ? (

                  <Select
                    name='attackersFaction'
                    backgroundColor='#292626'
                    w='90%'
                    value={dataForm.attackersFaction}
                    onChange={onChangeInputsAttacker}>
                    <option selected hidden disabled value="">Select Attacker</option>
                    {attackerOptions}
                  </Select>
                  ) : (
                    <Box
                      bgColor='#292626'
                      w='90%'
                      p={2}
                      rounded='md'
                      justifyContent='center'
                      textAlign='center'
                      h={10}
                      alignItems='center'
                    >
                    <Text textAlign='center' textColor={'#aaa'} fontSize={'14px'} as={"i"}>You currently have no troops deployed</Text>
                    </Box>
                  )}

                  <Select
                    name='defendersFaction'
                    backgroundColor='#292626'
                    w='90%'
                    value={dataForm.defendersFaction}
                    onChange={onChangeInputsDefender}>
                    <option selected hidden disabled value="">Select Defender</option>
                    {defenderOptions}
                  </Select>

                  {
                    dataForm.attackersFaction !== ''  ? <Text textAlign='left' fontSize={'16px'}>Troops You Deployed: {attackerTroopsAvailable}</Text>
                      : <></>
                  }


                  <NumberInput
                    defaultValue={1}
                    min={1}
                    max={GetMaxTroops()}
                    name="quantity"
                    w='90%'
                    onChange={handleChange}
                    value={attackerTroops}
                    bgColor='#292626'
                    borderRadius='10px'
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
                        isActive={attackType === 1}
                        onClick={() => setAttackType(1)}
                      >
                        Conquest
                      </RdTabButton>
                      <RdTabButton
                        isActive={attackType === 2}
                        onClick={() => setAttackType(2)}
                      >
                        Skirmish
                      </RdTabButton>
                    </Flex>
                  </Center>
                  <Text
                    as='i'>{GetDescription()}
                  </Text>
                </VStack>
              </Center>
              <Spacer m='4' />


              <Spacer m='4' />

              <Flex direction='row' justify='space-between' justifyContent='center'>
                <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
                  <HStack justify='space-between'>
                    <Box w='45'>
                      <VStack>
                        {attackerImage !== '' ?
                          <Avatar
                            boxSize={{base: '50px', sm: '100px'}}
                            objectFit="cover"
                            src={ImageService.translate(attackerImage).fixedWidth(100, 100)}
                          /> : <></>
                        }
                        <Text textAlign='left'
                              fontSize={{base: '16px', sm: '24px'}}
                        >{dataForm.attackersFaction}</Text>
                        <Text textAlign='left'
                              fontSize={{base: '12px', sm: '16px'}}
                        >Attack Strength: {attackerTroops}</Text>
                        {/* {isOwnerOfFaction
            ? <Text textAlign='left' fontSize={'16px'}>Troops Delegated: {factionTroops}</Text> : ""} */}
                      </VStack>
                    </Box>
                    <Box  w='10'>
                      <Text textAlign='left'
                            fontSize={{base: '12px', sm: '16px'}}
                      >VS</Text>
                    </Box>

                    <Box  w='45'>
                      <VStack>
                        {defenderImage !== '' ?
                          <Avatar
                            boxSize={{base: '50px', sm: '100px'}}
                            objectFit="cover"
                            src={ImageService.translate(defenderImage).fixedWidth(100, 100)}
                          /> : <></>
                        }
                        <Text textAlign='right'
                              fontSize={{base: '16px', sm: '24px'}}
                        >{dataForm.defendersFaction}</Text>
                        <Text textAlign='right'
                              fontSize={{base: '12px', sm: '16px'}}
                        >Troops stationed: {defenderTroops}</Text>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
              </Flex>
              {/* </Center> */}

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
                  <Text cursor='pointer' fontSize={'14px'} onClick={() => onOpenDailyCheckin()}>{getAttackCost()} $Koban</Text>
                  <Text fontSize={'14px'}>per troop you attack with ({getAttackCost()*attackerTroops})</Text>
                </HStack>
              </Center>
              <Flex alignContent={'center'} justifyContent={'center'}>
                <Box
                  ps='20px'>
                  <RdButton
                    minW='200px'
                    size={{base: 'md', sm: 'lg'}}
                    stickyIcon={true}
                    onClick={() => PreBattleChecks()}
                    isLoading={isExecuting}
                    disabled={isExecuting}
                    marginTop='2'
                    marginBottom='2'
                    loadingText={executingLabel}
                  >
                    {user.address ? 'Attack' : 'Connect'}
                  </RdButton>
                </Box>
              </Flex>

              <Center>
                <Flex justifyContent='space-between' w='90%' >
                  <Text fontSize={'12px'}>Your $Koban: {koban}</Text>
                </Flex>
              </Center>
            </div>
          )}
        </>
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

      <DailyCheckinModal isOpen={isOpenDailyCheckin} onClose={onCloseDailyCheckin} forceRefresh={forceRefresh}/>
    </Flex>
  )
}

export default AttackTab;