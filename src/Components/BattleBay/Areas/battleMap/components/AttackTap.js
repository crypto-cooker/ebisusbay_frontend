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
  Heading
} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfileId, getFactionsOwned} from "@src/core/api/RyoshiDynastiesAPICalls";

const AttackTap = ({ controlPoint = []}) => {

  const attackSetUp = useRef();
  const attackConclusion = useRef();
  const battleLog = useRef();
  const battleOutcome = useRef();
  const attackerOutcome = useRef();
  const defenderOutcome = useRef();
  const battleLogText = useRef();
  const [defenderTroops, setDefenderTroops] = useState(0);
  const [attackerTroops, setAttackerTroops] = useState(1)
  const handleChange = (value) => setAttackerTroops(value)

  const user = useSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const playerFactions = [];

  const [attackerOptions, setAttackerOptions] = useState([]);
  const [defenderOptions, setDefenderOptions] = useState([]);
  const defenderTroopsAvailable = 0;
  const attackerTroopsAvailable = 0;
  
  const arrayColumn = (arr, n) => arr.map(x => x[n]);
  // const defenderFactions = arrayColumn(factions.filter(faction => !faction.owned), 'faction')
  // const attackerFactions = arrayColumn(factions.filter(faction => faction.owned), 'faction')

  const [dataForm, setDataForm] = useState({
    attackersFaction: "" ?? null,
    // quantity: 0,
    defenderFaction: "" ?? null,
  })
  const onChangeInputsAttacker = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    attackerTroopsAvailable = controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops;
  }
  const onChangeInputsDefender = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    defenderTroopsAvailable = controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops;
  }

  const GetPlayerOwnedFactions = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await getProfileId(user.address.toLowerCase(), signatureInStorage);
        const data = await getFactionsOwned(res.data.data[0].profileId);
        playerFactions = data.data.data;
        // console.log('playerFactions', playerFactions);
        ShowAvailableFactions();
      } catch (error) {
        console.log(error)
      }
    }
  }


  function Battle()
  {
    if(getAttackerTroopsInRegion() <= 1)
    {
      alert("You must have at least 2 troops to attack")
      return;
    }
    setDefenderTroops(getDefenderTroops(dataForm.defenderFaction));
    Attack(attackerTroops, defenderTroops)
    attackSetUp.current.style.display = "none"
    attackConclusion.current.style.display = "block"
  }
  function Reset()
  {
    attackSetUp.current.style.display = "block"
    attackConclusion.current.style.display = "none"
  }
  function Attack(attacker, defender)
  {
    var attackersSlain = 0;
    var defendersSlain = 0;
    var attackerWins = false;
    var outcomeLog = ""

    while(attacker > 0 && defender > 0)
    {
        var attackerRoll = dice.roll();
        var defenderRoll = dice.roll();
        if(attackerRoll > defenderRoll)
        {
            defender--;
            defendersSlain++;
        }
        else
        {
            attacker--;
            attackersSlain++;
        }
        outcomeLog += "attackerRoll: " + attackerRoll + " defenderRoll: " + defenderRoll+"<br>";
    }
    if(attacker > 0)
    {
        attackerWins = true;
    }
    
    battleLogText.current.innerHTML = outcomeLog;
    battleOutcome.current.textContent = attackerWins ? "You won!" : "You lost!";
    attackerOutcome.current.textContent = dataForm.attackersFaction+" lost "+attackersSlain+" out of "+attacker+" troops";
    defenderOutcome.current.textContent = dataForm.defenderFaction+" lost "+defendersSlain+" out of "+defender+" troops";
    
    DestroyTroops(dataForm.defenderFaction, defendersSlain);
    DestroyTroops(dataForm.attackersFaction, attackersSlain);
  }
  //will need to be rewritten as a POST request
  function DestroyTroops(factionToRemoveTroopsFrom, amount)
  {
    // factions.forEach(faction => {
    //   if(faction.faction === factionToRemoveTroopsFrom)
    //   {
    //     faction.troops -= amount;
    //   }
    // });
  }
  function getDefenderTroops(defenderFaction)
  {
    
    // var troops = 0;
    // if(defenderFaction === null)
    // {
    //   return troops;
    // }
    // factions.forEach(faction => {
    //   if(faction.faction === defenderFaction)
    //   {
    //     troops = faction.troops;
    //   }
    // });
    // console.log(troops)
    // return troops;
  }
  function getAttackerTroopsInRegion()
  {
    // var troops = 0;
    // factions.forEach(faction => {
    //   if(faction.faction === dataForm.attackersFaction)
    //   {
    //     troops = faction.troops;
    //   }
    // });
    // return troops;
  }
  const getMax = () => { 
    if(attackerTroopsAvailable>=3){return 3;}
    else{return attackerTroopsAvailable;}
  }
  var dice = {
    sides: 6,
    roll: function () {
      var randomNumber = Math.floor(Math.random() * this.sides) + 1;
      return randomNumber;
    }
  }
  function showDetailedResults()
  {
    battleLog.current.style.display = battleLog.current.style.display === "block" ? "none" : "block";
  }
  const ShowAvailableFactions = async () => {
    setAttackerOptions(playerFactions.map((faction, index) => (
      <option value={faction.name} key={index}>{faction.name}</option>)
      ))
  }
  useEffect(() => {
    GetPlayerOwnedFactions();
    if(controlPoint.leaderBoard !== undefined)
    {
      
      setDefenderOptions(controlPoint.leaderBoard.map((faction, index) => (
        <option value={faction.name} key={index}>{faction.name}</option>)
        ))
    }
    
    }, [controlPoint])
 


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
            <NumberInput defaultValue={0} min={0} max={getMax} name="quantity" 
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
            <FormLabel>Troops available: {defenderTroopsAvailable}</FormLabel>
          </FormControl>
        </Box>
      </Flex>

      <div title="When attacking, a D6 roll is made for both the attacker and the defender. 
            The lower roll (ties going to defender) loses a troop. This continues until one 
              side has run out of troops">How are Attacks Calculated? (Hover for info)</div>

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