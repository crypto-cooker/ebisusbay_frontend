var selectedRegion = "None";
const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];
const regionFlags = ["pin-Southern-Trident", "pin-Dragonland", "pin-Human-Kingdoms", "pin-Dwarf-Mines"];

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
RandomizeStats();
displayWinningFactions();

function reset_troops(){
    deployedTroops = new DeployedTroops()
    document.getElementById("deploymentNotes").innerHTML = "";
    document.getElementById("troops").innerHTML = "Troops available: " + troopsAvailable;
    console.log(document.getElementById("quantity").innerHTML)
    document.getElementById("quantity").innerHTML = "";
}
function selectRegion(x)
{
    selectedRegion = x;
    document.getElementById("selectedRegion").innerHTML = selectedRegion;
    displayTop3InRegion(selectedRegion);
    setUpDropDown('defenderFactionInput','defenderFactionUL', getDefenderFactions(), selectDefenderFaction);
    setUpDropDown('attackerFactionInput','attackerFactionUl', getAttackerFactions(), selectAttackerFaction);
}
function getRegionStats(region)
{
    document.getElementById("regionName").innerHTML = region;
    document.getElementById("desc").innerHTML = "<br>" +getTroopsInRegion(region);
    // console.log("Current holder: "+getWinningFactionInRegion(region))
    // var targetdiv = document.getElementById(pin).getElementsByClassName("pin-text")[0].getElementsByClassName("head")[0];
    // console.log(targetdiv)
    // targetdiv.textContent = getWinningFactionInRegion(region);
}
function CheckFaction()
{
    var inputField = document.getElementById("deployFactionInput");  

    if(selectedFaction == "None" || inputField.innerHTML == "None"){
        console.log("No faction selected");
        return true;
    }
    else{
        return false;
    }
}
function CheckRegion()
{
    if(selectedRegion == "None"){
        console.log("No region selected");
        document.getElementById("selectedRegion").innerHTML = "Please select a faction";
        return true;
    }
    else{
        document.getElementById("selectedRegion").innerHTML = selectedRegion;
    }
}
function troops()
{
    return troopsAvailable;
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
    const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club"];
    const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];

    for (let index = 0; index < 100; index++) 
    {
        var faction = factions[Math.floor(Math.random()*factions.length)];
        var region = regions[Math.floor(Math.random()*regions.length)];

        //if deployment exists, add troops to it
        if(checkIfDeploymentExists(region, faction) == true)
        {
 
                // deployedTroops.deployments[].addTroops(val);
                // deployedTroops.allPlayers.forEach(player => total += player.getDetails())
                // document.getElementById("deploymentNotes").innerHTML = total;
        }
        else    //create new deployment
        {
            deployedTroops.newDeployment(region, faction, Math.floor(Math.random()*1000));
        }
    }
}
function getTroopsInRegion(region)
{
    deployedTroops.deployments.sort(function(b, a){return a.amount - b.amount});

    let total = "";
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(region == deployedTroops.deployments[i].region)
        {  
            total += deployedTroops.deployments[i].faction + ": "+ deployedTroops.deployments[i].amount+" troops<br>";
        }
    }

    return total;
}
function displayTop3InRegion(region)
{
    deployedTroops.deployments.sort(function(b, a){return a.amount - b.amount});
    var troopsTable = document.getElementById("troopsTable");
    while (troopsTable.firstChild) {
        troopsTable.removeChild(troopsTable.lastChild);
        }
    var rank = 1;

    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(region == deployedTroops.deployments[i].region)
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

            troopsTable.appendChild(tr);

            if(rank==3)
            {
                return;
            }
            rank++;
        }
    }
}
function getWinningFactionInRegion(region)
{
    deployedTroops.deployments.sort(function(b, a){return a.amount - b.amount});
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(region == deployedTroops.deployments[i].region)
        {  
            return deployedTroops.deployments[i].faction;
        }
    }
}
function displayWinningFactions()
{
    var pins = [];
    regionFlags.forEach(myFunction); 

    function myFunction(item, index) { 
        // console.log(item); 
        pins.push(document.getElementById(item));
    }
    
    for(var i=0; i<pins.length; i++)
    {
        var targetdiv = pins[i].getElementsByClassName("pin-text")[0].getElementsByClassName("head")[0];
        targetdiv.textContent = getWinningFactionInRegion(pins[i].title);
        var icon = pins[i].getElementsByClassName("factionIcon")[0]
        icon.src = "../images/"+getWinningFactionInRegion(pins[i].title)+".png";
    }
}
function openPanel(evt, panelName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = "smallBtnDisabled";
    }
    document.getElementById(panelName).style.display = "block";
    evt.currentTarget.className = "smallBtnSelected";
}
function RefreshInfo()
{
    displayTop3InRegion(selectedRegion);
}

const factions_url = "https://api.coindesk.com/v1/bpi/currentprice.json";

setUpFactionDropDown("deployFactionInput", "deployFactionUl", factions)
var selectedFaction = "";
var troopsAvailable = 20;

function howManyTroopsCanUserPlace()
{
    return troopsAvailable;
}
//delegate troops to a faction
function delegate(x)
{
    troopsAvailable -= x;
}
//register a faction
function AddFaction(faction)
{
    factions.push(faction.factionName);
    console.log(factions);
}

function setUpFactionDropDown(inputId, ulId, factions, selectionFunction)
{
    var input, filter, ul, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(ulId);

    factions.forEach(faction => {
        var el = document.createElement("li");
        var a = document.createElement("a");
        el.appendChild(a);
        a.innerHTML = faction;
        a.onclick = function() {selectionFunction(a.innerHTML)};
        ul.appendChild(el);
    });
    ul.style.display = "none";
    console.log(factions);
}