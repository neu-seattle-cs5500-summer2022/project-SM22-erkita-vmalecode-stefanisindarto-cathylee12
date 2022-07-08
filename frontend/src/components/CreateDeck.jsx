import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {createDeck} from '../features/dataSlice';
import { reset } from '../features/dataSlice';
import { useState, useEffect } from 'react';

const CreateDeck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.data
  )
  const { user } = useSelector((state) => state.auth);
  useEffect(()=> {
    if (!user) {
      navigate('/login');
    }
    
  },[navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newDeckName = data.get('deck');
    console.log('[handleSubmit]',newDeckName);
    dispatch(createDeck(newDeckName));
    const newDeckData = {
    
    };
  };
  useEffect(() => {
    if (isError) {
      
    }

    if (isSuccess ) {
      dispatch(reset());
      navigate('/view-decks');
    }

    
  }, [ isSuccess])
  return (
      <>
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Create New Deck
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="d"
              label="New Deck Name"
              name="deck"
              autoComplete="email"
              autoFocus
            />
            
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Make deck public"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Deck!
            </Button>
            
            
          </Box>
        </Box>
      
      
      </>
      
    
  )
}

export default CreateDeck