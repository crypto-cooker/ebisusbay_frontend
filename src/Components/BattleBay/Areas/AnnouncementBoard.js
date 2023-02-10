import React, {useEffect, useRef} from 'react';
import './BattleBay.module.scss';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tabs,
  TabList,
  Heading,
} from '@chakra-ui/react';

const AnnouncementBoard = ({onBack}) => {
  const regionsRef = useRef();
  const troopsTableRef = useRef();

  useEffect(() => {
    console.log("this is from leaderboard useEffect")
    setUpLeaderboard();
  });
  //#region  functions
  const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];
  const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club"];
  class Deployment {
      constructor(region, faction, amount, deploymentOwner) {
        this.code = region + faction;
        this.region = region;
        this.faction = faction;
        this.amount = amount;
      }
      addTroops(amount) {
          this.amount += amount;
        }
      getDetails() {
          return "You have deployed " + this.amount +" troops on behalf of "+ this.faction +" to " + this.region + "<br>";
        }};
  class DeployedTroops {
      constructor(){
        this.deployments = []
      }
      newDeployment(region, faction, amount){
        let d = new Deployment(region, faction, amount)
        this.deployments.push(d)
        return d
      }
      get allPlayers(){
        return this.deployments
      }
      get numberOfPlayers(){
          return this.deployments.length
      }
      get totalTroops(){
          let total = 0
          this.deployments.forEach(d => total += d.amount)
          console.log(total)
          return total
      }
    }
  let deployedTroops = new DeployedTroops()

  function setUpLeaderboard() {
      RandomizeStats();
      DisplayRegions();
  }

  function GetRegions(){
      return regions;
  }
  function DisplayRegions() {
      var regions = GetRegions();
      while (regionsRef.current.firstChild) {
        regionsRef.current.removeChild(regionsRef.current.lastChild);
          }

      var li = regionsRef.current.getElementsByTagName("li");

      regions.forEach(region => {
          var el = document.createElement("li");
          el.classList.add("tab");
          var a = document.createElement("a");
          el.appendChild(a);
          a.innerHTML = region;
          a.onclick = function() {selectRegion(this)};
          regionsRef.current.appendChild(el);
      });
      selectRegion(li[0].getElementsByTagName("a")[0]);
  }
  function selectRegion(region) {
      console.log(region.innerHTML + " selected");
      var li = regionsRef.current.getElementsByTagName("li");

      for (var i = 0; i < li.length; i++) {
          if(li[i].classList.contains("active"))
          {
              li[i].classList.remove("active");
          }
      }
      region.parentElement.classList.add("active");
      displayWinners(region);
  }
  function displayWinners(region){
      deployedTroops.deployments.sort(function(b, a){return a.amount - b.amount});
      while (troopsTableRef.current.firstChild) {
        troopsTableRef.current.removeChild(troopsTableRef.current.lastChild);
          }

      var rank = 1;

      for(var i=0; i<deployedTroops.deployments.length; i++)  
      {  
          if(region.innerHTML == deployedTroops.deployments[i].region)
          {  
              var tr = document.createElement("tr");

              var tdRank = document.createElement("td");
              tdRank.classList.add("text-center");
              tdRank.scope = "row";
              tdRank.innerHTML = rank;
              tr.appendChild(tdRank);

              var tdFaction = document.createElement("td");
              tdFaction.classList.add("text-center");
              tdFaction.scope = "row";
              tdFaction.innerHTML = deployedTroops.deployments[i].faction;
              tr.appendChild(tdFaction);

              var tdTroops = document.createElement("td");
              tdTroops.classList.add("text-center");
              tdTroops.scope = "row";
              tdTroops.innerHTML = deployedTroops.deployments[i].amount;
              tr.appendChild(tdTroops);

              troopsTableRef.current.appendChild(tr);

              rank++;
          }
      }
  }
  function RandomizeStats()
  {
      function checkIfDeploymentExists(region, faction)
      {
          for(var i=0; i<deployedTroops.deployments.length; i++)  
          {  
              var code = deployedTroops.deployments[i].code;  
              if(code == region + faction){  
                  return true;  
              }
          }
          return false;
      }

      for (let index = 0; index < 100; index++) 
      {
          var faction = factions[Math.floor(Math.random()*factions.length)];
          var region = regions[Math.floor(Math.random()*regions.length)];

          //if deployment exists, add troops to it
          if(checkIfDeploymentExists(region, faction) == true)
          {
          }
          else    //create new deployment
          {
              deployedTroops.newDeployment(region, faction, Math.floor(Math.random()*10));
          }
      }
      console.log(deployedTroops.deployments);
  }
  //#endregion
    
  return (
    <section className="gl-legacy container">
      <button className="btn" onClick={onBack}>Back to Village Map</button>
      <p className="text-center"></p>
    <div class="row justify-content-center">
   
    <div class="col-6">
    <div className="row">
            <div className="col-12 col-lg-7 text-center text-lg-start">
                <Heading>Leaderboard</Heading>
            </div>
            <div>
                <ul id="regionsUL" ref={regionsRef} className="activity-filter">
                </ul>
            </div>
            <div className="mt-4 table-responsive"></div>
        </div>
      <TableContainer>
      <Table variant='simple'>
      <Thead>
        <Tr>
          <Th className='text-center'>Rank</Th>
          <Th className='text-center'>Faction</Th>
          <Th className='text-center'>Troops</Th>
        </Tr>
      </Thead>
        {/* {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td>{val.age}</td>
              <td>{val.gender}</td>
            </tr>
          )
        })} */}
        <Tbody id="troopsTable" ref={troopsTableRef}> </Tbody>
      </Table>
      </TableContainer>
    </div>

    <div class="col-6">
      <h2 className='chakra-heading css-1dklj6k'> AnnouncementBoard </h2>
      <p className='text-break mb-4'>Recent Game Changes, Patches, etc</p>
      <div>
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </div>
    </div>
    
    </div>
    </section>
  )
};


export default AnnouncementBoard;