import axios from 'axios';

const API_URL = '/api/';

const createDeck = async(deckName,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const deckData = {
    name: deckName,
  };
  const response = await axios.post(API_URL +'decks', deckData, config);
  return response.data;
}
const deleteDeck = async(deckID,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const deckData = {
    deckID: deckID,
  };
  console.log('[dataService/deleteDeck]',API_URL +'decks/'+ deckID);
  const response = await axios.delete(API_URL +'decks/'+ deckID, deckData, config);
  return response.data;
}
const addCard = async(cardData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.post(API_URL +'decks/push-card', cardData, config);
  return response.data;
}
const removeCard = async(cardData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.post(API_URL +'decks/remove-card', cardData, config);
  return response.data;
}
const getDecks = async(token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  
  const response = await axios.get(API_URL +'decks', config);
  return response.data;
}

const dataService = {
  createDeck,
  getDecks,
  addCard,
  removeCard,
  deleteDeck
}
export default dataService;