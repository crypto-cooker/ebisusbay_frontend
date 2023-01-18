const factions_url = "https://api.coindesk.com/v1/bpi/currentprice.json";
const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];

getAllFactions(factions_url);

var selectedFaction = "";
var troopsAvailable = 20;




const element = document.getElementById('panzoom')
const panzoom = Panzoom(element, {
    contain: 'outside',
    startScale: 0.5,
    origin: '50% 50%', 
    pinchAndPan: true
});
//cursor: move; user-select: none; touch-action: none; transform-origin: 50% 50%; 
//transition: none 0s ease 0s; transform: scale(1.0068) translate(0.971284px, 0.993243px);


// // enable mouse wheel
const parent = element.parentElement
parent.addEventListener('wheel', panzoom.zoomWithWheel);
parent.addEventListener()





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
    const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];
    factions.push(faction.factionName);
    console.log(factions);
}
function GetRegions()
{
    return regions;
}
async function getAllFactions(url)
{
    let troops = `<th>Troops Available 20</th>`;
    var factionList = document.getElementById("factionList");  
    document.getElementById("troops").innerHTML = troops;


    //completed function

    // const response = await fetch(url);
    // var data = await response.json();
    // if (response) {
    //     hideloader();
    // }
    // // ${data.bpi.USD.rate}
    // // let factions = `<th>Factions to support </th>`;

    // Object.entries(data.bpi).forEach(([key, value]) => {
    //     // console.log(`${key}: ${value}`);
    //     var ele2 = document.getElementById('buttonSpot');

    //     const button = document.createElement('button')
    //     button.innerText = `${key}`
    //     button.addEventListener('click', selectFaction)
    //     button.type = "button";
    //     button.className = "factionButton";

    //     ele2.insertAdjacentElement("beforebegin", button);
    //     // document.body.appendChild(button)
    // });


    //placeholder function
    const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];

    factions.forEach(faction => {
        var option = document.createElement("option");
        option.text = faction;
        factionList.add(option);
    });
}


