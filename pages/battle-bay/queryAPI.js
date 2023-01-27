const factions_url = "https://api.coindesk.com/v1/bpi/currentprice.json";
const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];
// const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];

// getAllFactions(factions_url);
setUpFactionDropDown("deployFactionInput", "deployFactionUl", factions)
var selectedFaction = "";
var troopsAvailable = 20;



function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

function howManyTroopsCanUserPlace()
{
    return troopsAvailable;
}
function howManyTroopsDoesUserHave()
{
    return troopsAvailable;
}
function howManyTroopsHasUserDeployed()
{
    return 0;
}
function delegate(x)
{
    troopsAvailable -= x;
}
function AddFaction(faction)
{
    // const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];
    factions.push(faction.factionName);
    console.log(factions);
}
function GetRegions()
{
    return regions;
}
async function getAllFactions(url)
{

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