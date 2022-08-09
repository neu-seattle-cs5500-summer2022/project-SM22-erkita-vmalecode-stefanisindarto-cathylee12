import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactCardFlip from "react-card-flip";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { practiceCards, nextCard, updateRecallability } from '../features/dataSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export default function Practice() {
  const params = useParams();
  const dispatch = useDispatch();
  const deckId = params.deckid;
  const { card } = useSelector((state) => state.data);
  // The colors of the buttons again, hard, good, easy
  const defaultColor = '#1565c0';
  const activeColor = 'black';
  const [againButtonColor, setAgainButtonColor] = useState(defaultColor);
  const [hardButtonColor, setHardButtonColor] = useState(defaultColor);
  const [goodButtonColor, setGoodButtonColor] = useState(defaultColor);
  const [easyButtonColor, setEasyButtonColor] = useState(defaultColor);
  const navigate = useNavigate();
  const deckData = {
    deckId: deckId
  }

  useEffect(() => {
    dispatch(practiceCards(deckData));
  }, [navigate])

  // Set card difficulty selection button color
  useEffect(() => {
    setAgainButtonColor(defaultColor);
    setHardButtonColor(defaultColor);
    setGoodButtonColor(defaultColor);
    setEasyButtonColor(defaultColor);
    if (card?.recallability === 'again') {
      setAgainButtonColor(activeColor);
    }
    else if (card?.recallability === 'hard') {
      setHardButtonColor(activeColor);
    }
    else if (card?.recallability === 'good') {
      setGoodButtonColor(activeColor);
    }
    else if (card?.recallability === 'easy') {
      setEasyButtonColor(activeColor);
    }

  }, [card])

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  }

  const handleRecallability = (e, recallability) => {
    if (card) {
      const cardData = {
        cardId: card._id
      }
      const newRecallability = {
        recallability: recallability
      }
      dispatch(updateRecallability({ deckData, cardData, newRecallability }));
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        marginTop: '100px'
      }}
      alignItems='center'
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <Card
          variant="outlined"
          sx={{
            width: 500,
            borderRadius: 5,
          }}
        >
          <AspectRatio>
            <CardContent>
              <Typography
                variant="h3"
                component="div"
                align='center'
              >
                {card ? card.front : ""}
              </Typography>
            </CardContent>
            <CardActions
              style={{
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="contained"
                onClick={handleFlip}
              >
                See Back
              </Button>
            </CardActions>
            <CardActions
              style={{
                justifyContent: 'flex-end',
                marginTop: 170
              }}
            >
              <Button
                variant="contained"
                onClick={() => dispatch(nextCard(deckData))}
              >
                Next Card
              </Button>
            </CardActions>
          </AspectRatio>
        </Card>
        <Card
          variant="outlined"
          sx={{
            minWidth: 500,
            borderRadius: 5,
          }}
        >
          <AspectRatio>
            <CardContent>
              <Typography
                variant="h3"
                component="div"
                align='center'
              >
                {card ? card.back : ""}
              </Typography>
            </CardContent>
            <CardActions
              style={{
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="contained"
                onClick={handleFlip}
              >
                Front
              </Button>
            </CardActions>
            <CardActions
              style={{
                justifyContent: 'space-evenly',
                marginTop: 150
              }}
            >
              <Button
                variant='contained'
                onClick={() => { handleRecallability(deckData, "again") }}
                style={{
                  backgroundColor: `${againButtonColor}`
                }}
              >
                again
              </Button>
              <Button
                style={{
                  backgroundColor: `${hardButtonColor}`
                }}
                variant='contained'
                onClick={() => { handleRecallability(deckData, "hard") }}
              >
                hard
              </Button>
              <Button
                variant='contained'
                onClick={() => { handleRecallability(deckData, "good") }}
                style={{
                  backgroundColor: `${goodButtonColor}`
                }}
              >
                good
              </Button>
              <Button
                variant='contained'
                onClick={() => { handleRecallability(deckData, "easy") }}
                style={{
                  backgroundColor: `${easyButtonColor}`
                }}
              >
                easy
              </Button>
            </CardActions>
          </AspectRatio>
        </Card>
      </ReactCardFlip>
    </Box>
  );
}