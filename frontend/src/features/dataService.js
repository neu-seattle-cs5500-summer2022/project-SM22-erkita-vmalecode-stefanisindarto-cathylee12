import axios from 'axios';

const API_URL = '/api/';

const createDeck = async(deckData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.post(API_URL +'decks', deckData, config);
  return response.data;
}
const deleteDeck = async(deckId,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const deckData = {
    deckId: deckId,
  };
  const response = await axios.delete(API_URL +'decks/'+ deckId, config);
  return response.data;
}
const addCard = async(cardData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.post(API_URL +'decks/'+cardData.deckId+'/cards', cardData, config);
  return response.data;
}
const removeCard = async(cardData,token) => {
  
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.delete(API_URL +'decks/' + cardData.deckId + '/cards/' + cardData.cardId, config);
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
const getCards = async(deckData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.get(API_URL +'decks/'+deckData.deckId + '/cards', config);
  return response.data;
}
const practiceCards = async(deckData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.get(API_URL +'decks/'+deckData.deckId + '/practice', config);
  return response.data;
}
const nextCard = async(deckData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.get(API_URL +'decks/'+deckData.deckId + '/practice/next', config);
  return response.data;
}
const updateRecallability = async(deckData,cardData,recallability,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.patch(
    API_URL +'decks/'+deckData.deckId + '/cards/'+cardData.cardId + '/recallability', recallability, config);
  return response.data;
}
const updateVisibility = async(deckData,token) => {
  const config = {
    headers: {
      Authorization: token
    },
  };
  const response = await axios.patch(
    API_URL + 'decks/public/'+ deckData.deckId ,deckData, config);
  return response.data;
}
const dataService = {
  createDeck,
  getDecks,
  addCard,
  removeCard,
  deleteDeck,
  getCards,
  practiceCards,
  nextCard,
  updateRecallability,
  updateVisibility,
}
export default dataService;