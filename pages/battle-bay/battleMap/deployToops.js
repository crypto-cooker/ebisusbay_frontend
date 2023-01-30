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