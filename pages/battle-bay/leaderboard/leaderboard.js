const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];
function GetRegions()
{
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
DisplayRegions();

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
function displayWinners(region)
{
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