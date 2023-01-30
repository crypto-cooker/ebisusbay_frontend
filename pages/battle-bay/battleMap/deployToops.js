setUpDropDown('deployFactionInput','deployFactionUl', factions, selectDeploymentFaction);
// setUpFactionDropDown("deployFactionInput", "deployFactionUl", factions, selectFaction())

function selectDeploy() {
    var deployButton = document.getElementById("deploy");
    deployButton.classList.remove("smallBtnDisabled");
    deployButton.classList.add("smallBtnSelected");

    var recallButton = document.getElementById("recall");
    recallButton.classList.remove("smallBtnSelected");
    recallButton.classList.add("smallBtnDisabled");

    document.getElementById("troops").innerHTML = "Troops available to Deploy: " + troopsAvailable;
    deployMode = true;
}

function selectRecall() {
    var recallButton = document.getElementById("recall");
    recallButton.classList.remove("smallBtnDisabled");
    recallButton.classList.add("smallBtnSelected");

    var deployButton = document.getElementById("deploy");
    deployButton.classList.remove("smallBtnSelected");
    deployButton.classList.add("smallBtnDisabled");

    document.getElementById("troops").innerHTML = "Troops available to Recall: " + GetTroopsFromFactionDeployedToThisRegion(selectedFaction);
    deployMode = false;
    displayTroopsToRecall();
}
function deployTroops() {
    let val = parseInt(document.getElementById('quantity').value);

    if(val==0){
        alert("Please enter a value greater than 0");
        return;
    }
    if(CheckFaction()){
        alert("Please select a faction to allocate your troops to");
        return;
    }
    if(CheckRegion()){
        alert("Please select a region to deploy your troops to");
        return;
    }

    if(troopsAvailable < val){
        alert("You cannot deploy more troops than you have available");
        return;
    }

    let total = "";
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        var code = deployedTroops.deployments[i].code;  
        if(code == selectedRegion + selectedFaction){  
            troopsAvailable -= val;
            document.getElementById("troops").innerHTML = "Troops available: " + troopsAvailable;
            
            console.log("Already deployed");
            deployedTroops.deployments[i].addTroops(val);
            deployedTroops.allPlayers.forEach(player => total += player.getDetails())
            document.getElementById("deploymentNotes").innerHTML = total;
            return;  
        }
    }

    troopsAvailable -= val;
    document.getElementById("troops").innerHTML = "Troops available: " + troopsAvailable;

    deployedTroops.newDeployment(selectedRegion, selectedFaction, val);
    deployedTroops.allPlayers.forEach(player => total += player.getDetails())
    document.getElementById("deploymentNotes").innerHTML = total;

    closeForm();
}

function selectDeploymentFaction(x, inputId, ulId) {  
    selectedFaction = x;
    document.getElementById(inputId).value = selectedFaction;
    document.getElementById(ulId).style.display = "none";

    console.log("selectedFaction: " + selectedFaction);
    if(deployMode==false){
        displayTroopsToRecall();
    }
}

function displayTroopsToRecall(){
    var maxToRecall = GetTroopsFromFactionDeployedToThisRegion(selectedFaction);
    document.getElementById("troops").innerHTML = "Troops deployed to "+selectedRegion +" on behalf of "+selectedFaction+ ": "+maxToRecall;
    document.getElementById("quantity").max = maxToRecall;
}

function GetTroopsFromFactionDeployedToThisRegion(faction){
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        var code = deployedTroops.deployments[i].code;  
        if(code == selectedRegion + faction){  
            return deployedTroops.deployments[i].amount;  
        }
    }
    return 0;
}

function recallTroops(){

    let val = parseInt(document.getElementById('quantity').value);
    var maxToRecall = GetTroopsFromFactionDeployedToThisRegion(selectedFaction);

    if(val==0){
        alert("Please enter a value greater than 0");
        return;
    }

    if(CheckFaction()){
        alert("Please select a faction of which you have deployed troops from in this region");
        return;
    }

    if(maxToRecall < val){
        alert("You cannot recall more troops than you have deployed");
        return;
    }

    let total = "";
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        var code = deployedTroops.deployments[i].code;  
        if(code == selectedRegion + selectedFaction)
        {  
            deployedTroops.deployments[i].amount -= val;  
            troopsAvailable += val;
            closeForm();
            return;
        }
    }

}
function setUpDropDown(inputId, ulId, factions, selectedFunction)
{
    var input, filter, ul, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(ulId);
    $(ul).empty();//clears the list

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