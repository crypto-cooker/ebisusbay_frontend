function Battle()
{
    Attack(attackerTroops, defenderTroops)
    
    document.getElementById("attackSetUp").style.display = "none"
    document.getElementById("attackConclusion").style.display = "block"
}
function attackAgain()
{
    //clear attack setup
    document.getElementById("troopsToAttackWithInput").value = "";
    document.getElementById("attackerFactionInput").value = "";
    document.getElementById("defenderFactionInput").value = "";
    document.getElementById('troopsToAttackWith').textContent = "";
    attackerFaction = null;
    defenderFaction = null;
    attackerTroops = null;
    defenderTroops = null;
    battleText.textContent = ""

    //show attack setup
    document.getElementById("attackSetUp").style.display = "block";
    document.getElementById("attackConclusion").style.display = "none";
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
    
    document.getElementById("outcomeLog").innerHTML = outcomeLog;
    document.getElementById("attackOutcome").textContent = attackerWins ? "You won!" : "You lost!";
    document.getElementById("attackerOutcome").textContent = attackerFaction+" lost "+attackersSlain+" out of "+attackerTroops+" troops";
    document.getElementById("defenderOutcome").textContent = defenderFaction+" lost "+defendersSlain+" out of "+defenderTroops+" troops";
    
    DestroyTroops(defenderFaction, selectedRegion, defendersSlain);
    DestroyTroops(attackerFaction, selectedRegion, attackersSlain);
}
//will need to be rewritten as a POST request
function DestroyTroops(faction, region, amount)
{
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        var code = deployedTroops.deployments[i].code;  
        if(code == region + faction)
        {  
            deployedTroops.deployments[i].amount -= amount;  
            return;
        }
    }
}
function showDetailedResults()
{
    if(document.getElementById("detailedResultsForm").style.display == "block")
    {
        document.getElementById("detailedResultsForm").style.display = "none";
        document.getElementById("resultsButton").textContent = "Show Detailed Results";
    }
    else
    {
        document.getElementById("detailedResultsForm").style.display = "block";
        document.getElementById("resultsButton").textContent = "Hide Detailed Results";
    }
}