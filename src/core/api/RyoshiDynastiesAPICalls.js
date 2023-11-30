import axios from "axios";
import {appConfig} from "@src/Config";
const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

//gets the current game id
export const getWeeklyGameId = async () => {
  try{
    var data = await api.get("ryoshi-dynasties/games/0");
    return data.data.data.id;
  }
  catch(error){
    throw error;
  }
}
export const getSeason = async (seasonOffset) => {
  try{
    if(seasonOffset == 0){
      var currentGame = await api.get("ryoshi-dynasties/games/0");
      const seasonIdNumber = Number(currentGame.data.data.id-1);
      // console.log(seasonIdNumber)
      var data = await api.get("ryoshi-dynasties/games/"+seasonIdNumber);
      return data.data.data;
    }
  }
  catch(error){
    throw error;
  }
}
export const getSeasonDate = async (seasonIdNumber) => {
  try{
    var data = await api.get("ryoshi-dynasties/games/"+seasonIdNumber);
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}

// export const getGameEndTime = async () => {
//   try{
//     var currentGame = await api.get("ryoshi-dynasties/games/0");
//     return currentGame.data.data.endAt;
//   }
//   catch(error){
//     throw error;
//   }
// }
export const getSeasonGameId = async () => {
  try{
    var data = await api.get("ryoshi-dynasties/games/0");
    return data.data.data.season.id;
  }
  catch(error){
    throw error;
  }
}
// export const getWeekEndDate = async () => {
//   try{
//     var data = await api.get("ryoshi-dynasties/games/0");
//     return data.data.data.endAt;
//   }
//   catch(error){
//     throw error;
//   }
// }
//gets the map for the game
export const getMap = async (seasonNumber) => {
  try{
    return await api.get("ryoshi-dynasties/games/"+seasonNumber);
  }
  catch(error){
    throw error;
  }
}
export const getProfileTroops = async (_address, _signature) => {
  try{
    var data = await api.get("ryoshi-dynasties/armies?",
      {params: {address: _address, signature: _signature}});

    //itterate through the data and get the troops without a control point
    var troops = 0;
    // console.log(data.data.data)
    data.data.data.forEach(element => {
      if(element.controlPointId == null){
        troops += element.troops;
      }
      // console.log(element.controlPointId)
    });
    return troops;
  }
  catch(error){
    throw error;
  }
}
export const getProfileArmies = async (_address, _signature) => {
  try{
    var gameId = await getWeeklyGameId();
    var data = await api.get("ryoshi-dynasties/armies?",
      {params: {address: _address, signature: _signature, gameId: gameId}});
    return data;
  }
  catch(error){
    throw error;
  }
}
export const getFactionUndeployedArmies = async (_address, _signature) => {
  try{
    var gameId = await getWeeklyGameId();
    var data = await api.get("ryoshi-dynasties/armies?",
      {params: {address: _address, signature: _signature, gameId: gameId}});
      
    //itterate through the data and get the troops without a control point
    var troops = 0;
    data.data.data.forEach(element => {
      if(element.controlPointId == null){
        troops += element.troops;
      }
    });
    return troops;
  }
  catch(error){
    throw error;
  }
}
//creates a faction
export const createFaction = async (address, signature, type, name, addresses=[], image) => {
  try{
    return await api.post("ryoshi-dynasties/factions?", 
      {name, type, addresses, image},
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const UploadFactionIconPfp = async (address, signature, name, id, image) => {
  try{
    return await api.patch(baseURL + "api/ryoshi-dynasties/factions?", 
      {name, id, image},
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
//gets specific factions
export const getFactionOwned = async (address, signature) => {
  try{
    return await api.get("ryoshi-dynasties/factions?", 
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const getFactionRegistered = async (address, signature) => {
  try{
    var gameId = await getSeasonGameId();
    return await api.get("ryoshi-dynasties/factions?", 
      {params: {address, signature, gameId}});
  }
  catch(error){
    throw error;
  }
}
//registers a faction for the season
export const subscribeFaction = async (address, signature, factionId) => {
  try{
    var gameId = await getSeasonGameId();
    return await api.post("ryoshi-dynasties/subscriptions?", 
      {gameId, factionId},
      {params: {address, signature}}
      );
  }
  catch(error){
    throw error;
  }
}
export const editFaction = async (address, signature, id, name, addresses=[], type) => {
  try{
    return await api.patch("ryoshi-dynasties/factions?", 
      {name, id, addresses, type},
      {params: {address: address, signature: signature}},
      );
  }
  catch(error){
    throw error;
  }
}
export const deleteFaction = async (address, signature, id) => {
  try{
    return await api.delete("ryoshi-dynasties/factions?", 
      {params: {address, signature, id}},
      );
  }
  catch(error){
    throw error;
  }
}
export const getFactionTroops= async (address, signature, factionId) => {
  try{
    var data = await api.get("ryoshi-dynasties/factions/"+factionId,
    {params: {address, signature}});
    return data.data.data.troops;
  }
  catch(error){
    throw error;
  }
}
//adds troops to the player's wallet
export const createArmy = async (_walletAddress, _walletSignature, _troops) => {
  try{
    return await api.get("ryoshi-dynasties/army?", 
      {params: {walletAddress: _walletAddress, walletSignature: _walletSignature}},
      {body: {troops: _troops}});
  }
  catch(error){
    throw error;
  }
}
//takes troops from a player's wallet and adds them to a faction
export const delegateTroops = async (address, signature, troops, factionId) => {
  try{
    var gameID = await api.get("ryoshi-dynasties/games/0");
    let gameId = gameID.data.data.id;

    // console.log("GameID: "+gameId);
    // console.log("FactionID: "+factionId);
    // console.log("Troops: "+troops);
    troops = Number(troops);

    return await api.patch("ryoshi-dynasties/armies?", 
      {troops, factionId, gameId},
      {params: {address: address, signature: signature, action: "DELEGATE"}},
      );
  }
  catch(error){
    throw error;
  }
}
//deploys troops from a faction to a control point
export const deployTroops = async (address, signature, gameId, troops, controlPointId, factionId) => {
  try{

    // var gameId = await getWeeklyGameId();
    // console.log("Troops: "+troops);
    // troops = Number(troops);
    // console.log("ControlPointID: "+controlPointId);
    // console.log("GameID: "+gameId);
    // console.log("FactionID: "+factionId);
    
    // console.log("Address: "+address);
    // console.log("Signature: "+signature);

    return await api.patch("ryoshi-dynasties/armies?", 
      {troops, controlPointId, gameId, factionId},
      {params: {address: address, signature: signature, action: "DEPLOY"}}
      );
  }
  catch(error){
    throw error;
  }
}
//recalls troops from a control point and returns them to the faction
export const recallTroops = async (address, signature, gameId, troops, controlPointId, factionId) => {
  try{
    return await api.patch("ryoshi-dynasties/armies?", 
      {troops, controlPointId, gameId, factionId},
      {params: {address, signature, action: "RECALL"}}
      );
  }
  catch(error){
    throw error;
  }
}
export const getReward= async (_rewardNumber) => {
  try{
    var data = await api.get("ryoshi-dynasties/rewards/"+_rewardNumber);
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
//fix to get profile troops
export const getProfileId = async (_address, _signature) => {
  try{
    //add if else for if it is empty
    var data = await api.get("ryoshi-dynasties/armies?",
      {params: {address: _address, signature: _signature}});
    return data;
  }
  catch(error){
    throw error;
  }
}
export const getAllFactions = async (gameId) => {
  try{
    var data = await api.get("ryoshi-dynasties/factions/all",
      {params: {gameId}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const getAllFactionsSeasonId = async (gameId, seasonId) => {
  try{
    // console.log(gameId, seasonId)
    var data = await api.get("ryoshi-dynasties/factions/all",
      {params: {gameId, seasonId}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const addTroops = async (address, signature, troops) => {
  try{
    return await api.post("ryoshi-dynasties/armies?", 
      {troops},
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const getLeaderBoard = async (controlPointId, gameId) => {
  try{
    var data = await api.get("ryoshi-dynasties/control-points/"+controlPointId,
      {params: {gameId}});
    return data.data.data.leaderBoard;
  }
  catch(error){
    throw error;
  }
}
//gets a specific control point
export const getControlPoint = async (controlPointId, gameId) => {
  try{
    var data = await api.get("ryoshi-dynasties/control-points/"+controlPointId,
      {params: {gameId}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const attack = async (address, signature, troops, controlPointId, factionId, defendingFactionId, battleType) => {
  try{
    //cant remove yet as attacktap is still a js file
    var gameID = await api.get("ryoshi-dynasties/games/0");
    var gameId = gameID.data.data.id;

    return await api.post("ryoshi-dynasties/battle-transactions?", 
      {troops, controlPointId, gameId, factionId, defendingFactionId, battleType},
      {params: {address, signature, gameId}}
      );
  }
  catch(error){
    throw error;
  }
}
export const getDailyRewards = async (address, signature) => {
  try{
    return await api.get("ryoshi-dynasties/game-tokens/daily-reward?", 
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const getGameTokens = async (address, signature) => {
  try{
    return await api.get("ryoshi-dynasties/game-tokens/battle-reward?", 
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const getRewardsStreak = async (address, signature) => {
  try{
    return await api.get("ryoshi-dynasties/game-tokens/daily-reward/next/?", 
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const getBattleRewards = async (address, signature) => {
  try{
    let data =  await api.get("ryoshi-dynasties/game-tokens/battle-reward?",
      {params: {address, signature}});

    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const claimBattleRewards = async (address, signature) => {
  try{
    return await api.get("ryoshi-dynasties/game-tokens/battle-reward?", 
      {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}
export const getTroopsOnControlPoint = async (address, signature, controlPoint, gameId) => {
  try{
    let data = await api.get("ryoshi-dynasties/armies?",
      {params: {address, signature, gameId}});
    var troops = 0;
    data.data.data.forEach(element => {
      if(element.controlPointId === controlPoint){
        troops += element.troops;
      }
    });
    return troops;
  }
  catch(error){
    throw error;
  }
}
export const getRegistrationCost = async (address, signature, blockId, gameId, factionId) => {
  try{
    // console.log(address, signature, blockId, gameId, factionId);
    let data = await api.get("ryoshi-dynasties/factions/subscription?", 
      {params: {address, signature, blockId}},
      {gameId, factionId} );
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const getBattleLog = async (address, signature, gameId, pageSize, page, orderBy) => {
  try{
    // console.log(address, signature, blockId, gameId, factionId);
    let data = await api.get("ryoshi-dynasties/game-log?", 
      {params: {address, signature, gameId, pageSize, page, orderBy}});
    return data.data.data.logs;
  }
  catch(error){
    throw error;
  }
}
export const disbandFaction = async (address, signature, action) => {
  try{
    let data = await api.patch("ryoshi-dynasties/factions/status?", 
      {address},
      {params: {address, signature, action}});
    return data;
  }
  catch(error){
    throw error;
  }
}
export const getLeadersForSeason = async (gameId) => {
  try{
    var data = await api.get("ryoshi-dynasties/control-points",
      {params: {gameId, allowDisbanded: false}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
//meeple
export const MeepleUpkeep = async (address, signature, amount) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/upkeep?", 
      {amount},
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const MeepleMint = async (address, signature, amount) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/minting?", 
      {amount},
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const MeepleTradeInCards = async (address, signature, nftId, amount) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/trading-card?", 
      {nftId, amount},
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}

//tests
export const MeepleTradeInCardsTest = async (address, signature) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/trading-card-testing?", 
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const MeepleMintTest = async (address, signature, amount) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/minting-testing?", 
      {amount},
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const MeepleUpkeepTest = async (address, signature, amount) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/upkeep-testing?", 
      {amount},
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}
export const MeepleBurnTest = async (address, signature, amount) => {
  try{
    var data = await api.post("ryoshi-dynasties/meeple/burn-testing?", 
      {amount},
      {params: {address, signature}});
    return data.data.data;
  }
  catch(error){
    throw error;
  }
}