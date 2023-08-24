import {NextPage} from "next";
import {Text,Grid, GridItem, Flex, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ApiService } from "@src/core/services/api-service";
import {useInfiniteQuery} from "@tanstack/react-query";
import { Center, Spinner, Box } from "@chakra-ui/react";

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
  }
}
export const getHandName = (handRef: number) => {
  switch(handRef) {
    case 1: return "Four of a Kind";
    case 2: return "Straight";
    case 3: return "Full House";
    case 4: return "Three of a Kind";
    case 5: return "Two Pair";
    case 6: return "One Pair";
    case 7: return "High Card";
  }
}

export const RankPlayers = async (data : any) => {

  // data = data.slice(0, 50)
  let rankedPlayers : Player[] = [];
  rankedPlayers = CreateRankedPlayersFromData(data);
  rankedPlayers = CreateCardRanks(rankedPlayers);
  rankedPlayers = FindBestHand(rankedPlayers);
  rankedPlayers = SetSecondaryCardEdition(rankedPlayers);
  rankedPlayers = RankPlayersByCards(rankedPlayers);

  // rankedPlayers = rankedPlayers.slice(0, 5)
  // rankedPlayers = SetSecondaryCardEdition(rankedPlayers);
  console.log("Ranked players ", rankedPlayers)

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
    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] === 4) {
        fourOfAKind = true;
        fourOfAKindValue = parseInt(card);
      } else {
        secondaryValue = parseInt(card);
      }
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
    cards.sort((a, b) => a - b);
    const uniqueCards = [...new Set(cards)];
    let straight = false;
    let straightValue = 0;
    let secondaryValue = 0;
    let straightStartIndex = 0;
    for(let i = 0; i < uniqueCards.length - 5; i++) {
      if(uniqueCards[i] + 1 === uniqueCards[i + 1] &&
        uniqueCards[i + 1] + 1 === uniqueCards[i + 2] &&
        uniqueCards[i + 2] + 1 === uniqueCards[i + 3] &&
        uniqueCards[i + 3] + 1 === uniqueCards[i + 4] &&
        uniqueCards[i + 4] + 1 === uniqueCards[i + 5]) {
          straight = true;
          straightValue = uniqueCards[i + 4];
          straightStartIndex = i;
          break;
        }
    }
    if(straight) {
      return {
        handRef: 2,
        primaryValue: straightValue,
        secondaryValue: uniqueCards[uniqueCards.length - 1],
        handDescription: uniqueCards[straightStartIndex].toString() + " - " + uniqueCards[straightStartIndex + 4].toString()
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
    }
    )
    let threeOfAKind = false;
    let threeOfAKindValue = 0;
    let twoOfAKind = false;
    let twoOfAKindValue = 0;
    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] === 3) {
        threeOfAKind = true;
        threeOfAKindValue = parseInt(card);
      } else if(cardCountDict[card] === 2) {
        twoOfAKind = true;
        twoOfAKindValue = parseInt(card);
      }
    })
    if(threeOfAKind && twoOfAKind) {
      return {
        handRef: 3,
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
    cards.forEach((card) => {
      if(cardCountDict[card]) {
        cardCountDict[card]++;
      } else {
        cardCountDict[card] = 1;
      }
    }
    )
    let twoPair = false;
    let twoPairValue = 0;
    let secondaryValue = 0;
    let secondaryTwoPairValue = 0;
    Object.keys(cardCountDict).forEach((card) => {
      if(cardCountDict[card] === 2) {
        if(twoPair) {
          secondaryTwoPairValue = twoPairValue;
          twoPairValue = parseInt(card);
        } else {
          twoPair = true;
          twoPairValue = parseInt(card);
        }
      } else {
        secondaryValue = parseInt(card);
      }
    }
    )
    if(twoPair) {
      return {
        handRef: twoPairValue,
        primaryValue: twoPairValue,
        secondaryValue: secondaryValue,
        handDescription: getCardName(twoPairValue) + " " + getCardName(secondaryTwoPairValue)
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
        handDescription: GetScoreOfHighestCards(3, cards, [onePairValue]).toString()
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
      if(player.bestHand.secondaryValue < 2){
        console.log("player.bestHand.secondaryValue", player.bestHand.secondaryValue)
        player.bestHand.secondaryCardEdition = player.cards.find((card) => 
        cardValueDict.find((cardValue) => cardValue.value === player.bestHand.primaryValue && cardValue.max >= card) !== undefined) as never;
      }
      else{
        player.bestHand.secondaryCardEdition = player.cards.find((card) => 
          cardValueDict.find((cardValue) => cardValue.value === player.bestHand.secondaryValue && cardValue.max >= card) !== undefined) as never;
      }
    })
    return rankedPlayers;
  }

  const SearchForBestHand = (cards: number[]) => {

    //check for 4 of a kind
    const fourOfAKind = checkForFourOfAKind(cards);
    if(fourOfAKind)  return fourOfAKind;

    //check for straight
    const straight = checkForStraight(cards);
    if(straight) return straight;

    //check for full house
    const fullHouse = checkForFullHouse(cards);
    if(fullHouse) return fullHouse;

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
    //high card
    return {
      handRef: 7,
      primaryValue: 0,
      secondaryValue: GetScoreOfHighestCards(cards.length, cards, cardsToIgnore),
      handDescription: GetScoreOfHighestCards(cards.length, cards, cardsToIgnore).toString()
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
      score = cards[i];
    }
    return score;
  }

  //rank players by their cards
  const RankPlayersByCards = (playersWithHands: Player[]) => {
      //sort by handRef
      playersWithHands.sort((a, b) => a.bestHand.handRef - b.bestHand.handRef);
      //sort by primaryValue but only if handRef is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef) {
          return b.bestHand.primaryValue - a.bestHand.primaryValue;
        }
      })
      //sort by secondaryValue but only if primaryValue is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue) {
            return b.bestHand.secondaryValue - a.bestHand.secondaryValue;
          }
      })

      //sort by secondaryCardEdition but only if secondaryValue is the same
      playersWithHands.sort((a, b) => {
        if(a.bestHand.handRef === b.bestHand.handRef && a.bestHand.primaryValue === b.bestHand.primaryValue && a.bestHand.secondaryValue === b.bestHand.secondaryValue) {
            return a.bestHand.secondaryCardEdition - b.bestHand.secondaryCardEdition;
          }
      })

      return playersWithHands;
  }

  // const dummyPlayerCards = [
