var selectedRegion = "None";

class Deployment {
    constructor(region, faction, amount) {
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
}
function getRegionStats(region)
{
    document.getElementById("regionName").innerHTML = region;
    document.getElementById("desc").innerHTML = "<br>" +getTroopsInRegion(region);
}
function CheckFaction()
{
    var mylist = document.getElementById("factionList");  

    if(selectedFaction == "None" || mylist.selectedIndex==0){
        console.log("No faction selected");
        // document.getElementById("selectedFaction").innerHTML = "Please select a faction";
        return true;
    }
    else{
        // document.getElementById("selectedFaction").innerHTML = "Selected Faction: " + selectedFaction;
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

$('.maparea').maphilight({ 
    fill: true,
    fillColor: 'FFFFFF',
    fillOpacity: 0.2,

    stroke: true,
    strokeColor: 'ff0000',
    strokeOpacity: 1,
    strokeWidth: 3,

    // fade in the shapes on mouseover
    fade: true,
    // always show the hilighted areas
    alwaysOn: false,
    // never show the hilighted areas
    neverOn: false,

    groupBy: false,
    wrapClass: true,
    // apply a shadow to the shape
    shadow: false,
    shadowX: 0,
    shadowY: 0,
    shadowRadius: 6,
    shadowColor: '000000',
    shadowOpacity: 0.8,
    // Can be 'outside', 'inside', or 'both'.
    shadowPosition: 'outside',
    // Can be 'stroke' or 'fill'
    shadowFrom: false,
});



// var $wrapper = $("#scaleable-wrapper");

// $wrapper.resizable({
  
// });