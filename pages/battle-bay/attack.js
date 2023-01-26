var attackerTroops;
var defenderTroops;

var defenderFaction;
var attackerFaction;

const input = document.getElementById('defenderFactionInput');
const battleText = document.getElementById('battleText');
// input.addEventListener('change', selectDefenderFaction);

const attackerFactionInput = document.getElementById('attackerFactionInput');
// attackerFactionInput.addEventListener('change', showMaxAttackers);

// function showMaxAttackers(e)
// {
//     attackerFaction = attackerFactionInput.value;
//     console.log(attackerFaction);
//     var maxText = document.getElementById('troopsToAttackWith');
//     var maxTextInput = document.getElementById('troopsToAttackWithInput');
//     var troops = getAttackerTroops();

//     maxText.textContent = "Troops to wager (max " +troops+")";
//     maxTextInput.max = troops;
// }
function updateValue() {
    console.log(defenderFaction);
    console.log(attackerFaction);
    console.log(attackerTroops);
    console.log(defenderTroops);

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
    updateValue();
}


var dice = {
    sides: 6,
    roll: function () {
      var randomNumber = Math.floor(Math.random() * this.sides) + 1;
      return randomNumber;
    }
  }

function Attack(attacker, defender)
{
    while(attacker > 0 && defender > 0)
    {
        var attackerRoll = dice.roll();
        var defenderRoll = dice.roll();
        if(attackerRoll > defenderRoll)
        {
            defender--;
        }
        else
        {
            attacker--;
        }
    }
    return attacker, defender;
}

function getAttackerTroops()
{
    console.log("attackerFaction: " + attackerFaction);
    console.log("selectedRegion: " + selectedRegion);

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
function removeAttackerTroops(troops)
{
    var initialTroops = getAttackerTroops();
    initialTroops -= (initialTroops - troops);
    setAttackerTroops(initialTroops);
}
function removeDefenderTroops(troops)
{
    var initialTroops = getDefenderTroops();
    initialTroops -= (initialTroops - troops);
    setDefenderTroops(initialTroops);
}
function setAttackerTroops(troops)
{
    //set the attacker troops
}
function setDefenderTroops(troops)
{
    //set the defender troops
}

function Battle()
{
    // var attacker = getAttackerTroops();
    // var defender = getDefenderTroops();

    // attacker, defender = Attack(attacker, defender)

    // removeAttackerTroops(attacker);
    // removeDefenderTroops(defender);

    // showConclusion();
    document.getElementById("attackSetUp").style.display = "none";
    document.getElementById("attackConclusion").style.display = "block";
}

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
// function selectDefenderFaction(x, inputId, ulId)
// {
//     defenderFaction = x.innerHTML;
//     defenderTroops = getDefenderTroops();

//     document.getElementById(inputId).value = defenderFaction;
//     document.getElementById(ulId).style.display = "none";

//     // updateValue();
// }

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
  function attackAgain()
  {
    document.getElementById("attackSetUp").style.display = "block";
    document.getElementById("attackConclusion").style.display = "none";
  }