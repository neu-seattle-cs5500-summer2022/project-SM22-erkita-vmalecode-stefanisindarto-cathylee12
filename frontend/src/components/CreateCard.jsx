import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addCard } from '../features/dataSlice';
import { useParams } from 'react-router-dom';
import { reset } from '../features/dataSlice';
import { useState, useEffect } from 'react';


const CreateCard = () => {
  const params = useParams();
  const deckId = params.deckid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deck = useSelector((state) => state.data.decks.find((deck) => deck._id === deckId));
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.data
  )
  useEffect(() => {
    if (isError) {

    }

    if (isSuccess) {
      dispatch(reset());
      navigate('/edit-deck/' + deckId);
    }


  }, [isSuccess])
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const front = data.get('front');
    const back = data.get('back');
    const cardData = {
      deckId,
      front,
      back,

    }
    dispatch(addCard(cardData));
  };
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
          Create New Card
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            multiline
            rows={2}
            margin="normal"
            required
            fullWidth
            id="d"
            label="Front of Card"
            name="front"
            autoFocus
          />
          <TextField
            multiline
            rows={2}
            margin="normal"
            required
            fullWidth
            id="d"
            label="Back of Card"
            name="back"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Card!
          </Button>

        </Box>
      </Box>


    </>


  )
}

export default CreateCard