import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  FormControl, 
  FormLabel, 
  NumberInput, 
  NumberInputField,
  NumberInputStepper, 
  NumberIncrementStepper, 
  NumberDecrementStepper, 
  Select ,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  Image,
  Grid,
  GridItem,
  VStack,
  Center,
  Text,
  Spacer,
} from "@chakra-ui/react";

import Button from "@src/Components/components/Button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {attack, getFactionsOwned, getProfileArmies} from "@src/core/api/RyoshiDynastiesAPICalls";
import { createSuccessfulTransactionToastContent } from '@src/utils';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

//contracts
import {Contract, ethers, BigNumber} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Battlefield from "@src/Contracts/Battlefield.json";
import Resources from "@src/Contracts/Resources.json";
import {io} from "socket.io-client";

//sockets
// import { socket } from '@src/socket';
// import { ConnectionState } from 'src/Components/BattleBay/Areas/sockets/ConnectionState';
// import { ConnectionManager } from 'src/Components/BattleBay/Areas/sockets/ConnectionManager.js';
// import { Events } from 'src/Components/BattleBay/Areas/sockets/Events.js';

//filter player armies that are deployed to controlpoint id and show the list of factiions that you are supporting there

const AttackTap = ({ controlPoint = [], refreshControlPoint}) => {

  const config = appConfig();
  const user = useSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();

  const attackSetUp = useRef();
  const attackConclusion = useRef();
  const battleLog = useRef();
  const battleOutcome = useRef();
  const attackerOutcome = useRef();
  const defenderOutcome = useRef();
  const battleLogText = useRef();

  const [defenderTroops, setDefenderTroops] = useState(0);
  const [attackerTroops, setAttackerTroops] = useState(0);
  const [attackerTroopsAvailable, setAttackerTroopsAvailable] = useState(1);
  const [attackerOptions, setAttackerOptions] = useState([]);
  const [defenderOptions, setDefenderOptions] = useState([]);

  const [allFactions, setAllFactions] = useState([]);
  const [factionsLoaded, setFactionsLoaded] = useState(false);
  const [playerArmies, setPlayerArmies] = useState([]);
  const [combinedArmies, setCombinedArmies] = useState([]);
  const [isOwnerOfFaction, setIsOwnerOfFaction] = useState(false);
  const [playerFaction, SetPlayerFaction] = useState([]);
  const [factionTroops, setFactionTroops] = useState(0);

  const handleChange = (value) => setAttackerTroops(value)

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //contract interactions
  const [koban, setKoban] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Attacking...');

  //sockets
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);

  
  const [dataForm, setDataForm] = useState({
    attackersFaction: "" ?? null,
    // quantity: 0,
    defendersFaction: "" ?? null,
  })

  const CheckIfAttackerFactionIsOwnedByPlayer = async () => {
      setIsOwnerOfFaction(dataForm.attackersFaction == playerFaction[0].name);
  }
  const GetPlayerArmies = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getProfileArmies(user.address.toLowerCase(), signatureInStorage);
        setPlayerArmies(
          data.data.data.filter(army => army.controlPointId == controlPoint.id)
        );
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    console.log('dataForm', dataForm);
  }, [dataForm])

  const onChangeInputsAttacker = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    console.log('combinedArmies', combinedArmies);
    console.log('e.target.value', e.target.value);
    setAttackerTroopsAvailable(combinedArmies.filter(faction => faction.name === e.target.value)[0].troops);
  }
  const onChangeInputsDefender = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    setDefenderTroops(controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops);
  }
  const GetPlayerOwnedFaction = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
        SetPlayerFaction(data.data.data);
        console.log('data.data.data', data.data.data);
        setFactionTroops(data.data.data[0].troops);
      } catch (error) {
        console.log(error)
      }
    }
  }
  const CheckForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.resources, Resources, readProvider);
    const tx = await resourceContract.isApprovedForAll(user.address.toLowerCase(), config.contracts.battleField);
    return tx;
  }
  const RealAttack = async () => {
    setIsExecuting(true);
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {

        //check for approval
        const approved = await CheckForApproval();

        if(koban < 50){
          toast.error("You need at least 50 Koban to attack")
          return;
        }

        if(!approved){
          toast.error("Please approve the contract to spend your resources")
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
        // console.log("signatureInStorage", signatureInStorage);

        setExecutingLabel('Attacking...');
        const data = await attack(
          user.address.toLowerCase(), 
          signatureInStorage, 
          Number(attackerTroops), 
          controlPointId, 
          attackerFactionId, 
          defenderFactionId);

        console.log("data", data);
        
        const timestamp = Number(data.data.data.timestampInSeconds);
        const attacker = data.data.data.attacker;
        const attackId = Number(data.data.data.attackId);
        const troops = Number(data.data.data.troops);
        const sig = data.data.data.signature;

        var attackTuple = {timestamp: timestamp, 
                          attacker: attacker, 
                          attackId: attackId, 
                          quantity: troops};

        const attackContract = new Contract(config.contracts.battleField, Battlefield, user.provider.getSigner());
        const tx = await attackContract.attackFaction(attackTuple, sig);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        console.log("receipt", receipt);
        // ShowAttackConclusion();

      } catch (error) {
        if(error.response !== undefined) {
          console.log(error)
          toast.error(error.response.data.error.metadata.message)
        }
        else {
          toast.error(error);
        }
      }
      setIsExecuting(false);
  }
  }
  function ShowAttackConclusion(){
    var attackersAlive = Number(attackerTroops);
    var attackersSlain = 0;
    var defendersSlain = 0;
    var outcomeLog = ""
    var attackerDice = data.data.data[0].diceScores1;
    var defenderDice = data.data.data[0].diceScores2;

    for(var i = 0; i < attackerDice.length; i++)
    {
      if(attackerDice[i] <= defenderDice[i])
      {
        attackersAlive--;
        attackersSlain++;
        console.log("attacker dies")
      }
      else
      {
        defendersSlain++;
      }

      outcomeLog += "Attacker: " + attackerDice[i] + " Defender: " + defenderDice[i]+"<br>";
    }

    battleLogText.current.innerHTML = outcomeLog;
    battleOutcome.current.textContent = attackersAlive>0 ? "You won!" : "You lost!";
    attackerOutcome.current.textContent = dataForm.attackersFaction+" lost "+attackersSlain+"/"+ Number(attackerTroops)+" troops";
    defenderOutcome.current.textContent = dataForm.defendersFaction+" lost "+defendersSlain+"/"+defenderTroops+" troops";
    
    setupDice(attackerDice, defenderDice);

    attackSetUp.current.style.display = "none"
    attackConclusion.current.style.display = "block"
  }
  function PreBattleChecks()
  {
    setShowAlert(false)

    if(attackerTroopsAvailable <= 1)
    {
      setAlertMessage("You must have at least 2 troops to attack")
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

    RealAttack();
  }
  function Reset()
  {
    refreshControlPoint();
    attackSetUp.current.style.display = "block"
    attackConclusion.current.style.display = "none"
  }
  function getDefenderTroopsInRegion(){
    controlPoint.leaderBoard.forEach(faction => {
      if(faction.name === dataForm.defendersFaction){
        setDefenderTroops(faction.totalTroops);
      }});
  }
  function getAttackerTroopsInRegion(){
    controlPoint.leaderBoard.forEach(faction => {
      if(faction.name === dataForm.attackersFaction){
        setAttackerTroopsAvailable(faction.totalTroops);
      }});
  }
  function showDetailedResults()
  {
    battleLog.current.style.display = battleLog.current.style.display === "block" ? "none" : "block";
  }
  // const ShowAvailableFactions = async (playerFactions) => {
  //   setAttackerOptions(playerFactions.map((faction, index) => (
  //     <option value={faction.name} key={index}>{faction.name}</option>)
  //     ))
  // }
  const CheckForKoban = async () => {
    console.log("CheckForKoban")
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.resources, Resources, readProvider);
    const tx = await resourceContract.balanceOf(user.address.toLowerCase(), 1);
    setKoban(Number(ethers.utils.hexValue(BigNumber.from(tx))));
  }

  useEffect(() => {
    console.log("controlPoint changed")
    if(controlPoint.leaderBoard !== undefined) {
      
      setAllFactions(controlPoint.leaderBoard);
      setDefenderOptions(controlPoint.leaderBoard.map((faction, index) => (
        faction.totalTroops > 0 ?
        <option value={faction.name} key={index}>{faction.name}</option>
        : null)))
    }
  }, [controlPoint])

  useEffect(() => {
    if(attackerOptions!="") {
      setShowAlert(false)
      dataForm.attackersFaction = attackerOptions[0].props.value;
    }
  }, [])

  useEffect(() => {
      if(defenderOptions!="") {
        dataForm.defendersFaction = defenderOptions[0].props.value;
      }
  }, [defenderOptions])

  useEffect(() => {
      if(dataForm.defendersFaction!=null) {
        setShowAlert(false)
        getDefenderTroopsInRegion()
      }
  }, [dataForm.defendersFaction])

  useEffect(() => {
    if(dataForm.attackersFaction!="") {
        // console.log("dataForm.attackersFaction", dataForm.attackersFaction)
        getAttackerTroopsInRegion()
        CheckIfAttackerFactionIsOwnedByPlayer()
      }
  }, [dataForm.attackersFaction])
  
  useEffect(() => {
    refreshControlPoint();
    CheckForKoban();
    GetPlayerOwnedFaction();
    GetPlayerArmies();
  }, [])

  useEffect(() => {
    if(playerArmies.length > 0 && allFactions.length > 0 && !factionsLoaded) {
      var combinedArmiesLocal = [];

      //we need to combine the playerArmies by factionId
      playerArmies.forEach((army, index) => {
        var found = combinedArmiesLocal.find(f => f.factionId === army.factionId);
        if(found === undefined) {
          combinedArmiesLocal.push({name: allFactions.find(f => f.id === army.factionId).name, 
            factionId: army.factionId, troops: army.troops});
        }
        else {
          found.troops += army.troops;
        }
      })

      setCombinedArmies(combinedArmiesLocal);
    }
  }, [playerArmies, allFactions])

  useEffect(() => {
    if(combinedArmies.length > 0 && !factionsLoaded) {
      setAttackerOptions(combinedArmies.map((faction, index) => (
        <option 
          value={faction.name}
          key={index}>
          {faction.name}</option>)
      ))
      setFactionsLoaded(true);
    }
  }, [combinedArmies]);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    const socket = io('wss://testcms.ebisusbay.biz/socket/ryoshi-dynasties/battles?walletAddress=0x2bc60de5833c7c7279427657ef839c06212a38bf');

    function onConnect() {
      setIsSocketConnected(true);
      console.log('connected')
    }

    function onDisconnect() {
      setIsSocketConnected(false);
      console.log('disconnected')
    }

    function onBattleAttackEvent(data) {
      console.log('BATTLE_ATTACK', data)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('BATTLE_ATTACK', onBattleAttackEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('BATTLE_ATTACK', onBattleAttackEvent);
    };
  }, []);


  const [att, setAtt] = useState([])
  const [def, setDef] = useState([])

  function setupDice(attackerDice, defenderDice) {
    attackerDice.length = Math.min(attackerDice.length, 3);
    defenderDice.length = Math.min(defenderDice.length, 3);
    
    // var diceRolls = [5,6,2]
    setAtt(
      attackerDice.map((i) => (<Image
          borderRadius='full'
          align={'center'}
          objectFit='cover'
          boxSize='200px'
          src = {'img/battle-bay/dice/dice_'+i+'.gif'}
        />))
      )
    // diceRolls = [3,1]
    setDef(
      defenderDice.map((i) => (<Image
        borderRadius='full'
        align={'center'}
        objectFit='cover'
        boxSize='200px'
        src = {'img/battle-bay/dice/dice_'+i+'.gif'}
      />))
    )
  }

  return (
    <Flex flexDirection='column' textAlign='center' justifyContent='space-around' >

      <Center>
        <Flex justifyContent='center' w='90%' >
          <Text textAlign='center' fontSize={'14px'}>Faction owners can use deployed troops to attack other factions</Text>
        </Flex>
      </Center>

      <Spacer m='4' />

      <Center>
        <Flex justifyContent='space-between' w='90%' >
          <Text textAlign='left' fontSize={'16px'}> Select a Faction to attack:</Text>
          <Text textAlign='right' fontSize={'16px'}>Attacker Strength (1-3):</Text>
        </Flex>
      </Center>
      

      <Center>
        <Flex justifyContent='space-between' w='90%' >
          <Select 
            name='attackersFaction'
            backgroundColor='#292626'
            w='40%' 
            me={2} 
            value={dataForm.attackersFaction} 
            onChange={onChangeInputsAttacker}>
            {attackerOptions}
          </Select>

          <NumberInput 
            align='right'
            defaultValue={1} 
            min={1} 
            max={3} 
            name="quantity" 
            w='20%'
            onChange={handleChange}
            value={attackerTroops} 
            type ='number'
            bgColor='#292626'
            borderRadius='10px'
            >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Select 
            name='defendersFaction'
            backgroundColor='#292626'
            w='40%' 
            me={2} 
            value={dataForm.defendersFaction} 
            onChange={onChangeInputsDefender}>
            {defenderOptions}
          </Select>
        </Flex>
      </Center>
     
      <Spacer m='4' />

      {/* VS */}
      <Center>
        <Flex justifyContent='space-between' w='90%' >
          <Box>
            <Text textAlign='left' fontSize={'24px'}>{dataForm.attackersFaction}</Text>
            <Text textAlign='left' fontSize={'16px'}>Troops You Deployed: {attackerTroopsAvailable}</Text>
            {/* {isOwnerOfFaction 
            ? <Text textAlign='left' fontSize={'16px'}>Troops Delegated: {factionTroops}</Text> : ""} */}
            
            <Text textAlign='left' fontSize={'16px'}>Attack Strength: {attackerTroops}</Text>
          </Box>
          
          <Text textAlign='left' fontSize={'16px'}>VS</Text>

          <Box>
            <Text textAlign='right' fontSize={'24px'}>{dataForm.defendersFaction}</Text>
            <Text textAlign='right' fontSize={'16px'}>Troops deployed: {defenderTroops}</Text>
          </Box>
        </Flex>
      </Center>

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
        
        <Text fontSize={'14px'}>Costs 50 $Koban</Text>
        <Flex alignContent={'center'} justifyContent={'center'}>
        <Box
              ps='20px'>
              <RdButton
                w='200px'
                fontSize={{base: 'xl', sm: '2xl'}}
                stickyIcon={true}
                onClick={() => PreBattleChecks()}
                isLoading={isExecuting}
                disabled={isExecuting}
                marginTop='2'
                marginBottom='2'
              >
                {user.address ? (
                  <>{isExecuting ? executingLabel : 'Attack'}</>
                ) : (
                  <>Connect</>
                )}
              </RdButton>
            </Box>
        </Flex>

        <Center>
          <Flex justifyContent='space-between' w='90%' >
            <Text fontSize={'12px'}>Your $Koban: {koban}</Text>
            <Text fontSize={'12px'} title="When attacking, a D6 roll is made for both the attacker and the defender. 
                The lower roll (ties going to defender) loses a troop. This continues until one 
                  side has run out of troops">How are Attacks Calculated? (Hover for info)</Text>
          </Flex>
        </Center>

      <div ref={attackConclusion} style={{ display: 'none'}}>
        <div class="container">
          <Heading ref={battleOutcome} >Victory!</Heading>
          <Grid
        templateAreas={`"att def"`}
        gridTemplateColumns={'1fr 1fr'}
        h='200px'
        gap='1'
        color='blackAlpha.700'
        fontWeight='bold'
      >
        <GridItem pl='2'  area={'att'}>
          <VStack spacing='-180px'>{att}</VStack>
        </GridItem>
        <GridItem pl='2'  area={'def'}>
        <VStack spacing='-180px'>{def}</VStack>
        </GridItem>

      </Grid>
          <div class="row">
            <Box >
              <p style={{textAlign:'left'}}>Attackers</p>
              <label class = "basicText" ref={attackerOutcome}>This is the attacker outcome</label>
            </Box>
            <div class="column border-left">
            <p style={{textAlign:'left'}}>Defenders</p>
              <label class = "basicText" ref={defenderOutcome}> This is the defender outcome</label>
            </div>
          </div>
          <Flex gap='16px'>
            <Button type="legacy"
              onClick={Reset}
              // onClick={processCreateListingRequest}
              // isLoading={executingCreateListing}
              // disabled={executingCreateListing}
              className="flex-fill">
              Attack Again
            </Button>
            <Button type="legacy"
              onClick={showDetailedResults}
              // onClick={processCreateListingRequest}
              // isLoading={executingCreateListing}
              // disabled={executingCreateListing}
              className="flex-fill">
              See detailed results
            </Button>
            </Flex>
        </div>
        <div ref={battleLog} style={{display: 'none', overflowY:'scroll', height:'300px'}}>
        <form class="form-container">
          <Heading class = "basicText" id="">Results:</Heading>
          <p ref={battleLogText}></p>
        </form>
      </div>
      </div>

    </Flex>
  )
}

export default AttackTap;