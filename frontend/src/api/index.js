import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const getDecks = () => API.get("/api/decks");
export const getDeck = (id) => API.get(`/api/decks/${id}`);
export const getDeckFlashcards = (id) => API.get(`/api/decks/${id}/cards`);
export const createDeck = (newDeck) => API.post("/api/decks", newDeck);
export const createFlashcard = (id, newFlashcard) =>
  API.post(`/api/decks/${id}`, newFlashcard);
export const updateDeck = (id, updatedDeck) =>
  API.patch(`/api/decks/${id}`, updatedDeck);
export const deleteDeck = (id) => API.delete(`/api/decks/${id}`);

export const getCard = (deckId) => API.get(`/api/decks/${deckId}/cards`);
export const getCardFront = (deckId, cardId) =>
  API.get(`/api/decks/${deckId}/cards/${cardId}/front`);
export const getCardBack = (deckId, cardId) =>
  API.get(`/api/decks/${deckId}/cards/${cardId}/back`);
export const createCard = (deckId) => API.post(`/api/decks/${deckId}/cards`);
export const updateFront = (deckId, cardId) =>
  API.patch(`/api/decks/${deckId}/cards/${cardId}/front`);
export const updateBack = (deckId, cardId) =>
  API.patch(`/api/decks/${deckId}/cards/${cardId}/back`);
export const updateRecallability = (deckId, cardId) =>
  API.patch(`/api/decks/${deckId}/cards/${cardId}/recallability`);
export const deleteCard = (deckId, cardId) =>
  API.delete(`/api/decks/${deckId}/cards/${cardId}`);

export const signin = (userData) => API.post("/api/user/signin", userData);
export const signup = (userData) => API.post("/api/user/signup", userData);
