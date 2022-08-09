import React from 'react'
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {getDecks} from '../features/dataSlice';
import Moment from 'moment';
const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const decks = useSelector((state) => state.data.decks);
  Moment.locale('en');

  return (<>
    <Typography
    variant="h6"
    sx={{
      mt: '10%',
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.1rem',
      fontSize: '100px',
      color: 'inherit',
      textDecoration: 'none',
      display:'flex',
      alignItems: 'center',
      flexDirection: 'column',
      
    }}
  >
    Welcome to Amgi!
    <br />
  <Typography
  sx={{
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    fontSize: '20px',
    color: 'inherit',

  }}>
    {!user? <>
      <Button size = 'large' sx={{paddingTop: '10px'}} component = {Link} to = './login' >Log in</Button>
      or<Button size = 'large' sx={{paddingTop: '10px'}} component = {Link} to = './register'>Register</Button>
      to start creating and reviewing flashcards! 
      </>
    : <>
      <>Logged in | {user.result.name} | </>
      <Button size = 'large' sx={{paddingTop: '10px'}} component = {Link} to = './view-decks' >View Decks Now</Button>
    </>}
  </Typography>
  </Typography>
  </>
  )
}

export default Landing