//   {
//     address: "0x123",
//     cards: [1, 392, 412, 714, 746, 1150],
//     cardRanks: [],
//     bestHand: {
//       handRef: 0,
//       primaryValue: 0,
//       secondaryValue: 0
//     }
//   },
//   {
//     address: "0x456",
//     cards: [16, 383, 468, 35],
//     cardRanks: [],
//     bestHand: {
//       handRef: 0,
//       primaryValue: 0,
//       secondaryValue: 0
//     }
//   },
//   {
//     address: "0x789",
//     cards: [256, 361, 435, 490, 557],
//     cardRanks: [],
//     bestHand: {
//       handRef: 0,
//       primaryValue: 0,
//       secondaryValue: 0
//     }
//   }
// ]


  // const generateDummyPlayers = () => {
  //   const players: Player[] = [];
  //   for(let i = 0; i < playersToGenerate; i++) {
  //     players.push({
  //       address: "0x" + Math.floor(Math.random() * 1000000000000000000).toString(16),
  //       cards: generateRandomCards(),
  //       cardRanks: [],
  //       bestHand: {
  //         handRef: 0,
  //         primaryValue: 0,
  //         secondaryValue: 0,
  //         handDescription: ""
  //       }
  //     })
      
  //   }
  //   return players;
  // }
    // const generateRandomCards = () => {
  //   const cards: number[] = [];
  //   for(let i = 0; i < cardsToGenerate; i++) {
  //       cards.push(Math.floor(Math.random() * 4000) + 1);
  //   }
  //   return cards;
  // }