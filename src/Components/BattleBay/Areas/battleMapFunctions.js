var selectedRegion = "None";
const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];
const regionFlags = ["pin-Southern-Trident", "pin-Dragonland", "pin-Human-Kingdoms", "pin-Dwarf-Mines"];
const deployMode = new Boolean(true);
var selectedFaction = "";
var troopsAvailable = 20;
var defenderFactionInput;

export function holdRefs(defenderFactionInputRef )
{
    console.log("holding refs")
    defenderFactionInput = defenderFactionInputRef;
}

var attackerTroops;
var defenderTroops;
var attackerFaction;
var defenderFaction;

//form that pops up when you click on a region
export function openForm() {
    document.getElementById("myForm").style.display = "inline-block";
    document.getElementById("troops").innerHTML = "Troops available: " + troopsAvailable;
    document.getElementById("quantity").max = troopsAvailable;
    document.getElementById("overlay2").style.display = "block";
    selectDeploy();
}
function closeForm() {
    document.getElementById("myForm").style.display = "none";
    off();
}
export function off() {
    document.getElementById("overlay2").style.display = "none";
}
function Apply() {
    if(deployMode){
        deployTroops();
    }
    else{
        recallTroops();
    }
}



function reset_troops(){
    deployedTroops = new DeployedTroops()
    document.getElementById("deploymentNotes").innerHTML = "";
    document.getElementById("troops").innerHTML = "Troops available: " + troopsAvailable;
    console.log(document.getElementById("quantity").innerHTML)
    document.getElementById("quantity").innerHTML = "";
}
export 
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
            deployedTroops.newDeployment(region, faction, Math.floor(Math.random()*10));
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
function displayTop3InRegion(region, troopsTableRef)
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
        var targetdiv = pins[i].getElementsByClassName("pinText")[0].getElementsByClassName("head")[0];
        targetdiv.textContent = getWinningFactionInRegion(pins[i].title);
        var icon = pins[i].getElementsByClassName("factionIcon")[0]
        icon.src = "/img/battle-bay/"+getWinningFactionInRegion(pins[i].title)+".png";
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
//from testing async
// const factions_url = "https://api.coindesk.com/v1/bpi/currentprice.json";
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

// #region attackSetUp.js
function updateValue() {
    battleText = document.getElementById('battleText');

    if(defenderFaction != null && attackerFaction != null && attackerTroops != null && defenderTroops != null)
    {
        battleText.textContent = "Attack "+ defenderFaction + " " + defenderTroops +" Troops with " + attackerTroops + "Troops from " + attackerFaction;
    }
}
function setUpDropDown(inputId, ulId, factions, selectedFunction)
{
    var input, filter, ul, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(ulId);
    $(ul).empty();//clears the list

    factions.forEach(faction => {
        var el = document.createElement("li");
        var a = document.createElement("a");
        el.appendChild(a);
        a.innerHTML = faction;
        a.onclick = function() {
            selectedFunction(faction, inputId, ulId)
        };
        ul.appendChild(el);
    });
    ul.style.display = "none";
}
function selectDefenderFaction(x, inputId, ulId)
{
    defenderFaction = x;
    defenderTroops = getDefenderTroops();

    document.getElementById(inputId).value = defenderFaction;
    document.getElementById(ulId).style.display = "none";
    updateValue();
}
function selectAttackerFaction(x, inputId, ulId)
{
    attackerFaction = x;
    attackerTroops = getAttackerTroops();

    document.getElementById(inputId).value = attackerFaction;
    document.getElementById(ulId).style.display = "none";

    var maxText = document.getElementById('troopsToAttackWith');
    var maxTextInput = document.getElementById('troopsToAttackWithInput');

    maxText.textContent = "Troops to wager (max " +attackerTroops+")";
    maxTextInput.max = attackerTroops;
    maxTextInput.value = attackerTroops;
    updateValue();
}
function getAttackerTroops()
{
    // console.log("attackerFaction: " + attackerFaction);
    // console.log("selectedRegion: " + selectedRegion);

    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(selectedRegion == deployedTroops.deployments[i].region && 
            deployedTroops.deployments[i].faction == attackerFaction)
        {  
            console.log("troops: " + deployedTroops.deployments[i].amount);
            return deployedTroops.deployments[i].amount;
        }
    }
    return factionsInRegion;
}
function getDefenderTroops()
{
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(selectedRegion == deployedTroops.deployments[i].region && deployedTroops.deployments[i].faction == defenderFaction)
        {  
            return deployedTroops.deployments[i].amount;
        }
    }
}
//currently, this returns all factions in this region for testing purposes, in the future it will only return those that the wallet owns
function getAttackerFactions()
{
    var factionsInRegion = [];
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(selectedRegion == deployedTroops.deployments[i].region && 
            // deployedTroops.deployments[i].faction != getAttackerFactions() && 
                !factionsInRegion.includes(deployedTroops.deployments[i].faction))
        {  
            factionsInRegion.push(deployedTroops.deployments[i].faction);
        }
    }
    return factionsInRegion;
}
function getDefenderFactions()
{
    var factionsInRegion = [];
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(selectedRegion == deployedTroops.deployments[i].region && 
            // deployedTroops.deployments[i].faction != getAttackerFactions() && 
                !factionsInRegion.includes(deployedTroops.deployments[i].faction))
        {  
            factionsInRegion.push(deployedTroops.deployments[i].faction);
        }
    }
    return factionsInRegion;
}
function filterFactions(inputId, ulId) {
    document.getElementById(ulId).style.display = "block";

    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(ulId);
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) 
    {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
    // console.log("filterFactions");
}
//#endregion