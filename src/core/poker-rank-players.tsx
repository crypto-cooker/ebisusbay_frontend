export interface Hand {
  handRef: number;
  primaryValue: number;
  handDescription: string;
  secondaryValue: number;
  secondaryCardEdition?: number;
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

export const GetActualEditionNumber = (edition: number) => {
  let actualEdition = -1;
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
  }
}

export const RankPlayers = async (data : any) => {

  let rankedPlayers : Player[] = [];
  rankedPlayers = CreateRankedPlayersFromData(data);
  rankedPlayers = RemoveBlackListedPlayers(rankedPlayers);
  rankedPlayers = CreateCardRanks(rankedPlayers);
  rankedPlayers = FindBestHand(rankedPlayers);
  rankedPlayers = SetSecondaryCardEdition(rankedPlayers);
  rankedPlayers = RankPlayersByCards(rankedPlayers);
  rankedPlayers = rankedPlayers.filter((player) => player.cards.length >= 5);
  return rankedPlayers;
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
            handDescription: ""
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
  const checkForFourOfAKind = (cards: number[]) => {
    const cardCountDict: any = {};
    cards.forEach((card) => {
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
      if(cardCountDict[card] === 4) {
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = previousCard;
      } else if (cardCountDict[card] >= 4){
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
        secondaryValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
      previousCard = parseInt(card);
    })
    if(fourOfAKind) {
      return {
        handRef: 1,
        primaryValue: fourOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(fourOfAKindValue) + "s"
      }
    }
    return null;
  }
  const checkForStraight = (cards: number[]) => {
    //sort and remove any duplicates
    cards.sort((a, b) => b - a);
    const uniqueCards = [...new Set(cards)];
    if(uniqueCards.length < 5) return null;

    let straight = false;
    let straightValue = 0;
    let straightStartIndex = 0;
    for(let i = 0; i <= uniqueCards.length - 5; i++) {
      if(uniqueCards[i] - 1 === uniqueCards[i + 1] &&
        uniqueCards[i + 1] - 1 === uniqueCards[i + 2] &&
        uniqueCards[i + 2] - 1 === uniqueCards[i + 3] &&
        uniqueCards[i + 3] - 1 === uniqueCards[i + 4]) {
          straight = true;
          straightValue = uniqueCards[i + 4];
          straightStartIndex = i;
        }
    }
    cards.sort((a, b) => a - b);

    if(straight) {
      return {
        handRef: 3,
        primaryValue: straightValue,
        secondaryValue: uniqueCards[uniqueCards.length - 1],
        handDescription: getCardName(uniqueCards[straightStartIndex+ 4]) + " - " + getCardName(uniqueCards[straightStartIndex])
      }
    }
    return null;
  }
  const checkForFullHouse = (cards: number[]) => {
    const cardCountDict: any = {};
    cards.forEach((card) => {
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
        if(threeOfAKind) {
          twoOfAKind = true;
          threeOfAKind = true;
          twoOfAKindValue = threeOfAKindValue;
          threeOfAKindValue = parseInt(card);
        } else {
          threeOfAKindValue = parseInt(card);
          threeOfAKind = true;
        }
      } else if(cardCountDict[card] === 2) {
        twoOfAKind = true;
        twoOfAKindValue = parseInt(card);
      }
    })

    if(threeOfAKind && twoOfAKind) {
      return {
        handRef: 2,
        primaryValue: threeOfAKindValue,
        secondaryValue: twoOfAKindValue,
        handDescription: getCardName(threeOfAKindValue) + "s " + getCardName(twoOfAKindValue)+ "s"
      }
    }
    return null;
  }
  const checkForThreeOfAKind = (cards: number[]) => {
    const cardCountDict: any = {};
    cards.forEach((card) => {
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
      if(cardCountDict[card] === 3) {
        threeOfAKind = true;
        threeOfAKindValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(threeOfAKind) {
      return {
        handRef: 4,
        primaryValue: threeOfAKindValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(threeOfAKindValue) + "s"
      }
    }
    return null;
  }
  const checkForTwoPair = (cards: number[]) => {
    const cardCountDict: any = {};
    cards.sort((a, b) => a - b);
    cards.forEach((card) => {
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
      if(cardCountDict[card] === 2) {
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
    // cards.sort((a, b) => b - a);
    if(twoPair) {
      return {
        handRef: 5,
        primaryValue: largerPair,
        secondaryValue: smallerPairValue,
        handDescription: getCardName(largerPair) + " " + getCardName(smallerPairValue)
      }
    }
    return null;
  }
  const checkForOnePair = (cards: number[]) => {
    const cardCountDict: any = {};
    cards.forEach((card) => {
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
      if(cardCountDict[card] === 2) {
        onePair = true;
        onePairValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(onePair) {
      return {
        handRef: 6,
        primaryValue: onePairValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(onePairValue) + "s"
      }
    }
    return null;
  }
  const FindBestHand = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      player.bestHand = SearchForBestHand(player.cardRanks);
    })
    return rankedPlayers;
  }
  const CreateCardRanks = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {
      player.cards.forEach((card) => {
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
  const SetSecondaryCardEdition = (rankedPlayers: Player[]) => {
    rankedPlayers.forEach((player) => {

      player.cards.sort((a, b) => b - a);
      player.cardRanks.sort((a, b) => b - a);

      player.bestHand.secondaryCardEdition = -1;
        for(let i = 0; i < player.cards.length; i++) {
          if(player.cardRanks[i] === player.bestHand.secondaryValue) {
            player.bestHand.secondaryCardEdition = GetActualEditionNumber(player.cards[i]);
            // console.log("New best hand", player.bestHand.secondaryCardEdition);
          }
        }
    })
    return rankedPlayers;
  }
  const SearchForBestHand = (cards: number[]) => {

    //check for 4 of a kind
    const fourOfAKind = checkForFourOfAKind(cards);
    if(fourOfAKind) return fourOfAKind;

    //check for full house
    const fullHouse = checkForFullHouse(cards);
    if(fullHouse) return fullHouse;

    //check for straight
    const straight = checkForStraight(cards);
    if(straight) return straight;

    //check for three of a kind
    const threeOfAKind = checkForThreeOfAKind(cards);
    if(threeOfAKind) return threeOfAKind;

    //check for two pair
    const twoPair = checkForTwoPair(cards);
    if(twoPair) return twoPair;

    //check for one pair
    const onePair = checkForOnePair(cards);
    if(onePair) return onePair;

    let cardsToIgnore: number[] = [];
    let highestCard = GetScoreOfHighestCards(cards.length, cards, cardsToIgnore);
    //high card
    return {
      handRef: 7,
      primaryValue: highestCard,
      secondaryValue: GetScoreOfHighestCards(cards.length, cards, [highestCard]),
      handDescription: getCardName(highestCard)
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