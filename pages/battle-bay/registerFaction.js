class Faction {
    constructor(factionName, addresses, owner) {
      this.factionName = factionName;
      this.addresses = addresses;
      this.owner = owner;
    }
    getDetails() {
        return this.owner+" is the owner of the " + this.factionName +" faction containing the addresses: "+ this.addresses+"<br>";
      }};


document.getElementById("editFaction").style.display = "none";
var myFaction;

function editFaction() {
    document.getElementById("factionRegistrationForm").style.display = "block";
    document.getElementById("factionNameEntry").value = myFaction.factionName;
    document.getElementById("registerButton").style.display = "none";
    document.getElementById("overlay2").style.display = "block";
}

function registerFaction()
{
    var factionName = document.getElementById("factionNameEntry").value;
    var addresses = document.getElementById("addresseslist");
    var addressesArray = [];
    for (var i = 0; i < addresses.children.length; i++) {
        addressesArray.push(addresses.children[i].id);
    }
    var faction = new Faction(factionName, addressesArray);
    console.log(faction);
    AddFaction(faction);
    myFaction = faction;

    document.getElementById("editFaction").style.display = "block";
    closeRegistrationForm();
}

function openRegistrationForm() {
    document.getElementById("factionRegistrationForm").style.display = "block";
    document.getElementById("overlay2").style.display = "block";
    document.getElementById("registerButton").style.display = "block";
}

function closeRegistrationForm() {
    document.getElementById("factionRegistrationForm").style.display = "none";
    off();
}
function off() {
    document.getElementById("overlay2").style.display = "none";
}

function addItem() {
    var adList = document.getElementById("addresseslist");
    var addresses = document.getElementById("addresses");

    //check if address is already in list
    var item = document.getElementById(addresses.value);
    if(item != null)
    {
        alert("Address already in list");
        return;
    }

    var li = document.createElement("li");
    li.classList.add("basicText");
    li.setAttribute('id', addresses.value);
    li.appendChild(document.createTextNode(addresses.value));
    adList.appendChild(li);
    addresses.value = "";
}

function removeItem() {

    var adList = document.getElementById("addresseslist");
    var addresses = document.getElementById("addresses");
    var item = document.getElementById(addresses.value);
    if(item == null)
    {
        alert("No such address is connected to this faction");
        return;
    }

    adList.removeChild(item);
}
function myFunction() {
    var x = document.getElementById("addresseslist");
    if (x.style.display === "none") {
    document.getElementById("ShowAddresses").innerHTML = "Hide Addresses";
    x.style.display = "block";
    } else {
    document.getElementById("ShowAddresses").innerHTML = "Show Addresses";
    x.style.display = "none";
    }
  }