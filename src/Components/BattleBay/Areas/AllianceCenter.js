
const AllianceCenter = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>
    <div>
            <button class="btn" onclick="window.location.href='../fancyMenu.html'">back</button>
            <button type="button" class="btn" id="registerFaction" onclick="openRegistrationForm()">Register Faction</button>
            <button type="button" class="btn" id="delgateTroops" onclick="openDelegateForm()">Delegate Troops</button>
            <button type="button" class="btn" id="editFaction" onclick="editFaction()">Edit Faction</button>
          </div>
<div class="form-popup" id="factionRegistrationForm">

    <form action="/action_page.php" class="form-container">

      <label class = "basicText" for="quantity">Faction Name:</label>
      <input type="text" class = "css-1fzih88" id="factionNameEntry" />
      
      <p></p>

        <label class = "basicText" for="quantity">Addresses of Wallets or Contract:</label>
        <input type="text" class = "entryField" id="addresses"/>
        <button type="button" class="minibtn" onclick="addItem()">Add address</button>
        <button type="button" class="minibtn" onclick="removeItem()">Remove</button>
        <button type="button" class="minibtn" id="ShowAddresses" onclick="myFunction()">Hide Addresses</button>
        <ul id="addresseslist"></ul>

      <p></p>
      <button type="button" class="btn" id="registerButton" onclick="registerFaction()">Register <br/> Cost: 300 Cro</button>
      <button type="button" class="btn cancel" onclick="closeRegistrationForm()">Cancel</button>
    </form>

  </div>

  <div class="form-popup" id="delegateForm">

    <form action="/action_page.php" class="form-container">

      <label class = "basicText" id="troopsAvailable">Troops available:</label>
      
      <p></p>

        <label class = "basicText" >Select a faction to delegate troops to:</label>
        <input type="text"  id="factionSelector" onkeyup="filterFactions()" placeholder="Search for faction.."class = "entryField"/>
        
        <ul id="factionUL">
        </ul>

        <p></p>
        <label class = "basicText" for="quantity">Quantity:</label>
        <input class = "css-1fzih88" type="number" id="troopsToDeligate" name="quantity" min="0"/>
        <p></p>

      <p></p>
      <button type="button" class="btn" id="delegate" onclick="DelegateTroops()">Delegate</button>
      <button type="button" class="btn cancel" onclick="closeDelegateForm()">Cancel</button>

    </form>

  </div>
  <div id="overlay2" onclick="closeForm(), closeDelegateForm(), closeRegistrationForm()"></div>
    </section>
  )
};


export default AllianceCenter;