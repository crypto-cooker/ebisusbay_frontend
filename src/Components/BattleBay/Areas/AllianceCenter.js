import {
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import ClanForm from './ClanForm';
import DelegateForm from './DelegateForm';

const AllianceCenter = ({onBack}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];
  
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>
      <Heading className="title text-center">Alliance Center</Heading>
      <p className="text-center">The Alliance Center allows for faction management.</p>

      <DelegateForm isOpen={isOpen} onClose={onClose} factions={factions}/>
      {/* <ClanForm isOpen={isOpen} onClose={onClose}/> */}

      
    <div>
      <button type="button" className="btn" id="registerFaction" 
        onClick={() => {}}>Register Clan</button>
      <button type="button" class="btn" id="delgateTroops" 
        onClick={() => {onOpen();}}>Delegate Troops</button>
      <button type="button" class="btn" id="editFaction" 
        onClick={() => {}}>Edit Clan</button>
    </div>


  {/* <div class="form-popup" id="delegateForm">

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

  </div> */}
    </section>
  )
};


export default AllianceCenter;