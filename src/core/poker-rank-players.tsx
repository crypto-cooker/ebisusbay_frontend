export interface Hand {
  handRef: number;
  primaryValue: number;
  handDescription: string;
  secondaryValue: number;
  secondaryCardEdition: number;
  secondaryCardSuit: number;
  cardIds: number[];
}
export interface Player {
  address: string;
  cards: number[];
  cardRanks: number[];
  bestHand: Hand;
  wildCards: number[];
  gameCards: number[];
}
export const cardValueDict = [
  { max: 0, value: 1},
  { max: 400, value: 2 },
  { max: 800, value: 3 },
  { max: 1200, value: 4 },
  { max: 1600, value: 5 },
  { max: 2000, value: 6 },
  { max: 2400, value: 7 },
  { max: 2800, value: 8 },
  { max: 3200, value: 9 },
  { max: 3600, value: 10 },
  { max: 3700, value: 11 },//Jack
  { max: 3800, value: 12 },//Queen
  { max: 3900, value: 13 },//King
  { max: 4000, value: 14 },//Ace
  { max: 4400, value: 2 },
  { max: 4800, value: 3 },
  { max: 5200, value: 4 },
  { max: 5600, value: 5 },
  { max: 6000, value: 6 },
  { max: 6400, value: 7 },
  { max: 6800, value: 8 },
  { max: 7200, value: 9 },
  { max: 7600, value: 10 },
  { max: 7700, value: 11 },//Jack
  { max: 7800, value: 12 },//Queen
  { max: 7900, value: 13 },//King
  { max: 8000, value: 14 },//Ace
  { max: 8400, value: 2 },
  { max: 8800, value: 3 },
  { max: 9200, value: 4 },
  { max: 9600, value: 5 },
  { max: 10000, value: 6 },
  { max: 10400, value: 7 },
  { max: 10800, value: 8 },
  { max: 11200, value: 9 },
  { max: 11600, value: 10 },
  { max: 11700, value: 11 },//Jack
  { max: 11800, value: 12 },//Queen
  { max: 11900, value: 13 },//King
  { max: 12000, value: 14 },//Ace
]
const BlackListedWallets = [
  "0x358758277ce0785104ea72acadc1de7e7af7aecd",
  "0x0f5a35dd7bbc94734139dc8a145c320d46594404",
  "0x9a9c18e0deae5ae3b4928f8f0efeffd490c6de85",
  "0x358758277ce0785104ea72acadc1de7e7af7aecd",
  "0x0f5a35dd7bbc94734139dc8a145c320d46594404",
  "0x02b2c2edfecb367be26092fac3e3b38a14d1adf0",
  "0xb67abc8e8c64c35f7dd0ba76f54420e935335b32",
  "0x24cb7600f7d631982c072536c8f602f54282d2ef",
  "0x358758277ce0785104ea72acadc1de7e7af7aecd",
  "0x708d93ac77262d8b911174447b919076ab6ce08a",
  "0x40874f18922267cc2ca7933828594ab5078c1065"
]
const activeGameCardsThreshold = 3;
let gameNumber = 1;
let activeGameStartIndex = 0;

