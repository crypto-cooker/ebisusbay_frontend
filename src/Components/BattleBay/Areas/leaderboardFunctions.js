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

export function setUpLeaderboard() {
    console.log("yooooooooooooooooo")
    RandomizeStats();
    DisplayRegions();
}

function GetRegions(){
    return regions;
}
function DisplayRegions() {
    var regions = GetRegions();
    var ul, li;
    ul = document.getElementById("regionsUL");
    li = ul.getElementsByTagName("li");

    regions.forEach(region => {
        var el = document.createElement("li");
        var a = document.createElement("a");
        el.appendChild(a);
        a.innerHTML = region;
        a.onclick = function() {selectRegion(this)};
        ul.appendChild(el);
    });
    selectRegion(li[0].getElementsByTagName("a")[0]);
}
function selectRegion(region) {
    console.log(region.innerHTML);
    ul = document.getElementById("regionsUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
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
    var troopsTable = document.getElementById("troopsTable");
    while (troopsTable.firstChild) {
        troopsTable.removeChild(troopsTable.lastChild);
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

            troopsTable.appendChild(tr);

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
}
// let myVar = 1234;
// export default;