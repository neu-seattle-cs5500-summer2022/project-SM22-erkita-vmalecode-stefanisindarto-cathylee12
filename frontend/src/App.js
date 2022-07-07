import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import Decks from "./components/Decks";
import DetailDeck from './components/DetailDeck';
import Flashcard from './components/Practice';
import CreateDeck from './components/CreateDeck';
import React from 'react';
import CreateCard from './components/CreateCard';
import Practice from "./components/Practice";
import Landing from "./components/Landing";

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path = '/' element = {<Landing />}/>
        <Route path = '/login' element = {<SignIn/>}/>
        <Route path = '/register' element = {<Register/>} />
        <Route path = '/view-decks' element = {<Decks/>} />
        <Route path = '/edit-deck/:deckid' element = {<DetailDeck />} />
        <Route path = '/cards' element = {<Flashcard/>} />
        <Route path = '/create-deck' element = {<CreateDeck />} />
        <Route path = '/create-card/:deckid' element = {<CreateCard />} />
        <Route path = '/practice/:deckid' element = {<Practice />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
