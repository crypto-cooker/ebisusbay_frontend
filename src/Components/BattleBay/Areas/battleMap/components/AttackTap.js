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
} from "@chakra-ui/react";

import Button from "@src/Components/components/Button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {attack, getFactionsOwned} from "@src/core/api/RyoshiDynastiesAPICalls";
import { createSuccessfulTransactionToastContent } from '@src/utils';

//contracts
import {Contract} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Battlefield from "@src/Contracts/Battlefield.json";

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
  const [attackerTroopsAvailable, setAttackerTroopsAvailable] = useState(0);
  const [attackerOptions, setAttackerOptions] = useState([]);
  const [defenderOptions, setDefenderOptions] = useState([]);

  const handleChange = (value) => setAttackerTroops(value)

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  
  const [dataForm, setDataForm] = useState({
    attackersFaction: "" ?? null,
    // quantity: 0,
    defenderFaction: "" ?? null,
  })

  const onChangeInputsAttacker = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    setAttackerTroopsAvailable(controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops);
  }
  const onChangeInputsDefender = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    setDefenderTroops(controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops);
  }
  const GetPlayerOwnedFactions = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        // const res = await getProfileId(user.address.toLowerCase(), signatureInStorage);
        const data = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
        const playerFactions = data.data.data;
        // console.log('playerFactions', playerFactions);
        ShowAvailableFactions(playerFactions);
      } catch (error) {
        console.log(error)
      }
    }
  }
  const RealAttack = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const controlPointId = controlPoint.id;
        const attackerFactionId = controlPoint.leaderBoard.filter(faction => faction.name === dataForm.attackersFaction)[0].id;
        const defenderFactionId = controlPoint.leaderBoard.filter(faction => faction.name === dataForm.defenderFaction)[0].id;
        // console.log("controlPoint.id", controlPoint.id)
        // console.log("attackerFactionId", attackerFactionId)
        // console.log("defenderFactionId", defenderFactionId)
        // console.log("attackerTroops", Number(attackerTroops))
        const data = await attack(user.address.toLowerCase(), signatureInStorage, Number(attackerTroops), 
          controlPointId, attackerFactionId, defenderFactionId);
        
        console.log("data", data)
        //Signature, timestamp and attackId are returned
        const timestamp = Number(data.data.data.timestampInSeconds);
        const attacker = data.data.data.attacker;
        // var b = attacker.replace(/'/g, '"');
        const attackId = Number(data.data.data.attackId);
        const troops = Number(data.data.data.troops);
        const sig = data.data.data.signature;

        var attackTuple = {timestamp: timestamp, 
                          attacker: attacker, 
                          attackId: attackId, 
                          quantity: troops};
        //add check for https://testnet.cronoscan.com/address/0x878a7d4ea252cb8317e8e0dd0d29ca6e03d94b7c#writeProxyContract

        // console.log(config.contracts.attack)1683217043
        // console.log(AttackContract)//[1683217574, "0x2bc60de5833c7c7279427657ef839c06212a38bf", 59, 2]
        //0x2bc60De5833C7C7279427657ef839c06212A38bF

        const attackContract = new Contract(config.contracts.attack, Battlefield, user.provider.getSigner());

        console.log("attackTuple", attackTuple)
        console.log("signatureInStorage", signatureInStorage)

        const tx = await attackContract.attackFaction(attackTuple, sig);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        console.log('Attack completed')


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
        defenderOutcome.current.textContent = dataForm.defenderFaction+" lost "+defendersSlain+"/"+defenderTroops+" troops";
        
        setupDice(attackerDice, defenderDice);

        attackSetUp.current.style.display = "none"
        attackConclusion.current.style.display = "block"

      } catch (error) {
        console.log(error)
        toast.error(error);
      }
    }
  }
  function Battle()
  {
    setShowAlert(false)

    if(getAttackerTroopsInRegion() <= 1)
    {
      setAlertMessage("You must have at least 2 troops to attack")
      setShowAlert(true)
      return;
    }

    getDefenderTroopsInRegion(dataForm.defenderFaction);

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

    // FakeAttack(attackerTroops, defenderTroops)
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
      if(faction.name === dataForm.defenderFaction){
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
  const ShowAvailableFactions = async (playerFactions) => {
    setAttackerOptions(playerFactions.map((faction, index) => (
      <option value={faction.name} key={index}>{faction.name}</option>)
      ))
  }

  useEffect(() => {
    // console.log("controlPoint", controlPoint)
    GetPlayerOwnedFactions();
    if(controlPoint.leaderBoard !== undefined) {
      setDefenderOptions(controlPoint.leaderBoard.map((faction, index) => (
        <option value={faction.name} key={index}>{faction.name}</option>)))
    }
  }, [controlPoint])

  useEffect(() => {
    if(attackerOptions!="") {
      setShowAlert(false)
      dataForm.attackersFaction = attackerOptions[0].props.value;
    }
  }, [attackerOptions])

  useEffect(() => {
      if(defenderOptions!="") {
        dataForm.defenderFaction = defenderOptions[0].props.value;
      }
  }, [defenderOptions])

  useEffect(() => {
      if(dataForm.defenderFaction!=null) {
        // console.log("dataForm.defenderFaction", dataForm.defenderFaction)
        setShowAlert(false)
        getDefenderTroopsInRegion()
      }
  }, [dataForm.defenderFaction])

  useEffect(() => {
    if(dataForm.attackersFaction!="") {
        // console.log("dataForm.attackersFaction", dataForm.attackersFaction)
        getAttackerTroopsInRegion()
      }
  }, [dataForm.attackersFaction])
  
  useEffect(() => {
    console.log("opened attack tap")
    refreshControlPoint();
  }, [])

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
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      <div ref={attackSetUp} style={{ display: 'block'}}>
      <Box m='8px 24px 34px'>
        <p>
          If you are a faction owner, you will be able to attack other troops in the region with troops you have deployed
        </p>
      </Box>
      <Flex gap='16px'>
        <Box>
          <p>Attackers</p>
          <FormControl mb={'24px'}>
            <FormLabel>Attacker Faction:</FormLabel>
            <Select name='attackersFaction' me={2} value={dataForm.attackersFaction} onChange={onChangeInputsAttacker}>
              {attackerOptions}
            </Select>
            <FormLabel>Troops available: {attackerTroopsAvailable}</FormLabel>
          </FormControl>

          <FormControl>
            <FormLabel>Quantity:</FormLabel>
            <NumberInput defaultValue={0} min={0} max={3} name="quantity" 
              onChange={handleChange}
              value={attackerTroops} type ='number'>
             <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Box>

        <Box>
          <p>Defenders</p>
          <FormControl mb={'24px'}>
            <FormLabel>Select A Faction to attack:</FormLabel>
            <Select name='defenderFaction' me={2} value={dataForm.defenderFaction} onChange={onChangeInputsDefender}>
              {defenderOptions}
            </Select>
            <FormLabel>Troops available: {defenderTroops}</FormLabel>
          </FormControl>
        </Box>
      </Flex>

      <div title="When attacking, a D6 roll is made for both the attacker and the defender. 
            The lower roll (ties going to defender) loses a troop. This continues until one 
              side has run out of troops">How are Attacks Calculated? (Hover for info)</div>

        <Flex justify={"center"} align={"center"} style={{ marginTop: '16px' }}>
          <Box p='3'>
            {showAlert && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>{alertMessage}</AlertTitle>
            </Alert>)}
          </Box>
        </Flex>
        <div style={{ display: 'flex', marginTop: '16px' }}>
          <Button type="legacy"
            onClick={Battle}
            // onClick={processCreateListingRequest}
            // isLoading={executingCreateListing}
            // disabled={executingCreateListing}
            className="flex-fill">
            Attack
          </Button>
        </div>
      </div>

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