export const GetActualEditionNumber = (edition: number) => {
  let actualEdition = -1;
  // console.log("edition", edition);

  cardValueDict.forEach((cardValue) => {
  // console.log("edition", edition);
  if(cardValue.max < edition) {
      actualEdition = edition - cardValue.max;
    }
  })
  // console.log("actualEdition", actualEdition);
  return actualEdition;
}
export const getCardName = (card: number) => {
  switch(card) {
    case 2: return "2";
    case 3: return "3";
    case 4: return "4";
    case 5: return "5";
    case 6: return "6";
    case 7: return "7";
    case 8: return "8";
    case 9: return "9";
    case 10: return "10";
    case 11: return "J";
    case 12: return "Q";
    case 13: return "K";
    case 14: return "A";
    default: return "";
  }
}
export const getHandName = (handRef: number) => {
  switch(handRef) {
    case 1: return "Four of a Kind";
    case 2: return "Full House";
    case 3: return "Straight";
    case 4: return "Three of a Kind";
    case 5: return "Two Pair";
    case 6: return "One Pair";
    case 7: return "High Card";
    case 8: return "N/A";
  }
}
export const RankPlayers = async (data : any, gameId:number, testcases:boolean=false) => {
  let rankedPlayers : Player[] = [];
  gameNumber = gameId;
  activeGameStartIndex = (gameNumber - 1) * 4000;

  //for testing
  if(gameNumber === 4) {
    activeGameStartIndex = 8000;
  }

  rankedPlayers = CreateRankedPlayersFromData(data);
  // const testingAdds = ["0xb762c2bdea9ea8ecc641ad40c3e38ad7031be31e", "0x80075c04f21f8c0ae2e7261a443dd4a57c3f07d0"];
  // rankedPlayers = rankedPlayers.filter((player) => player.address === ("0x574ceac75090869c92fd5315d0e89a0294ca58fc").toLowerCase());
  // rankedPlayers = rankedPlayers.filter((player) => player.address === ("0xb762c2bdea9ea8ecc641ad40c3e38ad7031be31e").toLowerCase() 
  //   || player.address === ("0x80075c04f21f8c0ae2e7261a443dd4a57c3f07d0").toLowerCase()
  //   || player.address === ("0x4dc3c580f9557fcfa4077e0175498178277aafe4").toLowerCase()
  //   || player.address === ("0x75c0de1bba50c28dde6ad3d97ea4f0a9c7514a6b").toLowerCase()
  //   );
  
  rankedPlayers = rankedPlayers.filter((player) => player.cards.length >= 5);
  rankedPlayers = RemoveBlackListedPlayers(rankedPlayers);
  rankedPlayers = CreateCardRanks(rankedPlayers);
  rankedPlayers = FindBestHand(rankedPlayers);
  rankedPlayers = RankPlayersByCards(rankedPlayers);
  console.log("rankedPlayers", rankedPlayers);
  return rankedPlayers;
}
export const RankPlayersByWorst = async (_rankedPlayers : Player[], gameId:number) => {
  gameNumber = gameId;
  activeGameStartIndex = (gameNumber - 1) * 4000;

  let rankedPlayers : Player[] = [];
  rankedPlayers = new Array(..._rankedPlayers);
  rankedPlayers = RemoveBestHand(rankedPlayers);
  rankedPlayers = rankedPlayers.filter((player) => player.cards.length >= 5);

  rankedPlayers = CreateCardRanks(rankedPlayers);
  rankedPlayers = FindWorstHand(rankedPlayers);
  rankedPlayers = RankPlayersByCards(rankedPlayers, true);
  // console.log("rankedPlayers worst", rankedPlayers);
  return rankedPlayers;
}
const GetLowestCardID = (cards: number[]) => {
  let lowestCard = Infinity;
  cards.forEach((card) => {
    if(card%4000 < lowestCard) {
      lowestCard = card%4000;
    }
  })
  return lowestCard;
}
  const MeetsGameRequriements = (_cardsForGame: number[], cardInHand : string[], _wildCards: number[] = []) => {
    if(gameNumber === 1) {
      return true;
    } else if(gameNumber === 4){
      let additionalSpaceForCards = 5 - cardInHand.length;
      let gameCardsUsed = 0;
      let cardsForGame = new Array(..._cardsForGame);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = parseInt(cardInHand[i]);
        for(let j = 0; j < cardsForGame.length; j++) {
          if(cardsForGame[j] == cardValue) {
            gameCardsUsed ++;
            cardsForGame.splice(j, 1);
            j--;
      }}}

      if(_wildCards.length > 0) {
        //check if a wild card can be used to meet the game requirements
        let wildCardUsed = false;
        for(let i = 0; i < _wildCards.length; i++) {
          if(cardsForGame.includes(_wildCards[i])) {
            wildCardUsed = true;
          }
        }
        if(wildCardUsed) {
          // gameCardsUsed++;
        }
      }

      let cardsNeeded = activeGameCardsThreshold - gameCardsUsed;
      // console.log("cardsNeeded", cardsNeeded);
      // console.log("cardsForGame", cardsForGame);
      // console.log("additionalSpaceForCards", additionalSpaceForCards);
      // console.log("clubsUsedInHand", clubsUsedInHand);
      // console.log("cardInHand", cardInHand);
      // console.log("clubCards", clubCards);

      //meets game requirements in just main cards
      if(gameCardsUsed >= activeGameCardsThreshold) {
        return true;
      }

      //doesn't have enough cards to meet game requirements
      if(cardsNeeded > cardsForGame.length){
        return false;
      }

      //if you need more cards in the new suite than you have space for, you can't meet the game requirements
      if(cardsNeeded > additionalSpaceForCards){
        return false;
      }

      return true;

    } else {
      let additionalSpaceForCards = 5 - cardInHand.length;
      let gameCardsUsed = 0;
      let cardsForGame = new Array(..._cardsForGame);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = parseInt(cardInHand[i]);
        for(let j = 0; j < cardsForGame.length; j++) {
          if(cardsForGame[j] == cardValue) {
            gameCardsUsed ++;
            cardsForGame.splice(j, 1);
            j--;
      }}}

      let cardsNeeded = activeGameCardsThreshold - gameCardsUsed;
      // console.log("cardsNeeded", cardsNeeded);
      // console.log("cardsForGame", cardsForGame);
      // console.log("additionalSpaceForCards", additionalSpaceForCards);
      // console.log("clubsUsedInHand", clubsUsedInHand);
      // console.log("cardInHand", cardInHand);
      // console.log("clubCards", clubCards);

      //meets game requirements in just main cards
      if(gameCardsUsed >= activeGameCardsThreshold) {
        return true;
      }

      //doesn't have enough cards to meet game requirements
      if(cardsNeeded > cardsForGame.length){
        return false;
      }

      //if you need more cards in the new suite than you have space for, you can't meet the game requirements
      if(cardsNeeded > additionalSpaceForCards){
        return false;
      }

      return true;
    }
  }
  const GetCardIdsFromGame = (cards: number[], cardInHand : string[]) => {
    // console.log("GetCardIdsFromGame");
    // console.log("cards", cards);
    // console.log("cardInHand", cardInHand);

    let cardIds: number[] = [];
    let filteredCards = new Array();

    //remove all cards that are not in the hand
    for(let i = 0; i < cards.length; i++){
      //get value of card from cardValueDict
      let cardActualValue  = 0;
      cardValueDict.forEach((cardValue) => {
        if(cardValue.max <= cards[i]) {
          cardActualValue = cardValue.value+1;
        }
      })

      //check if the card is in the hand, if not remove it
      if(cardInHand.includes(cardActualValue.toString())) {
        filteredCards.push(cards[i]);
      }
    }

    for(let i = 0; i < cardInHand.length; i++) {
      let lowestCard = Infinity;
      for(let i = 0; i < filteredCards.length; i++) {
        filteredCards[i] < lowestCard ? lowestCard = filteredCards[i] : null;
      }
      //remove the id we found
      filteredCards = filteredCards.filter((card) => card != lowestCard);

      //add the id to the list of ids
      cardIds = [...cardIds, lowestCard];
    }
    return cardIds;
  }
  const ActiveGameCardNeededInKicker = (_activeGameCards: number[], cardInHand: number[]) => {
    if(gameNumber === 1) {
      return false;
    } else {
      let activeGameCardsUsedInHand = 0;
      let activeGameCards = new Array(..._activeGameCards);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = cardInHand[i];
        for(let j = 0; j < activeGameCards.length; j++) {
          if(activeGameCards[j] == cardValue) {
            activeGameCardsUsedInHand ++;
            activeGameCards.splice(j, 1);
            j--;
      }}}

      //meets game requirements in just main cards
      return activeGameCardsUsedInHand >= activeGameCardsThreshold ? false : true;
    }
  }
  const GetSecondaryCardRank = (_activeGameCards: number[], cardInHand: number[], bestCard:number, _wildCards: number[] = []) => {
    if(gameNumber === 1) {
      return bestCard;
    } else if(gameNumber === 4) {
      // 8 are going to be wild cards
      let wildCards = new Array(..._wildCards);
    
      if(ActiveGameCardNeededInKicker(_activeGameCards, cardInHand)) {
        wildCards = wildCards.filter((card) => card > activeGameStartIndex)
      }

      if(wildCards.length == 0) return bestCard;
      else return 8;

    } else {
      let clubsUsedInHand = 0;
      let activeGameCards = new Array(..._activeGameCards);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = cardInHand[i];
        for(let j = 0; j < activeGameCards.length; j++) {
          if(activeGameCards[j] == cardValue) {
            clubsUsedInHand ++;
            activeGameCards.splice(j, 1);
            j--;
      }}}

      //meets game requirements in just main cards
      if(clubsUsedInHand >= activeGameCardsThreshold) {
        return bestCard;
      }

      //go through the remaining cards and find the best card to add
      let bestClubCard = 0;
      activeGameCards.sort((a, b) => b - a);
      for(let i = 0; i < activeGameCards.length; i++) {
        if(activeGameCards[i] > bestClubCard) {
          bestClubCard = activeGameCards[i];
        }
      }
      return bestClubCard;
    }
  }
  const GetLowestCard = (_activeGameCards: number[], cardInHand: number[]) => {
    let activeGameCards = new Array(..._activeGameCards);
    //check if there is a club card with the same value as the card in hand
    for(let i = 0; i < cardInHand.length; i++) {
      let removedMe = false;
      let cardValue = cardInHand[i];
      for(let j = 0; j < activeGameCards.length; j++) {
        if(activeGameCards[j] == cardValue && !removedMe) {
          activeGameCards.splice(j, 1);
          removedMe = true;
    }}}

    //go through the remaining cards and find the best card to add
    let bestClubCard = Infinity;
    activeGameCards.sort((a, b) => b - a);
    // console.log("activeGameCards", activeGameCards);
    for(let i = 0; i < activeGameCards.length; i++) {
      if(activeGameCards[i] < bestClubCard) {
        bestClubCard = activeGameCards[i];
      }
    }
    // console.log("lowest card", bestClubCard);
    return bestClubCard;
  }
  const CreateRankedPlayersFromData = (data: any) => {
    let rankedPlayers: Player[] = [];
    data.forEach((owner:any) => {
      if(rankedPlayers.find((player: Player) => player.address === owner.owner.id) === undefined) {
        rankedPlayers.push({
          address: owner.owner.id,
          cards: [],
          cardRanks: [],
          gameCards: [],
          wildCards: [],
          bestHand: {
            handRef: 0,
            primaryValue: 0,
            secondaryValue: 0,
            handDescription: "",
            secondaryCardEdition: 0,
            secondaryCardSuit: 0,
            cardIds: []
          }
        })
      }
      rankedPlayers.find((player) => player.address === owner.owner.id)?.cards.sort( (a, b) => b%4000 - a%4000).push(Number(owner.identifier));
    })
    return rankedPlayers;
  }
  const RemoveBlackListedPlayers = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      if(BlackListedWallets.includes(player.address)) {
        // console.log("removing blacklisted player", player.address);
        rankedPlayers.splice(rankedPlayers.indexOf(player), 1);
      }
    })
    return rankedPlayers;
  }
  const GetSecondaryCardEdition = (cardsFromGame: number[], cards: number[], secondaryValue:number, valuesUsedInHand: number[]) => {
    let secondaryCardEdition = -1;
    cardsFromGame.sort((a, b) => b - a);
    let filteredCards = new Array();

    for(let i = 0; i < cards.length; i++){
      let cardActualValue  = 0;
      cardValueDict.forEach((cardValue) => {
        if(cardValue.max < cards[i]%4000) {
          cardActualValue = cardValue.value+1;
        }
      })
      //fix for overflow
      if(cardActualValue == 15) cardActualValue = 2;
      if(cardActualValue == secondaryValue) {
        filteredCards.push(cards[i]);
      }
    }

    if(ActiveGameCardNeededInKicker(cardsFromGame, valuesUsedInHand)) {
      filteredCards = filteredCards.filter((card) => card > activeGameStartIndex)
    }

    let lowestCard = Infinity;
    let lowestCardRealNumber = Infinity;
    filteredCards = filteredCards.sort((a, b) => b - a);
    // console.log("filteredCards", filteredCards);

    for(let i = 0; i < filteredCards.length; i++) {
      // console.log("filteredCards[i]%4000", filteredCards[i]%4000, reverseOrder);
      if(filteredCards[i]%4000 < lowestCard ){
        lowestCard = filteredCards[i]%4000;
        lowestCardRealNumber = filteredCards[i];
      }
    }
      console.log("lowestCardRealNumber", lowestCardRealNumber);
    secondaryCardEdition = GetActualEditionNumber(lowestCard);

    return secondaryCardEdition;
  }
  const GetsecondaryCardSuit = (cardsFromGame: number[], cards: number[], secondaryValue:number, valuesUsedInHand: number[]) => {
    let secondaryCardEdition = -1;
    cardsFromGame.sort((a, b) => b - a);
    let filteredCards = new Array();

    for(let i = 0; i < cards.length; i++){
      let cardActualValue  = 0;
      cardValueDict.forEach((cardValue) => {
        if(cardValue.max < cards[i]%4000) {
          cardActualValue = cardValue.value+1;
        }
      })
      //fix for overflow
      if(cardActualValue == 15) cardActualValue = 2;
      if(cardActualValue == secondaryValue) {
        filteredCards.push(cards[i]);
      }
    }

    if(ActiveGameCardNeededInKicker(cardsFromGame, valuesUsedInHand)) {
      filteredCards = filteredCards.filter((card) => card > activeGameStartIndex)
    }

    let lowestCard = Infinity;
    let lowestCardRealNumber = Infinity;
    filteredCards = filteredCards.sort((a, b) => b - a);
    // console.log("filteredCards", filteredCards);

    for(let i = 0; i < filteredCards.length; i++) {
      // console.log("filteredCards[i]%4000", filteredCards[i]%4000, reverseOrder);
      if(filteredCards[i]%4000 < lowestCard ){
        lowestCard = filteredCards[i]%4000;
        lowestCardRealNumber = filteredCards[i];
      }
    }
    console.log("lowestCardRealNumber", lowestCardRealNumber);
    //0-4000 = clubs, 4000-8000 = diamonds, 8000-12000 = hearts, 12000-16000 = spades
    if(lowestCardRealNumber < 4000) {
      secondaryCardEdition = 0;
    } else if(lowestCardRealNumber < 8000) {
      secondaryCardEdition = 1;
    } else if(lowestCardRealNumber < 12000) {
      secondaryCardEdition = 2;
    } else {
      secondaryCardEdition = 3;
    }
     
    return secondaryCardEdition;
  }
  const checkForFourOfAKind = (cardRanks: number[], cardsFromGame:number[], cards:number[], reverseOrder:boolean = false, wildCards: number[] = []) => {
    const cardCountDict: any = {};
    if(reverseOrder) cardRanks.sort((a, b) => a - b);

    cardRanks.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    })
    let fourOfAKind = false;
    let fourOfAKindValue = 0;
    let secondaryValue = 0;
    let previousCard = 0;
    let cardIds: number[] = [];

    Object.keys(cardCountDict).forEach((card) => {
      // console.log("card", card," cardCountDict[card]", cardCountDict[card]);
      if(cardCountDict[card] === 4 && MeetsGameRequriements(cardsFromGame, [card, card, card, card]) ) {
      if(reverseOrder && fourOfAKind) return;
      fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = previousCard;
        cardIds = GetCardIdsFromGame(cards, [card, card, card, card]);
      } else if (cardCountDict[card] >= 4 && MeetsGameRequriements(cardsFromGame, [card, card, card, card])){
      if(reverseOrder && fourOfAKind) return;
      // console.log("card", card," cardCountDict[card]", cardCountDict[card]);
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = parseInt(card);
        cardIds = GetCardIdsFromGame(cards, [card, card, card, card]);
      } else {
        secondaryValue = parseInt(card);
      }
      previousCard = parseInt(card);
    })

    if(fourOfAKind) {
      let valuesUsedInHand = [fourOfAKindValue, fourOfAKindValue, fourOfAKindValue, fourOfAKindValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, secondaryValue, wildCards)
      if(reverseOrder ){
        secondaryValue = ActiveGameCardNeededInKicker(cardsFromGame, valuesUsedInHand) ? GetLowestCard(cardsFromGame, valuesUsedInHand) : GetLowestCard(cardRanks, valuesUsedInHand)
      }
      let secondaryCardEdition = GetSecondaryCardEdition(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, secondaryValue, valuesUsedInHand);

      return {
        handRef: 1,
        primaryValue: fourOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(fourOfAKindValue) + "s",
        secondaryCardEdition: secondaryCardEdition,
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const checkForStraight = (cardRanks: number[], cardsFromGame:number[], cards:number[], reverseOrder:boolean = false, wildCards: number[] = []) => {
    //sort and remove any duplicates
    cardRanks.sort((a, b) => b - a);
    if(reverseOrder) cardRanks.sort((a, b) => a - b);

    const uniqueCards = [...new Set(cardRanks)];
    if(uniqueCards.length < 5) return null;

    let straight = false;
    let straightValue = 0;
    let straightStartIndex = 0;
    let cardIds: number[] = [];
    for(let i = 0; i <= uniqueCards.length - 5; i++) {
        let uniqueCardIds = [uniqueCards[i].toString(), uniqueCards[i+1].toString(), uniqueCards[i+2].toString(), uniqueCards[i+3].toString(), uniqueCards[i+4].toString()];
        if(uniqueCards[i] - 1 === uniqueCards[i + 1] &&
          uniqueCards[i + 1] - 1 === uniqueCards[i + 2] &&
          uniqueCards[i + 2] - 1 === uniqueCards[i + 3] &&
          uniqueCards[i + 3] - 1 === uniqueCards[i + 4] &&
          MeetsGameRequriements(cardsFromGame, uniqueCardIds)) {
          cardIds = GetCardIdsFromGame(cards, uniqueCardIds);
          straight = true;
          straightValue = uniqueCards[i + 4];
          straightStartIndex = i;
        }
    }
    cardRanks.sort((a, b) => a - b);

    if(straight) {
      let valuesUsedInHand = [straightValue, straightValue-1, straightValue-2, straightValue-3];
      let secondaryValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, uniqueCards[uniqueCards.length - 1], wildCards)
      if(reverseOrder ){
        secondaryValue = ActiveGameCardNeededInKicker(cardsFromGame, valuesUsedInHand) ? GetLowestCard(cardsFromGame, valuesUsedInHand) : GetLowestCard(cardRanks, valuesUsedInHand)
      }
      let secondaryCardEdition = GetSecondaryCardEdition(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, secondaryValue, valuesUsedInHand);

      return {
        handRef: 3,
        primaryValue: straightValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(uniqueCards[straightStartIndex+ 4]) + " - " + getCardName(uniqueCards[straightStartIndex]),
        secondaryCardEdition: secondaryCardEdition,
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const checkForFullHouse = (cardRanks: number[], cardsFromGame:number[], cards:number[], reverseOrder:boolean = false, wildCards: number[] = []) => {
    const cardCountDict: any = {};
    if(reverseOrder) cardRanks.sort((a, b) => a - b);

    cardRanks.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    }) 
    let threeOfAKind = false;
    let threeOfAKindValue = 0;
    let twoOfAKind = false;
    let twoOfAKindValue = 0;
    
    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] >= 3) {
        // console.log("card", card);
        if(threeOfAKind && MeetsGameRequriements(cardsFromGame, [card, card, card])) {
          twoOfAKind = true;
          threeOfAKind = true;
          twoOfAKindValue = threeOfAKindValue;
          threeOfAKindValue = parseInt(card);
      } else if(MeetsGameRequriements(cardsFromGame, [card, card, card])) {
          threeOfAKindValue = parseInt(card);
          threeOfAKind = true;
        }
      } else if(cardCountDict[card] === 2) {
        twoOfAKind = true;
        twoOfAKindValue = parseInt(card);
      }
    })

    if(threeOfAKind && twoOfAKind) {
      let valuesUsedInHand = [threeOfAKindValue, threeOfAKindValue, threeOfAKindValue, twoOfAKindValue, twoOfAKindValue];
      twoOfAKindValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, twoOfAKindValue, wildCards)
      let secondaryCardEdition = GetSecondaryCardEdition(cardsFromGame, cards, twoOfAKindValue, valuesUsedInHand);
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, twoOfAKindValue, valuesUsedInHand);
      let cardIds = GetCardIdsFromGame(cards, [threeOfAKindValue.toString(), threeOfAKindValue.toString(), threeOfAKindValue.toString(), twoOfAKindValue.toString(), twoOfAKindValue.toString()]);

      return {
        handRef: 2,
        primaryValue: threeOfAKindValue,
        secondaryValue: twoOfAKindValue,
        handDescription: getCardName(threeOfAKindValue) + "s " + getCardName(twoOfAKindValue)+ "s",
        secondaryCardEdition: secondaryCardEdition,
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const checkForThreeOfAKind = (cardRanks: number[], cardsFromGame:number[], cards:number[], reverseOrder:boolean = false, wildCards: number[] = []) => {
    if(reverseOrder) cardRanks.sort((a, b) => a - b);

    const cardCountDict: any = {};
    cardRanks.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    }
    )
    let threeOfAKind = false;
    let threeOfAKindValue = 0;
    let secondaryValue = 0;
    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] === 3 && MeetsGameRequriements(cardsFromGame, [card, card, card]) ) {
        threeOfAKind = true;
        threeOfAKindValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(threeOfAKind) {
      let valuesUsedInHand = [threeOfAKindValue, threeOfAKindValue, threeOfAKindValue, secondaryValue, secondaryValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, secondaryValue, wildCards)
      if(reverseOrder ){
        secondaryValue = ActiveGameCardNeededInKicker(cardsFromGame, valuesUsedInHand) ? GetLowestCard(cardsFromGame, valuesUsedInHand) : GetLowestCard(cardRanks, valuesUsedInHand)
      }
      let secondaryCardEdition = GetSecondaryCardEdition(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      let cardIds = GetCardIdsFromGame(cards, [threeOfAKindValue.toString(), threeOfAKindValue.toString(), threeOfAKindValue.toString(), 
        secondaryValue.toString(), secondaryValue.toString()]);

      return {
        handRef: 4,
        primaryValue: threeOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(threeOfAKindValue) + "s",
        secondaryCardEdition: secondaryCardEdition,
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const checkForTwoPair = (cardRanks: number[], cardsFromGame: number[], cards: number[], reverseOrder:boolean = false, wildCards: number[] = []) => {
    const cardCountDict: any = {};
    cardRanks.sort((a, b) => a - b);

    cardRanks.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    }
    )

    let onePair = false;
    let twoPair = false;
    let smallerPairValue = reverseOrder ? Infinity : 0;
    let largerPair = reverseOrder ? Infinity : 0;

    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] >= 2 && MeetsGameRequriements(cardsFromGame, [card, card])) {
        if(!onePair) {
          onePair = true;
          smallerPairValue = parseInt(card);
        } else {
          twoPair = true;
          if(reverseOrder) {
            if(parseInt(card) < largerPair) {
              if(largerPair < smallerPairValue) {
                smallerPairValue = largerPair;
              }
              largerPair = parseInt(card);
            }
          } else {
            if(parseInt(card) > largerPair) {
              if(largerPair > smallerPairValue) {
                smallerPairValue = largerPair;
              }
              largerPair = parseInt(card);
            }
          }
      }
      }  
    }
    )

    if(twoPair) {
      let valuesUsedInHand = [smallerPairValue, smallerPairValue, largerPair, largerPair];
      smallerPairValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, smallerPairValue, wildCards)
      largerPair = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, largerPair, wildCards)
      let secondaryCardEdition = GetSecondaryCardEdition(cardsFromGame, cards, smallerPairValue, valuesUsedInHand);
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, smallerPairValue, valuesUsedInHand);
      let cardIds = GetCardIdsFromGame(cards, [smallerPairValue.toString(), smallerPairValue.toString(), largerPair.toString(), 
        largerPair.toString()]);

      return {
        handRef: 5,
        primaryValue: largerPair,
        secondaryValue: smallerPairValue,
        handDescription: getCardName(largerPair) + " " + getCardName(smallerPairValue),
        secondaryCardEdition: secondaryCardEdition,
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const checkForOnePair = (cardRanks: number[], cardsFromGame: number[], cards: number[], reverseOrder:boolean = false, wildCards: number[] = []) => {
    const cardCountDict: any = {};
    if(reverseOrder) cardRanks.sort((a, b) => a - b);

    cardRanks.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    }
    )
    let onePair = false;
    let onePairValue = 0;
    let secondaryValue = 0;
    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] === 2 && MeetsGameRequriements(cardsFromGame, [card, card])) {
        onePair = true;
        onePairValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(onePair) {
      let valuesUsedInHand = [onePairValue, onePairValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, secondaryValue, wildCards)
      if(reverseOrder ){
        secondaryValue = ActiveGameCardNeededInKicker(cardsFromGame, valuesUsedInHand) ? GetLowestCard(cardsFromGame, valuesUsedInHand) : GetLowestCard(cardRanks, valuesUsedInHand)
      }
      let secondaryCardEdition = GetSecondaryCardEdition(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      let cardIds = GetCardIdsFromGame(cards, [onePairValue.toString(), onePairValue.toString()]);

      return {
        handRef: 6,
        primaryValue: onePairValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(onePairValue) + "s",
        secondaryCardEdition: secondaryCardEdition,
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const FindBestHand = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      player.gameCards = RankGameCards(player.cards.filter((card) => card > activeGameStartIndex));
      if(gameNumber === 4) {
        player.wildCards =  GetAllWildCards(player.cards);
        player.bestHand = SearchForBestHand(player);
      } else {
        player.bestHand = SearchForBestHand(player);
      }
    })
    return rankedPlayers;
  }
  const FindWorstHand = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      let gameCards = RankGameCards(player.cards.filter((card) => card > activeGameStartIndex));
      player.bestHand = SearchForWorstHand(player.cardRanks, gameCards, player.cards);
    })
    return rankedPlayers;
  }
  const RankGameCards = (clubsCards: number[]) => {
    let rankedCards: number[] = [];
    clubsCards.forEach((card) => {
      // let cardNumber = card > activeGameStartIndex ? card - activeGameStartIndex : card;
      let cardFound = false;
      cardValueDict.forEach((cardValue) => {
        if (card <= cardValue.max && !cardFound) {
          rankedCards.push(cardValue.value as never);
          cardFound = true;
        }
      })
    })
    return rankedCards;
  }
  const CreateCardRanks = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      player.cards.forEach((card) => {
        // let cardNumber = card > activeGameStartIndex ? card - activeGameStartIndex : card;
        let cardFound = false;
        cardValueDict.forEach((cardValue) => {
          if (card <= cardValue.max && !cardFound) {
            player.cardRanks.push(cardValue.value as never);
            cardFound = true;
          }
        })
      })
    })
    return rankedPlayers;
  }
  const SearchForBestHand = (player : Player) => {
    let cardRanks = new Array(...player.cardRanks);
    let cardsForGame = new Array(...player.gameCards);
    let cards = new Array(...player.cards);
    let wildCards: number[] = player.wildCards;

    //check for 4 of a kind
    const fourOfAKind = checkForFourOfAKind(cardRanks, cardsForGame, cards, false, wildCards);
    if(fourOfAKind) return fourOfAKind;

    //check for full house
    const fullHouse = checkForFullHouse(cardRanks, cardsForGame, cards, false, wildCards);
    if(fullHouse) return fullHouse;

    //check for straight
    const straight = checkForStraight(cardRanks, cardsForGame, cards, false, wildCards);
    if(straight) return straight;

    //check for three of a kind
    const threeOfAKind = checkForThreeOfAKind(cardRanks, cardsForGame, cards, false, wildCards);
    if(threeOfAKind) return threeOfAKind;

    //check for two pair
    const twoPair = checkForTwoPair(cardRanks, cardsForGame, cards, false, wildCards);
    if(twoPair) return twoPair;

    //check for one pair
    const onePair = checkForOnePair(cardRanks, cardsForGame, cards, false, wildCards);
    if(onePair) return onePair;

    let cardsToIgnore: number[] = [];
    let highestCard = GetScoreOfHighestCards(cardRanks.length, cardRanks, cardsToIgnore);
    if(MeetsGameRequriements(cardsForGame,[])){
      //high card
      return {
        handRef: 7,
        primaryValue: highestCard,
        secondaryValue: GetScoreOfHighestCards(cardRanks.length, cardRanks, [highestCard]),
        handDescription: getCardName(highestCard),
        secondaryCardEdition: -1,
        secondaryCardSuit: GetsecondaryCardSuit(cardsForGame, cards, highestCard, [highestCard]),
        cardIds: GetCardIdsFromGame(cards, [highestCard.toString()])
      }
    }
    return{
      handRef: 8,
      primaryValue: 0,
      secondaryValue: 0,
      handDescription: "Hand doesn't meet game requirements",
      secondaryCardEdition: -1,
      secondaryCardSuit: 0,
      cardIds: []
    }
  }
  const SearchForBestHandSpades = (player : Player) => {

    let cardRanks = new Array(...player.cardRanks);
    let cardsForGame = new Array(...player.gameCards);
    let cards = new Array(...player.cards);
    let wildCards: number[] = player.wildCards;


    //check for 4 of a kind
    const fourOfAKind = CheckForFourOfAKindSpades(cardRanks, cardsForGame, cards, wildCards);
    if(fourOfAKind) return fourOfAKind;

    // //check for full house
    // const fullHouse = checkForFullHouse(cardRanks, cardsForGame, cards);
    // if(fullHouse) return fullHouse;

    // //check for straight
    // const straight = checkForStraight(cardRanks, cardsForGame, cards);
    // if(straight) return straight;

    // //check for three of a kind
    // const threeOfAKind = checkForThreeOfAKind(cardRanks, cardsForGame, cards);
    // if(threeOfAKind) return threeOfAKind;

    // //check for two pair
    // const twoPair = checkForTwoPair(cardRanks, cardsForGame, cards);
    // if(twoPair) return twoPair;

    // //check for one pair
    // const onePair = checkForOnePair(cardRanks, cardsForGame, cards);
    // if(onePair) return onePair;

    // let cardsToIgnore: number[] = [];
    // let highestCard = GetScoreOfHighestCards(cardRanks.length, cardRanks, cardsToIgnore);
    // if(MeetsGameRequriements(cardsForGame,[])){
    //   //high card
    //   return {
    //     handRef: 7,
    //     primaryValue: highestCard,
    //     secondaryValue: GetScoreOfHighestCards(cardRanks.length, cardRanks, [highestCard]),
    //     handDescription: getCardName(highestCard),
    //     secondaryCardEdition: -1,
    //     cardIds: GetCardIdsFromGame(cards, [highestCard.toString()])
    //   }
    // }
    return{
      handRef: 8,
      primaryValue: 0,
      secondaryValue: 0,
      handDescription: "Hand doesn't meet game requirements",
      secondaryCardEdition: -1,
      cardIds: []
    }
  }
  const CheckForFourOfAKindSpades = (cardRanks: number[], cardsFromGame:number[], cards:number[], wildCards: number[]) => {

    const cardCountDict: any = {};
    cardRanks.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    })
    
    let fourOfAKind = false;
    let fourOfAKindValue = 0;
    let secondaryValue = 0;
    let previousCard = 0;
    let cardIds: number[] = [];

    Object.keys(cardCountDict).forEach((card) => {
      // console.log("card", card," cardCountDict[card]", cardCountDict[card]);
      if(cardCountDict[card] === 4 && MeetsGameRequriements(cardsFromGame, [card, card, card, card]) ) {
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = previousCard;
        cardIds = GetCardIdsFromGame(cards, [card, card, card, card]);
      } else if (cardCountDict[card] >= 4 && MeetsGameRequriements(cardsFromGame, [card, card, card, card])){
        // console.log("card", card," cardCountDict[card]", cardCountDict[card]);
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = parseInt(card);
        cardIds = GetCardIdsFromGame(cards, [card, card, card, card]);
      } else {
        secondaryValue = parseInt(card);
      }
      previousCard = parseInt(card);
    })


    if(fourOfAKind) {
      let valuesUsedInHand = [fourOfAKindValue, fourOfAKindValue, fourOfAKindValue, fourOfAKindValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame, valuesUsedInHand, secondaryValue, wildCards)
      let secondaryCardSuit = GetsecondaryCardSuit(cardsFromGame, cards, secondaryValue, valuesUsedInHand);
      
      return {
        handRef: 1,
        primaryValue: fourOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(fourOfAKindValue) + "s",
        secondaryCardEdition: GetSecondaryCardEdition(cardsFromGame, cards, secondaryValue, valuesUsedInHand),
        secondaryCardSuit: secondaryCardSuit,
        cardIds: cardIds
      }
    }
    return null;
  }
  const SearchForWorstHand = (cardRanks: number[], cardsForGame: number[], cards: number[]) => {

    //check for 4 of a kind
    const fourOfAKind = checkForFourOfAKind(cardRanks, cardsForGame, cards, true);
    if(fourOfAKind) return fourOfAKind;

    //check for full house
    const fullHouse = checkForFullHouse(cardRanks, cardsForGame, cards, true);
    if(fullHouse) return fullHouse;

    //check for straight
    const straight = checkForStraight(cardRanks, cardsForGame, cards, true);
    if(straight) return straight;

    //check for three of a kind
    const threeOfAKind = checkForThreeOfAKind(cardRanks, cardsForGame, cards, true);
    if(threeOfAKind) return threeOfAKind;

    //check for two pair
    const twoPair = checkForTwoPair(cardRanks, cardsForGame, cards, true);
    if(twoPair) return twoPair;

    //check for one pair
    const onePair = checkForOnePair(cardRanks, cardsForGame, cards, true);
    if(onePair) return onePair;

    let cardsToIgnore: number[] = [];
    let highestCard = GetScoreOfHighestCards(cardRanks.length, cardRanks, cardsToIgnore);
    if(MeetsGameRequriements(cardsForGame,[])){
      //high card
      return {
        handRef: 7,
        primaryValue: highestCard,
        secondaryValue: GetScoreOfHighestCards(cardRanks.length, cardRanks, [highestCard]),
        handDescription: getCardName(highestCard),
        secondaryCardEdition: -1,
        secondaryCardSuit: GetsecondaryCardSuit(cardsForGame, cards, highestCard, [highestCard]),
        cardIds: GetCardIdsFromGame(cards, [highestCard.toString()])
      }
    }
    return{
      handRef: 8,
      primaryValue: 0,
      secondaryValue: 0,
      handDescription: "Hand doesn't meet game requirements",
      secondaryCardEdition: -1,
      secondaryCardSuit: 0,
      cardIds: []
    }
  }
  const GetScoreOfHighestCards = (numberOfCards: number, cards: number[], cardsToIgnore: number[]) => {
    let score = 0;
    cards.sort((a, b) => b - a);

    for(let i = 0; i < numberOfCards; i++) {
      if(cardsToIgnore.includes(cards[i])){
        numberOfCards++;
        continue;
      }
      if(cards[i] > score)
        score = cards[i];
    }
    return score;
  }
  const RankPlayersByCards = (playersWithHands: Player[], reverseOrder:boolean = false) => {
    let secondaryValues: any = {};

    if(gameNumber === 4) {
      //map all secondary values to a to the address of the player
      playersWithHands.forEach((player) => {
        if(!secondaryValues[player.bestHand.secondaryValue]) {
          secondaryValues[player.bestHand.secondaryValue] = [player];
        } else {
          secondaryValues[player.bestHand.secondaryValue].push(player);
        }
      })

      //overwrite 8s with Aces so that  
      playersWithHands.forEach((player) => {
        if(player.bestHand.secondaryValue === 8) {
          player.bestHand.secondaryValue = 14;
        }
      })
    }

    if(!reverseOrder) {
      //sort by handRef
      playersWithHands.sort((a, b) => a.bestHand.handRef - b.bestHand.handRef);
      //sort by primaryValue but only if handRef is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef) {
          return b.bestHand.primaryValue - a.bestHand.primaryValue;
        }
        return 1;
      })

      //condition for game 4
      //sort by secondaryValue but only if primaryValue is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue) {
            return b.bestHand.secondaryValue - a.bestHand.secondaryValue;
          }
        return 1;
      })

      //sort by secondaryCardEdition but only if secondaryValue is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue && a.bestHand.secondaryValue === b.bestHand.secondaryValue) {
          return (a.bestHand.secondaryCardEdition ?? 0) - (b.bestHand.secondaryCardEdition ?? 0);
        }
        return 1;
      })

      //sort by secondaryCardSuit but only if secondaryCardEdition is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue && a.bestHand.secondaryValue === b.bestHand.secondaryValue && a.bestHand.secondaryCardEdition === b.bestHand.secondaryCardEdition) {
          return b.bestHand.secondaryCardSuit - a.bestHand.secondaryCardSuit;
        }
        return 1;
      })
    } 
    
    //reverse order
    else {
      //sort by handRef
      playersWithHands.sort((a, b) => a.bestHand.handRef - b.bestHand.handRef);
      //sort by primaryValue but only if handRef is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef) {
          return a.bestHand.primaryValue - b.bestHand.primaryValue;
        }
        return 1;
      })
      //sort by secondaryValue but only if primaryValue is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue) {
            return a.bestHand.secondaryValue - b.bestHand.secondaryValue;
          }
        return 1;
      })

      //sort by secondaryCardEdition but only if secondaryValue is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue && a.bestHand.secondaryValue === b.bestHand.secondaryValue) {
          return (a.bestHand.secondaryCardEdition ?? 0) - (b.bestHand.secondaryCardEdition ?? 0);
        }
        return 1;
      })
    }

    //reapply secondary values for game 4
    if(gameNumber === 4) {
      Object.keys(secondaryValues).forEach((secondaryValue) => {
        secondaryValues[secondaryValue].forEach((player: Player) => {
          player.bestHand.secondaryValue = parseInt(secondaryValue);
        })
      })
    }

    return playersWithHands;
  }
  const RemoveBestHand = (playersWithHands: Player[]) => {
    //itterate through cards and if in best hand remove it
    playersWithHands.forEach((player) => {
      player.cards = player.cards.filter((card) => !player.bestHand.cardIds.includes(card));
      player.cardRanks = [];
    })
    return playersWithHands;
  }
  const GetAllWildCards = (cards: number[]) => {
    let wildCards: number[] = [];
    //check if cardvaluedict for card is an 8
    cards.forEach((card) => {
      let cardFound = false;
      cardValueDict.forEach((cardValue) => {
        if (card <= cardValue.max && !cardFound) {
          if(cardValue.value === 8) {
            wildCards.push(card);
          }
          cardFound = true;
        }
      }
      )
    })
    return wildCards;
  }