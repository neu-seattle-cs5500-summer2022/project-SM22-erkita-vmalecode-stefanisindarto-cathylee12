import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Register from './components/Register';
import Navbar from "./components/navbar/Navbar";
import SignIn from "./components/SignIn";
function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path = '/' element = {<></>} />
        <Route path = '/register' element = {<Register/>} />
        <Route path = '/login' element = {<SignIn/>} />
        {/* <Route path = '/addmovie' element = {<AddMovie/>} />
        <Route path = '/login' element = {<Login/>} />
        <Route path = '/register' element = {<Register/>} />
        <Route path = '/moviedetail/:id' element = {<MovieDetail/>} /> */}
      </Routes>
    </Router>
    hello
    </>
  );
}

export default App;
