const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];
function GetRegions()
{
    return regions;
}

function DisplayRegions() {
    var regions = GetRegions();
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("factionSelector");
    filter = input.value.toUpperCase();
    ul = document.getElementById("regionsUL");
    li = ul.getElementsByTagName("li");

    factions.forEach(faction => {
        var el = document.createElement("li");
        var a = document.createElement("a");
        el.appendChild(a);
        a.innerHTML = faction;
        a.onclick = function() {selectFaction(this)};
        ul.appendChild(el);
    });
}
DisplayRegions();