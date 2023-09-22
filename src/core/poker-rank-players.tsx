export interface Hand {
  handRef: number;
  primaryValue: number;
  handDescription: string;
  secondaryValue: number;
  secondaryCardEdition: number;
}
export interface Player {
  address: string;
  cards: number[];
  cardRanks: number[];
  bestHand: Hand;
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
const game2clubsThreshold = 3;
let gameNumber = 1;

export const GetActualEditionNumber = (edition: number) => {
  let actualEdition = -1;

  edition = edition > 4000 ? edition - 4000 : edition;
  
  cardValueDict.forEach((cardValue) => {
    if(cardValue.max < edition) {
      actualEdition = edition - cardValue.max;
    }
  })
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
export const RankPlayers = async (data : any, testcases:boolean=false, gameId:number) => {
  let rankedPlayers : Player[] = [];
  gameNumber = gameId;

  if(testcases) {
    // 4 of a kind club kicker card
    rankedPlayers.push({ 
      address: "4:A(2C) Secondary:2(C)",
      cards: [3903, 3902, 1960, 1728, 222, 4210, 7999, 7998],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //4 of a kind diamond kicker card
    rankedPlayers.push({ 
      address: "4:A(3C) Secondary:A(D)",
      cards: [3903, 3902, 1960, 1728, 222, 2710, 7999, 7998, 7997],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //full house
    rankedPlayers.push({ 
      address: "3:A(2C) 2:5s(1C+1D)",
      cards: [3903, 7998, 1110, 5110, 7999],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //Three of a kind with club kicker
    rankedPlayers.push({ 
      address: "3:A(2C) 1:5s(1C)",
      cards: [3903, 7998, 2, 5110, 7999],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //Three of a kind with diamond kicker
    rankedPlayers.push({ 
      address: "3:A(3C) 1:Q(D)",
      cards: [7997, 7998, 3799, 5110, 7999],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //fails because it doesn't have enough cards for the game
    rankedPlayers.push({ 
      address: "3:A(1C) 2:2s(1C,1D)",
      cards: [3903, 3902, 1110, 5110, 7999],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //Straight with 5 clubs
    rankedPlayers.push({ 
      address: "Straight:5-9 (5C)",
      cards: [5600, 6000, 6400, 6800, 7200],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
    //Straight with 3 clubs
    rankedPlayers.push({ 
      address: "Straight:5-9 (3C)",
      cards: [5600, 2000, 6400, 2800, 7200],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
     //Straight with 2 clubs
     rankedPlayers.push({ 
      address: "Straight:5-9 (2C)",
      cards: [5600, 2000, 2400, 2800, 7200],
      cardRanks: [],
      bestHand: {
        handRef: 0,
        primaryValue: 0,
        secondaryValue: 0,
        handDescription: "",
        secondaryCardEdition: 0
      },
    })
  } else {
    rankedPlayers = CreateRankedPlayersFromData(data);
  }
  //filter out only the entry with the address that we want
  // rankedPlayers = rankedPlayers.filter((player) => player.address === ("0x58f4a38f80192e4739B10508E3d225B830a21663").toLowerCase());
  // console.log("rankedPlayers", rankedPlayers);
  
  rankedPlayers = rankedPlayers.filter((player) => player.cards.length >= 5);
  rankedPlayers = RemoveBlackListedPlayers(rankedPlayers);
  rankedPlayers = CreateCardRanks(rankedPlayers);
  rankedPlayers = FindBestHand(rankedPlayers);
  rankedPlayers = RankPlayersByCards(rankedPlayers);
  return rankedPlayers;
}

  const MeetsGameRequriements = (clubCards: number[], cardInHand : string[]) => {
    if(gameNumber === 1) {
      return true;
    } else if(gameNumber === 2) {

      let additionalSpaceForCards = 5 - cardInHand.length;
      let clubsUsedInHand = 0;
      let cardsForGame2 = new Array(...clubCards);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = parseInt(cardInHand[i]);
        for(let j = 0; j < cardsForGame2.length; j++) {
          if(cardsForGame2[j] == cardValue) {
            clubsUsedInHand ++;
            cardsForGame2.splice(j, 1);
            j--;
      }}}

      let cardsNeeded = game2clubsThreshold - clubsUsedInHand;
      // console.log("cardsNeeded", cardsNeeded);
      // console.log("cardsForGame2", cardsForGame2);
      // console.log("additionalSpaceForCards", additionalSpaceForCards);
      // console.log("clubsUsedInHand", clubsUsedInHand);
      // console.log("cardInHand", cardInHand);
      // console.log("clubCards", clubCards);

      //meets game requirements in just main cards
      if(clubsUsedInHand >= game2clubsThreshold) {
        return true;
      }

      //doesn't have enough cards to meet game requirements
      if(cardsNeeded > cardsForGame2.length){
        return false;
      }

      //if you need more cards in the new suite than you have space for, you can't meet the game requirements
      if(cardsNeeded > additionalSpaceForCards){
        return false;
      }

      return true;
    }
  }
  const ClubNeededInKicker = (clubCards: number[], cardInHand: number[]) => {
    if(gameNumber === 2) {
      let clubsUsedInHand = 0;
      let cardsForGame2 = new Array(...clubCards);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = cardInHand[i];
        for(let j = 0; j < cardsForGame2.length; j++) {
          if(cardsForGame2[j] == cardValue) {
            clubsUsedInHand ++;
            cardsForGame2.splice(j, 1);
            j--;
      }}}

      //meets game requirements in just main cards
      return clubsUsedInHand >= game2clubsThreshold ? false : true;
    }
    else{
      return false;
    }
  }
  const GetSecondaryCardRank = (clubCards: number[], cardInHand: number[], bestCard:number) => {
    if(gameNumber === 2) {
      let clubsUsedInHand = 0;
      let cardsForGame2 = new Array(...clubCards);
      
      //check if there is a club card with the same value as the card in hand
      for(let i = 0; i < cardInHand.length; i++) {
        let cardValue = cardInHand[i];
        for(let j = 0; j < cardsForGame2.length; j++) {
          if(cardsForGame2[j] == cardValue) {
            clubsUsedInHand ++;
            cardsForGame2.splice(j, 1);
            j--;
      }}}

      //meets game requirements in just main cards
      if(clubsUsedInHand >= game2clubsThreshold) {
        return bestCard;
      }

      //go through the remaining cards and find the best card to add
      let bestClubCard = 0;
      cardsForGame2.sort((a, b) => b - a);
      for(let i = 0; i < cardsForGame2.length; i++) {
        if(cardsForGame2[i] > bestClubCard) {
          bestClubCard = cardsForGame2[i];
        }
      }
      return bestClubCard;
    }
    else{
      return bestCard;
    }
  }
  const CreateRankedPlayersFromData = (data: any) => {
    const rankedPlayers: Player[] = [];
    data.forEach((owner:any) => {
      if(rankedPlayers.find((player: Player) => player.address === owner.owner.id) === undefined) {
        rankedPlayers.push({
          address: owner.owner.id,
          cards: [],
          cardRanks: [],
          bestHand: {
            handRef: 0,
            primaryValue: 0,
            secondaryValue: 0,
            handDescription: "",
            secondaryCardEdition: 0
          }
        })
      }
      rankedPlayers.find((player) => player.address === owner.owner.id)?.cards.sort( (a, b) => b - a).push(Number(owner.identifier));
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
  const GetSecondaryCardEdition = (cardRanks: number[], cardsFromGame2: number[], cards: number[], secondaryValue:number, valuesUsedInHand: number[]) => {
      let secondaryCardEdition = -1;
      let filteredCards = cards.sort((a, b) => b - a);
      // let filteredRanks = cardRanks;
      cardsFromGame2.sort((a, b) => b - a);

      if(ClubNeededInKicker(cardsFromGame2, valuesUsedInHand)) {
        // console.log("club needed in kicker");
        filteredCards = cards.filter((card) => card > 4000)
        filteredCards = filteredCards.map((card) => card - 4000);
        // filteredRanks = cardsFromGame2;
      } else { 
        filteredCards = filteredCards.map((card) => card > 4000 ? card - 4000 : card);
      }
      
      // console.log("filteredCards", filteredCards);
      // console.log("filteredRanks", filteredRanks); 
      // console.log("secondaryValue", secondaryValue);

      ///get the range of cards that are the same as the secondary value
      let min = 0;
      let max = 0;
      cardValueDict.forEach((cardValue) => {
        if (cardValue.value === secondaryValue) {
          max = cardValue.max;
        } else if (cardValue.value === secondaryValue - 1) {
          min = cardValue.max;
        }
      })
      filteredCards = filteredCards.filter((card) => card >= min && card <= max);
      // console.log("final filteredCards", filteredCards);
      // console.log("min", min);
      // console.log("max", max);
      let lowestCard = Infinity;
      for(let i = 0; i < filteredCards.length; i++) {
        filteredCards[i] < lowestCard ? lowestCard = filteredCards[i] : null;
      }
      secondaryCardEdition = GetActualEditionNumber(lowestCard);
    return secondaryCardEdition;
  }
  const checkForFourOfAKind = (cardRanks: number[], cardsFromGame2:number[], cards:number[]) => {
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
    Object.keys(cardCountDict).forEach((card) => {
      // console.log("card", card," cardCountDict[card]", cardCountDict[card]);
      if(cardCountDict[card] === 4 && MeetsGameRequriements(cardsFromGame2, [card, card, card, card])) {
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = previousCard;
      } else if (cardCountDict[card] >= 4 && MeetsGameRequriements(cardsFromGame2, [card, card, card, card])){
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
      previousCard = parseInt(card);
    })

    if(fourOfAKind) {
      let valuesUsedInHand = [fourOfAKindValue, fourOfAKindValue, fourOfAKindValue, fourOfAKindValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame2, valuesUsedInHand, secondaryValue)
      let secondaryCardEdition = GetSecondaryCardEdition(cardRanks, cardsFromGame2, cards, secondaryValue, valuesUsedInHand);

      return {
        handRef: 1,
        primaryValue: fourOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(fourOfAKindValue) + "s",
        secondaryCardEdition: secondaryCardEdition
      }
    }
    return null;
  }
  const checkForStraight = (cardRanks: number[], cardsFromGame2:number[], cards:number[]) => {
    //sort and remove any duplicates
    cardRanks.sort((a, b) => b - a);
    const uniqueCards = [...new Set(cardRanks)];
    if(uniqueCards.length < 5) return null;

    let straight = false;
    let straightValue = 0;
    let straightStartIndex = 0;
    for(let i = 0; i <= uniqueCards.length - 5; i++) {
      if(uniqueCards[i] - 1 === uniqueCards[i + 1] &&
        uniqueCards[i + 1] - 1 === uniqueCards[i + 2] &&
        uniqueCards[i + 2] - 1 === uniqueCards[i + 3] &&
        uniqueCards[i + 3] - 1 === uniqueCards[i + 4] &&
        MeetsGameRequriements(cardsFromGame2, [uniqueCards[i].toString(), uniqueCards[i+1].toString(), uniqueCards[i+2].toString(), uniqueCards[i+3].toString(), uniqueCards[i+4].toString()])
        ) {
          straight = true;
          straightValue = uniqueCards[i + 4];
          straightStartIndex = i;
        }
    }
    cardRanks.sort((a, b) => a - b);

    if(straight) {
      let valuesUsedInHand = [straightValue, straightValue-1, straightValue-2, straightValue-3];
      let secondaryValue = GetSecondaryCardRank(cardsFromGame2, valuesUsedInHand, uniqueCards[uniqueCards.length - 1])
      let secondaryCardEdition = GetSecondaryCardEdition(cardRanks, cardsFromGame2, cards, secondaryValue, valuesUsedInHand);

      return {
        handRef: 3,
        primaryValue: straightValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(uniqueCards[straightStartIndex+ 4]) + " - " + getCardName(uniqueCards[straightStartIndex]),
        secondaryCardEdition: secondaryCardEdition
      }
    }
    return null;
  }
  const checkForFullHouse = (cardRanks: number[], cardsFromGame2:number[], cards:number[]) => {
    const cardCountDict: any = {};
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
      if(cardCountDict[card] === 3) {
        if(threeOfAKind && MeetsGameRequriements(cardsFromGame2, [card, card, card])) {
          twoOfAKind = true;
          threeOfAKind = true;
          twoOfAKindValue = threeOfAKindValue;
          threeOfAKindValue = parseInt(card);
        } else if(MeetsGameRequriements(cardsFromGame2, [card, card, card])) {
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
      twoOfAKindValue = GetSecondaryCardRank(cardsFromGame2, valuesUsedInHand, twoOfAKindValue)
      let secondaryCardEdition = GetSecondaryCardEdition(cardRanks, cardsFromGame2, cards, twoOfAKindValue, valuesUsedInHand);

      return {
        handRef: 2,
        primaryValue: threeOfAKindValue,
        secondaryValue: twoOfAKindValue,
        handDescription: getCardName(threeOfAKindValue) + "s " + getCardName(twoOfAKindValue)+ "s",
        secondaryCardEdition: secondaryCardEdition
      }
    }
    return null;
  }
  const checkForThreeOfAKind = (cardRanks: number[], cardsFromGame2:number[], cards:number[]) => {
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
      if(cardCountDict[card] === 3 && MeetsGameRequriements(cardsFromGame2, [card, card, card]) ) {
        threeOfAKind = true;
        threeOfAKindValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(threeOfAKind) {
      let valuesUsedInHand = [threeOfAKindValue, threeOfAKindValue, threeOfAKindValue, secondaryValue, secondaryValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame2, valuesUsedInHand, secondaryValue)
      let secondaryCardEdition = GetSecondaryCardEdition(cardRanks, cardsFromGame2, cards, secondaryValue, valuesUsedInHand);

      return {
        handRef: 4,
        primaryValue: threeOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(threeOfAKindValue) + "s",
        secondaryCardEdition: secondaryCardEdition
      }
    }
    return null;
  }
  const checkForTwoPair = (cardRanks: number[], cardsFromGame2: number[], cards: number[]) => {
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
    let smallerPairValue = 0;
    let largerPair = 0;

    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] === 2 && MeetsGameRequriements(cardsFromGame2, [card, card])) {
        if(!onePair) {
          onePair = true;
          smallerPairValue = parseInt(card);
        } else {
          twoPair = true;
          if(parseInt(card) > largerPair) {
            if(largerPair > smallerPairValue) {
              smallerPairValue = largerPair;
            }
            largerPair = parseInt(card);
        }}
      }  
    }
    )

    if(twoPair) {
      let valuesUsedInHand = [smallerPairValue, smallerPairValue, largerPair, largerPair];
      smallerPairValue = GetSecondaryCardRank(cardsFromGame2, valuesUsedInHand, smallerPairValue)
      let secondaryCardEdition = GetSecondaryCardEdition(cardRanks, cardsFromGame2, cards, smallerPairValue, valuesUsedInHand);

      return {
        handRef: 5,
        primaryValue: largerPair,
        secondaryValue: smallerPairValue,
        handDescription: getCardName(largerPair) + " " + getCardName(smallerPairValue),
        secondaryCardEdition: secondaryCardEdition
      }
    }
    return null;
  }
  const checkForOnePair = (cardRanks: number[], cardsFromGame2: number[], cards: number[]) => {
    const cardCountDict: any = {};
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
      if(cardCountDict[card] === 2 && MeetsGameRequriements(cardsFromGame2, [card, card])) {
        onePair = true;
        onePairValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(onePair) {
      let valuesUsedInHand = [onePairValue, onePairValue];
      secondaryValue = GetSecondaryCardRank(cardsFromGame2, valuesUsedInHand, secondaryValue)
      let secondaryCardEdition = GetSecondaryCardEdition(cardRanks, cardsFromGame2, cards, secondaryValue, valuesUsedInHand);

      return {
        handRef: 6,
        primaryValue: onePairValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(onePairValue) + "s",
        secondaryCardEdition: secondaryCardEdition
      }
    }
    return null;
  }
  const FindBestHand = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      let clubsCards = RankClubCards(player.cards.filter((card) => card > 4000));
      player.bestHand = SearchForBestHand(player.cardRanks, clubsCards, player.cards);
    })
    return rankedPlayers;
  }
  const RankClubCards = (clubsCards: number[]) => {
    let rankedClubsCards: number[] = [];
    clubsCards.forEach((card) => {
      let cardNumber = card > 4000 ? card - 4000 : card;
      let cardFound = false;
      cardValueDict.forEach((cardValue) => {
        if (cardNumber <= cardValue.max && !cardFound) {
          rankedClubsCards.push(cardValue.value as never);
          cardFound = true;
        }
      })
    })
    return rankedClubsCards;
  }
  const CreateCardRanks = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      player.cards.forEach((card) => {
        let cardNumber = card > 4000 ? card - 4000 : card;
        let cardFound = false;
        cardValueDict.forEach((cardValue) => {
          if (cardNumber <= cardValue.max && !cardFound) {
            player.cardRanks.push(cardValue.value as never);
            cardFound = true;
          }
        })
      })
    })
    return rankedPlayers;
  }
  const SearchForBestHand = (cardRanks: number[], cardsForGame2: number[], cards: number[]) => {

    //check for 4 of a kind
    const fourOfAKind = checkForFourOfAKind(cardRanks, cardsForGame2, cards);
    if(fourOfAKind) return fourOfAKind;

    //check for full house
    const fullHouse = checkForFullHouse(cardRanks, cardsForGame2, cards);
    if(fullHouse) return fullHouse;

    //check for straight
    const straight = checkForStraight(cardRanks, cardsForGame2, cards);
    if(straight) return straight;

    //check for three of a kind
    const threeOfAKind = checkForThreeOfAKind(cardRanks, cardsForGame2, cards);
    if(threeOfAKind) return threeOfAKind;

    //check for two pair
    const twoPair = checkForTwoPair(cardRanks, cardsForGame2, cards);
    if(twoPair) return twoPair;

    //check for one pair
    const onePair = checkForOnePair(cardRanks, cardsForGame2, cards);
    if(onePair) return onePair;

    let cardsToIgnore: number[] = [];
    let highestCard = GetScoreOfHighestCards(cardRanks.length, cardRanks, cardsToIgnore);
    if(MeetsGameRequriements(cardsForGame2,[])){
      //high card
      return {
        handRef: 7,
        primaryValue: highestCard,
        secondaryValue: GetScoreOfHighestCards(cardRanks.length, cardRanks, [highestCard]),
        handDescription: getCardName(highestCard),
        secondaryCardEdition: -1
      }
    }
    return{
      handRef: 8,
      primaryValue: 0,
      secondaryValue: 0,
      handDescription: "Hand doesn't meet game requirements",
      secondaryCardEdition: -1
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
  const RankPlayersByCards = (playersWithHands: Player[]) => {
      //sort by handRef
      playersWithHands.sort((a, b) => a.bestHand.handRef - b.bestHand.handRef);
      //sort by primaryValue but only if handRef is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef) {
          return b.bestHand.primaryValue - a.bestHand.primaryValue;
        }
        return 1;
      })
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

      return playersWithHands;
  }