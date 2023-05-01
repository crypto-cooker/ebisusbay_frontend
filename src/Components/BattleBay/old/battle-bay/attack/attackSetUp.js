// const battleText = document.getElementById('battleText');
var attackerTroops;
var defenderTroops;
var attackerFaction;
var defenderFaction;

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