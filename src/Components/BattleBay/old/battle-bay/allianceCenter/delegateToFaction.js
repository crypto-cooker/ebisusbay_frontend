function openDelegateForm() {
    document.getElementById("delegateForm").style.display = "block";
    document.getElementById("overlay2").style.display = "block";
    document.getElementById("factionUL").style.display = "none";
    GetAllFactions();
    document.getElementById("quantity").max = troopsAvailable;
    document.getElementById("troopsAvailable").innerHTML = "Troops Available: "+ howManyTroopsCanUserPlace();
}

function closeDelegateForm() {
    document.getElementById("delegateForm").style.display = "none";
    off();
}
function off() {
    document.getElementById("overlay2").style.display = "none";
}

function filterFactions() {
    document.getElementById("factionUL").style.display = "block";

    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("factionSelector");
    filter = input.value.toUpperCase();
    ul = document.getElementById("factionUL");
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
}
function selectFaction(x)
{
    var selectedFac = x.innerHTML;
    console.log("selectFaction "+selectedFac);
    document.getElementById("factionSelector").value = selectedFac;

    document.getElementById("factionUL").style.display = "none";
}

function DelegateTroops() {
    let val = parseInt(document.getElementById('troopsToDeligate').value);
    delegate(val);
    closeDelegateForm();
}

function GetAllFactions()
{
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("factionSelector");
    filter = input.value.toUpperCase();
    ul = document.getElementById("factionUL");
    li = ul.getElementsByTagName("li");

    //placeholder function
    const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];

    factions.forEach(faction => {
        var el = document.createElement("li");
        var a = document.createElement("a");
        el.appendChild(a);
        a.innerHTML = faction;
        a.onclick = function() {selectFaction(this)};
        ul.appendChild(el);
    });
}