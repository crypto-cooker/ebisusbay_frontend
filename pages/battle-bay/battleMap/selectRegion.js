deployMode = new Boolean(true);

function openForm() {
    document.getElementById("myForm").style.display = "inline-block";
    document.getElementById("troops").innerHTML = "Troops available: " + troopsAvailable;
    document.getElementById("quantity").max = troopsAvailable;
    document.getElementById("overlay2").style.display = "block";
    selectDeploy();
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    off();
}

function off() {
    document.getElementById("overlay2").style.display = "none";
}

function Apply() {
    if(deployMode){
        deployTroops();
    }
    else{
        recallTroops();
    }
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

function selectFaction() {  
    var mylist = document.getElementById("deployFactionInput");  
    selectedFaction = mylist.options[mylist.selectedIndex].text;
    displayTroopsToRecall();
}

function displayTroopsToRecall(){
    if(deployMode==true){
        return;
    }
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