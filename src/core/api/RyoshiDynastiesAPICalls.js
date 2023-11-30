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

export const getSeasonDate = async (seasonIdNumber) => {
  try{
    var data = await api.get("ryoshi-dynasties/games/"+seasonIdNumber);
    return data.data.data;
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